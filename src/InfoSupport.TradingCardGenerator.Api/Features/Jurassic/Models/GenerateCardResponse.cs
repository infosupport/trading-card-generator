namespace InfoSupport.TradingCardGenerator.Api.Features.Jurassic.Models;

/// <summary>
/// Response model for trading card generation
/// </summary>
public class GenerateCardResponse
{
    /// <summary>
    /// Generated trading card image as base64 encoded string
    /// </summary>
    public required string Image { get; set; }
}