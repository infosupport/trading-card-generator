# Trading Card Generator - AI Agent Instructions

This is a full-stack trading card generator that uses OpenAI's DALL-E to transform user photos into professional sports trading cards.

## Architecture Overview

**Backend**: ASP.NET Core 9.0 API (`src/InfoSupport.TradingCardGenerator/`)
- Single endpoint: `POST /generate` - generates trading cards from photos
- Uses Azure OpenAI DALL-E for image transformation via Semantic Kernel
- Configuration via user secrets: `LanguageModel:ApiKey`, `LanguageModel:Endpoint`, `LanguageModel:ImageModel`

**Frontend**: Next.js 15 with TypeScript (`src/InfoSupport.TradingCardGenerator.Web/`)
- Real-time camera capture and preview
- Team selection with predefined logos/colors
- Special properties system (MVP badges, etc.)
- Canvas-to-base64 image processing for API submission

## Key Development Patterns

### Embedded Resources for Prompts
Handlebars templates are embedded as resources in the C# project:
```xml
<EmbeddedResource Include="Prompts\generate-photo.md" />
```
Access via `EmbeddedResource.Read("Prompts.generate-photo.md")` - note the dot notation.

### Configuration Management
- **Never commit secrets** - use `dotnet user-secrets` for local development
- Settings classes follow `LanguageModelSettings` pattern with Options binding
- CORS configured for `http://localhost:3000` and `https://localhost:3001`

### Model Structure
All models use nullable reference types (`<Nullable>enable</Nullable>`):
- `GenerateCardRequest` contains `Sport`, `Team`, `Player` objects
- Base64 strings for image data (photos, logos, generated cards)
- XML documentation comments required for all public APIs

### Frontend Constants System
Team data, special properties, and UI constants are centralized in `components/constants.ts`:
- `TEAMS` object organizes by color with nested team arrays
- `SPECIAL_PROPERTIES` defines badge system with icons and descriptions
- Separate display vs capture dimensions for optimization

## Development Workflows

### Running the Full Stack
```bash
# Backend (from project root)
cd src/InfoSupport.TradingCardGenerator
dotnet run  # Starts on https://localhost:5001

# Frontend (separate terminal)
cd src/InfoSupport.TradingCardGenerator.Web
npm run dev  # Starts on http://localhost:3000
```

### Testing with Real API
Integration tests require Azure OpenAI configuration:
```bash
cd test/InfoSupport.TradingCardGenerator.Tests
dotnet user-secrets set "LanguageModel:ApiKey" "your-key"
dotnet test --filter "Category=Integration"
```

### Adding New Teams/Properties
1. Add logo PNG to `InfoSupport.TradingCardGenerator.Web/public/`
2. Update `TEAMS` or `SPECIAL_PROPERTIES` in `constants.ts`
3. Follow naming pattern: `{color}-{name}-{animal}.png`

## Critical Integration Points

### Image Processing Pipeline
1. Frontend captures via HTML5 Canvas → base64 JPEG (400x560px)
2. Backend decodes base64 → MemoryStream for Azure OpenAI
3. DALL-E image edit operation using Handlebars prompt template
4. Response re-encoded to base64 for frontend display

### Error Suppression
Backend suppresses specific warnings for experimental APIs:
```xml
<NoWarn>SKEXP0010;SKEXP0001;OPENAI001</NoWarn>
```

### Dependency Versions
- Uses beta Azure.AI.OpenAI (2.3.0-beta.2) for latest DALL-E features
- Next.js 15 with Turbopack (`--turbopack` flag in scripts)
- Tailwind CSS 4.0 (alpha) for styling

## Project-Specific Conventions

### File Organization
- `Endpoints/` for minimal API definitions (static extension methods)
- `Agent/` for AI-related services (not "Services" folder)
- `Shared/` for cross-cutting utilities like `EmbeddedResource`
- Frontend components are co-located in `src/app/components/`

### Naming Patterns
- C# classes use full descriptive names: `TradingCardPhotoGenerator`
- API methods follow REST conventions: `GenerateTradingCard`
- Frontend uses descriptive props: `capturedPhoto`, `isGenerating`, `loadingMessage`

### Testing Strategy
- Integration tests hit real Azure OpenAI (marked with `[Trait("Category", "Integration")]`)
- Test images embedded as `TestData/photo.png` manifest resources
- Generated images saved to disk for manual verification