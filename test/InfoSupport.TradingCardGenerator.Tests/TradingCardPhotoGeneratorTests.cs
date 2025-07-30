using System;
using System.ClientModel;
using System.Threading.Tasks;
using Azure.AI.OpenAI;
using InfoSupport.TradingCardGenerator.Agent;
using InfoSupport.TradingCardGenerator.Configuration;
using InfoSupport.TradingCardGenerator.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Xunit;

public class TradingCardPhotoGeneratorIntegrationTests
{
    [Fact]
    [Trait("Category", "Integration")]
    public async Task TransformPhoto_Integration_ReturnsBase64Image()
    {
        var configuration = GetConfiguration();

        var languageModelSettings = new LanguageModelSettings
        {
            ImageModel = configuration["LanguageModel:ImageModel"]!,
            Endpoint = configuration["LanguageModel:Endpoint"]!,
            ApiKey = configuration["LanguageModel:ApiKey"]!,
        };

        var azureClient = new AzureOpenAIClient(
            new Uri(configuration["LanguageModel:Endpoint"]!),
            new ApiKeyCredential(configuration["LanguageModel:ApiKey"]!),
            new AzureOpenAIClientOptions(AzureOpenAIClientOptions.ServiceVersion.V2025_04_01_Preview));

        var settings = Options.Create(languageModelSettings);
        var generator = new TradingCardPhotoGenerator(azureClient, settings);

        var request = new GenerateCardRequest
        {
            Player = new Player
            {
                Photo = GetSamplePhoto()
            },
            Sport = new Sport
            {
                Type = "hockey"
            },
            Team = new Team { Color = "Yellow", Name = "Handle Hornets" }
        };

        var result = await generator.TransformPhoto(request);

        Assert.NotNull(result);
        Assert.False(string.IsNullOrEmpty(result.Image));

        // Save the image to disk
        SaveGeneratedImage(result.Image);
    }

    private void SaveGeneratedImage(string resultImage)
    {
        var imageBytes = Convert.FromBase64String(resultImage);
        File.WriteAllBytes(Path.Combine(Directory.GetCurrentDirectory(), "generated.jpg"), imageBytes);
    }

    private IConfiguration GetConfiguration()
    {
        IConfiguration configuration = new ConfigurationBuilder()
            .AddUserSecrets(typeof(TradingCardPhotoGeneratorIntegrationTests).Assembly)
            .AddEnvironmentVariables()
            .Build();

        return configuration;
    }

    private string GetSamplePhoto()
    {
        var assembly = typeof(TradingCardPhotoGeneratorIntegrationTests).Assembly;

        var photoStream = assembly.GetManifestResourceStream(
            "InfoSupport.TradingCardGenerator.Tests.TestData.photo.png");

        var photoBytes = new byte[photoStream!.Length];
        photoStream.Read(photoBytes, 0, photoBytes.Length);

        return Convert.ToBase64String(photoBytes);
    }
}