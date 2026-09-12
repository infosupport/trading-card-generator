'use client';

import { useState, useEffect, useRef } from 'react';
import { useWebcam } from '@/hooks/useWebcam';
import { useFaceDetection } from '@/hooks/useFaceDetection';
import { TradingCardApi, blobToBase64, base64ToDataUrl } from '@/lib/api';
import { isks8BitTheme } from '@/lib/theme-config';

import Isks8BitActionButtons from './Isks8BitActionButtons';
import SceneSelector from './SceneSelector';
import Image from 'next/image';
import { Caveat } from 'next/font/google';
import { IMAGE_FORMAT, IMAGE_QUALITY } from '@/lib/constants';

const caveat = Caveat({ subsets: ['latin'], weight: '700' });

const GREETING_PHRASES = [
  'Greetings from',
  'Wish you were at',
  'Having a byte at',
  'Leveling up at',
  'Hacking away at',
  'Spotted at',
  'Caught conversing at',
  'Making memories at',
  'Powering up at',
  'Building things to last',
  'See you at',
  'Best vibes at',
  'Feeding my agents at',
  'Connecting at',
];

export default function Isks8BitCardGenerator() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCardImage, setGeneratedCardImage] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const cardDisplayRef = useRef<HTMLDivElement>(null);
  const [loadingMessage, setLoadingMessage] = useState(isks8BitTheme.loadingMessages[0]);
  const [messageIndex, setMessageIndex] = useState(0);
  const [scenes, setScenes] = useState<Array<{ id: string; name: string; description: string; icon: string }>>([]);
  const [selectedScene, setSelectedScene] = useState('scene01');
  const [greetingPhrase, setGreetingPhrase] = useState(GREETING_PHRASES[0]);
  const [countdown, setCountdown] = useState<number | null>(null);

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

  const readyToCapture = isStreaming && !isCapturing && !isGenerating && !generatedCardImage;
  const { faceCount } = useFaceDetection({ videoRef, enabled: readyToCapture });
  const singleFaceDetected = faceCount === 1;

  // Auto 3-2-1 countdown when a face is detected
  useEffect(() => {
    if (!readyToCapture || !singleFaceDetected) {
      setCountdown(null);
      return;
    }
    setCountdown((current) => (current === null ? 3 : current));
  }, [readyToCapture, singleFaceDetected]);

  // Tick countdown down and trigger capture
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      handleCapturePhoto();
      setCountdown(null);
      return;
    }
    const timeout = setTimeout(() => {
      setCountdown((current) => (current !== null ? current - 1 : null));
    }, 1000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  // Rotate loading messages during generation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setMessageIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % isks8BitTheme.loadingMessages.length;
          setLoadingMessage(isks8BitTheme.loadingMessages[newIndex]);
          return newIndex;
        });
      }, 2500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating]);

  // Start webcam and fetch scenes on mount
  useEffect(() => {
    startWebcam();

    const sceneIcons: Record<string, string> = {
      'scene01': '🎪',
      'scene02': '💻',
      'scene03': '☀️',
    };

    const defaultScenes = [
      { id: 'scene01', name: 'Outdoor Fairground', description: 'Conversing with friendly attendees on a sunny fairground', icon: '🎪' },
      { id: 'scene02', name: 'Tent Hackathon', description: 'Collaborating with teammates around laptops inside a festival tent', icon: '💻' },
      { id: 'scene03', name: 'Fairground Promenade', description: 'Walking among colorful vendor canopies under sunny skies', icon: '☀️' },
    ];

    const fetchScenes = async () => {
      try {
        const fetchedScenes = await TradingCardApi.getIsks8BitScenes();
        const mappedScenes = fetchedScenes.map((scene) => {
          const parts = scene.description.split(' - ');
          const name = parts[0] || scene.description;
          const description = parts[1] || scene.description;

          return {
            id: scene.identifier,
            name,
            description,
            icon: sceneIcons[scene.identifier] || '👾'
          };
        });

        if (mappedScenes.length > 0) {
          setScenes(mappedScenes);
          setSelectedScene(mappedScenes[0].id);
        } else {
          setScenes(defaultScenes);
        }
      } catch (err) {
        console.error('Error fetching ISKS 8-bit scenes:', err);
        setScenes(defaultScenes);
      }
    };

    fetchScenes();
  }, [startWebcam]);

  const handleCapturePhoto = async () => {
    setIsCapturing(true);
    setIsGenerating(true);
    setGeneratedCardImage(null);
    const randomPhrase = GREETING_PHRASES[Math.floor(Math.random() * GREETING_PHRASES.length)];
    setGreetingPhrase(randomPhrase);

    try {
      const blob = await capturePhoto(undefined, undefined, IMAGE_FORMAT, IMAGE_QUALITY);
      if (blob) {
        await processPhoto(blob);
      }
    } catch (err) {
      console.error('Error generating ISKS 8-bit postcard:', err);
    } finally {
      setIsCapturing(false);
      setIsGenerating(false);
    }
  };

  const handleUploadPhoto = async (file: File) => {
    setIsGenerating(true);
    setGeneratedCardImage(null);
    const randomPhrase = GREETING_PHRASES[Math.floor(Math.random() * GREETING_PHRASES.length)];
    setGreetingPhrase(randomPhrase);

    try {
      await processPhoto(file);
    } catch (err) {
      console.error('Error generating ISKS 8-bit postcard from upload:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const processPhoto = async (imageSource: Blob | File) => {
    const base64Photo = await blobToBase64(imageSource);
    setCapturedPhoto(base64ToDataUrl(base64Photo));

    const response = await TradingCardApi.generateIsks8BitCard({
      photo: base64Photo,
      scene: selectedScene
    });

    setGeneratedCardImage(base64ToDataUrl(response.image));
  };

  const handleReset = () => {
    setGeneratedCardImage(null);
    setCapturedPhoto(null);
  };

  return (
    <div>
      {/* Print-only styles for A6 Postcard */}
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

          body > div:has(#isks-8bit-postcard-print-container) {
            display: block !important;
          }

          body * {
            visibility: hidden;
          }

          #isks-8bit-postcard-print-container,
          #isks-8bit-postcard-print-container * {
            visibility: visible;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          #isks-8bit-postcard-print-container {
            display: block !important;
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

          #isks-8bit-postcard-print-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          @page {
            size: A6 portrait;
            margin: 0;
          }
        }
      `}</style>

      {/* Header */}
      <div className="text-center mb-6">
        <div
          className="inline-block px-8 py-4 rounded-lg"
          style={{
            background: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #9a3412 100%)',
            border: '3px solid #fbbf24',
            boxShadow: '0 4px 20px rgba(154, 52, 18, 0.4), inset 0 0 15px rgba(251, 191, 36, 0.2)',
          }}
        >
          <h1
            className="text-3xl sm:text-5xl font-black tracking-wider text-amber-100"
            style={{
              fontFamily: "var(--font-bebas-neue), Arial, sans-serif",
              textShadow: '2px 2px 0px #431407, 0 0 10px rgba(251, 191, 36, 0.5)',
            }}
          >
            {isks8BitTheme.headerTitle}
          </h1>
          <p
            className="mt-1 text-xs sm:text-sm font-bold tracking-widest text-amber-200"
            style={{ fontFamily: "var(--font-geist-mono), 'Courier New', monospace" }}
          >
            {isks8BitTheme.headerSubtitle}
          </p>
        </div>
        {error && (
          <div className="mt-4 p-3 bg-red-100 border-2 border-red-400 text-red-700 rounded-lg max-w-md mx-auto">
            {error}
          </div>
        )}
      </div>

      {/* Main Grid: Scene Selector on left, Postcard in center */}
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_420px_1fr] gap-4 lg:gap-0 justify-center items-start lg:items-center my-6">
        {/* Left - Scene Selector */}
        <div className="flex flex-col w-full lg:w-auto">
          {scenes.length > 0 && (
            <SceneSelector
              scenes={scenes}
              selectedScene={selectedScene}
              onSceneSelect={setSelectedScene}
            />
          )}
        </div>

        {/* Center - Postcard Display */}
        <div className="flex justify-center w-full lg:w-auto">
          <div
            id="isks-8bit-postcard-print-container"
            ref={cardDisplayRef}
            className="relative w-[420px] h-[594px] rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-500 mx-auto"
            style={{
              background: 'linear-gradient(145deg, #fed7aa 0%, #fef3c7 50%, #ffedd5 100%)',
              border: '6px solid #9a3412',
              outline: '2px solid #fbbf24',
              outlineOffset: '-4px',
            }}
          >
            {/* Postcard Inner Container */}
            <div className="relative w-full h-full overflow-hidden">
              {generatedCardImage ? (
                <Image
                  src={generatedCardImage}
                  alt="Generated ISKS 8-Bit Postcard"
                  width={420}
                  height={594}
                  className="w-full h-full object-cover"
                />
              ) : isGenerating && capturedPhoto ? (
                <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-amber-900 to-orange-950 flex flex-col items-center justify-center p-6 text-center">
                  <img
                    src={capturedPhoto}
                    alt="Captured Reference"
                    className="absolute inset-0 w-full h-full object-cover opacity-25"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                  {/* Retro 8-bit fairground animation */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 mb-4 rounded-lg bg-orange-600/30 border-2 border-amber-400 flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(251,191,36,0.4)]">
                      <span className="text-4xl animate-bounce">🎪</span>
                    </div>
                    <div
                      className="px-4 py-2 rounded bg-black/60 border border-orange-500 text-amber-300 font-mono text-sm tracking-wider shadow-lg"
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
                    <div className="bg-amber-900/30 flex items-center justify-center text-amber-900 absolute inset-0">
                      <div className="text-center">
                        <div className="text-6xl mb-2">📷</div>
                        <div className="font-mono text-sm font-bold">Camera Preview</div>
                      </div>
                    </div>
                  )}

                  {/* Countdown overlay */}
                  {countdown !== null && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-30 pointer-events-none">
                      <span
                        className="text-8xl font-black text-amber-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] font-mono animate-ping"
                      >
                        {countdown}
                      </span>
                    </div>
                  )}

                  {/* Corner Logo / Accent */}
                  <div className="absolute top-3 left-3 z-20 pointer-events-none">
                    <Image
                      src="/isks/builttolast.png"
                      alt="Built To Last"
                      width={100}
                      height={50}
                      className="drop-shadow-lg object-contain"
                    />
                  </div>
                </>
              )}

              {/* Top left logo on generated image */}
              {generatedCardImage && (
                <div className="absolute top-3 left-3 z-20 pointer-events-none">
                  <Image
                    src="/isks/builttolast.png"
                    alt="Built To Last"
                    width={100}
                    height={50}
                    className="drop-shadow-lg object-contain"
                  />
                </div>
              )}

              {/* Cute Greeting Postcard Overlay */}
              <div
                className={`absolute bottom-3 left-4 right-4 flex flex-col items-end gap-0.5 ${caveat.className} z-20 pointer-events-none`}
                style={{
                  transform: "rotate(-6deg) skewY(-1deg)",
                }}
              >
                <span
                  className="text-[28px] sm:text-[36px] text-amber-200 drop-shadow-lg leading-none"
                  style={{
                    textShadow: "2px 2px 6px rgba(0,0,0,0.9), 0 0 10px rgba(194,65,12,0.8)",
                    letterSpacing: "0.02em"
                  }}
                >
                  {greetingPhrase}
                </span>
                <div
                  className="text-[26px] sm:text-[34px] font-black tracking-wider uppercase leading-none drop-shadow-xl"
                  style={{
                    fontFamily: "var(--font-bebas-neue), Arial, sans-serif",
                    textShadow: "2px 2px 6px rgba(0,0,0,0.95), 0 0 12px rgba(234,88,12,0.9)",
                    color: "#fef08a"
                  }}
                >
                  ISKS 2026
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Symmetrical spacing */}
        <div className="flex flex-col w-full lg:w-auto"></div>
      </div>

      {/* Action Buttons */}
      <Isks8BitActionButtons
        isStreaming={isStreaming}
        isCapturing={isCapturing}
        isGenerating={isGenerating}
        generatedCardImage={generatedCardImage}
        cardDisplayRef={cardDisplayRef}
        onCapturePhoto={handleCapturePhoto}
        onUploadPhoto={handleUploadPhoto}
        onReset={handleReset}
      />
    </div>
  );
}
