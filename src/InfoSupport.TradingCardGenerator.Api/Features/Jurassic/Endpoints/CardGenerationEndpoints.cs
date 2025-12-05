using InfoSupport.TradingCardGenerator.Api.Features.Jurassic.Models;
using Microsoft.AspNetCore.Mvc;

namespace InfoSupport.TradingCardGenerator.Api.Features.Jurassic.Endpoints;

/// <summary>
/// Endpoints used to generate trading card photos.
/// </summary>
public static class CardGenerationEndpoints
{
    /// <summary>
    /// Maps the endpoints for card generation
    /// </summary>
    /// <param name="app">Web application instance to map the endpoints on.</param>
    public static void MapCardGenerationEndpoints(this WebApplication app)
    {
        app.MapPost("/cards/jurassic", GenerateTradingCard);
    }

    private static async Task<GenerateCardResponse> GenerateTradingCard(
        GenerateCardRequest request,
        [FromServices] JurassicCardPhotoGenerator generator)
    {
        return await generator.TransformPhoto(request);
    }
}