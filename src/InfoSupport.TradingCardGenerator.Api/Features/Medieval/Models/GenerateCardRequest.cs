namespace InfoSupport.TradingCardGenerator.Api.Features.Medieval.Models;

/// <summary>
/// Request data for generating a medieval trading card image.
/// </summary>
public class GenerateCardRequest
{
    /// <summary>
    /// The base64 encoded photo of the conference visitor.
    /// </summary>
    public required string Photo { get; set; }

    /// <summary>
    /// The identifier for the scene to render.
    /// </summary>
    public required string Scene { get; set; }

    /// <summary>
    /// The adventurer's first name, used to record the rolled stats on the leaderboard.
    /// </summary>
    public required string FirstName { get; set; }

    /// <summary>
    /// The adventurer's last name, used to record the rolled stats on the leaderboard.
    /// </summary>
    public required string LastName { get; set; }

    /// <summary>
    /// Rolled strength stat.
    /// </summary>
    public required int Strength { get; set; }

    /// <summary>
    /// Rolled wisdom stat.
    /// </summary>
    public required int Wisdom { get; set; }

    /// <summary>
    /// Rolled charisma stat.
    /// </summary>
    public required int Charisma { get; set; }
}
