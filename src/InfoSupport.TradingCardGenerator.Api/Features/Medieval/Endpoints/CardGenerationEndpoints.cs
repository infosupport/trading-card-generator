using InfoSupport.TradingCardGenerator.Api.Features.Medieval.Models;
using Microsoft.AspNetCore.Mvc;

namespace InfoSupport.TradingCardGenerator.Api.Features.Medieval.Endpoints;

/// <summary>
/// Endpoints used to generate medieval trading card photos.
/// </summary>
public static class CardGenerationEndpoints
{
    /// <summary>
    /// Maps the endpoints for medieval card generation.
    /// </summary>
    /// <param name="app">Web application instance to map the endpoints on.</param>
    public static void MapMedievalCardEndpoints(this WebApplication app)
    {
        app.MapPost("/cards/medieval", GenerateTradingCard);
        app.MapGet("/cards/medieval/scenes", GetAvailableScenes);
        app.MapGet("/cards/medieval/leaderboard", GetLeaderboard);
    }

    private static async Task<GenerateCardResponse> GenerateTradingCard(
        GenerateCardRequest request,
        [FromServices] MedievalCardPhotoGenerator generator)
    {
        return await generator.TransformPhoto(request);
    }

    private static IReadOnlyList<LeaderboardEntry> GetLeaderboard(
        [FromServices] MedievalLeaderboardService leaderboardService)
    {
        return leaderboardService.GetTopEntries();
    }

    private static IEnumerable<SceneDescription> GetAvailableScenes()
    {
        return
        [
            new SceneDescription("scene01", "Knight - Standing guard before a castle gate, heraldic flags wavering in the wind."),
            new SceneDescription("scene02", "King - Seated on a stone throne, sceptre in hand, looking straight at the camera."),
            new SceneDescription("scene03", "Minstrel - Standing in a candlelit library, reciting poems from an open scroll."),
            new SceneDescription("scene04", "Bard - Playing lute in the city streets, a peasant child watching in wonder."),
            new SceneDescription("scene05", "Alchemist - Holding a glowing elixir flask in their laboratory, racks of glassware all around."),
        ];
    }
}
