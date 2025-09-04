'use client';

import { useState, useEffect } from 'react';
import { useWebcam } from './useWebcam';
import { TradingCardApi, blobToBase64, base64ToDataUrl } from './api';
import { GenerateCardRequest } from './types';
import Image from 'next/image';


const CARD_WIDTH = 750;
const CARD_HEIGHT = 1050;

// Available sports
const SPORTS = ['basketball', 'football', 'baseball', 'ice hockey'];

// Team configuration with logos and colors
const TEAMS = {
  blue: {
    color: '#174a6f',
    logos: [
      'blue-encryption-eagles.png',
      'blue-linefeed-lions.png',
      'blue-recursive-rams.png',
      'blue-workflow-wolves.png',
    ],
  },
  brown: {
    color: '#8B4513',
    logos: [
      'brown-backup-bobcats.png',
      'brown-byte-bears.png',
      'brown-handle-hornets.png',
      'brown-telnet-tigers.png',
    ],
  },
  green: {
    color: '#228B22',
    logos: [
      'green-buffer-badgers.png',
      'green-firewall-foxes.png',
      'green-log-leopards.png',
      'green-router-ravens.png',
    ],
  },
  red: {
    color: '#DC143C',
    logos: [
      'red-daemon-dogs.png',
      'red-data-dolphins.png',
      'red-script-sharks.png',
      'red-stack-stallions.png',
    ],
  },
};


