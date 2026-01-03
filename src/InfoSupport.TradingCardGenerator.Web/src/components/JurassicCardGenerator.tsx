'use client';

import { useState, useEffect, useRef } from 'react';
import { useWebcam } from '@/hooks/useWebcam';
import { TradingCardApi, blobToBase64, base64ToDataUrl } from '@/lib/api';
import { GenerateDinoCardRequest } from '@/lib/types';
import { jurassicTheme } from '@/lib/theme-config';
import { JURASSIC_SCENES } from '@/lib/jurassic-scenes';
import TradingCardHeader from './TradingCardHeader';
import ActionButtons from './ActionButtons';
import SceneSelector from './SceneSelector';
import LoadingSpinner from './LoadingSpinner';
import Image from 'next/image';
import { 
  CARD_WIDTH, 
  CARD_HEIGHT, 
  CAPTURE_WIDTH, 
  CAPTURE_HEIGHT, 
  IMAGE_FORMAT, 
  IMAGE_QUALITY
} from '@/lib/constants';

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
  const [selectedScene, setSelectedScene] = useState(JURASSIC_SCENES[0].id);

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

  // On mount: start webcam
  useEffect(() => {
    startWebcam();
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
      />

      <SceneSelector
        scenes={JURASSIC_SCENES}
        selectedScene={selectedScene}
        onSceneSelect={setSelectedScene}
      />

      {/* Jurassic Card Display */}
      <div className="flex justify-center w-full my-6">
        <div
          ref={cardDisplayRef}
          className="w-[320px] h-[509px] sm:w-[375px] sm:h-[597px] shadow-[0_4px_24px_rgba(0,0,0,0.15)] transition-all duration-700 ease-in-out flex flex-col justify-between p-1.5 sm:p-2 rounded-xl mx-auto bg-theme-primary"
        >
          {/* Card Frame */}
          <div className="relative bg-theme-card-bg rounded-2xl h-[358px] sm:h-[420px]">
            {/* Video Canvas Area */}
            <div className="flex justify-center">
              <div
                className="relative overflow-hidden w-[290px] h-[307px] sm:w-[340px] sm:h-[360px] rounded-2xl mt-1.5 sm:mt-2"
              >
                {generatedCardImage ? (
                  <Image
                    src={generatedCardImage}
                    alt="Generated Jurassic Card"
                    width={340}
                    height={360}
                    className="object-cover w-[290px] h-[307px] sm:w-[340px] sm:h-[360px] rounded-2xl"
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
                      className={`scale-x-[-1] w-[290px] h-[307px] sm:w-[340px] sm:h-[360px] object-cover rounded-2xl ${isStreaming ? 'block' : 'hidden'}`}
                    />
                    
                    {!isStreaming && (
                      <div 
                        className="bg-gray-300 flex items-center justify-center text-gray-600 absolute inset-0 w-[290px] h-[307px] sm:w-[340px] sm:h-[360px] rounded-2xl"
                      >
                        <div className="text-center">
                          <div className="text-4xl sm:text-6xl mb-2">📷</div>
                          <div className="text-sm sm:text-base">Camera Preview</div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Player Name */}
            <div 
              className="text-center mt-1.5 sm:mt-2 text-[27px] sm:text-[32px] text-theme-primary"
              style={{
                fontFamily: "var(--font-bebas-neue), Arial, sans-serif"
              }}
            >
              {playerName}
            </div>
          </div>

          {/* Scene Icon */}
          <div className="flex justify-center items-center mt-1.5 sm:mt-2 grow">
            <div className="rounded-full border-2 flex items-center justify-center w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] bg-theme-card-bg border-theme-border">
              <div className="text-5xl sm:text-6xl">
                {JURASSIC_SCENES.find(s => s.id === selectedScene)?.icon || '🦖'}
              </div>
            </div>
          </div>
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
