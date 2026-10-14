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

builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<ImageGenerationExceptionHandler>();

// Bind the configuration describing the available image models and the model each feature uses
builder.Services.Configure<ImageGenerationOptions>(
    builder.Configuration.GetSection(ImageGenerationOptions.SectionName));

TokenCredential credential = new ChainedTokenCredential(
    new AzureCliCredential(),
    new ManagedIdentityCredential());

builder.Services.AddSingleton(credential);
builder.Services.AddHttpClient(ImageEditClientFactory.HttpClientName, client =>
{
    client.Timeout = TimeSpan.FromMinutes(10);
})
.AddStandardResilienceHandler(options =>
{
    // Image edits regularly take tens of seconds, so the default sub-second budgets are far too tight.
    options.AttemptTimeout.Timeout = TimeSpan.FromMinutes(2);
    options.TotalRequestTimeout.Timeout = TimeSpan.FromMinutes(5);
    options.CircuitBreaker.SamplingDuration = TimeSpan.FromMinutes(4);
    options.Retry.MaxRetryAttempts = 3;
    options.Retry.Delay = TimeSpan.FromSeconds(2);
});

builder.Services.AddSingleton<IImageEditClientFactory, ImageEditClientFactory>();

foreach (var feature in ImageGenerationFeatures.All)
{
    builder.Services.AddKeyedSingleton<IImageEditClient>(feature, (sp, key) =>
        sp.GetRequiredService<IImageEditClientFactory>().CreateForFeature((string)key!));
}

builder.Services.AddSingleton<SportsCardPhotoGenerator>();
builder.Services.AddSingleton<JurassicCardPhotoGenerator>();
builder.Services.AddSingleton<MedievalCardPhotoGenerator>();
var leaderboardDatabasePath = builder.Configuration["MedievalLeaderboard:DatabasePath"]
    ?? Path.Combine("App_Data", "medieval-leaderboard.db");
if (!Path.IsPathRooted(leaderboardDatabasePath))
{
    leaderboardDatabasePath = Path.Combine(builder.Environment.ContentRootPath, leaderboardDatabasePath);
}
builder.Services.AddSingleton(new MedievalLeaderboardService(leaderboardDatabasePath));

var app = builder.Build();

app.Services.GetRequiredService<MedievalLeaderboardService>().Initialize();

app.UseCors("AllowFrontend");
app.UseExceptionHandler();

app.UseStaticFiles();
app.MapSportsCardEndpoints();
app.MapJurassicCardEndpoints();
app.MapMedievalCardEndpoints();
app.Run();