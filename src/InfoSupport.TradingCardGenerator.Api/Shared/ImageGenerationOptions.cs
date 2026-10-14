namespace InfoSupport.TradingCardGenerator.Api.Shared;

/// <summary>
/// Configures the available image models and which feature uses which model.
/// </summary>
public class ImageGenerationOptions
{
    public const string SectionName = "ImageGeneration";

    /// <summary>
    /// The model used when a feature has no explicit mapping in <see cref="Features"/>.
    /// </summary>
    public string? DefaultModel { get; set; }

    /// <summary>
    /// The configured models, keyed by a logical model name (for example <c>gpt-image-1</c>).
    /// </summary>
    public Dictionary<string, ImageModelSettings> Models { get; set; } = new(StringComparer.OrdinalIgnoreCase);

    /// <summary>
    /// Maps a feature name (see <see cref="ImageGenerationFeatures"/>) to a key in <see cref="Models"/>.
    /// </summary>
    public Dictionary<string, string> Features { get; set; } = new(StringComparer.OrdinalIgnoreCase);
}

/// <summary>
/// The feature names used to look up the image model for a card generator.
/// </summary>
public static class ImageGenerationFeatures
{
    public const string Sports = "Sports";
    public const string Jurassic = "Jurassic";
    public const string Medieval = "Medieval";

    public static readonly string[] All = [Sports, Jurassic, Medieval];
}
