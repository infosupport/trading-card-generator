namespace InfoSupport.TradingCardGenerator.Api.Shared;

/// <summary>
/// Mock implementation for local development - returns the original image back.
/// </summary>
public class MockImageGenerator : IImageGenerator
{
    public async Task<byte[]> GenerateImageEditAsync(Stream imageStream, string prompt)
    {
        // Just return the original image for mock mode
        using var memoryStream = new MemoryStream();
        await imageStream.CopyToAsync(memoryStream);
        return memoryStream.ToArray();
    }
}
