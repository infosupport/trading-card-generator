using System.ClientModel;
using Azure.AI.OpenAI;
using InfoSupport.TradingCardGenerator.Agent;
using InfoSupport.TradingCardGenerator.Configuration;
using InfoSupport.TradingCardGenerator.Endpoints;
using Microsoft.SemanticKernel;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<LanguageModelSettings>(
    builder.Configuration.GetSection("LanguageModel"));

var azureClient = new AzureOpenAIClient(
    new Uri(builder.Configuration["LanguageModel:Endpoint"]!),
    new ApiKeyCredential(builder.Configuration["LanguageModel:ApiKey"]!), 
    new AzureOpenAIClientOptions(AzureOpenAIClientOptions.ServiceVersion.V2025_04_01_Preview)
);

builder.Services.AddSingleton(azureClient);
builder.Services.AddSingleton<TradingCardPhotoGenerator>();

var app = builder.Build();

app.UseStaticFiles();
app.MapCardGenerationEndpoints();

app.Run();
