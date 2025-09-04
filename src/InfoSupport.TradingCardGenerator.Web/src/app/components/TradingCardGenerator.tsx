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
    teams: [
      { name: 'Encryption Eagles', logo: 'blue-encryption-eagles.png' },
      { name: 'Linefeed Lions', logo: 'blue-linefeed-lions.png' },
      { name: 'Recursive Rams', logo: 'blue-recursive-rams.png' },
      { name: 'Workflow Wolves', logo: 'blue-workflow-wolves.png' },
    ],
  },
  brown: {
    color: '#8B4513',
    teams: [
      { name: 'Backup Bobcats', logo: 'brown-backup-bobcats.png' },
      { name: 'Byte Bears', logo: 'brown-byte-bears.png' },
      { name: 'Handle Hornets', logo: 'brown-handle-hornets.png' },
      { name: 'Telnet Tigers', logo: 'brown-telnet-tigers.png' },
    ],
  },
  green: {
    color: '#228B22',
    teams: [
      { name: 'Buffer Badgers', logo: 'green-buffer-badgers.png' },
      { name: 'Firewall Foxes', logo: 'green-firewall-foxes.png' },
      { name: 'Log Leopards', logo: 'green-log-leopards.png' },
      { name: 'Router Ravens', logo: 'green-router-ravens.png' },
    ],
  },
  red: {
    color: '#DC143C',
    teams: [
      { name: 'Daemon Dogs', logo: 'red-daemon-dogs.png' },
      { name: 'Data Dolphins', logo: 'red-data-dolphins.png' },
      { name: 'Script Sharks', logo: 'red-script-sharks.png' },
      { name: 'Stack Stallions', logo: 'red-stack-stallions.png' },
    ],
  },
};


