using Azure.Identity;
using InfoSupport.TradingCardGenerator.Api.Features.Sports;
using InfoSupport.TradingCardGenerator.Api.Features.Sports.Models;
using InfoSupport.TradingCardGenerator.Api.Shared;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace InfoSupport.TradingCardGenerator.Api.Tests.Features.Sports
{
    public class TradingCardPhotoGeneratorIntegrationTests
    {
        [Fact(Skip="Testing the other generator")]
        [Trait("Category", "Integration")]
        public async Task TransformPhoto_Integration_ReturnsBase64Image()
        {
            var configuration = GetConfiguration();

            var settings = Options.Create(new ImageModelSettings
            {
                DeploymentName = configuration["ImageGenerationModel:DeploymentName"]!,
                Endpoint = configuration["ImageGenerationModel:Endpoint"]!,
                Provider = ImageModelProvider.Mai,
            });

            var imageEditClient = new MaiImageEditClient(
                new HttpClient(),
                new AzureCliCredential(),
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