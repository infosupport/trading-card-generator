using Azure.AI.OpenAI;
using Azure.Identity;
using InfoSupport.TradingCardGenerator.Api.Features.Sports;
using InfoSupport.TradingCardGenerator.Api.Features.Sports.Models;
using InfoSupport.TradingCardGenerator.Api.Shared;
using Microsoft.Extensions.Configuration;

namespace InfoSupport.TradingCardGenerator.Api.Tests.Features.Sports
{
    public class TradingCardPhotoGeneratorIntegrationTests
    {
        [Fact(Skip="Testing the other generator")]
        [Trait("Category", "Integration")]
        public async Task TransformPhoto_Integration_ReturnsBase64Image()
        {
            var configuration = GetConfiguration();

            var settings = new ImageModelSettings
            {
                DeploymentName = configuration["ImageGeneration:Models:gpt-image-1.5:DeploymentName"] ?? "gpt-image-1.5",
                Endpoint = configuration["ImageGeneration:Models:gpt-image-1.5:Endpoint"]!,
                Provider = ImageModelProvider.AzureOpenAI,
            };

            var imageEditClient = new AzureOpenAiImageEditClient(
                new AzureOpenAIClient(
                    new Uri(settings.Endpoint),
                    new AzureCliCredential(),
                    new AzureOpenAIClientOptions(AzureOpenAIClientOptions.ServiceVersion.V2025_04_01_Preview)),
                settings);

            var imageMetadataInjector = new ImageMetadataInjector();
            var generator = new SportsCardPhotoGenerator(imageEditClient, imageMetadataInjector);

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

            SaveGeneratedImage(result.Image);
        }

        private void SaveGeneratedImage(string resultImage)
        {
            var imageBytes = Convert.FromBase64String(resultImage);
            File.WriteAllBytes(Path.Combine(Directory.GetCurrentDirectory(), "generated-sports.png"), imageBytes);
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

            using var photoStream = assembly.GetManifestResourceStream(
                "InfoSupport.TradingCardGenerator.Api.Tests.TestData.photo.png")
                ?? throw new InvalidOperationException("Embedded test photo not found as resource.");

            using var ms = new MemoryStream();
            photoStream.CopyTo(ms);
 
            return Convert.ToBase64String(ms.ToArray());
        }
    }
}