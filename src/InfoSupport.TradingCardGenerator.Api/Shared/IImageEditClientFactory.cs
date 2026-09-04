namespace InfoSupport.TradingCardGenerator.Api.Shared;

/// <summary>
/// Resolves the <see cref="IImageEditClient"/> implementation configured for a feature.
/// </summary>
public interface IImageEditClientFactory
{
    /// <summary>
    /// Creates the image edit client for the given feature name.
    /// </summary>
    /// <param name="featureName">One of the constants on <see cref="ImageGenerationFeatures"/>.</param>
    IImageEditClient CreateForFeature(string featureName);
}
