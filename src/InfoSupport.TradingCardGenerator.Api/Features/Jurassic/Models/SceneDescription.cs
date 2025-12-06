namespace InfoSupport.TradingCardGenerator.Api.Features.Jurassic.Models;

/// <summary>
/// Descriptor for available scenes in the card generator
/// </summary>
/// <param name="Identifier">Identifier for the scene</param>
/// <param name="Description">A short description for the scene</param>
public record SceneDescription(string Identifier, string Description);