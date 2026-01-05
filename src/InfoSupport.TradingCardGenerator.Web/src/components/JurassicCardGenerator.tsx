'use client';

import { useState, useEffect, useRef } from 'react';
import { useWebcam } from '@/hooks/useWebcam';
import { TradingCardApi, blobToBase64, base64ToDataUrl } from '@/lib/api';
import { GenerateDinoCardRequest, SceneDescription } from '@/lib/types';
import { jurassicTheme } from '@/lib/theme-config';

import TradingCardHeader from './TradingCardHeader';
import ActionButtons from './ActionButtons';
import SceneSelector from './SceneSelector';
import LoadingSpinner from './LoadingSpinner';
import Image from 'next/image';
import { Caveat } from 'next/font/google';
import { 
  CARD_WIDTH, 
  CARD_HEIGHT, 
  CAPTURE_WIDTH, 
  CAPTURE_HEIGHT, 
  IMAGE_FORMAT, 
  IMAGE_QUALITY
} from '@/lib/constants';

const caveat = Caveat({ subsets: ['latin'], weight: '700' });

export default function JurassicCardGenerator() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCardImage, setGeneratedCardImage] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const cardDisplayRef = useRef<HTMLDivElement>(null);
  const [loadingMessage, setLoadingMessage] = useState(jurassicTheme.loadingMessages[0]);
  const [messageIndex, setMessageIndex] = useState(0);
  const [scenes, setScenes] = useState<Array<{id: string; name: string; description: string; icon: string}>>([]);
  const [selectedScene, setSelectedScene] = useState('scene01');

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

  const playerName = (firstName.trim() + ' ' + lastName.trim()).trim().toUpperCase() || jurassicTheme.playerNameFallback;

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
    try {
      const blob = await capturePhoto(CAPTURE_WIDTH, CAPTURE_HEIGHT, IMAGE_FORMAT, IMAGE_QUALITY);
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
      <TradingCardHeader 
        firstName={firstName}
        lastName={lastName}
        onFirstNameChange={setFirstName}
        onLastNameChange={setLastName}
        teamColor={jurassicTheme.colors.primary}
        error={error || undefined}
        isVipMode={false}
        headerTitle={jurassicTheme.headerTitle}
        headerSubtitle={jurassicTheme.headerSubtitle}
        firstNamePlaceholder={jurassicTheme.firstNamePlaceholder}
        lastNamePlaceholder={jurassicTheme.lastNamePlaceholder}
      />

      {/* Jurassic Card Display with Scene Selector */}
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_375px_1fr] gap-4 lg:gap-0 justify-center items-start lg:items-center my-6">
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
            ref={cardDisplayRef}
            className="w-[320px] h-[509px] sm:w-[375px] sm:h-[597px] shadow-[0_4px_24px_rgba(0,0,0,0.15)] transition-all duration-700 ease-in-out flex flex-col justify-between rounded-xl mx-auto overflow-hidden"
          >
            {/* Video Canvas Area - Full Height */}
            <div className="relative flex-1 overflow-hidden rounded-xl">
              {generatedCardImage ? (
                <Image
                  src={generatedCardImage}
                  alt="Generated Jurassic Card"
                  fill
                  className="object-cover"
                />
              ) : isGenerating && capturedPhoto ? (
                <LoadingSpinner 
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

              {/* Guest Name Handwritten Overlay */}
              <div 
                className={`absolute bottom-1 left-4 right-4 flex flex-col items-end gap-1 ${caveat.className}`}
                style={{
                  transform: "rotate(-8deg) skewY(-2deg)",
                }}
              >
                {(firstName.trim() || lastName.trim()) && (
                  <span 
                    className="text-[28px] sm:text-[36px] text-white drop-shadow-lg"
                    style={{
                      textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
                      letterSpacing: "0.02em",
                      marginRight: "20px"
                    }}
                  >
                    {`${firstName.trim()} ${lastName.trim()}`}
                  </span>
                )}
                <span 
                  className="text-[28px] sm:text-[36px] text-white drop-shadow-lg"
                  style={{
                    textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
                    letterSpacing: "0.02em"
                  }}
                >
                  I was at
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

            {/* Scene Icon */}
            <div className="flex justify-center items-center mt-1.5 sm:mt-2 px-1.5 sm:px-2 pb-1.5 sm:pb-2">
              <div className="rounded-full border-2 flex items-center justify-center w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] bg-theme-primary border-theme-border">
                <div className="text-5xl sm:text-6xl">
                  {scenes.find(s => s.id === selectedScene)?.icon || '🦖'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Empty for symmetry */}
        <div className='flex flex-col w-full lg:w-auto'>
          {/* Could add additional options here in the future */}
        </div>
      </div>

      <ActionButtons 
        isStreaming={isStreaming}
        isCapturing={isCapturing}
        isGenerating={isGenerating}
        generatedCardImage={generatedCardImage}
        teamColor={jurassicTheme.colors.primary}
        playerName={playerName}
        cardDisplayRef={cardDisplayRef}
        onCapturePhoto={handleCapturePhoto}
        onUploadPhoto={handleUploadPhoto}
      />
    </div>
  );
}
