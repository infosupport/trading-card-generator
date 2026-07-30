using System.Collections.Concurrent;
using InfoSupport.TradingCardGenerator.Api.Features.Medieval.Models;

namespace InfoSupport.TradingCardGenerator.Api.Features.Medieval;

/// <summary>
/// Keeps track of the best rolled stats per adventurer name for the medieval leaderboard.
/// </summary>
public class MedievalLeaderboardService
{
    private const int MaxEntries = 10;

    private readonly ConcurrentDictionary<string, LeaderboardEntry> entriesByName = new(StringComparer.OrdinalIgnoreCase);

    /// <summary>
    /// Records a rolled entry, keeping only the best roll per adventurer name.
    /// </summary>
    /// <param name="entry">The rolled stats to record.</param>
    public void Record(LeaderboardEntry entry)
    {
        var key = $"{entry.FirstName.Trim()} {entry.LastName.Trim()}";

        entriesByName.AddOrUpdate(
            key,
            entry,
            (_, existing) => IsBetter(entry, existing) ? entry : existing);
    }

    /// <summary>
    /// Gets the top ranked leaderboard entries, ordered by strength, then wisdom, then charisma.
    /// </summary>
    public IReadOnlyList<LeaderboardEntry> GetTopEntries()
    {
        return entriesByName.Values
            .OrderByDescending(entry => entry.Strength)
            .ThenByDescending(entry => entry.Wisdom)
            .ThenByDescending(entry => entry.Charisma)
            .Take(MaxEntries)
            .ToList();
    }

    private static bool IsBetter(LeaderboardEntry candidate, LeaderboardEntry existing)
    {
        if (candidate.Strength != existing.Strength)
        {
            return candidate.Strength > existing.Strength;
        }

        if (candidate.Wisdom != existing.Wisdom)
        {
            return candidate.Wisdom > existing.Wisdom;
        }

        return candidate.Charisma > existing.Charisma;
    }
}
