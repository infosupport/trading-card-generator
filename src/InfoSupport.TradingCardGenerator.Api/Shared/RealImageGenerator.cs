using Azure.AI.OpenAI;
using Microsoft.Extensions.Options;
using OpenAI.Images;

namespace InfoSupport.TradingCardGenerator.Api.Shared;

/// <summary>
/// Real implementation using Azure OpenAI.
/// </summary>
public class RealImageGenerator(AzureOpenAIClient azureClient, IOptions<ImageModelSettings> settings) : IImageGenerator
{
    public async Task<byte[]> GenerateImageEditAsync(Stream imageStream, string prompt)
    {
        var imageClient = azureClient.GetImageClient(settings.Value.DeploymentName!);
        var imageEditOptions = new ImageEditOptions { Size = GeneratedImageSize.W1024xH1024 };
        var result = await imageClient.GenerateImageEditAsync(imageStream, "photo.jpg", prompt, imageEditOptions);
        return result.Value.ImageBytes.ToArray();
    }
}
