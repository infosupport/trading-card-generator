namespace InfoSupport.TradingCardGenerator.Models;

/// <summary>
/// Team information
/// </summary>
public class Team
{
    /// <summary>
    /// Name of the team
    /// </summary>
    public string Name { get; set; } = null!;

    /// <summary>
    /// Team color
    /// </summary>
    public string Color { get; set; } = null!;

    /// <summary>
    /// Team logo as base64 encoded string
    /// </summary>
    public string Logo { get; set; } = null!;
}
