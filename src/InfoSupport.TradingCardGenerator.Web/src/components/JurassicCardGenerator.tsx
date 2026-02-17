'use client';

import { useState, useEffect, useRef } from 'react';
import { useWebcam } from '@/hooks/useWebcam';
import { TradingCardApi, blobToBase64, base64ToDataUrl } from '@/lib/api';
import { GenerateDinoCardRequest } from '@/lib/types';
import { jurassicTheme } from '@/lib/theme-config';

import JurassicActionButtons from './JurassicActionButtons';
import SceneSelector from './SceneSelector';
import Image from 'next/image';
import { Caveat } from 'next/font/google';
import { 
  IMAGE_FORMAT, 
  IMAGE_QUALITY
} from '@/lib/constants';
import LoadingDinosaur from './LoadingDinosaur';

// A6 dimensions (105mm × 148mm) - portrait orientation
// For display, we use pixels that maintain the A6 ratio
const A6_DISPLAY_WIDTH = 420;
const A6_DISPLAY_HEIGHT = 594; // 420 * (148/105) = 594

const caveat = Caveat({ subsets: ['latin'], weight: '700' });

const GREETING_PHRASES = [
  'I was at',
  'Greetings from',
  'See you at',
  'I survived',
  'Wish you were at',
  'Having fun at',
  'Escaped from',
  'Only at',
  'Roaming around',
  'Unlocked new skills at'
];

