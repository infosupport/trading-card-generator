namespace InfoSupport.TradingCardGenerator.Api.Shared;

public class ImageModelSettings
{
    public string? Endpoint { get; set; }
    public string? ApiKey { get; set; }
    public string? DeploymentName { get; set; }
    public bool UseMock { get; set; } = false;
}