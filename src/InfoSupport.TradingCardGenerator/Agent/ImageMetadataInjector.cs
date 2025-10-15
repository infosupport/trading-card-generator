using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Metadata.Profiles.Exif;

namespace InfoSupport.TradingCardGenerator.Agent;

/// <summary>
/// Service for injecting EXIF metadata into images.
/// </summary>
public class ImageMetadataInjector
{
    private const string WatermarkText = "Generated with the Info Support AI Trading Card Generator";

    /// <summary>
    /// Injects the trading card generator watermark into the Image Editing Information EXIF field.
    /// </summary>
    /// <param name="imageBytes">The image bytes to process.</param>
    /// <returns>The image bytes with injected EXIF metadata.</returns>
    public byte[] InjectMetadata(byte[] imageBytes)
    {
        using var image = Image.Load(imageBytes);

        // Get or create EXIF profile
        var exifProfile = image.Metadata.ExifProfile ?? new ExifProfile();

        // Set the Software tag (Image Editing Information)
        // EXIF tag 0x0131 (305) - Software/Processing Software
        exifProfile.SetValue(ExifTag.Software, WatermarkText);

        // Attach the profile to the image
        image.Metadata.ExifProfile = exifProfile;

        // Save the image to a memory stream
        using var outputStream = new MemoryStream();
        image.Save(outputStream, new PngEncoder());

        return outputStream.ToArray();
    }
}
