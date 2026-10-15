using Azure;
using Azure.AI.OpenAI;
using OpenAI.Images;

namespace InfoSupport.TradingCardGenerator.Api.Shared;

/// <summary>
/// Image edit client backed by the Azure OpenAI gpt-image model family.
/// </summary>
public class AzureOpenAiImageEditClient(
    AzureOpenAIClient azureClient,
    ImageModelSettings modelSettings) : IImageEditClient
{
    /// <inheritdoc />
    public async Task<byte[]> EditImageAsync(MemoryStream imageStream, string prompt, CancellationToken cancellationToken = default)
    {
        var imageClient = azureClient.GetImageClient(modelSettings.DeploymentName);

        var imageEditOptions = new ImageEditOptions
        {
            Size = GeneratedImageSize.W1024xH1024
        };

        imageStream.Position = 0;

        try
        {
            var result = await imageClient.GenerateImageEditAsync(
                imageStream, "player-photo.jpg", prompt, imageEditOptions, cancellationToken);

            return result.Value.ImageBytes.ToArray();
        }
        catch (RequestFailedException ex) when (ex.Status >= 500 || ex.Status is 408 or 429)
        {
            throw new ImageGenerationUnavailableException(
                $"Azure OpenAI image edit failed ({ex.Status}): {ex.Message}", ex);
        }
    }
}
