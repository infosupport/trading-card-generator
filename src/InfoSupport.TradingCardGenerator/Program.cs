using InfoSupport.TradingCardGenerator.Endpoints;
using Microsoft.SemanticKernel;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddKernel()
    .AddAzureOpenAITextToImage(
        builder.Configuration["LanguageModel:ImageModel"]!,
        builder.Configuration["LanguageModel:Endpoint"]!,
        builder.Configuration["LanguageModel:ApiKey"]!
    );

var app = builder.Build();

app.UseStaticFiles();
app.MapCardGenerationEndpoints();

app.Run();
