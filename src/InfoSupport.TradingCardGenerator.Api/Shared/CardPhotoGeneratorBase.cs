using Azure.AI.OpenAI;
using Microsoft.Extensions.Options;
using OpenAI.Images;

namespace InfoSupport.TradingCardGenerator.Api.Shared;

/// <summary>
/// Provides base functionality to turn a regular photo into a themed trading card photo.
/// </summary>
public abstract class CardPhotoGeneratorBase(
    AzureOpenAIClient azureClient,
    IOptions<ImageModelSettings> modelSettings,
    ImageMetadataInjector metadataInjector)
{
    /// <summary>
    /// Generates an image based on the input image and a pre-rendered prompt. 
    /// </summary>
    /// <param name="imageStream">Input stream containing the submitted user image.</param>
    /// <param name="prompt">The prompt to modify the image.</param>
    /// <returns>Returns the raw data of the output image</returns>
    /// <remarks>The output image is watermarked so we can recognize it as AI generated</remarks>
    protected async Task<byte[]> InternalTransformPhoto(MemoryStream imageStream, string prompt)
    {
        var imageClient = azureClient.GetImageClient(modelSettings.Value.DeploymentName);

        var imageEditOptions = new ImageEditOptions
        {
            Size = GeneratedImageSize.W1024xH1024
        };

        var imageGenerationResult = await imageClient.GenerateImageEditAsync(
            imageStream, "player-photo.jpg", prompt,
            imageEditOptions);

        var imageBytes = imageGenerationResult.Value.ImageBytes.ToArray();
        var imageBytesWithMetadata = metadataInjector.InjectMetadata(imageBytes);

        return imageBytesWithMetadata;
    }

    /// <summary>
    /// Decodes a base64 string into a memory stream
    /// </summary>
    /// <param name="base64"></param>
    /// <returns></returns>
    protected MemoryStream DecodeBase64(string base64)
    {
        var rawData = Convert.FromBase64String(base64);
        return new MemoryStream(rawData);
    }
}