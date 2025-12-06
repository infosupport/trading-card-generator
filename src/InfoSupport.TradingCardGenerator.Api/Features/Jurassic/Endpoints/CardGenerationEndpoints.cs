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
        app.MapGet("/cards/jurassic/scenes", GetAvailableScenes);
    }

    private static async Task<GenerateCardResponse> GenerateTradingCard(
        GenerateCardRequest request,
        [FromServices] JurassicCardPhotoGenerator generator)
    {
        return await generator.TransformPhoto(request);
    }
    
    private static async Task<IEnumerable<SceneDescription>> GetAvailableScenes()
    {
        return
        [
            new SceneDescription("scene01", "T-Rex Chase - Running in terror from a roaring T-Rex during a rainy night near the electric fence."),
            new SceneDescription("scene02", "Sick Triceratops - Standing in awe beside a sick Triceratops lying in the warm daylight."),
            new SceneDescription("scene03", "Welcome to Jurassic Park - First breathtaking encounter with a Brachiosaurus from the jeep."),
            new SceneDescription("scene04", "Dinosaur Valley - Witnessing a majestic herd of Brachiosaurus and Parasaurolophus in golden sunlight."),
            new SceneDescription("scene05", "Helicopter Arrival - Arriving by helicopter with a dramatic aerial view of Isla Nublar."),
            new SceneDescription("scene06", "Dilophosaurus Encounter - Cornered by a venom-spitting Dilophosaurus with its frill extended in the rain."),
            new SceneDescription("scene07", "Compy Swarm - Surrounded by a pack of small but deadly Compsognathus in tall grass."),
            new SceneDescription("scene08", "Kitchen Raptors - Hiding in terror from a stalking Velociraptor in the industrial kitchen."),
            new SceneDescription("scene09", "Egg Hatching - Watching in wonder as a baby dinosaur hatches from its egg in the incubator."),
            new SceneDescription("scene10", "Genetics Lab - Exploring the futuristic genetics lab with DNA displays and dinosaur eggs."),
            new SceneDescription("scene11", "Mirror Chase - The iconic T-Rex in the side mirror during a high-speed chase in the rain."),
            new SceneDescription("scene12", "Fence Climb - Desperately climbing the electric fence while Velociraptors attack from below."),
        ];
    }
}