export default function TradingCardGenerator() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCardImage, setGeneratedCardImage] = useState<string | null>(null);
  const [teamColor, setTeamColor] = useState<string>();
  const [teamLogo, setTeamLogo] = useState<string>();
  const [sport, setSport] = useState<string>();

  const {
    videoRef,
    isStreaming,
    error,
    startWebcam,
    capturePhoto
  } = useWebcam({
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    facingMode: 'user'
  });

  const playerName = (firstName.trim() + ' ' + lastName.trim()).trim().toUpperCase() || 'PLAYER NAME';


  // On mount: pick random color and logo, start webcam
  useEffect(() => {
    // Pick random color
    const colors = Object.keys(TEAMS);
    const color = colors[Math.floor(Math.random() * colors.length)];
    // Pick random logo from that color
    const logos = TEAMS[color as keyof typeof TEAMS].logos;
    const logo = logos[Math.floor(Math.random() * logos.length)];
    // Pick random sport
    const randomSport = SPORTS[Math.floor(Math.random() * SPORTS.length)];
    
    setTeamColor(color);
    setTeamLogo(logo);
    setSport(randomSport);
    startWebcam();
  }, [startWebcam]);

  const handleCapturePhoto = async () => {
    setIsCapturing(true);
    setIsGenerating(true);
    try {
      const blob = await capturePhoto(CARD_WIDTH, CARD_HEIGHT);
      if (blob) {
        // Convert blob to base64
        const base64Photo = await blobToBase64(blob);
        
        // Prepare request for C# backend

        const request: GenerateCardRequest = {
          sport: {
            type: sport ?? 'football' // Use randomly selected sport with fallback
          },
          team: {
            name: 'InfoSupport',
            color: teamColor ?? 'blue',
            logo: teamLogo ?? 'blue-encryption-eagles.png',
          },
          player: {
            photo: base64Photo
          }
        };

        // Call the C# backend API
        const response = await TradingCardApi.generateCard(request);
        
        // Convert base64 response to data URL and display
        const cardImageDataUrl = base64ToDataUrl(response.image);
        setGeneratedCardImage(cardImageDataUrl);
        
        // Auto-download the generated card
        const a = document.createElement('a');
        a.href = cardImageDataUrl;
        a.download = `trading-card-${playerName.replace(/\s+/g, '-').toLowerCase()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Error generating trading card:', err);
      // You might want to show an error message to the user here
    } finally {
      setIsCapturing(false);
      setIsGenerating(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="text-base py-5">
        <h1 className="text-2xl font-bold mb-5">Trading Card Generator</h1>
        <div className="flex justify-center gap-5 mb-5">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            className="text-lg px-1 py-1 border border-gray-300 rounded"
            style={{ fontSize: '1.2em', margin: '0 10px', padding: '5px' }}
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            className="text-lg px-1 py-1 border border-gray-300 rounded"
            style={{ fontSize: '1.2em', margin: '0 10px', padding: '5px' }}
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-5 py-3 rounded max-w-md mx-auto mb-5 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Trading Card Preview */}
      <div className="flex justify-center">
        <div 
          className="shadow-[0_4px_24px_rgba(0,0,0,0.15)]"
          style={{
            width: '375px',
            height: '575px',
            backgroundColor: teamColor ? TEAMS[teamColor as keyof typeof TEAMS].color : '#174a6f'
          }}
        >
          {/* Card Frame */}
          <div 
            className="relative"
            style={{
              backgroundColor: '#f1e4ce',
              borderRadius: '16px',
              margin: '8px 8px 0px 8px',
              height: '400px'
            }}
          >
            {/* Video Canvas Area */}
            <div className="flex justify-center">
              <div
                className="relative overflow-hidden"
                style={{
                  width: '340px',
                  height: '340px',
                  borderRadius: '16px',
                  marginTop: '8px'
                }}
              >
                {/* Video Element */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ 
                    transform: 'scaleX(-1)',
                    width: '340px',
                    height: '340px',
                    objectFit: 'cover',
                    borderRadius: '16px',
                    display: isStreaming ? 'block' : 'none'
                  }}
                />
                
                {/* Placeholder when no camera */}
                {!isStreaming && (
                  <div 
                    className="bg-gray-300 flex items-center justify-center text-gray-600 absolute inset-0"
                    style={{
                      width: '340px',
                      height: '340px',
                      borderRadius: '16px'
                    }}
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-2">📷</div>
                      <div className="text-base">Camera Preview</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Player Name */}
            <div 
              className="text-center"
              style={{
                fontFamily: "'Bebas Neue', Arial, sans-serif",
                marginTop: '8px',
                fontSize: '32px',
                color: teamColor ? TEAMS[teamColor as keyof typeof TEAMS].color : '#174a6f'
              }}
            >
              {playerName}
            </div>
          </div>

          {/* Team Logo */}
          <div className="flex justify-center" style={{ marginTop: '8px' }}>
            <div className="relative">
              {teamLogo ? (
                <Image
                  src={`/${teamLogo}`}
                  alt="Team Logo"
                  width={100}
                  height={100}
                  className="object-contain rounded-full border-2"
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#f1e4ce',
                    borderColor: '#eee'
                  }}
                />
              ) : (
                <div
                  className="rounded-full border-2 flex items-center justify-center"
                  style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#f1e4ce',
                    borderColor: '#eee'
                  }}
                >
                  <div className="text-gray-400 text-xs">Loading...</div>
                </div>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-center" style={{ marginTop: '12px' }}>
            <button
              onClick={handleCapturePhoto}
              disabled={!isStreaming || isCapturing || isGenerating}
              className="px-6 py-2 rounded-lg shadow-md transition-colors border-2 text-sm font-bold disabled:bg-gray-400 disabled:text-gray-600"
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                backgroundColor: '#f1e4ce',
                color: teamColor ? TEAMS[teamColor as keyof typeof TEAMS].color : '#174a6f',
                borderColor: teamColor ? TEAMS[teamColor as keyof typeof TEAMS].color : '#174a6f'
              }}
            >
              {isGenerating ? 'GENERATING...' : isCapturing ? 'CAPTURING...' : 'GENERATE'}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Trading Card Result */}
      {generatedCardImage && (
        <div className="flex justify-center mt-8">
          <div className="text-center">
            <h2 
              className="text-xl font-bold mb-4"
              style={{ color: teamColor ? TEAMS[teamColor as keyof typeof TEAMS].color : '#174a6f' }}
            >
              Your Generated Trading Card
            </h2>
            <div className="shadow-[0_4px_24px_rgba(0,0,0,0.15)] inline-block">
              <Image
                src={generatedCardImage}
                alt="Generated Trading Card"
                width={375}
                height={525}
                className="rounded-lg"
                style={{
                  maxWidth: '375px',
                  height: 'auto'
                }}
              />
            </div>
            <div className="mt-4">
              <a
                href={generatedCardImage}
                download={`trading-card-${playerName.replace(/\s+/g, '-').toLowerCase()}.png`}
                className="px-4 py-2 text-white rounded-lg font-bold text-sm shadow-md transition-colors"
                style={{
                  backgroundColor: teamColor ? TEAMS[teamColor as keyof typeof TEAMS].color : '#174a6f'
                }}
              >
                Download Card
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
