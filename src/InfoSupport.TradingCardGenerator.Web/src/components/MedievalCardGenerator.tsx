'use client';

import { useState, useEffect, useRef } from 'react';
import { useWebcam } from '@/hooks/useWebcam';
import { TradingCardApi, blobToBase64, base64ToDataUrl } from '@/lib/api';
import { GenerateMedievalCardRequest } from '@/lib/types';
import { medievalTheme } from '@/lib/theme-config';

import MedievalActionButtons from './MedievalActionButtons';
import SceneSelector from './SceneSelector';
import Image from 'next/image';
import { 
  IMAGE_FORMAT, 
  IMAGE_QUALITY
} from '@/lib/constants';

// A6 dimensions (105mm × 148mm) - portrait orientation
const A6_DISPLAY_WIDTH = 420;
const A6_DISPLAY_HEIGHT = 594;

export default function MedievalCardGenerator() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCardImage, setGeneratedCardImage] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const cardDisplayRef = useRef<HTMLDivElement>(null);
  const [loadingMessage, setLoadingMessage] = useState(medievalTheme.loadingMessages[0]);
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
    facingMode: 'user'
  });

  // Rotate loading messages during generation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setMessageIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % medievalTheme.loadingMessages.length;
          setLoadingMessage(medievalTheme.loadingMessages[newIndex]);
          return newIndex;
        });
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating]);

  // On mount: start webcam and fetch scenes
  useEffect(() => {
    startWebcam();

    const sceneIcons: Record<string, string> = {
      'scene01': '⚔️',
      'scene02': '👑',
      'scene03': '📜',
      'scene04': '🎸',
      'scene05': '⚗️',
    };

    const fetchScenes = async () => {
      try {
        const fetchedScenes = await TradingCardApi.getMedievalScenes();
        const mappedScenes = fetchedScenes.map(scene => {
          const parts = scene.description.split(' - ');
          const name = parts[0] || scene.description;
          const description = parts[1] || scene.description;
          return {
            id: scene.identifier,
            name,
            description,
            icon: sceneIcons[scene.identifier] || '⚔️'
          };
        });
        setScenes(mappedScenes);
        if (mappedScenes.length > 0) {
          setSelectedScene(mappedScenes[0].id);
        }
      } catch (err) {
        console.error('Error fetching medieval scenes:', err);
      }
    };

    fetchScenes();
  }, [startWebcam]);

  const handleCapturePhoto = async () => {
    setIsCapturing(true);
    setIsGenerating(true);
    setGeneratedCardImage(null);
    try {
      const blob = await capturePhoto(undefined, undefined, IMAGE_FORMAT, IMAGE_QUALITY);
      if (blob) {
        await processPhoto(blob);
      }
    } catch (err) {
      console.error('Error generating medieval card:', err);
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
      console.error('Error generating medieval card from uploaded image:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const processPhoto = async (imageSource: Blob | File) => {
    const base64Photo = await blobToBase64(imageSource);
    const photoDataUrl = base64ToDataUrl(base64Photo);
    setCapturedPhoto(photoDataUrl);

    const request: GenerateMedievalCardRequest = {
      photo: base64Photo,
      scene: selectedScene
    };

    const response = await TradingCardApi.generateMedievalCard(request);
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

          body > div:has(#medieval-card-print-container) {
            display: block !important;
          }

          body * {
            visibility: hidden;
          }

          #medieval-card-print-container,
          #medieval-card-print-container * {
            visibility: visible;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          #medieval-card-print-container {
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
        <h1 className="text-4xl font-bold mb-2" style={{ color: medievalTheme.colors.primary }}>
          {medievalTheme.headerTitle}
        </h1>
        <p className="text-lg text-gray-600">{medievalTheme.headerSubtitle}</p>
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Card Display with Scene Selector */}
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_420px_1fr] gap-4 lg:gap-0 justify-center items-start lg:items-center my-6">
        {/* Left side - Scene Selector */}
        <div className="flex flex-col w-full lg:w-auto">
          <SceneSelector
            scenes={scenes}
            selectedScene={selectedScene}
            onSceneSelect={setSelectedScene}
          />
        </div>

        {/* Center - Medieval Card */}
        <div className="flex justify-center w-full lg:w-auto">
          <div
            id="medieval-card-print-container"
            ref={cardDisplayRef}
            className="w-[420px] h-[594px] shadow-[0_4px_24px_rgba(0,0,0,0.15)] transition-all duration-700 ease-in-out mx-auto overflow-hidden"
          >
            <div className="relative w-full h-full overflow-hidden">
              {generatedCardImage ? (
                <Image
                  src={generatedCardImage}
                  alt="Generated Medieval Card"
                  width={A6_DISPLAY_WIDTH}
                  height={A6_DISPLAY_HEIGHT}
                  className="w-full h-full object-cover"
                />
              ) : isGenerating && capturedPhoto ? (
                /* Loading state */
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  <img
                    src={capturedPhoto}
                    alt="Captured Photo"
                    className="absolute top-0 left-0 w-full h-full object-cover opacity-40"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl animate-pulse">⚗️</div>
                  </div>
                  <div className="absolute top-1/2 mt-8 left-1/2 -translate-x-1/2 w-full max-w-[320px] flex justify-center">
                    <div
                      className="text-lg font-bold tracking-wide px-6 py-2 rounded-lg text-amber-900 text-center bg-amber-100/80"
                      key={messageIndex}
                    >
                      {loadingMessage}
                    </div>
                  </div>
                </div>
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
                    <div className="bg-amber-50 flex items-center justify-center text-amber-800 absolute inset-0">
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
        </div>

        {/* Right side – empty for symmetry */}
        <div className="flex flex-col w-full lg:w-auto" />
      </div>

      <MedievalActionButtons
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
