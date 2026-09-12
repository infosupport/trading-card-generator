using HandlebarsDotNet;
using InfoSupport.TradingCardGenerator.Api.Features.Isks8Bit.Models;
using InfoSupport.TradingCardGenerator.Api.Shared;

namespace InfoSupport.TradingCardGenerator.Api.Features.Isks8Bit;

/// <summary>
/// Generates ISKS 2026 8-bit postcard themed trading card images.
/// </summary>
/// <param name="imageEditClient">The image edit client used to transform the photo.</param>
/// <param name="metadataInjector">The metadata injector used to watermark the images.</param>
public class Isks8BitCardPhotoGenerator(
    [FromKeyedServices(ImageGenerationFeatures.Isks8Bit)] IImageEditClient imageEditClient,
    ImageMetadataInjector metadataInjector) : CardPhotoGeneratorBase(imageEditClient, metadataInjector)
{
    private const string GeneratePhotoPrompt = "InfoSupport.TradingCardGenerator.Api.Features.Isks8Bit.Prompts.GeneratePhoto.md";
    private const string Scene01Prompt = "InfoSupport.TradingCardGenerator.Api.Features.Isks8Bit.Prompts.Scene01.md";
    private const string Scene02Prompt = "InfoSupport.TradingCardGenerator.Api.Features.Isks8Bit.Prompts.Scene02.md";
    private const string Scene03Prompt = "InfoSupport.TradingCardGenerator.Api.Features.Isks8Bit.Prompts.Scene03.md";

    /// <summary>
    /// Transforms a portrait photo into an 8-bit postcard image.
    /// </summary>
    /// <param name="request">Request data to use for generating the image.</param>
    /// <returns>Returns the generated image.</returns>
    public async Task<GenerateCardResponse> TransformPhoto(GenerateCardRequest request)
    {
        var imageStream = DecodeBase64(request.Photo);
        var renderedPromptTemplate = RenderPromptTemplate(request);
        var imageGenerationResult = await InternalTransformPhoto(imageStream, renderedPromptTemplate);

        return new GenerateCardResponse
        {
            Image = Convert.ToBase64String(imageGenerationResult),
        };
    }

    private string RenderPromptTemplate(GenerateCardRequest request)
    {
        var promptTemplate = Handlebars.Compile(EmbeddedResource.Read(GeneratePhotoPrompt));
        var scenePrompt = GetScenePrompt(request.Scene);

        return promptTemplate.Invoke(new
        {
            SceneDescription = EmbeddedResource.Read(scenePrompt)
        });
    }

    private static string GetScenePrompt(string? scene) => scene?.ToLowerInvariant() switch
    {
        "scene01" => Scene01Prompt,
        "scene02" => Scene02Prompt,
        "scene03" => Scene03Prompt,
        _ => Scene01Prompt
    };
}
