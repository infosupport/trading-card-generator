using System.ClientModel;
using Azure.AI.OpenAI;
using Azure.Identity;
using InfoSupport.TradingCardGenerator.Agent;
using InfoSupport.TradingCardGenerator.Configuration;
using InfoSupport.TradingCardGenerator.Endpoints;
using InfoSupport.TradingCardGenerator.Shared;
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

var modelConnectionString = ConnectionString.Parse(
    builder.Configuration.GetConnectionString("imageGenerationModel")!);

var azureClient = new AzureOpenAIClient(
    new Uri(modelConnectionString["Endpoint"]!),
    new ChainedTokenCredential(new AzureCliCredential(), new ManagedIdentityCredential()));

builder.Services.AddSingleton(azureClient);
builder.Services.AddSingleton<ImageMetadataInjector>();
builder.Services.AddSingleton<TradingCardPhotoGenerator>();

var app = builder.Build();

app.UseCors("AllowFrontend");

app.UseStaticFiles();
app.MapCardGenerationEndpoints();

app.Run();
