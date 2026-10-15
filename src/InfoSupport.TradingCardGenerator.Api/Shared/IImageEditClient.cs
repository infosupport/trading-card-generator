namespace InfoSupport.TradingCardGenerator.Api.Shared;

/// <summary>
/// Abstraction over image edit providers (Azure OpenAI gpt-image family, MAI, etc.).
/// </summary>
public interface IImageEditClient
{
    /// <summary>
    /// Transforms an input image according to the given prompt and returns the raw image bytes.
    /// </summary>
    Task<byte[]> EditImageAsync(MemoryStream imageStream, string prompt, CancellationToken cancellationToken = default);
}
