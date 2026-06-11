namespace InfoSupport.TradingCardGenerator.Api.Shared;

/// <summary>
/// Provides base functionality to turn a regular photo into a themed trading card photo.
/// </summary>
public abstract class CardPhotoGeneratorBase(
    IImageEditClient imageEditClient,
    ImageMetadataInjector metadataInjector)
{
    /// <summary>
    /// Generates an image based on the input image and a pre-rendered prompt.
    /// </summary>
    /// <param name="imageStream">Input stream containing the submitted user image.</param>
    /// <param name="prompt">The prompt to modify the image.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Returns the raw data of the output image.</returns>
    /// <remarks>The output image is watermarked so we can recognize it as AI generated.</remarks>
    protected async Task<byte[]> InternalTransformPhoto(MemoryStream imageStream, string prompt, CancellationToken cancellationToken = default)
    {
        var imageBytes = await imageEditClient.EditImageAsync(imageStream, prompt, cancellationToken);
        return metadataInjector.InjectMetadata(imageBytes);
    }

    /// <summary>
    /// Decodes a base64 string into a memory stream.
    /// </summary>
    protected MemoryStream DecodeBase64(string base64)
    {
        var rawData = Convert.FromBase64String(base64);
        return new MemoryStream(rawData);
    }
}