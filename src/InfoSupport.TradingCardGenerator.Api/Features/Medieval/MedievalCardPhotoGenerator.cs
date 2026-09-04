using HandlebarsDotNet;
using InfoSupport.TradingCardGenerator.Api.Features.Medieval.Models;
using InfoSupport.TradingCardGenerator.Api.Shared;

namespace InfoSupport.TradingCardGenerator.Api.Features.Medieval;

/// <summary>
/// Generates medieval themed trading card images rendered as stained glass panels.
/// </summary>
/// <param name="imageEditClient">The image edit client used to transform the photo.</param>
/// <param name="metadataInjector">The metadata injector used to watermark the images.</param>
/// <param name="leaderboardService">The service used to record rolled stats on the leaderboard.</param>
public class MedievalCardPhotoGenerator(
    [FromKeyedServices(ImageGenerationFeatures.Medieval)] IImageEditClient imageEditClient,
    ImageMetadataInjector metadataInjector,
    MedievalLeaderboardService leaderboardService) : CardPhotoGeneratorBase(imageEditClient, metadataInjector)
{
    private const string GeneratePhotoPrompt = "InfoSupport.TradingCardGenerator.Api.Features.Medieval.Prompts.GeneratePhoto.md";
    private const string Scene01Prompt = "InfoSupport.TradingCardGenerator.Api.Features.Medieval.Prompts.Scene01.md";
    private const string Scene02Prompt = "InfoSupport.TradingCardGenerator.Api.Features.Medieval.Prompts.Scene02.md";
    private const string Scene03Prompt = "InfoSupport.TradingCardGenerator.Api.Features.Medieval.Prompts.Scene03.md";
    private const string Scene04Prompt = "InfoSupport.TradingCardGenerator.Api.Features.Medieval.Prompts.Scene04.md";
    private const string Scene05Prompt = "InfoSupport.TradingCardGenerator.Api.Features.Medieval.Prompts.Scene05.md";

    /// <summary>
    /// Transforms a portrait photo into a medieval stained glass trading card image.
    /// </summary>
    /// <param name="request">Request data to use for generating the image.</param>
    /// <returns>Returns the generated image.</returns>
    public async Task<GenerateCardResponse> TransformPhoto(GenerateCardRequest request)
    {
        var imageStream = DecodeBase64(request.Photo);
        var renderedPromptTemplate = RenderPromptTemplate(request);
        var imageGenerationResult = await InternalTransformPhoto(imageStream, renderedPromptTemplate);

        leaderboardService.Record(new LeaderboardEntry
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Strength = request.Strength,
            Wisdom = request.Wisdom,
            Charisma = request.Charisma,
        });

        return new GenerateCardResponse
        {
            Image = Convert.ToBase64String(imageGenerationResult),
            Leaderboard = leaderboardService.GetTopEntries(),
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
        _ => Scene01Prompt
    };
}
