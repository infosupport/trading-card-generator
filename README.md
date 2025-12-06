# Trading Card Generator

A .NET 10 web application that generates custom sports trading cards using OpenAI's
gpt-image-1 image generation model. Users can create personalized trading cards by
uploading their photo and customizing team information and colors.

## 🚀 Getting Started

### Prerequisites

- .NET 10.0 SDK
- Azure OpenAI API access with access to gpt-image-1
- Visual Studio 2022 or Visual Studio Code
- [Aspire CLI](https://aspire.dev/get-started/install-cli/)

### Running the application

Make sure you have the following user-secrets configured for the `src/InfoSupport.TradingCardGenerator.Api` project:

| Secret Name                         | Description                                        |
|-------------------------------------|----------------------------------------------------|
| ImageGenerationModel:Endpoint       | The endpoint URL for the Azure OpenAI service      |
| ImageGenerationModel:ApiKey         | The API key for accessing the Azure OpenAI service |
| ImageGenerationModel:DeploymentName | The deployment name for the gpt-image-1 model      |

To run the full application execute the following command from the root of the repository:

```bash
aspire run
```

## 🏗️ Project Structure

```text
├── src/
│   ├── InfoSupport.TradingCardGenerator.Api/           # Backend API
│   │   ├── Features/                                   # Feature modules
│   │   │   └── <FeatureName>/                          # Each feature follows this structure
│   │   │       ├── Endpoints/                          # API endpoint definitions
│   │   │       ├── Models/                             # Data models and DTOs
│   │   │       └── Prompts/                            # AI prompt templates
│   │   └── Shared/                                     # Shared utilities
│   ├── InfoSupport.TradingCardGenerator.AppHost/       # Aspire AppHost for orchestration
│   ├── InfoSupport.TradingCardGenerator.ServiceDefaults/ # Aspire service defaults
│   └── InfoSupport.TradingCardGenerator.Web/           # Frontend Next.js application
│       ├── public/                                     # Static assets (team logos)
│       └── src/
│           ├── app/                                    # Next.js app directory
│           ├── components/                             # React components
│           ├── hooks/                                  # Custom React hooks
│           └── lib/                                    # Utilities and constants
├── test/
│   ├── InfoSupport.TradingCardGenerator.Api.Tests/     # API unit tests
│   └── InfoSupport.TradingCardGenerator.ServiceDefaults.Tests/
├── docs/                                               # Architecture documentation
└── README.md
```

## 🧪 Running Tests

We have two test suites, one for the backend API which you can run using the following
command:

```bash
dotnet test
```

The frontend tests can be run by running the following commands:

```bash
cd src/InfoSupport.TradingCardGenerator.Web
npm test
```

## 🚦 Development

### Adding New Features

1. **Feature Module**: Create a new folder under `src/InfoSupport.TradingCardGenerator.Api/Features/`
2. **Models**: Add data models in your feature's `Models/` folder
3. **Endpoints**: Define API endpoints in your feature's `Endpoints/` folder
4. **Prompts**: Add AI prompt templates in your feature's `Prompts/` folder
5. **Tests**: Add corresponding tests in `test/InfoSupport.TradingCardGenerator.Api.Tests/Features/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Documentation

1. [Introduction and goals](./docs/01-introduction-and-goals.md)
2. [Constraints](./docs/02-constraints.md)
3. [Context and scope](./docs/03-context-and-scope.md)
4. [Solution strategy](./docs/04-solution-strategy.md)
5. [Building block view](./docs/05-building-block-view.md)
6. [Runtime view](./docs/06-runtime-view.md)
7. [Deployment view](./docs/07-deployment-view.md)
8. [Quality](./docs/08-quality.md)

---

**Note**: This application requires a valid Azure OpenAI subscription and API access to function properly.
