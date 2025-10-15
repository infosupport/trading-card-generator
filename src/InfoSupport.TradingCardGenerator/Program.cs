using System.ClientModel;
using Azure.AI.OpenAI;
using InfoSupport.TradingCardGenerator.Agent;
using InfoSupport.TradingCardGenerator.Configuration;
using InfoSupport.TradingCardGenerator.Endpoints;
using Microsoft.SemanticKernel;

var builder = WebApplication.CreateBuilder(args);

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3001")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.Configure<LanguageModelSettings>(
    builder.Configuration.GetSection("LanguageModel"));

var azureClient = new AzureOpenAIClient(
    new Uri(builder.Configuration["LanguageModel:Endpoint"]!),
    new ApiKeyCredential(builder.Configuration["LanguageModel:ApiKey"]!), 
    new AzureOpenAIClientOptions(AzureOpenAIClientOptions.ServiceVersion.V2025_04_01_Preview)
);

builder.Services.AddSingleton(azureClient);
builder.Services.AddSingleton<ImageMetadataInjector>();
builder.Services.AddSingleton<TradingCardPhotoGenerator>();

var app = builder.Build();

// Use CORS
app.UseCors("AllowFrontend");

app.UseStaticFiles();
app.MapCardGenerationEndpoints();

app.Run();