export default function JurassicCardGenerator() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCardImage, setGeneratedCardImage] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const cardDisplayRef = useRef<HTMLDivElement>(null);
  const [loadingMessage, setLoadingMessage] = useState(jurassicTheme.loadingMessages[0]);
  const [messageIndex, setMessageIndex] = useState(0);
  const [scenes, setScenes] = useState<Array<{id: string; name: string; description: string; icon: string}>>([]);
  const [selectedScene, setSelectedScene] = useState('scene01');
  const [greetingPhrase, setGreetingPhrase] = useState(GREETING_PHRASES[0]);

  // Set random greeting phrase on client mount to avoid hydration mismatch
  useEffect(() => {
    setGreetingPhrase(GREETING_PHRASES[Math.floor(Math.random() * GREETING_PHRASES.length)]);
  }, []);

  const {
    videoRef,
    isStreaming,
    error,
    startWebcam,
    capturePhoto
  } = useWebcam({
    facingMode: 'user'
  });

  const playerName = jurassicTheme.playerNameFallback;

  // Rotate loading messages during generation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setMessageIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % jurassicTheme.loadingMessages.length;
          setLoadingMessage(jurassicTheme.loadingMessages[newIndex]);
          return newIndex;
        });
      }, 3000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isGenerating]);

  // On mount: start webcam and fetch scenes
  useEffect(() => {
    startWebcam();
    
    // Icon mapping for scenes
    const sceneIcons: Record<string, string> = {
      'scene01': '🦖',
      'scene02': '🦏',
      'scene03': '🦕',
      'scene04': '🌄',
      'scene05': '🚁',
      'scene06': '🦎',
      'scene07': '🦴',
      'scene08': '🔪',
      'scene09': '🥚',
      'scene10': '🧬',
      'scene11': '🪞',
      'scene12': '⚡',
    };
    
    // Fetch available scenes from API
    const fetchScenes = async () => {
      try {
        const fetchedScenes = await TradingCardApi.getAvailableScenes();
        // Map backend scenes to frontend format with icons
        const mappedScenes = fetchedScenes.map(scene => {
          // Parse "Name - Description" format
          const parts = scene.description.split(' - ');
          const name = parts[0] || scene.description;
          const description = parts[1] || scene.description;
          
          return {
            id: scene.identifier,
            name,
            description,
            icon: sceneIcons[scene.identifier] || '🦖'
          };
        });
        
        setScenes(mappedScenes);
        if (mappedScenes.length > 0) {
          setSelectedScene(mappedScenes[0].id);
        }
      } catch (error) {
        console.error('Error fetching scenes:', error);
        // Fallback to default scene ID if fetch fails
      }
    };
    
    fetchScenes();
  }, [startWebcam]);

  const handleCapturePhoto = async () => {
    setIsCapturing(true);
    setIsGenerating(true);
    setGeneratedCardImage(null);
    // Pick a random greeting phrase
    const randomPhrase = GREETING_PHRASES[Math.floor(Math.random() * GREETING_PHRASES.length)];
    setGreetingPhrase(randomPhrase);
    try {
      // Capture at native webcam resolution without forcing dimensions
      const blob = await capturePhoto(undefined, undefined, IMAGE_FORMAT, IMAGE_QUALITY);
      if (blob) {
        await processPhoto(blob);
      }
    } catch (err) {
      console.error('Error generating jurassic card:', err);
    } finally {
      setIsCapturing(false);
      setIsGenerating(false);
    }
  };

  const handleUploadPhoto = async (file: File) => {
    setIsGenerating(true);
    setGeneratedCardImage(null);
    try {
      await processPhoto(file);
    } catch (err) {
      console.error('Error generating jurassic card from uploaded image:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const processPhoto = async (imageSource: Blob | File) => {
    const base64Photo = await blobToBase64(imageSource);
    
    const sizeInKB = (base64Photo.length * 0.75 / 1024).toFixed(2);
    console.log(`Photo processed: Base64 size: ${sizeInKB}KB`);
    
    const photoDataUrl = base64ToDataUrl(base64Photo);
    setCapturedPhoto(photoDataUrl);
    
    // Prepare request for jurassic card
    const request: GenerateDinoCardRequest = {
      photo: base64Photo,
      scene: selectedScene
    };

    // Call the jurassic API endpoint
    const response = await TradingCardApi.generateDinoCard(request);
    
    const cardImageDataUrl = base64ToDataUrl(response.image);
    setGeneratedCardImage(cardImageDataUrl);
  };

  return (
    <div>
      {/* Print-only styles */}
      <style jsx global>{`
        @media print {
          html, body {
            height: 148mm;
            width: 105mm;
            margin: 0;
            padding: 0;
            overflow: hidden;
          }
          
          body > * {
            display: none !important;
          }
          
          body > div:has(#jurassic-card-print-container) {
            display: block !important;
          }
          
          body * {
            visibility: hidden;
          }
          
          #jurassic-card-print-container,
          #jurassic-card-print-container * {
            visibility: visible;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          #jurassic-card-print-container {
            position: fixed;
            left: 0;
            top: 0;
            width: 105mm !important;
            height: 148mm !important;
            margin: 0;
            padding: 0;
            overflow: hidden;
            page-break-after: avoid;
            page-break-inside: avoid;
            break-after: avoid;
            break-inside: avoid;
          }
          
          @page {
            size: A6 portrait;
            margin: 0;
          }
        }
      `}</style>

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-2" style={{ color: jurassicTheme.colors.primary }}>
          {jurassicTheme.headerTitle}
        </h1>
        <p className="text-lg text-gray-600">{jurassicTheme.headerSubtitle}</p>
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Jurassic Card Display with Scene Selector */}
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_420px_1fr] gap-4 lg:gap-0 justify-center items-start lg:items-center my-6">
        {/* Left side - Scene Selector */}
        <div className='flex flex-col w-full lg:w-auto'>
          <SceneSelector
            scenes={scenes}
            selectedScene={selectedScene}
            onSceneSelect={setSelectedScene}
          />
        </div>

        {/* Center - Jurassic Card */}
        <div className="flex justify-center w-full lg:w-auto">
          <div
            id="jurassic-card-print-container"
            ref={cardDisplayRef}
            className="w-[420px] h-[594px] shadow-[0_4px_24px_rgba(0,0,0,0.15)] transition-all duration-700 ease-in-out mx-auto overflow-hidden"
          >
            {/* Video Canvas Area - Full Height */}
            <div className="relative w-full h-full overflow-hidden">
              {generatedCardImage ? (
                <Image
                  src={generatedCardImage}
                  alt="Generated Jurassic Card"
                  width={420}
                  height={594}
                  className="w-full h-full object-cover"
                />
              ) : isGenerating && capturedPhoto ? (
                <LoadingDinosaur 
                  capturedPhoto={capturedPhoto}
                  loadingMessage={loadingMessage}
                  messageIndex={messageIndex}
                />
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`scale-x-[-1] w-full h-full object-cover ${isStreaming ? 'block' : 'hidden'}`}
                  />
                  
                  {!isStreaming && (
                    <div 
                      className="bg-gray-300 flex items-center justify-center text-gray-600 absolute inset-0"
                    >
                      <div className="text-center">
                        <div className="text-4xl sm:text-6xl mb-2">📷</div>
                        <div className="text-sm sm:text-base">Camera Preview</div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Overlay Image */}
              {!generatedCardImage && (
                <Image 
                  src="/overlay.png" 
                  alt="Overlay" 
                  width={420}
                  height={594}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
                />
              )}

              {/* Greeting Overlay */}
              <div 
                className={`absolute bottom-1 left-4 right-4 flex flex-col items-end gap-1 ${caveat.className} z-20`}
                style={{
                  transform: "rotate(-8deg) skewY(-2deg)",
                }}
              >
                <span 
                  className="text-[28px] sm:text-[36px] text-white drop-shadow-lg"
                  style={{
                    textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
                    letterSpacing: "0.02em"
                  }}
                >
                  {greetingPhrase}
                </span>
                <Image 
                  src="/bitbash.png" 
                  alt="BitBash" 
                  width={100} 
                  height={100}
                  className="drop-shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Empty for symmetry */}
        <div className='flex flex-col w-full lg:w-auto'>
          {/* Could add additional options here in the future */}
        </div>
      </div>

      <JurassicActionButtons 
        isStreaming={isStreaming}
        isCapturing={isCapturing}
        isGenerating={isGenerating}
        generatedCardImage={generatedCardImage}
        cardDisplayRef={cardDisplayRef}
        onCapturePhoto={handleCapturePhoto}
        onUploadPhoto={handleUploadPhoto}
      />
    </div>
  );
}
