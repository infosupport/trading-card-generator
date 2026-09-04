using HandlebarsDotNet;
using InfoSupport.TradingCardGenerator.Api.Features.Sports.Models;
using InfoSupport.TradingCardGenerator.Api.Shared;

namespace InfoSupport.TradingCardGenerator.Api.Features.Sports;

/// <summary>
/// The sports card generator is responsible for generating images with a sports theme.
/// </summary>
/// <param name="imageEditClient">The image edit client used to transform the photo.</param>
/// <param name="metadataInjector">The metadata injector used to watermark the generated image.</param>
public class SportsCardPhotoGenerator(
    [FromKeyedServices(ImageGenerationFeatures.Sports)] IImageEditClient imageEditClient,
    ImageMetadataInjector metadataInjector)
    : CardPhotoGeneratorBase(imageEditClient, metadataInjector)
{
    const string SportsCardPrompt = "InfoSupport.TradingCardGenerator.Api.Features.Sports.Prompts.GeneratePhoto.md";

    /// <summary>
    /// Transforms a portrait photo into a trading card image.
    /// </summary>
    /// <param name="request">Request data to use for generating the image.</param>
    /// <returns>Returns the generated image.</returns>
    public async Task<GenerateCardResponse> TransformPhoto(GenerateCardRequest request)
    {
        var imageStream = DecodeBase64(request.Player.Photo);
        var sportsCardPromptTemplate = RenderPromptTemplate(request);
        var imageGenerationResult = await InternalTransformPhoto(imageStream, sportsCardPromptTemplate);

        return new GenerateCardResponse
        {
            Image = Convert.ToBase64String(imageGenerationResult),
        };
    }

    private static string RenderPromptTemplate(GenerateCardRequest request)
    {
        var promptTemplate = Handlebars.Compile(EmbeddedResource.Read(SportsCardPrompt));

        var promptTemplateData = new
        {
            sportName = request.Sport.Type,
            teamColor = request.Team.Color,
            teamName = request.Team.Name,
        };

        return promptTemplate.Invoke(promptTemplateData);
    }
}