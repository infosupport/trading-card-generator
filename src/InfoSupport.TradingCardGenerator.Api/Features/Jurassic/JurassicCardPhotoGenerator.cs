using HandlebarsDotNet;
using InfoSupport.TradingCardGenerator.Api.Features.Jurassic.Models;
using InfoSupport.TradingCardGenerator.Api.Shared;

namespace InfoSupport.TradingCardGenerator.Api.Features.Jurassic;

/// <summary>
/// Generates jurassic themed trading card images.
/// </summary>
/// <param name="imageEditClient">The image edit client used to transform the photo.</param>
/// <param name="metadataInjector">The metadata injector used to watermark the images.</param>
public class JurassicCardPhotoGenerator(
    IImageEditClient imageEditClient,
    ImageMetadataInjector metadataInjector) : CardPhotoGeneratorBase(imageEditClient, metadataInjector)
{
    private const string GeneratePhotoPrompt = "InfoSupport.TradingCardGenerator.Api.Features.Jurassic.Prompts.GeneratePhoto.md";
    private const string Scene01Prompt = "InfoSupport.TradingCardGenerator.Api.Features.Jurassic.Prompts.Scene01.md";
    private const string Scene02Prompt = "InfoSupport.TradingCardGenerator.Api.Features.Jurassic.Prompts.Scene02.md";
    private const string Scene03Prompt = "InfoSupport.TradingCardGenerator.Api.Features.Jurassic.Prompts.Scene03.md";
    private const string Scene04Prompt = "InfoSupport.TradingCardGenerator.Api.Features.Jurassic.Prompts.Scene04.md";
    private const string Scene05Prompt = "InfoSupport.TradingCardGenerator.Api.Features.Jurassic.Prompts.Scene05.md";
    private const string Scene06Prompt = "InfoSupport.TradingCardGenerator.Api.Features.Jurassic.Prompts.Scene06.md";
    private const string Scene07Prompt = "InfoSupport.TradingCardGenerator.Api.Features.Jurassic.Prompts.Scene07.md";
    private const string Scene08Prompt = "InfoSupport.TradingCardGenerator.Api.Features.Jurassic.Prompts.Scene08.md";
    private const string Scene09Prompt = "InfoSupport.TradingCardGenerator.Api.Features.Jurassic.Prompts.Scene09.md";
    private const string Scene10Prompt = "InfoSupport.TradingCardGenerator.Api.Features.Jurassic.Prompts.Scene10.md";
    private const string Scene11Prompt = "InfoSupport.TradingCardGenerator.Api.Features.Jurassic.Prompts.Scene11.md";
    private const string Scene12Prompt = "InfoSupport.TradingCardGenerator.Api.Features.Jurassic.Prompts.Scene12.md";
    
    /// <summary>
    /// Transforms a portrait photo into a trading card image.
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

    private static string GetScenePrompt(string scene) => scene?.ToLowerInvariant() switch
    {
        "scene01" => Scene01Prompt,
        "scene02" => Scene02Prompt,
        "scene03" => Scene03Prompt,
        "scene04" => Scene04Prompt,
        "scene05" => Scene05Prompt,
        "scene06" => Scene06Prompt,
        "scene07" => Scene07Prompt,
        "scene08" => Scene08Prompt,
        "scene09" => Scene09Prompt,
        "scene10" => Scene10Prompt,
        "scene11" => Scene11Prompt,
        "scene12" => Scene12Prompt,
        _ => Scene01Prompt
    };
}