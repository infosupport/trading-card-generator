using Aspire.Hosting.Azure;

var builder = DistributedApplication.CreateBuilder(args);

var backend = builder
    .AddProject<Projects.InfoSupport_TradingCardGenerator_Api>("backend");

builder
    .AddNpmApp("frontend", "../InfoSupport.TradingCardGenerator.Web", "dev")
    .WithHttpEndpoint(env: "PORT", port: 3000, isProxied: false)
    .WithExternalHttpEndpoints()
    .WithReference(backend)
    .WaitFor(backend);

builder.Build().Run();
