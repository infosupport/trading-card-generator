namespace InfoSupport.TradingCardGenerator.Api.Features.Isks8Bit.Models;

/// <summary>
/// Request for generating an ISKS 2026 8-bit postcard image.
/// </summary>
public class GenerateCardRequest
{
    /// <summary>
    /// Base64 encoded portrait photo to transform.
    /// </summary>
    public required string Photo { get; set; }

    /// <summary>
    /// The scene identifier to generate (e.g. "scene01").
    /// </summary>
    public string? Scene { get; set; }
}
