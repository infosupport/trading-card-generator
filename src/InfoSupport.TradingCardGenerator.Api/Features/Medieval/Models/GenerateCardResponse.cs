namespace InfoSupport.TradingCardGenerator.Api.Features.Medieval.Models;

/// <summary>
/// Response model for medieval trading card generation.
/// </summary>
public class GenerateCardResponse
{
    /// <summary>
    /// Generated trading card image as base64 encoded string.
    /// </summary>
    public required string Image { get; set; }
}
