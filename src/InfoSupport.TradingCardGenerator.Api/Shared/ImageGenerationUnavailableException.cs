namespace InfoSupport.TradingCardGenerator.Api.Shared;

/// <summary>
/// Thrown when the upstream image generation service is temporarily unable to serve a request.
/// </summary>
public class ImageGenerationUnavailableException(string message, Exception? innerException = null)
    : Exception(message, innerException);
