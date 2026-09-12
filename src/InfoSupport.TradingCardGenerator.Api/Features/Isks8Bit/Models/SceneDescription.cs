namespace InfoSupport.TradingCardGenerator.Api.Features.Isks8Bit.Models;

/// <summary>
/// Description of an available scene for ISKS 8-bit postcard generation.
/// </summary>
/// <param name="Identifier">Unique scene identifier.</param>
/// <param name="Description">Human-readable description of the scene.</param>
public record SceneDescription(string Identifier, string Description);
