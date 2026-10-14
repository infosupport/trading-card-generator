import { GenerateCardRequest, GenerateCardResponse, GenerateDinoCardRequest, GenerateMedievalCardRequest, GenerateMedievalCardResponse, LeaderboardEntry, SceneDescription } from './types';

const API_BASE_URL = process.env.BACKEND_HTTP || 'http://localhost:5000';

export class ApiError extends Error {
  constructor(public readonly status: number) {
    super(`HTTP error! status: ${status}`);
    this.name = 'ApiError';
  }
}

export function getFriendlyErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.status === 503) {
    return 'The image service is very busy right now. Please try again in a minute.';
  }
  // fetch() throws a TypeError when the backend can't be reached at all
  if (error instanceof TypeError) {
    return 'Could not reach the card generator. Please ask a staff member to restart the demo.';
  }
  return 'Something went wrong while creating your card. Please try again.';
}

export class TradingCardApi {
  static async generateSportsCard(request: GenerateCardRequest): Promise<GenerateCardResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/cards/sports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new ApiError(response.status);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating trading card:', error);
      throw error;
    }
  }

  static async generateDinoCard(request: GenerateDinoCardRequest): Promise<GenerateCardResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/cards/jurassic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new ApiError(response.status);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating dino card:', error);
      throw error;
    }
  }

  static async generateMedievalCard(request: GenerateMedievalCardRequest): Promise<GenerateMedievalCardResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/cards/medieval`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new ApiError(response.status);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating medieval card:', error);
      throw error;
    }
  }

  static async getMedievalLeaderboard(): Promise<LeaderboardEntry[]> {    try {
      const response = await fetch(`${API_BASE_URL}/cards/medieval/leaderboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching medieval leaderboard:', error);
      throw error;
    }
  }

  static async getMedievalScenes(): Promise<SceneDescription[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/cards/medieval/scenes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching medieval scenes:', error);
      throw error;
    }
  }

  static async getAvailableScenes(): Promise<SceneDescription[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/cards/jurassic/scenes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching available scenes:', error);
      throw error;
    }
  }
}

// Utility function to convert image blob to base64
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Utility function to convert base64 to data URL with dynamic mime type detection
export function base64ToDataUrl(base64: string, mimeType?: string): string {
  // If no mimeType provided, try to detect from base64 content
  if (!mimeType) {
    // Check for JPEG signature
    if (base64.startsWith('/9j/')) {
      mimeType = 'image/jpeg';
    } else {
      mimeType = 'image/png'; // Default fallback
    }
  }
  return `data:${mimeType};base64,${base64}`;
}
