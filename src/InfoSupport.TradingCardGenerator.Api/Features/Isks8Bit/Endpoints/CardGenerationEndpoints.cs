using InfoSupport.TradingCardGenerator.Api.Features.Isks8Bit.Models;
using Microsoft.AspNetCore.Mvc;

namespace InfoSupport.TradingCardGenerator.Api.Features.Isks8Bit.Endpoints;

/// <summary>
/// Endpoints used to generate ISKS 2026 8-bit postcard photos.
/// </summary>
public static class CardGenerationEndpoints
{
    /// <summary>
    /// Maps the endpoints for ISKS 2026 8-bit postcard generation
    /// </summary>
    /// <param name="app">Web application instance to map the endpoints on.</param>
    public static void MapIsks8BitCardEndpoints(this WebApplication app)
    {
        app.MapPost("/cards/isks-8bit", GenerateTradingCard);
        app.MapGet("/cards/isks-8bit/scenes", GetAvailableScenes);
    }

    private static async Task<GenerateCardResponse> GenerateTradingCard(
        GenerateCardRequest request,
        [FromServices] Isks8BitCardPhotoGenerator generator)
    {
        return await generator.TransformPhoto(request);
    }

    private static async Task<IEnumerable<SceneDescription>> GetAvailableScenes()
    {
        return
        [
            new SceneDescription("scene01", "Outdoor Fairground - Conversing with friendly attendees on a sunny fairground surrounded by tents and festival pennants."),
            new SceneDescription("scene02", "Tent Hackathon - Collaborating with teammates around laptops during an energetic hackathon session inside a festival tent."),
            new SceneDescription("scene03", "Fairground Promenade - Walking among colorful vendor canopies and bunting under sunny skies."),
        ];
    }
}
