using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace InfoSupport.TradingCardGenerator.Api.Shared;

/// <summary>
/// Translates upstream image service failures into a 503 response instead of an opaque 500.
/// </summary>
public class ImageGenerationExceptionHandler(
    ILogger<ImageGenerationExceptionHandler> logger,
    IProblemDetailsService problemDetailsService) : IExceptionHandler
{
    /// <inheritdoc />
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        if (exception is not ImageGenerationUnavailableException)
        {
            return false;
        }

        logger.LogError(exception, "The image generation service is unavailable.");

        httpContext.Response.StatusCode = StatusCodes.Status503ServiceUnavailable;

        return await problemDetailsService.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            Exception = exception,
            ProblemDetails = new ProblemDetails
            {
                Status = StatusCodes.Status503ServiceUnavailable,
                Title = "Image service unavailable",
                Detail = "The image generation service is temporarily unavailable. Please try again in a few moments."
            }
        });
    }
}
