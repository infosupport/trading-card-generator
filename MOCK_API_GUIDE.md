# Mock API Guide

The API now supports a mock mode for local frontend development without requiring Azure OpenAI credentials.

## How It Works

When `UseMock: true` is set in configuration, the API returns a simple placeholder image instead of calling Azure OpenAI. This allows you to develop the frontend without authentication issues.

## Configuration

In [appsettings.json](src/InfoSupport.TradingCardGenerator.Api/appsettings.json):

```json
{
  "ImageGenerationModel": {
    "UseMock": true,
    "DeploymentName": "dall-e-3"
  }
}
```

## Running with Mock

```bash
cd src/InfoSupport.TradingCardGenerator.Api
dotnet run
```

The API will start on http://localhost:5000 and return placeholder images for all card generation requests.

## Switching to Real Azure OpenAI

To use the real Azure OpenAI service:

1. Set `UseMock: false` in appsettings.json
2. Configure your Azure credentials:
   - Ensure you're logged in with Azure CLI (`az login`)
   - Or configure managed identity for production

The configuration will automatically use:
- `ImageGenerationModel:Endpoint` - Your Azure OpenAI endpoint
- `ImageGenerationModel:DeploymentName` - Your DALL-E deployment name
- Azure CLI credentials or Managed Identity for authentication

## Endpoints

Both mock and real modes support the same endpoints:

- `POST /cards/sports` - Generate sports trading cards
- `POST /cards/jurassic` - Generate Jurassic Park themed cards
- `GET /cards/jurassic/scenes` - Get available scene descriptions
