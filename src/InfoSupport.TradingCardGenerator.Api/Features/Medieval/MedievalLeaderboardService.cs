using System.Globalization;
using InfoSupport.TradingCardGenerator.Api.Features.Medieval.Models;
using Microsoft.Data.Sqlite;

namespace InfoSupport.TradingCardGenerator.Api.Features.Medieval;

/// <summary>
/// Keeps track of the best rolled stats per adventurer name for the medieval leaderboard.
/// </summary>
public class MedievalLeaderboardService
{
    private const int MaxEntries = 10;
    private readonly string connectionString;
    private readonly TimeProvider timeProvider;

    public MedievalLeaderboardService(string databasePath, TimeProvider? timeProvider = null)
    {
        var fullPath = Path.GetFullPath(databasePath);
        Directory.CreateDirectory(Path.GetDirectoryName(fullPath)!);
        connectionString = new SqliteConnectionStringBuilder { DataSource = fullPath }.ToString();
        this.timeProvider = timeProvider ?? TimeProvider.System;
    }

    /// <summary>
    /// Creates the leaderboard table if it does not already exist.
    /// </summary>
    public void Initialize()
    {
        using var connection = new SqliteConnection(connectionString);
        connection.Open();

        if (!TableExists(connection))
        {
            CreateTable(connection);
            return;
        }

        if (!HasRecordedOnColumn(connection))
        {
            using var dropCommand = connection.CreateCommand();
            dropCommand.CommandText = "DROP TABLE LeaderboardEntries;";
            dropCommand.ExecuteNonQuery();
            CreateTable(connection);
        }
    }

    private static bool TableExists(SqliteConnection connection)
    {
        using var command = connection.CreateCommand();
        command.CommandText = "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'LeaderboardEntries';";
        return command.ExecuteScalar() is not null;
    }

    private static bool HasRecordedOnColumn(SqliteConnection connection)
    {
        using var command = connection.CreateCommand();
        command.CommandText = "PRAGMA table_info(LeaderboardEntries);";

        using var reader = command.ExecuteReader();
        while (reader.Read())
        {
            if (string.Equals(reader.GetString(1), "RecordedOn", StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }
        }

        return false;
    }

    private static void CreateTable(SqliteConnection connection)
    {
        using var command = connection.CreateCommand();
        command.CommandText = """
            CREATE TABLE LeaderboardEntries (
                RecordedOn TEXT NOT NULL,
                NameKey TEXT NOT NULL,
                FirstName TEXT NOT NULL,
                LastName TEXT NOT NULL,
                Strength INTEGER NOT NULL,
                Wisdom INTEGER NOT NULL,
                Charisma INTEGER NOT NULL,
                PRIMARY KEY (RecordedOn, NameKey)
            );
            """;
        command.ExecuteNonQuery();
    }

    /// <summary>
    /// Records a rolled entry, keeping only the best roll per adventurer name.
    /// </summary>
    /// <param name="entry">The rolled stats to record.</param>
    public void Record(LeaderboardEntry entry)
    {
        var nameKey = $"{entry.FirstName.Trim()} {entry.LastName.Trim()}".ToUpperInvariant();
        var recordedOn = GetCurrentDate();

        using var connection = new SqliteConnection(connectionString);
        connection.Open();

        using var command = connection.CreateCommand();
        command.CommandText = """
            INSERT INTO LeaderboardEntries (RecordedOn, NameKey, FirstName, LastName, Strength, Wisdom, Charisma)
            VALUES ($recordedOn, $nameKey, $firstName, $lastName, $strength, $wisdom, $charisma)
            ON CONFLICT(RecordedOn, NameKey) DO UPDATE SET
                FirstName = excluded.FirstName,
                LastName = excluded.LastName,
                Strength = excluded.Strength,
                Wisdom = excluded.Wisdom,
                Charisma = excluded.Charisma
            WHERE excluded.Strength > LeaderboardEntries.Strength
                OR (excluded.Strength = LeaderboardEntries.Strength AND excluded.Wisdom > LeaderboardEntries.Wisdom)
                OR (excluded.Strength = LeaderboardEntries.Strength AND excluded.Wisdom = LeaderboardEntries.Wisdom
                    AND excluded.Charisma > LeaderboardEntries.Charisma);
            """;
        command.Parameters.AddWithValue("$recordedOn", recordedOn);
        command.Parameters.AddWithValue("$nameKey", nameKey);
        command.Parameters.AddWithValue("$firstName", entry.FirstName);
        command.Parameters.AddWithValue("$lastName", entry.LastName);
        command.Parameters.AddWithValue("$strength", entry.Strength);
        command.Parameters.AddWithValue("$wisdom", entry.Wisdom);
        command.Parameters.AddWithValue("$charisma", entry.Charisma);
        command.ExecuteNonQuery();
    }

    /// <summary>
    /// Gets the top ranked leaderboard entries, ordered by strength, then wisdom, then charisma.
    /// </summary>
    public IReadOnlyList<LeaderboardEntry> GetTopEntries()
    {
        using var connection = new SqliteConnection(connectionString);
        connection.Open();

        using var command = connection.CreateCommand();
        command.CommandText = """
            SELECT FirstName, LastName, Strength, Wisdom, Charisma, RecordedOn
            FROM LeaderboardEntries
            WHERE RecordedOn = $recordedOn
            ORDER BY Strength DESC, Wisdom DESC, Charisma DESC
            LIMIT $maxEntries;
            """;
        command.Parameters.AddWithValue("$recordedOn", GetCurrentDate());
        command.Parameters.AddWithValue("$maxEntries", MaxEntries);

        using var reader = command.ExecuteReader();
        var entries = new List<LeaderboardEntry>();
        while (reader.Read())
        {
            entries.Add(new LeaderboardEntry
            {
                FirstName = reader.GetString(0),
                LastName = reader.GetString(1),
                Strength = reader.GetInt32(2),
                Wisdom = reader.GetInt32(3),
                Charisma = reader.GetInt32(4),
                RecordedOn = DateOnly.ParseExact(reader.GetString(5), "yyyy-MM-dd", CultureInfo.InvariantCulture),
            });
        }

        return entries;
    }

    private string GetCurrentDate() =>
        DateOnly.FromDateTime(timeProvider.GetLocalNow().DateTime).ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
}
