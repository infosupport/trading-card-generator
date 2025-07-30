# Trading Card Generator

A .NET 9 web application that generates custom sports trading cards using OpenAI's DALL-E image generation model. Users can create personalized trading cards by uploading their photo and customizing team information and colors.

## 🏆 Features

- **AI-Powered Card Generation**: Uses OpenAI's DALL-E (GPT-image-1) model to generate high-quality trading card images
- **Custom Player Photos**: Upload your own photo to appear on the trading card
- **Team Customization**: Set team name, colors, and logo
- **Multiple Sports Support**: Generate cards for various sports (football, basketball, soccer, etc.)
- **RESTful API**: Simple HTTP API for generating cards programmatically

## 🚀 Getting Started

### Prerequisites

- .NET 9.0 SDK
- Azure OpenAI API access with DALL-E model deployment
- Visual Studio 2022 or Visual Studio Code

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/infosupport/trading-card-generator.git
   cd trading-card-generator
   ```

2. **Configure OpenAI Settings**
   
   Set up your Azure OpenAI configuration using user secrets:

   ```bash
   cd src/InfoSupport.TradingCardGenerator
   dotnet user-secrets set "LanguageModel:ApiKey" "your-openai-api-key"
   dotnet user-secrets set "LanguageModel:Endpoint" "your-azure-openai-endpoint"
   dotnet user-secrets set "LanguageModel:ImageModel" "dall-e-3"
   ```

   Or configure via `appsettings.json`:

   ```json
   {
     "LanguageModel": {
       "ApiKey": "your-openai-api-key",
       "Endpoint": "your-azure-openai-endpoint",
       "ImageModel": "dall-e-3"
     }
   }
   ```

3. **Restore dependencies**

   ```bash
   dotnet restore
   ```

4. **Run the application**

   ```bash
   dotnet run --project src/InfoSupport.TradingCardGenerator
   ```

The application will start on `https://localhost:5001` by default.

## 📋 API Usage

### Generate Trading Card

**POST** `/generate`

Generate a new trading card with custom player and team information.

#### Request Body

```json
{
  "sport": {
    "type": "football"
  },
  "team": {
    "name": "Lightning Bolts",
    "color": "#FF6B35",
    "logo": "base64-encoded-logo-image"
  },
  "player": {
    "photo": "base64-encoded-player-photo"
  }
}
```

#### Request Fields

| Field          | Type   | Description                                              |
| -------------- | ------ | -------------------------------------------------------- |
| `sport`        | object | Sport information for the trading card                   |
| `sport.type`   | string | Type of sport (e.g., "football", "basketball", "soccer") |
| `team`         | object | Team information for the trading card                    |
| `team.name`    | string | Name of the team                                         |
| `team.color`   | string | Primary team color (hex code or color name)              |
| `team.logo`    | string | Team logo as base64 encoded image                        |
| `player`       | object | Player information for the trading card                  |
| `player.photo` | string | Player photo as base64 encoded image                     |

#### Response

```json
{
  "image": "base64-encoded-generated-trading-card-image"
}
```

#### Response Fields

| Field   | Type   | Description                                           |
| ------- | ------ | ----------------------------------------------------- |
| `image` | string | Generated trading card image as base64 encoded string |

## 🛠️ Technology Stack

- **Framework**: ASP.NET Core 9.0
- **AI Integration**: Microsoft Semantic Kernel
- **Image Generation**: Azure OpenAI DALL-E
- **Language**: C# with nullable reference types enabled
- **Testing**: xUnit (test project included)

## 🏗️ Project Structure

```text
├── src/
│   └── InfoSupport.TradingCardGenerator/
│       ├── Endpoints/              # API endpoint definitions
│       ├── Models/                 # Data models and DTOs
│       ├── Properties/             # Launch settings
│       └── Program.cs              # Application entry point
├── test/
│   └── InfoSupport.TradingCardGenerator.Tests/  # Unit tests
└── README.md
```

## 🧪 Running Tests

Execute the test suite:

```bash
dotnet test
```

## 🔧 Configuration

The application uses the following configuration keys:

- `LanguageModel:ApiKey` - Your Azure OpenAI API key
- `LanguageModel:Endpoint` - Your Azure OpenAI service endpoint
- `LanguageModel:ImageModel` - The image generation model to use (e.g., "dall-e-3")

## 🚦 Development

### Adding New Features

1. **Models**: Add new data models in `src/InfoSupport.TradingCardGenerator/Models/`
2. **Endpoints**: Extend API functionality in `src/InfoSupport.TradingCardGenerator/Endpoints/`
3. **Tests**: Add corresponding tests in `test/InfoSupport.TradingCardGenerator.Tests/`

### Code Style

- Nullable reference types are enabled
- XML documentation comments are used for public APIs
- Follow standard C# naming conventions

## 📝 License

This project is developed by InfoSupport.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For questions and support, please contact the InfoSupport development team.

---

**Note**: This application requires a valid Azure OpenAI subscription and API access to function properly.