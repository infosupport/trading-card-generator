using System.ClientModel;
using Azure.AI.OpenAI;
using InfoSupport.TradingCardGenerator.Api.Features.Jurassic;
using InfoSupport.TradingCardGenerator.Api.Features.Jurassic.Models;
using InfoSupport.TradingCardGenerator.Api.Shared;
using InfoSupport.TradingCardGenerator.Api.Tests.Features.Sports;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace InfoSupport.TradingCardGenerator.Api.Tests.Features.Jurassic
{
    public class JurassicCardPhotoGeneratorIntegrationTests
    {
        [Fact]
        [Trait("Category", "Integration")]
        public async Task TransformPhoto_Integration_ReturnsBase64Image()
        {
            var configuration = GetConfiguration();

            var languageModelSettings = new ImageModelSettings
            {
                DeploymentName = configuration["ImageGenerationModel:DeploymentName"]!,
                Endpoint = configuration["ImageGenerationModel:Endpoint"]!,
                ApiKey = configuration["ImageGenerationModel:ApiKey"]!,
            };

            var azureClient = new AzureOpenAIClient(
                new Uri(configuration["ImageGenerationModel:Endpoint"]!),
                new ApiKeyCredential(configuration["ImageGenerationModel:ApiKey"]!),
                new AzureOpenAIClientOptions(AzureOpenAIClientOptions.ServiceVersion.V2025_04_01_Preview));

            var settings = Options.Create(languageModelSettings);
            var imageMetadataInjector = new ImageMetadataInjector();
            var generator = new JurassicCardPhotoGenerator(azureClient, settings, imageMetadataInjector);

            var request = new GenerateCardRequest
            {
                Photo = GetSamplePhoto()
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
            File.WriteAllBytes(Path.Combine(Directory.GetCurrentDirectory(), "generated-jurassic.png"), imageBytes);
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