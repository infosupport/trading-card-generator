namespace InfoSupport.TradingCardGenerator.Api.Features.Isks.Models;

/// <summary>
/// Request data for generating an ISKS 2026 trading card image.
/// </summary>
public class GenerateCardRequest
{
    /// <summary>
    /// The base64 encoded photo of the conference visitor.
    /// </summary>
    public required string Photo { get; set; }
}
