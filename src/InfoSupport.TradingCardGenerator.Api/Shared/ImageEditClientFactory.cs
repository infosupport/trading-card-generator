using System.Collections.Concurrent;
using Azure;
using Azure.AI.OpenAI;
using Azure.Core;
using Microsoft.Extensions.Options;

namespace InfoSupport.TradingCardGenerator.Api.Shared;

/// <summary>
/// Creates image edit clients based on the provider configured for each model.
/// </summary>
public class ImageEditClientFactory(
    IOptions<ImageGenerationOptions> options,
    IHttpClientFactory httpClientFactory,
    TokenCredential credential) : IImageEditClientFactory
{
    /// <summary>
    /// The name of the <see cref="HttpClient"/> used by REST based providers.
    /// </summary>
    public const string HttpClientName = "image-edit";

    private readonly ConcurrentDictionary<string, IImageEditClient> clients = new(StringComparer.OrdinalIgnoreCase);

    /// <inheritdoc />
    public IImageEditClient CreateForFeature(string featureName)
    {
        var settings = options.Value;

        if (!settings.Features.TryGetValue(featureName, out var modelName))
        {
            modelName = settings.DefaultModel
                ?? throw new InvalidOperationException(
                    $"No image model is configured for feature '{featureName}' and no default model is set.");
        }

        return clients.GetOrAdd(modelName, CreateClient);
    }

    private IImageEditClient CreateClient(string modelName)
    {
        if (!options.Value.Models.TryGetValue(modelName, out var model))
        {
            throw new InvalidOperationException($"Image model '{modelName}' is not configured.");
        }

        if (string.IsNullOrWhiteSpace(model.Endpoint))
        {
            throw new InvalidOperationException(
                $"No endpoint is configured for image model '{modelName}'. " +
                $"Set '{ImageGenerationOptions.SectionName}:Models:{modelName}:Endpoint'.");
        }

        return model.Provider switch
        {
            ImageModelProvider.Mai => new MaiImageEditClient(
                httpClientFactory.CreateClient(HttpClientName), credential, model),
            ImageModelProvider.AzureOpenAI => new AzureOpenAiImageEditClient(CreateAzureClient(model), model),
            _ => throw new InvalidOperationException($"Unsupported image model provider '{model.Provider}'.")
        };
    }

    private AzureOpenAIClient CreateAzureClient(ImageModelSettings model)
    {
        var clientOptions = new AzureOpenAIClientOptions(AzureOpenAIClientOptions.ServiceVersion.V2025_04_01_Preview);

        return string.IsNullOrWhiteSpace(model.ApiKey)
            ? new AzureOpenAIClient(new Uri(model.Endpoint), credential, clientOptions)
            : new AzureOpenAIClient(new Uri(model.Endpoint), new AzureKeyCredential(model.ApiKey), clientOptions);
    }
}