export default function TradingCardGenerator() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCardImage, setGeneratedCardImage] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [teamColor, setTeamColor] = useState<string>();
  const [teamName, setTeamName] = useState<string>();
  const [teamLogo, setTeamLogo] = useState<string>();
  const [teamLogoBase64, setTeamLogoBase64] = useState<string>();
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
    const initializeTeam = async () => {
      // Pick random color
      const colors = Object.keys(TEAMS);
      const color = colors[Math.floor(Math.random() * colors.length)];
      // Pick random team from that color
      const teams = TEAMS[color as keyof typeof TEAMS].teams;
      const team = teams[Math.floor(Math.random() * teams.length)];
      // Pick random sport
      const randomSport = SPORTS[Math.floor(Math.random() * SPORTS.length)];
      
      setTeamColor(color);
      setTeamName(team.name);
      setTeamLogo(team.logo);
      setSport(randomSport);
      
      // Convert logo to base64 using existing utility
      try {
        const response = await fetch(`/${team.logo}`);
        const blob = await response.blob();
        const logoBase64 = await blobToBase64(blob);
        setTeamLogoBase64(logoBase64);
      } catch (error) {
        console.error('Error converting logo to base64:', error);
        setTeamLogoBase64('');
      }
    };
    
    initializeTeam();
    startWebcam();
  }, [startWebcam]);

  const handleCapturePhoto = async () => {
    setIsCapturing(true);
    setIsGenerating(true);
    setGeneratedCardImage(null); // Clear any previous result
    try {
      const blob = await capturePhoto(CARD_WIDTH, CARD_HEIGHT);
      if (blob) {
        // Convert blob to base64
        const base64Photo = await blobToBase64(blob);
        
        // Store the captured photo for display
        const photoDataUrl = base64ToDataUrl(base64Photo);
        setCapturedPhoto(photoDataUrl);
        
        // Prepare request for C# backend

        const request: GenerateCardRequest = {
          sport: {
            type: sport ?? 'football' // Use randomly selected sport with fallback
          },
          team: {
            name: teamName ?? 'InfoSupport',
            color: teamColor ?? 'blue',
            logo: teamLogoBase64 ?? '', // Use base64 encoded logo
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
          className="shadow-[0_4px_24px_rgba(0,0,0,0.15)] transition-all duration-700 ease-in-out"
          style={{
            width: generatedCardImage ? 'auto' : '375px',
            height: generatedCardImage ? 'auto' : '575px',
            backgroundColor: generatedCardImage ? 'transparent' : (teamColor ? TEAMS[teamColor as keyof typeof TEAMS].color : '#174a6f'),
            maxWidth: generatedCardImage ? '500px' : '375px'
          }}
        >
          {/* Show generated card if available */}
          {generatedCardImage ? (
            <Image
              src={generatedCardImage}
              alt="Generated Trading Card"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto rounded-lg"
              style={{
                maxWidth: '500px',
                height: 'auto'
              }}
            />
          ) : (
            /* Show trading card preview */
            <>
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
                    {isGenerating && capturedPhoto ? (
                      /* Show loading state with captured photo in background */
                      <>
                        <Image
                          src={capturedPhoto}
                          alt="Captured Photo"
                          width={340}
                          height={340}
                          className="object-cover absolute inset-0 opacity-30"
                          style={{
                            width: '340px',
                            height: '340px',
                            borderRadius: '16px',
                            transform: 'scaleX(-1)'
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                          <div className="text-center text-white">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                            <div className="text-sm font-semibold">Generating Card...</div>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* Show live video feed */
                      <>
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
                      </>
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
              <div className="flex justify-center gap-3" style={{ marginTop: '12px' }}>
                <button
                  onClick={() => {
                    if (generatedCardImage) {
                      // Reset to capture new photo
                      setGeneratedCardImage(null);
                      setCapturedPhoto(null);
                    } else {
                      handleCapturePhoto();
                    }
                  }}
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
                  {generatedCardImage 
                    ? 'GENERATE NEW CARD' 
                    : isGenerating 
                      ? 'GENERATING...' 
                      : isCapturing 
                        ? 'CAPTURING...' 
                        : 'GENERATE CARD'
                  }
                </button>
                
                {/* Download Button - only show when card is generated */}
                {generatedCardImage && (
                  <button
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = generatedCardImage;
                      a.download = `trading-card-${playerName.replace(/\s+/g, '-').toLowerCase()}.png`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }}
                    className="px-6 py-2 rounded-lg shadow-md transition-colors border-2 text-sm font-bold"
                    style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      backgroundColor: teamColor ? TEAMS[teamColor as keyof typeof TEAMS].color : '#174a6f',
                      color: '#f1e4ce',
                      borderColor: teamColor ? TEAMS[teamColor as keyof typeof TEAMS].color : '#174a6f'
                    }}
                  >
                    DOWNLOAD
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons when card is generated */}
      {generatedCardImage && (
        <div className="flex justify-center gap-3 mt-6">
          <button
            onClick={() => {
              setGeneratedCardImage(null);
              setCapturedPhoto(null);
            }}
            className="px-6 py-2 rounded-lg shadow-md transition-colors border-2 text-sm font-bold"
            style={{
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: '#f1e4ce',
              color: teamColor ? TEAMS[teamColor as keyof typeof TEAMS].color : '#174a6f',
              borderColor: teamColor ? TEAMS[teamColor as keyof typeof TEAMS].color : '#174a6f'
            }}
          >
            GENERATE NEW CARD
          </button>
          
          <button
            onClick={() => {
              const a = document.createElement('a');
              a.href = generatedCardImage;
              a.download = `trading-card-${playerName.replace(/\s+/g, '-').toLowerCase()}.png`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
            className="px-6 py-2 rounded-lg shadow-md transition-colors border-2 text-sm font-bold"
            style={{
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: teamColor ? TEAMS[teamColor as keyof typeof TEAMS].color : '#174a6f',
              color: '#f1e4ce',
              borderColor: teamColor ? TEAMS[teamColor as keyof typeof TEAMS].color : '#174a6f'
            }}
          >
            DOWNLOAD CARD
          </button>
        </div>
      )}
    </div>
  );
}
