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

// API Types for C# Backend Integration
export interface ApiPlayer {
  photo: string; // base64 encoded photo
}

export interface ApiSport {
  type: string; // e.g., football, basketball, soccer
}

export interface ApiTeam {
  name: string;
  color: string;
  logo: string; // base64 encoded logo
}

export interface GenerateCardRequest {
  sport: ApiSport;
  team: ApiTeam;
  player: ApiPlayer;
}

export interface GenerateCardResponse {
  image: string; // base64 encoded generated card image
}

// Jurassic Card Types
export interface GenerateDinoCardRequest {
  photo: string; // base64 encoded photo
  scene: string; // scene identifier (e.g., "scene01", "scene02")
}

// Medieval Card Types
export interface GenerateMedievalCardRequest {
  photo: string; // base64 encoded photo
  scene: string; // scene identifier (e.g., "scene01", "scene02")
  firstName: string;
  lastName: string;
  strength: number;
  wisdom: number;
  charisma: number;
}

export interface LeaderboardEntry {
  recordedOn: string;
  firstName: string;
  lastName: string;
  strength: number;
  wisdom: number;
  charisma: number;
}

export interface GenerateMedievalCardResponse extends GenerateCardResponse {
  leaderboard: LeaderboardEntry[];
}

export interface SceneDescription {
  identifier: string;
  description: string;
}
