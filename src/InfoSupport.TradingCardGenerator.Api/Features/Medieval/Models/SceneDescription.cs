namespace InfoSupport.TradingCardGenerator.Api.Features.Medieval.Models;

/// <summary>
/// Descriptor for available scenes in the medieval card generator.
/// </summary>
/// <param name="Identifier">Identifier for the scene.</param>
/// <param name="Description">A short description for the scene.</param>
public record SceneDescription(string Identifier, string Description);
