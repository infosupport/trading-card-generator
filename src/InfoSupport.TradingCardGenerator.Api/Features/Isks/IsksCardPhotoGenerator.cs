using InfoSupport.TradingCardGenerator.Api.Features.Isks.Models;
using InfoSupport.TradingCardGenerator.Api.Shared;

namespace InfoSupport.TradingCardGenerator.Api.Features.Isks;

/// <summary>
/// Generates ISKS 2026 themed trading card images with a 1990s office portrait look.
/// </summary>
/// <param name="imageEditClient">The image edit client used to transform the photo.</param>
/// <param name="metadataInjector">The metadata injector used to watermark the images.</param>
public class IsksCardPhotoGenerator(
    [FromKeyedServices(ImageGenerationFeatures.Isks)] IImageEditClient imageEditClient,
    ImageMetadataInjector metadataInjector) : CardPhotoGeneratorBase(imageEditClient, metadataInjector)
{
    private const string GeneratePhotoPrompt = "InfoSupport.TradingCardGenerator.Api.Features.Isks.Prompts.GeneratePhoto.md";

    /// <summary>
    /// Transforms a portrait photo into a trading card image.
    /// </summary>
    /// <param name="request">Request data to use for generating the image.</param>
    /// <returns>Returns the generated image.</returns>
    public async Task<GenerateCardResponse> TransformPhoto(GenerateCardRequest request)
    {
        var imageStream = DecodeBase64(request.Photo);
        var imageGenerationResult = await InternalTransformPhoto(imageStream, EmbeddedResource.Read(GeneratePhotoPrompt));

        return new GenerateCardResponse
        {
            Image = Convert.ToBase64String(imageGenerationResult),
        };
    }
}
