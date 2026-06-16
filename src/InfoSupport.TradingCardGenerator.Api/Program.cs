using Azure.AI.OpenAI;
using Azure.Core;
using Azure.Identity;
using InfoSupport.TradingCardGenerator.Api.Features.Jurassic;
using InfoSupport.TradingCardGenerator.Api.Features.Jurassic.Endpoints;
using InfoSupport.TradingCardGenerator.Api.Features.Medieval;
using InfoSupport.TradingCardGenerator.Api.Features.Medieval.Endpoints;
using InfoSupport.TradingCardGenerator.Api.Features.Sports;
using InfoSupport.TradingCardGenerator.Api.Features.Sports.Endpoints;
using InfoSupport.TradingCardGenerator.Api.Shared;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Bind the configuration for the image generation model
builder.Services.Configure<ImageModelSettings>(builder.Configuration.GetSection("ImageGenerationModel"));
var imageModelSettings = builder.Configuration.GetSection("ImageGenerationModel").Get<ImageModelSettings>();

// Register the image edit client based on the configured provider
TokenCredential credential = new ChainedTokenCredential(
    new AzureCliCredential(),
    new ManagedIdentityCredential());

if (imageModelSettings?.Provider == ImageModelProvider.Mai)
{
    builder.Services.AddSingleton(credential);
    builder.Services.AddHttpClient<IImageEditClient, MaiImageEditClient>(client =>
    {
        client.Timeout = TimeSpan.FromMinutes(5);
    });
}
else
{
    var azureClient = new AzureOpenAIClient(
        new Uri(imageModelSettings!.Endpoint),
        credential,
        new AzureOpenAIClientOptions(AzureOpenAIClientOptions.ServiceVersion.V2025_04_01_Preview));

    builder.Services.AddSingleton(azureClient);
    builder.Services.AddSingleton<IImageEditClient, AzureOpenAiImageEditClient>();
}

builder.Services.AddSingleton<ImageMetadataInjector>();
builder.Services.AddSingleton<SportsCardPhotoGenerator>();
builder.Services.AddSingleton<JurassicCardPhotoGenerator>();
builder.Services.AddSingleton<MedievalCardPhotoGenerator>();

var app = builder.Build();

app.UseCors("AllowFrontend");

app.UseStaticFiles();
app.MapSportsCardEndpoints();
app.MapJurassicCardEndpoints();
app.MapMedievalCardEndpoints();

app.Run();