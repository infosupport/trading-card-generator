namespace InfoSupport.TradingCardGenerator.Models;

/// <summary>
/// Request model for generating a new trading card
/// </summary>
public class GenerateCardRequest
{
    /// <summary>
    /// Sport information for the trading card
    /// </summary>
    public Sport Sport { get; set; } = null!;

    /// <summary>
    /// Team information for the trading card
    /// </summary>
    public Team Team { get; set; } = null!;

    /// <summary>
    /// Player information for the trading card
    /// </summary>
    public Player Player { get; set; } = null!;
}
