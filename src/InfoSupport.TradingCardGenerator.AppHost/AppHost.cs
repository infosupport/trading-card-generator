using Aspire.Hosting.Azure;

var builder = DistributedApplication.CreateBuilder(args);

var foundry = builder.AddAzureAIFoundry("foundry");

var imageModel = foundry
    .AddDeployment("imageGenerationModel", new AIFoundryModel
    {
        Name = "gpt-image-1",
        Version = "2025-04-15",
        Format = "OpenAI",
    })
    .WithProperties(resource =>
    {
        resource.SkuCapacity = 9;
    });

var backend = builder
    .AddProject<Projects.InfoSupport_TradingCardGenerator>("backend")
    .WithReference(imageModel);

builder
    .AddNpmApp("frontend", "../InfoSupport.TradingCardGenerator.Web", "dev")
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints()
    .WithReference(backend);

builder.Build().Run();
