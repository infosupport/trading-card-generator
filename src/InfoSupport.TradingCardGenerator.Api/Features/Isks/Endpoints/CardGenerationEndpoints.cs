using InfoSupport.TradingCardGenerator.Api.Features.Isks.Models;
using Microsoft.AspNetCore.Mvc;

namespace InfoSupport.TradingCardGenerator.Api.Features.Isks.Endpoints;

/// <summary>
/// Endpoints used to generate trading card photos.
/// </summary>
public static class CardGenerationEndpoints
{
    /// <summary>
    /// Maps the endpoints for ISKS 2026 card generation
    /// </summary>
    /// <param name="app">Web application instance to map the endpoints on.</param>
    public static void MapIsksCardEndpoints(this WebApplication app)
    {
        app.MapPost("/cards/isks", GenerateTradingCard);
    }

    private static async Task<GenerateCardResponse> GenerateTradingCard(
        GenerateCardRequest request,
        [FromServices] IsksCardPhotoGenerator generator)
    {
        return await generator.TransformPhoto(request);
    }
}
