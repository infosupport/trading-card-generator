import { GenerateCardRequest, GenerateCardResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7250';

export class TradingCardApi {
  static async generateCard(request: GenerateCardRequest): Promise<GenerateCardResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: GenerateCardResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Error generating trading card:', error);
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

// Utility function to convert base64 to data URL
export function base64ToDataUrl(base64: string, mimeType: string = 'image/png'): string {
  return `data:${mimeType};base64,${base64}`;
}
