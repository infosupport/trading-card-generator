// Trading Card Generator Types

export interface Player {
  firstName: string;
  lastName: string;
  displayName?: string;
}

export interface TradingCardData {
  player: Player;
  team?: string;
  sport?: string;
  position?: string;
  stats?: Record<string, string | number>;
}

export interface WebcamConstraints {
  width?: number;
  height?: number;
  facingMode?: 'user' | 'environment';
  frameRate?: number;
}

export interface CaptureOptions {
  format?: 'png' | 'jpeg' | 'webp';
  quality?: number;
  width?: number;
  height?: number;
}

export interface WebcamError {
  name: string;
  message: string;
  constraint?: string;
}
