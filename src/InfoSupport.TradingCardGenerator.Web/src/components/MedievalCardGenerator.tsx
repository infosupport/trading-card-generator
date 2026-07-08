'use client';

import { useState, useEffect, useRef } from 'react';
import { useWebcam } from '@/hooks/useWebcam';
import { TradingCardApi, blobToBase64, base64ToDataUrl } from '@/lib/api';
import { GenerateMedievalCardRequest } from '@/lib/types';
import { medievalTheme } from '@/lib/theme-config';

import MedievalActionButtons from './MedievalActionButtons';
import MedievalSceneSelector from './MedievalSceneSelector';
import Image from 'next/image';
import { CameraIcon } from '@heroicons/react/24/outline';
import { 
  IMAGE_FORMAT, 
  IMAGE_QUALITY
} from '@/lib/constants';

// Standard playing card dimensions (63mm × 88mm) - portrait orientation
const CARD_DISPLAY_WIDTH = 420;
const CARD_DISPLAY_HEIGHT = 587;

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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [stats, setStats] = useState({ strength: 5, wisdom: 5, charisma: 5 });
  const [isRolling, setIsRolling] = useState(false);

  const guildName = scenes.find((scene) => scene.id === selectedScene)?.name ?? '';
  const playerName = (firstName.trim() + ' ' + lastName.trim()).trim().toUpperCase() || 'UNKNOWN ADVENTURER';

  const rollStats = () => ({
    strength: Math.floor(Math.random() * 10) + 1,
    wisdom: Math.floor(Math.random() * 10) + 1,
    charisma: Math.floor(Math.random() * 10) + 1,
  });

  const handleRollFate = () => {
    if (isRolling) return;
    setIsRolling(true);
    if (scenes.length > 0) {
      const randomScene = scenes[Math.floor(Math.random() * scenes.length)];
      setSelectedScene(randomScene.id);
    }
    setStats(rollStats());
    setTimeout(() => setIsRolling(false), 500);
  };

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
    setStats(rollStats());
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
            height: 88mm;
            width: 63mm;
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
            width: 63mm !important;
            height: 88mm !important;
            margin: 0;
            padding: 0;
            overflow: hidden;
            page-break-after: avoid;
            page-break-inside: avoid;
            break-after: avoid;
            break-inside: avoid;
          }

          @page {
            size: 63mm 88mm;
            margin: 0;
          }
        }
      `}</style>

      {/* Header */}
      <div className="text-center mb-6">
        <div
          className="inline-block relative px-10 py-6 sm:px-14 sm:py-8 -rotate-1"
          style={{
            background: 'radial-gradient(circle at 25% 20%, #f5e8c8 0%, #ecd9a8 45%, #d8bd82 100%)',
            boxShadow: '0 10px 24px rgba(0,0,0,0.35), inset 0 0 30px rgba(146,64,14,0.25)',
            clipPath:
              'polygon(1% 6%, 12% 1%, 30% 4%, 50% 0%, 70% 3%, 90% 1%, 99% 8%, 97% 25%, 100% 45%, 97% 65%, 99% 85%, 92% 99%, 72% 96%, 50% 100%, 28% 97%, 8% 99%, 2% 82%, 4% 60%, 1% 40%, 3% 20%)',
          }}
        >
          <h1
            className="font-[family-name:var(--font-metal-mania)] text-4xl sm:text-5xl tracking-wide"
            style={{ color: medievalTheme.colors.primary, textShadow: '1px 1px 0 rgba(0,0,0,0.15)' }}
          >
            {medievalTheme.headerTitle}
          </h1>
          <p className="mt-2 font-serif italic text-lg text-amber-900/80">
            {medievalTheme.headerSubtitle}
          </p>
        </div>
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
          <MedievalSceneSelector
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
            className="w-[420px] h-[587px] p-3.5 rounded-2xl transition-all duration-700 ease-in-out mx-auto overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #5a3d24 0%, #2b1c10 100%)',
              border: '3px solid var(--theme-border-active)',
              boxShadow: '0 14px 32px rgba(0,0,0,0.5)',
            }}
          >
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <div className="relative w-full h-full overflow-hidden">
                {generatedCardImage ? (
                  <Image
                    src={generatedCardImage}
                    alt="Generated Medieval Card"
                    width={CARD_DISPLAY_WIDTH}
                    height={CARD_DISPLAY_HEIGHT}
                    className="w-full h-full object-cover"
                  />
                ) : isGenerating && capturedPhoto ? (
                  /* Loading state */
                  <div className="relative w-full h-full overflow-hidden">
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
                        className="text-lg tracking-wide px-6 py-2 rounded-lg text-center"
                        style={{
                          fontFamily: "var(--font-metal-mania), 'Georgia', serif",
                          color: 'var(--theme-primary)',
                          background: 'linear-gradient(180deg, var(--theme-card-bg) 0%, #e4cfa0 100%)',
                          border: '2px solid var(--theme-border-active)',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.35)',
                        }}
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
                      <div
                        className="flex items-center justify-center absolute inset-0"
                        style={{
                          background: 'radial-gradient(circle at 50% 35%, #e4cfa0 0%, #c9a866 60%, #a9863f 100%)',
                          color: 'var(--theme-primary)',
                        }}
                      >
                        <div className="text-center">
                          <CameraIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2" />
                          <div
                            className="text-base sm:text-lg tracking-wide"
                            style={{ fontFamily: "var(--font-metal-mania), 'Georgia', serif" }}
                          >
                            Awaiting Thy Likeness
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Stats bar - baked into the print container so it's part of the printed card */}
                <div
                  className="absolute bottom-0 left-0 right-0 px-3 py-2 sm:px-4 sm:py-3"
                  style={{
                    background:
                      'linear-gradient(0deg, rgba(30,20,12,0.95) 0%, rgba(30,20,12,0.8) 65%, rgba(30,20,12,0) 100%)',
                  }}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span
                      className="text-base sm:text-lg tracking-wide truncate"
                      style={{ fontFamily: "var(--font-metal-mania), 'Georgia', serif", color: '#f3d98a' }}
                    >
                      {playerName}
                    </span>
                    {guildName && (
                      <span className="text-xs sm:text-sm italic font-serif shrink-0" style={{ color: '#e8d9b8' }}>
                        {guildName}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between gap-1.5 mt-1.5 sm:mt-2">
                    {[
                      { label: 'STR', value: stats.strength },
                      { label: 'WIS', value: stats.wisdom },
                      { label: 'CHA', value: stats.charisma },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="flex-1 text-center py-1 rounded"
                        style={{
                          background: 'linear-gradient(180deg, #efdcae 0%, #d8bd82 100%)',
                          border: '1.5px solid var(--theme-border-active)',
                        }}
                      >
                        <div
                          className="text-[10px] sm:text-xs font-bold tracking-widest"
                          style={{ color: 'var(--theme-primary)' }}
                        >
                          {stat.label}
                        </div>
                        <div
                          className="text-sm sm:text-base leading-none"
                          style={{ fontFamily: "var(--font-metal-mania), 'Georgia', serif", color: 'var(--theme-primary)' }}
                        >
                          {stat.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Adventurer details */}
        <div className="flex flex-col w-full lg:w-auto">
          <div className="p-2 sm:p-4">
            <h3
              className="text-lg sm:text-xl mb-3 sm:mb-4 text-center tracking-wide"
              style={{ fontFamily: "var(--font-metal-mania), 'Georgia', serif", color: 'var(--theme-primary)' }}
            >
              Sign Thy Name
            </h3>
            <div className="flex flex-col gap-2 w-full max-w-[320px] mx-auto">
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                maxLength={20}
                className="px-3 py-2 rounded-lg text-center outline-none"
                style={{
                  fontFamily: "var(--font-metal-mania), 'Georgia', serif",
                  background: 'linear-gradient(180deg, var(--theme-card-bg) 0%, #e4cfa0 100%)',
                  color: 'var(--theme-primary)',
                  border: '2px solid var(--theme-border-active)',
                }}
              />
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                maxLength={20}
                className="px-3 py-2 rounded-lg text-center outline-none"
                style={{
                  fontFamily: "var(--font-metal-mania), 'Georgia', serif",
                  background: 'linear-gradient(180deg, var(--theme-card-bg) 0%, #e4cfa0 100%)',
                  color: 'var(--theme-primary)',
                  border: '2px solid var(--theme-border-active)',
                }}
              />
              <button
                onClick={handleRollFate}
                disabled={isGenerating}
                className="mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  fontFamily: "var(--font-metal-mania), 'Georgia', serif",
                  background: 'linear-gradient(180deg, var(--theme-primary) 0%, #5a1d0c 100%)',
                  color: 'var(--theme-card-bg)',
                  border: '2px solid var(--theme-border-active)',
                  boxShadow: '0 3px 0 rgba(0,0,0,0.4)',
                }}
              >
                <span className={isRolling ? 'inline-block animate-spin' : 'inline-block'}>🎲</span>
                Roll for Fate
              </button>
            </div>
          </div>
        </div>
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
