namespace InfoSupport.TradingCardGenerator.Api.Shared;

public enum ImageModelProvider
{
    AzureOpenAI,
    Mai,
}

public class ImageModelSettings
{
    public required string Endpoint { get; set; }
    public string? ApiKey { get; set; }
    public required string DeploymentName { get; set; }
    public ImageModelProvider Provider { get; set; } = ImageModelProvider.AzureOpenAI;
}