using InfoSupport.TradingCardGenerator.Agent;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Metadata.Profiles.Exif;
using Xunit;

namespace InfoSupport.TradingCardGenerator.Tests;

public class ImageMetadataInjectorTests
{
    private readonly ImageMetadataInjector _injector;

    public ImageMetadataInjectorTests()
    {
        _injector = new ImageMetadataInjector();
    }

    [Fact]
    public void InjectMetadata_WithValidImage_ReturnsImageWithMetadata()
    {
        // Arrange
        var imageBytes = GetTestImageBytes();

        // Act
        var result = _injector.InjectMetadata(imageBytes);

        // Assert
        Assert.NotNull(result);
        Assert.NotEmpty(result);
        Assert.True(result.Length > 0);
    }

    [Fact]
    public void InjectMetadata_WithValidImage_InjectsCorrectSoftwareTag()
    {
        // Arrange
        var imageBytes = GetTestImageBytes();
        var expectedWatermark = "Generated with the Info Support AI Trading Card Generator";

        // Act
        var result = _injector.InjectMetadata(imageBytes);

        // Assert
        using var image = Image.Load(result);
        var exifProfile = image.Metadata.ExifProfile;

        Assert.NotNull(exifProfile);
        var success = exifProfile.TryGetValue(ExifTag.Software, out var softwareTag);
        Assert.True(success);
        Assert.NotNull(softwareTag);
        Assert.Equal(expectedWatermark, softwareTag.Value);
    }

    [Fact]
    public void InjectMetadata_WithValidImage_ProducesValidPngImage()
    {
        // Arrange
        var imageBytes = GetTestImageBytes();

        // Act
        var result = _injector.InjectMetadata(imageBytes);

        // Assert
        Assert.NotNull(result);

        // Verify the result can be loaded as a valid image
        using var image = Image.Load(result);
        Assert.NotNull(image);
        Assert.True(image.Width > 0);
        Assert.True(image.Height > 0);
    }

    [Fact]
    public void InjectMetadata_PreservesImageDimensions()
    {
        // Arrange
        var imageBytes = GetTestImageBytes();
        int originalWidth, originalHeight;

        using (var originalImage = Image.Load(imageBytes))
        {
            originalWidth = originalImage.Width;
            originalHeight = originalImage.Height;
        }

        // Act
        var result = _injector.InjectMetadata(imageBytes);

        // Assert
        using var resultImage = Image.Load(result);
        Assert.Equal(originalWidth, resultImage.Width);
        Assert.Equal(originalHeight, resultImage.Height);
    }

    private byte[] GetTestImageBytes()
    {
        var assembly = typeof(ImageMetadataInjectorTests).Assembly;
        var photoStream = assembly.GetManifestResourceStream(
            "InfoSupport.TradingCardGenerator.Tests.TestData.photo.png");

        if (photoStream == null)
        {
            throw new InvalidOperationException("Test image not found");
        }

        var photoBytes = new byte[photoStream.Length];
        photoStream.Read(photoBytes, 0, photoBytes.Length);

        return photoBytes;
    }
}
