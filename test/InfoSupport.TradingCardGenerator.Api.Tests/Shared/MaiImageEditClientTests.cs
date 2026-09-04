using Azure.Core;
using InfoSupport.TradingCardGenerator.Api.Shared;

namespace InfoSupport.TradingCardGenerator.Api.Tests.Shared;

public class MaiImageEditClientTests
{
    [Fact]
    public async Task EditImageAsync_UsesApiKeyHeader_WhenConfigured()
    {
        var handler = new CapturingHttpMessageHandler();
        var client = new MaiImageEditClient(
            new HttpClient(handler),
            new ThrowingTokenCredential(),
            new ImageModelSettings
            {
                Endpoint = "https://example.test",
                DeploymentName = "mai-test",
                ApiKey = "test-api-key"
            });

        var imageBytes = new byte[] { 1, 2, 3 };

        var result = await client.EditImageAsync(new MemoryStream(imageBytes), "fox");

        Assert.NotEmpty(result);
        Assert.Equal("test-api-key", handler.LastRequest!.Headers.GetValues("api-key").Single());
        Assert.Null(handler.LastRequest.Headers.Authorization);
        Assert.Equal("https://example.test/mai/v1/images/edits", handler.LastRequest.RequestUri?.ToString());
    }

    private sealed class ThrowingTokenCredential : TokenCredential
    {
        public override AccessToken GetToken(TokenRequestContext requestContext, CancellationToken cancellationToken) =>
            throw new InvalidOperationException("Bearer token should not be used when ApiKey is configured.");

        public override ValueTask<AccessToken> GetTokenAsync(TokenRequestContext requestContext, CancellationToken cancellationToken) =>
            throw new InvalidOperationException("Bearer token should not be used when ApiKey is configured.");
    }

    private sealed class CapturingHttpMessageHandler : HttpMessageHandler
    {
        public HttpRequestMessage? LastRequest { get; private set; }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            LastRequest = request;

            return Task.FromResult(new HttpResponseMessage(System.Net.HttpStatusCode.OK)
            {
                Content = new StringContent("{\"data\":[{\"b64_json\":\"AQID\"}]}")
            });
        }
    }
}
