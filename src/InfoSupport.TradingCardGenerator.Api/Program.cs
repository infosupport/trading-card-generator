using System.ClientModel;
using Azure.AI.OpenAI;
using Azure.Identity;
using InfoSupport.TradingCardGenerator.Api.Features.Jurassic;
using InfoSupport.TradingCardGenerator.Api.Features.Sports;
using InfoSupport.TradingCardGenerator.Api.Features.Sports.Endpoints;
using InfoSupport.TradingCardGenerator.Api.Shared;
using Microsoft.SemanticKernel;

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

// Configure either mock or real image generator based on settings
if (imageModelSettings?.UseMock == true)
{
    builder.Services.AddSingleton<IImageGenerator, MockImageGenerator>();
}
else
{
    var azureClient = new AzureOpenAIClient(
        new Uri(imageModelSettings!.Endpoint!),
        new ChainedTokenCredential(
            new AzureCliCredential(),
            new ManagedIdentityCredential()
        ),
        new AzureOpenAIClientOptions(AzureOpenAIClientOptions.ServiceVersion.V2025_04_01_Preview));

    builder.Services.AddSingleton(azureClient);
    builder.Services.AddSingleton<IImageGenerator, RealImageGenerator>();
}

builder.Services.AddSingleton<ImageMetadataInjector>();
builder.Services.AddSingleton<SportsCardPhotoGenerator>();
builder.Services.AddSingleton<JurassicCardPhotoGenerator>();

var app = builder.Build();

app.UseCors("AllowFrontend");

app.UseStaticFiles();
app.MapCardGenerationEndpoints();

app.Run();