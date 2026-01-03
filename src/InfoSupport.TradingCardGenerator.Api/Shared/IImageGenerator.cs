namespace InfoSupport.TradingCardGenerator.Api.Shared;

/// <summary>
/// Interface for image generation to enable mocking.
/// </summary>
public interface IImageGenerator
{
    /// <summary>
    /// Generates an edited image based on the input image and prompt.
    /// </summary>
    /// <param name="imageStream">Input image stream.</param>
    /// <param name="prompt">The prompt to modify the image.</param>
    /// <returns>The generated image bytes.</returns>
    Task<byte[]> GenerateImageEditAsync(Stream imageStream, string prompt);
}
