namespace InfoSupport.TradingCardGenerator.Api.Features.Jurassic.Models;

/// <summary>
/// Request data for generating a jurrassic trading card image.
/// </summary>
public class GenerateCardRequest
{
    /// <summary>
    /// The base64 encoded photo of the conference visitor.
    /// </summary>
    public required string Photo { get; set; }
    
    /// <summary>
    /// The identifier for the scene to render
    /// </summary>
    public required string Scene { get; set; }
}