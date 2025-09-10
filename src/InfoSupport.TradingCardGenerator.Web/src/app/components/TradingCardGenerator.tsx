'use client';

import { useState, useEffect } from 'react';
import { useWebcam } from './useWebcam';
import { TradingCardApi, blobToBase64, base64ToDataUrl } from './api';
import { GenerateCardRequest } from './types';
import Image from 'next/image';


// Display dimensions (what user sees)
const CARD_WIDTH = 750;
const CARD_HEIGHT = 1050;

// Capture dimensions (what gets sent to API) - optimized for smaller file size
const CAPTURE_WIDTH = 400;
const CAPTURE_HEIGHT = 560;

// Image quality settings
const IMAGE_FORMAT = 'image/jpeg' as const;
const IMAGE_QUALITY = 0.85; // 85% quality - good balance between size and quality

// Available sports
const SPORTS = ['basketball', 'football', 'baseball', 'ice hockey'];

// Fun loading messages that combine tech and sports themes
const LOADING_MESSAGES = [
  "⚡ Compiling your legendary stats...",
  "🏆 Deploying championship algorithms...",
  "🚀 Loading your MVP profile...",
  "⚽ Debugging your athletic prowess...",
  "🏀 Merging code with pure talent...",
  "🎯 Optimizing your game performance...",
  "💻 Running victory simulations...",
  "🔥 Executing championship queries...",
  "⭐ Initializing hall of fame data...",
  "🎪 Rendering your tech superpowers...",
  "🏃‍♂️ Sprinting through the pipeline...",
  "🎮 Calculating your skill coefficients...",
  "🌟 Bootstrapping your stardom...",
  "🚁 Elevating your profile status...",
  "🎨 Painting your digital masterpiece..."
];

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
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [messageIndex, setMessageIndex] = useState(0);

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

  // Rotate loading messages during generation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setMessageIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % LOADING_MESSAGES.length;
          setLoadingMessage(LOADING_MESSAGES[newIndex]);
          return newIndex;
        });
      }, 1500); // Change message every 1.5 seconds
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isGenerating]);

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
      // Capture at optimized resolution with JPEG compression to reduce API payload size
      const blob = await capturePhoto(CAPTURE_WIDTH, CAPTURE_HEIGHT, IMAGE_FORMAT, IMAGE_QUALITY);
      if (blob) {
        // Convert blob to base64
        const base64Photo = await blobToBase64(blob);
        
        // Log the actual size for debugging
        const sizeInKB = (base64Photo.length * 0.75 / 1024).toFixed(2);
        console.log(`Captured photo: ${CAPTURE_WIDTH}x${CAPTURE_HEIGHT}, Base64 size: ${sizeInKB}KB`);
        
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
        <h1 className="text-4xl font-black mb-2 text-gray-900 dark:text-gray-100 tracking-wider" style={{ fontFamily: "'Bebas Neue', 'Arial Black', sans-serif" }}>
          🏆 TECHORAMA SPORTS EDITION 🏆
        </h1>
        <h2 className="text-xl font-bold mb-6 text-gray-700 dark:text-gray-300 tracking-wide" style={{ fontFamily: "'Bebas Neue', Arial, sans-serif" }}>
          ULTIMATE TECH TRADING CARD CREATOR
        </h2>
        <div className="flex justify-center gap-5 mb-5">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="⚡ PLAYER FIRST NAME"
            className="text-lg px-4 py-3 border-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 font-bold tracking-wide transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            style={{ fontSize: '1.1em', fontFamily: "'Bebas Neue', Arial, sans-serif", borderColor: teamColor ? TEAMS[teamColor as keyof typeof TEAMS].color : '#174a6f' }}
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="🚀 PLAYER LAST NAME"
            className="text-lg px-4 py-3 border-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 font-bold tracking-wide transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            style={{ fontSize: '1.1em', fontFamily: "'Bebas Neue', Arial, sans-serif", borderColor: teamColor ? TEAMS[teamColor as keyof typeof TEAMS].color : '#174a6f' }}
          />
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-5 py-3 rounded max-w-md mx-auto mb-5 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Trading Card Preview */}
      <div className="flex justify-center">
        <div 
          className="shadow-[0_4px_24px_rgba(0,0,0,0.15)] transition-all duration-700 ease-in-out"
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
                    {generatedCardImage ? (
                      /* Show generated card image */
                      <Image
                        src={generatedCardImage}
                        alt="Generated Trading Card"
                        width={340}
                        height={340}
                        className="object-cover"
                        style={{
                          width: '340px',
                          height: '340px',
                          borderRadius: '16px'
                        }}
                      />
                    ) : isGenerating && capturedPhoto ? (
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
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
                          <div className="text-center text-white p-6 rounded-xl bg-black bg-opacity-40">
                            {/* Enhanced Spinner */}
                            <div className="relative mb-4">
                              <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-opacity-30 mx-auto"></div>
                              <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-white border-r-transparent border-b-transparent border-l-transparent mx-auto absolute inset-0" style={{ animationDuration: '0.8s' }}></div>
                              <div className="animate-ping absolute inset-0 h-16 w-16 rounded-full bg-white bg-opacity-20 mx-auto" style={{ animationDuration: '2s' }}></div>
                            </div>
                            {/* Rotating Message */}
                            <div 
                              className="text-lg font-bold tracking-wide transition-all duration-500 ease-in-out transform"
                              style={{ 
                                fontFamily: "'Bebas Neue', Arial, sans-serif",
                                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                                minHeight: '28px'
                              }}
                              key={messageIndex} // Force re-render for animation
                            >
                              {loadingMessage}
                            </div>
                            <div className="text-sm mt-2 text-white text-opacity-80 font-medium">
                              Creating your championship moment...
                            </div>
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


        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-8">
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
          className="px-8 py-4 rounded-xl shadow-lg transition-all duration-200 border-3 font-black text-lg tracking-wider hover:scale-105 disabled:bg-gray-400 disabled:text-gray-600 disabled:hover:scale-100 disabled:cursor-not-allowed"
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
            fontFamily: "'Bebas Neue', Arial, sans-serif",
            backgroundColor: '#f1e4ce',
            color: teamColor ? TEAMS[teamColor as keyof typeof TEAMS].color : '#174a6f',
            borderColor: teamColor ? TEAMS[teamColor as keyof typeof TEAMS].color : '#174a6f',
            borderWidth: '3px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          {generatedCardImage 
            ? '🎯 GENERATE NEW CARD' 
            : isGenerating 
              ? '⚡ GENERATING MAGIC...' 
              : isCapturing 
                ? '📸 CAPTURING...' 
                : '🚀 GENERATE MY CARD'
          }
        </button>
        
        {generatedCardImage && (
          <button
            onClick={() => {
              if (generatedCardImage) {
                const a = document.createElement('a');
                a.href = generatedCardImage;
                a.download = `techorama-trading-card-${playerName.replace(/\s+/g, '-').toLowerCase()}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }
            }}
            className="px-8 py-4 rounded-xl shadow-lg transition-all duration-200 border-3 font-black text-lg tracking-wider hover:scale-105"
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              fontFamily: "'Bebas Neue', Arial, sans-serif",
              backgroundColor: teamColor ? TEAMS[teamColor as keyof typeof TEAMS].color : '#174a6f',
              color: '#f1e4ce',
              borderColor: teamColor ? TEAMS[teamColor as keyof typeof TEAMS].color : '#174a6f',
              borderWidth: '3px',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            🏆 DOWNLOAD MY CARD
          </button>
        )}
      </div>
    </div>
  );
}
