using InfoSupport.TradingCardGenerator.Api.Features.Medieval;
using InfoSupport.TradingCardGenerator.Api.Features.Medieval.Models;
using Microsoft.Data.Sqlite;

namespace InfoSupport.TradingCardGenerator.Api.Tests.Features.Medieval;

public class MedievalLeaderboardServiceTests
{
    [Fact]
    public void Record_PersistsBestRollAcrossServiceInstances()
    {
        var databaseDirectory = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString("N"));
        var databasePath = Path.Combine(databaseDirectory, "leaderboard.db");
        var timeProvider = new TestTimeProvider(new DateTimeOffset(2026, 10, 14, 12, 0, 0, TimeSpan.Zero));

        try
        {
            var leaderboard = new MedievalLeaderboardService(databasePath, timeProvider);
            leaderboard.Initialize();
            leaderboard.Record(new LeaderboardEntry
            {
                FirstName = "Ada",
                LastName = "Lovelace",
                Strength = 7,
                Wisdom = 2,
                Charisma = 1,
            });
            leaderboard.Record(new LeaderboardEntry
            {
                FirstName = "ada",
                LastName = "lovelace",
                Strength = 6,
                Wisdom = 10,
                Charisma = 10,
            });
            leaderboard.Record(new LeaderboardEntry
            {
                FirstName = "ADA",
                LastName = "LOVELACE",
                Strength = 7,
                Wisdom = 2,
                Charisma = 3,
            });

            var restartedLeaderboard = new MedievalLeaderboardService(databasePath, timeProvider);
            restartedLeaderboard.Initialize();
            var entries = restartedLeaderboard.GetTopEntries();

            var entry = Assert.Single(entries);
            Assert.Equal(7, entry.Strength);
            Assert.Equal(2, entry.Wisdom);
            Assert.Equal(3, entry.Charisma);
            Assert.Equal(new DateOnly(2026, 10, 14), entry.RecordedOn);
        }
        finally
        {
            DeleteDatabaseDirectory(databaseDirectory);
        }
    }

    [Fact]
    public void GetTopEntries_ReturnsOnlyCurrentLocalDate()
    {
        var databaseDirectory = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString("N"));
        var databasePath = Path.Combine(databaseDirectory, "leaderboard.db");
        var timeProvider = new TestTimeProvider(new DateTimeOffset(2026, 10, 14, 23, 0, 0, TimeSpan.Zero));

        try
        {
            var leaderboard = new MedievalLeaderboardService(databasePath, timeProvider);
            leaderboard.Initialize();
            leaderboard.Record(new LeaderboardEntry
            {
                FirstName = "Ada",
                LastName = "Lovelace",
                Strength = 7,
                Wisdom = 2,
                Charisma = 3,
            });

            timeProvider.SetLocalNow(new DateTimeOffset(2026, 10, 15, 1, 0, 0, TimeSpan.Zero));
            Assert.Empty(leaderboard.GetTopEntries());

            leaderboard.Record(new LeaderboardEntry
            {
                FirstName = "Ada",
                LastName = "Lovelace",
                Strength = 9,
                Wisdom = 1,
                Charisma = 1,
            });

            var todayEntry = Assert.Single(leaderboard.GetTopEntries());
            Assert.Equal(9, todayEntry.Strength);
            Assert.Equal(new DateOnly(2026, 10, 15), todayEntry.RecordedOn);

            timeProvider.SetLocalNow(new DateTimeOffset(2026, 10, 14, 12, 0, 0, TimeSpan.Zero));
            var previousDayEntry = Assert.Single(leaderboard.GetTopEntries());
            Assert.Equal(7, previousDayEntry.Strength);
            Assert.Equal(new DateOnly(2026, 10, 14), previousDayEntry.RecordedOn);
        }
        finally
        {
            DeleteDatabaseDirectory(databaseDirectory);
        }
    }

    [Fact]
    public void Initialize_ReplacesOldDateLessTable()
    {
        var databaseDirectory = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString("N"));
        var databasePath = Path.Combine(databaseDirectory, "leaderboard.db");
        var timeProvider = new TestTimeProvider(new DateTimeOffset(2026, 10, 14, 12, 0, 0, TimeSpan.Zero));

        try
        {
            Directory.CreateDirectory(databaseDirectory);
            using (var connection = new SqliteConnection(new SqliteConnectionStringBuilder { DataSource = databasePath }.ToString()))
            {
                connection.Open();
                using var command = connection.CreateCommand();
                command.CommandText = """
                    CREATE TABLE LeaderboardEntries (
                        NameKey TEXT NOT NULL PRIMARY KEY,
                        FirstName TEXT NOT NULL,
                        LastName TEXT NOT NULL,
                        Strength INTEGER NOT NULL,
                        Wisdom INTEGER NOT NULL,
                        Charisma INTEGER NOT NULL
                    );
                    INSERT INTO LeaderboardEntries VALUES ('ADA LOVELACE', 'Ada', 'Lovelace', 7, 2, 3);
                    """;
                command.ExecuteNonQuery();
            }

            var leaderboard = new MedievalLeaderboardService(databasePath, timeProvider);
            leaderboard.Initialize();
            Assert.Empty(leaderboard.GetTopEntries());

            leaderboard.Record(new LeaderboardEntry
            {
                FirstName = "Ada",
                LastName = "Lovelace",
                Strength = 8,
                Wisdom = 2,
                Charisma = 1,
            });

            Assert.Equal(8, Assert.Single(leaderboard.GetTopEntries()).Strength);
        }
        finally
        {
            DeleteDatabaseDirectory(databaseDirectory);
        }
    }

    private static void DeleteDatabaseDirectory(string databaseDirectory)
    {
        if (Directory.Exists(databaseDirectory))
        {
            Directory.Delete(databaseDirectory, recursive: true);
        }
    }

    private sealed class TestTimeProvider(DateTimeOffset localNow) : TimeProvider
    {
        private DateTimeOffset currentLocalTime = localNow;

        public override DateTimeOffset GetUtcNow() => currentLocalTime;

        public override TimeZoneInfo LocalTimeZone => TimeZoneInfo.Utc;

        public void SetLocalNow(DateTimeOffset value) => currentLocalTime = value;
    }
}