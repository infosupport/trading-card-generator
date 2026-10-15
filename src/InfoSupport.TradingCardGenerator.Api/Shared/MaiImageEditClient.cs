using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Azure.Core;

namespace InfoSupport.TradingCardGenerator.Api.Shared;

/// <summary>
/// Image edit client backed by the MAI-Image-2.5-Flash model via the MAI REST API.
/// </summary>
public class MaiImageEditClient(
    HttpClient httpClient,
    TokenCredential credential,
    ImageModelSettings modelSettings) : IImageEditClient
{
    private static readonly TokenRequestContext TokenRequestContext =
        new(["https://cognitiveservices.azure.com/.default"]);

    /// <inheritdoc />
    public async Task<byte[]> EditImageAsync(MemoryStream imageStream, string prompt, CancellationToken cancellationToken = default)
    {
        imageStream.Position = 0;
        var imageContent = new StreamContent(imageStream);
        imageContent.Headers.ContentType = new MediaTypeHeaderValue("image/jpeg");

        using var content = new MultipartFormDataContent();
        content.Add(new StringContent(modelSettings.DeploymentName), "model");
        content.Add(new StringContent(prompt), "prompt");
        content.Add(imageContent, "image", "player-photo.jpg");

        var endpoint = modelSettings.Endpoint.TrimEnd('/');
        var request = new HttpRequestMessage(HttpMethod.Post, $"{endpoint}/mai/v1/images/edits");

        if (!string.IsNullOrWhiteSpace(modelSettings.ApiKey))
        {
            request.Headers.Add("api-key", modelSettings.ApiKey);
        }
        else
        {
            var accessToken = await credential.GetTokenAsync(TokenRequestContext, cancellationToken);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken.Token);
        }

        request.Content = content;

        HttpResponseMessage response;

        try
        {
            response = await httpClient.SendAsync(request, cancellationToken);
        }
        catch (Exception ex) when (ex is HttpRequestException or TaskCanceledException
                                   && !cancellationToken.IsCancellationRequested)
        {
            throw new ImageGenerationUnavailableException("Could not reach the MAI image edit service.", ex);
        }

        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync(cancellationToken);
            var message = $"MAI image edit failed ({(int)response.StatusCode} {response.StatusCode}): {errorBody}";

            throw IsTransient(response.StatusCode)
                ? new ImageGenerationUnavailableException(message)
                : new HttpRequestException(message);
        }

        var json = await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: cancellationToken);
        var data = json.GetProperty("data");

        if (data.GetArrayLength() == 0)
            throw new InvalidOperationException("MAI API returned no images in the response.");

        var b64 = data[0].GetProperty("b64_json").GetString()
            ?? throw new InvalidOperationException("MAI API returned a null b64_json value.");

        return Convert.FromBase64String(b64);
    }

    private static bool IsTransient(HttpStatusCode statusCode) =>
        (int)statusCode >= 500 || statusCode is HttpStatusCode.RequestTimeout or HttpStatusCode.TooManyRequests;
}
