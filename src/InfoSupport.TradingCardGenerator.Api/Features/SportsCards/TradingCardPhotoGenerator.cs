using Azure.AI.OpenAI;
using HandlebarsDotNet;
using InfoSupport.TradingCardGenerator.Api.Features.SportsCards.Models;
using InfoSupport.TradingCardGenerator.Api.Shared;
using Microsoft.Extensions.Options;
using OpenAI.Images;

namespace InfoSupport.TradingCardGenerator.Api.Features.SportsCards;

public class TradingCardPhotoGenerator(
    AzureOpenAIClient azureClient,
    IOptions<ImageModelSettings> modelSettings,
    ImageMetadataInjector metadataInjector)
{
    const string SportsCardPrompt = "InfoSupport.TradingCardGenerator.Api.Features.SportsCards.Prompts.GeneratePhoto.md";
    
    /// <summary>
    /// Transforms a portrait photo into a trading card image.
    /// </summary>
    /// <param name="request">Request data to use for generating the image.</param>
    /// <returns>Returns the generated image.</returns>
    public async Task<GenerateCardResponse> TransformPhoto(GenerateCardRequest request)
    {
        var imageClient = azureClient.GetImageClient(modelSettings.Value.DeploymentName);
        var imageStream = DecodeBase64(request.Player.Photo);

        var imageEditOptions = new ImageEditOptions
        {
            Size = GeneratedImageSize.W1024xH1024
        };

        var imageGenerationResult = await imageClient.GenerateImageEditAsync(
            imageStream, "player-photo.jpg", RenderPromptTemplate(request),
            imageEditOptions);

        var imageBytes = imageGenerationResult.Value.ImageBytes.ToArray();
        var imageBytesWithMetadata = metadataInjector.InjectMetadata(imageBytes);

        var responseData = Convert.ToBase64String(imageBytesWithMetadata);

        return new GenerateCardResponse
        {
            Image = responseData,
        };
    }

    private static MemoryStream DecodeBase64(string base64)
    {
        var rawData = Convert.FromBase64String(base64);
        return new MemoryStream(rawData);
    }

    private static string RenderPromptTemplate(GenerateCardRequest request)
    {
        var promptTemplate = Handlebars.Compile( EmbeddedResource.Read(SportsCardPrompt));

        var promptTemplateData = new
        {
            sportName = request.Sport.Type,
            teamColor = request.Team.Color,
            teamName = request.Team.Name,
        };

        return promptTemplate.Invoke(promptTemplateData);
    }
}