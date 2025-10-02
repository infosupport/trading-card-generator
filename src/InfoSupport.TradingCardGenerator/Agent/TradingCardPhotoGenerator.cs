using Azure.AI.OpenAI;
using HandlebarsDotNet;
using InfoSupport.TradingCardGenerator.Configuration;
using InfoSupport.TradingCardGenerator.Models;
using InfoSupport.TradingCardGenerator.Shared;
using Microsoft.Extensions.Options;
using OpenAI.Images;

namespace InfoSupport.TradingCardGenerator.Agent;

public class TradingCardPhotoGenerator(AzureOpenAIClient azureClient, IOptions<LanguageModelSettings> settings)
{
    /// <summary>
    /// Transforms a portrait photo into a trading card image.
    /// </summary>
    /// <param name="request">Request data to use for generating the image.</param>
    /// <returns>Returns the generated image.</returns>
    public async Task<GenerateCardResponse> TransformPhoto(GenerateCardRequest request)
    {
        var imageClient = azureClient.GetImageClient(settings.Value.ImageModel);
        var imageStream = DecodeBase64(request.Player.Photo);

        var imageEditOptions = new ImageEditOptions
        {
            Size = GeneratedImageSize.W1024xH1024
        };

        var imageGenerationResult = await imageClient.GenerateImageEditAsync(
            imageStream, "player-photo.jpg", RenderPromptTemplate(request),
            imageEditOptions);

        var responseData = Convert.ToBase64String(
            imageGenerationResult.Value.ImageBytes.ToArray());

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
        var promptTemplate = Handlebars.Compile(
            EmbeddedResource.Read("Prompts.generate-photo.md"));

        var promptTemplateData = new
        {
            sportName = request.Sport.Type,
            teamColor = request.Team.Color,
            teamName = request.Team.Name,
        };

        return promptTemplate.Invoke(promptTemplateData);
    }
}