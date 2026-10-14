namespace InfoSupport.TradingCardGenerator.Api.Features.Medieval.Models;

/// <summary>
/// A single entry on the medieval leaderboard, representing an adventurer's best rolled stats.
/// </summary>
public class LeaderboardEntry
{
    /// <summary>
    /// The local calendar date when this score was recorded.
    /// </summary>
    public DateOnly RecordedOn { get; set; }

    /// <summary>
    /// The adventurer's first name.
    /// </summary>
    public required string FirstName { get; set; }

    /// <summary>
    /// The adventurer's last name.
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
