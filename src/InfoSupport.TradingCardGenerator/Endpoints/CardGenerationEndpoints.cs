using InfoSupport.TradingCardGenerator.Models;

namespace InfoSupport.TradingCardGenerator.Endpoints;

public static class CardGenerationEndpoints
{
    /// <summary>
    /// Maps the endpoints for card generation
    /// </summary>
    /// <param name="app">Web application instance to map the endpoints on.</param>
    public static void MapCardGenerationEndpoints(this WebApplication app)
    {
        app.MapPost("/generate", GenerateTradingCard);
    }

    private static GenerateCardResponse GenerateTradingCard(GenerateCardRequest request)
    {
        throw new NotImplementedException();
    }
}