namespace InfoSupport.TradingCardGenerator.Api.Features.Isks8Bit.Models;

/// <summary>
/// Response for an ISKS 2026 8-bit postcard generation request.
/// </summary>
public class GenerateCardResponse
{
    /// <summary>
    /// Base64 encoded generated card image.
    /// </summary>
    public required string Image { get; set; }
}
