using System.Buffers.Text;
using Azure.AI.OpenAI;
using HandlebarsDotNet;
using InfoSupport.TradingCardGenerator.Api.Features.Sports.Models;
using InfoSupport.TradingCardGenerator.Api.Shared;
using Microsoft.Extensions.Options;
using OpenAI.Images;

namespace InfoSupport.TradingCardGenerator.Api.Features.Sports;

/// <summary>
/// The sports  card generator is responsible for generating images with a sports theme.
/// </summary>
/// <param name="azureClient">The azure AI client needed to talk to the image generation model.</param>
/// <param name="modelSettings">The settings containing the deployment name of the image generation model.</param>
/// <param name="metadataInjector">The metadata injector used to watermark the generated image.</param>
public class SportsCardPhotoGenerator(
    AzureOpenAIClient azureClient,
    IOptions<ImageModelSettings> modelSettings,
    ImageMetadataInjector metadataInjector)
    : CardPhotoGeneratorBase(azureClient, modelSettings, metadataInjector)
{
    const string SportsCardPrompt = "InfoSupport.TradingCardGenerator.Api.Features.SportsCards.Prompts.GeneratePhoto.md";

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