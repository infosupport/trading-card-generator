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

// Bind the configuration describing the available image models and the model each feature uses
builder.Services.Configure<ImageGenerationOptions>(
    builder.Configuration.GetSection(ImageGenerationOptions.SectionName));

TokenCredential credential = new ChainedTokenCredential(
    new AzureCliCredential(),
    new ManagedIdentityCredential());

builder.Services.AddSingleton(credential);
builder.Services.AddHttpClient(ImageEditClientFactory.HttpClientName, client =>
{
    client.Timeout = TimeSpan.FromMinutes(5);
});

builder.Services.AddSingleton<IImageEditClientFactory, ImageEditClientFactory>();

foreach (var feature in ImageGenerationFeatures.All)
{
    builder.Services.AddKeyedSingleton<IImageEditClient>(feature, (sp, key) =>
        sp.GetRequiredService<IImageEditClientFactory>().CreateForFeature((string)key!));
}

builder.Services.AddSingleton<ImageMetadataInjector>();
builder.Services.AddSingleton<SportsCardPhotoGenerator>();
builder.Services.AddSingleton<JurassicCardPhotoGenerator>();
builder.Services.AddSingleton<MedievalCardPhotoGenerator>();
builder.Services.AddSingleton<MedievalLeaderboardService>();

var app = builder.Build();

app.UseCors("AllowFrontend");

app.UseStaticFiles();
app.MapSportsCardEndpoints();
app.MapJurassicCardEndpoints();
app.MapMedievalCardEndpoints();

app.Run();