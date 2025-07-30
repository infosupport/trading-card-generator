namespace InfoSupport.TradingCardGenerator.Models;

/// <summary>
/// Response model for trading card generation
/// </summary>
public class GenerateCardResponse
{
    /// <summary>
    /// Generated trading card image as base64 encoded string
    /// </summary>
    public string Image { get; set; } = null!;
}
