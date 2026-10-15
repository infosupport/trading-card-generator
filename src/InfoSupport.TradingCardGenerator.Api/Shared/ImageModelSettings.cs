namespace InfoSupport.TradingCardGenerator.Api.Shared;

public enum ImageModelProvider
{
    AzureOpenAI,
    Mai,
}

public class ImageModelSettings
{
    public string Endpoint { get; set; } = string.Empty;
    public string? ApiKey { get; set; }
    public string DeploymentName { get; set; } = string.Empty;
    public ImageModelProvider Provider { get; set; } = ImageModelProvider.AzureOpenAI;
}