using InfoSupport.TradingCardGenerator.Api.Features.Sports.Models;
using Microsoft.AspNetCore.Mvc;

namespace InfoSupport.TradingCardGenerator.Api.Features.Sports.Endpoints;

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
        app.MapPost("/cards/sports", GenerateTradingCard);
    }

    private static async Task<GenerateCardResponse> GenerateTradingCard(
        GenerateCardRequest request, [FromServices] SportsCardPhotoGenerator generator)
    {
        return await generator.TransformPhoto(request);
    }
}
