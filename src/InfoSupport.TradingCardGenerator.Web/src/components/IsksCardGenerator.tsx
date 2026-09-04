'use client';

import { useState, useEffect, useRef } from 'react';
import { useWebcam } from '@/hooks/useWebcam';
import { useFaceDetection } from '@/hooks/useFaceDetection';
import { TradingCardApi, blobToBase64, base64ToDataUrl } from '@/lib/api';
import { isksTheme } from '@/lib/theme-config';

import IsksActionButtons from './IsksActionButtons';
import Image from 'next/image';
import { CameraIcon } from '@heroicons/react/24/outline';
import { IMAGE_FORMAT, IMAGE_QUALITY } from '@/lib/constants';

// Standard playing card dimensions (63mm × 88mm) - portrait orientation
const CARD_DISPLAY_WIDTH = 420;
const CARD_DISPLAY_HEIGHT = 587;

export default function IsksCardGenerator() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCardImage, setGeneratedCardImage] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const cardDisplayRef = useRef<HTMLDivElement>(null);
  const [loadingMessage, setLoadingMessage] = useState(isksTheme.loadingMessages[0]);
  const [messageIndex, setMessageIndex] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);

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
  const multipleFacesDetected = faceCount > 1;

  // Start (or cancel) the 3-2-1 countdown as a single face comes in and out of view
  useEffect(() => {
    if (!readyToCapture || !singleFaceDetected) {
      setCountdown(null);
      return;
    }
    setCountdown((current) => (current === null ? 3 : current));
  }, [readyToCapture, singleFaceDetected]);

  // Tick the countdown down, then trigger the capture automatically
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
          const newIndex = (prevIndex + 1) % isksTheme.loadingMessages.length;
          setLoadingMessage(isksTheme.loadingMessages[newIndex]);
          return newIndex;
        });
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating]);

  useEffect(() => {
    startWebcam();
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
      console.error('Error generating ISKS card:', err);
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
      console.error('Error generating ISKS card from uploaded image:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNextEmployee = () => {
    setGeneratedCardImage(null);
    setCapturedPhoto(null);
  };

  const processPhoto = async (imageSource: Blob | File) => {
    const base64Photo = await blobToBase64(imageSource);
    setCapturedPhoto(base64ToDataUrl(base64Photo));

    const response = await TradingCardApi.generateIsksCard({ photo: base64Photo });
    setGeneratedCardImage(base64ToDataUrl(response.image));
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

          body > div:has(#isks-card-print-container) {
            display: block !important;
          }

          body * {
            visibility: hidden;
          }

          #isks-card-print-container,
          #isks-card-print-container * {
            visibility: visible;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          #isks-card-print-container {
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
          className="inline-block px-10 py-6"
          style={{
            background: '#d4d0c8',
            border: '2px solid',
            borderColor: '#f0f0f0 #808080 #808080 #f0f0f0',
            boxShadow: '4px 4px 0 rgba(0,0,0,0.25)',
          }}
        >
          <h1
            className="text-4xl sm:text-5xl tracking-widest"
            style={{
              fontFamily: "var(--font-bebas-neue), Arial, sans-serif",
              color: isksTheme.colors.primary,
            }}
          >
            {isksTheme.headerTitle}
          </h1>
          <p
            className="mt-2 text-xs sm:text-sm tracking-widest text-gray-700"
            style={{ fontFamily: "var(--font-geist-mono), 'Courier New', monospace" }}
          >
            {isksTheme.headerSubtitle}
          </p>
        </div>
        {error && (
          <div className="mt-4 p-3 bg-red-100 border-2 border-red-400 text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Card display */}
      <div className="flex justify-center my-6">
        <div
          id="isks-card-print-container"
          ref={cardDisplayRef}
          className="relative w-[420px] h-[587px] p-3.5 overflow-hidden"
          style={{
            background: '#d4d0c8',
            border: '3px solid',
            borderColor: '#f0f0f0 #808080 #808080 #f0f0f0',
            boxShadow: '6px 6px 0 rgba(0,0,0,0.3)',
          }}
        >
          <div className="relative w-full h-full overflow-hidden" style={{ border: '2px inset #808080' }}>
            {generatedCardImage ? (
              <Image
                src={generatedCardImage}
                alt="Generated ISKS Card"
                width={CARD_DISPLAY_WIDTH}
                height={CARD_DISPLAY_HEIGHT}
                className="w-full h-full object-cover"
              />
            ) : isGenerating && capturedPhoto ? (
              /* Loading state */
              <div className="relative w-full h-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element -- transient preview of an in-memory data URL */}
                <img
                  src={capturedPhoto}
                  alt="Captured Photo"
                  className="absolute top-0 left-0 w-full h-full object-cover opacity-40"
                  style={{ transform: 'scaleX(-1)' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl animate-pulse">📼</div>
                </div>
                <div className="absolute top-1/2 mt-8 left-1/2 -translate-x-1/2 w-full max-w-[320px] flex justify-center">
                  <div
                    className="text-sm px-4 py-2 text-center"
                    style={{
                      fontFamily: "var(--font-geist-mono), 'Courier New', monospace",
                      color: 'var(--theme-primary)',
                      background: '#d4d0c8',
                      border: '2px solid',
                      borderColor: '#f0f0f0 #808080 #808080 #f0f0f0',
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
                      background: 'radial-gradient(circle at 50% 35%, #4a72b8 0%, #1e3a8a 60%, #14265c 100%)',
                      color: '#e8e4d9',
                    }}
                  >
                    <div className="text-center">
                      <CameraIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2" />
                      <div
                        className="text-sm tracking-widest"
                        style={{ fontFamily: "var(--font-geist-mono), 'Courier New', monospace" }}
                      >
                        PLEASE STEP UP
                      </div>
                    </div>
                  </div>
                )}

                {/* Detection frame - one face is a valid employee, more than one is a policy violation */}
                {isStreaming && readyToCapture && (
                  <div
                    className={`absolute inset-0 pointer-events-none transition-all duration-300 ${singleFaceDetected || multipleFacesDetected ? 'animate-pulse' : ''}`}
                    style={{
                      boxShadow: multipleFacesDetected
                        ? 'inset 0 0 0 5px #dc2626, inset 0 0 30px rgba(220,38,38,0.55)'
                        : singleFaceDetected
                        ? 'inset 0 0 0 5px #1e3a8a, inset 0 0 30px rgba(30,58,138,0.5)'
                        : 'inset 0 0 0 2px rgba(30,58,138,0.3)',
                    }}
                  />
                )}

                {/* Face-detection hint */}
                {isStreaming && countdown === null && readyToCapture && (
                  <div className="absolute top-3 left-0 right-0 flex justify-center">
                    <div
                      className="px-3 py-1 text-[11px] sm:text-xs tracking-widest animate-pulse text-center"
                      style={{
                        fontFamily: "var(--font-geist-mono), 'Courier New', monospace",
                        background: multipleFacesDetected ? 'rgba(127,29,29,0.85)' : 'rgba(30,41,59,0.75)',
                        color: multipleFacesDetected ? '#fecaca' : '#e8e4d9',
                      }}
                    >
                      {multipleFacesDetected
                        ? 'ONE EMPLOYEE PER BADGE - NEXT IN LINE PLEASE'
                        : singleFaceDetected
                        ? 'HOLD STILL...'
                        : 'LOCATING EMPLOYEE...'}
                    </div>
                  </div>
                )}

                {/* Countdown overlay */}
                {isStreaming && countdown !== null && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: 'rgba(15,23,42,0.4)' }}
                  >
                    <div
                      key={countdown}
                      className="text-8xl sm:text-9xl"
                      style={{
                        fontFamily: "var(--font-bebas-neue), Arial, sans-serif",
                        color: '#e8e4d9',
                        textShadow: '0 4px 12px rgba(0,0,0,0.6)',
                      }}
                    >
                      {countdown === 0 ? '📸' : countdown}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <IsksActionButtons
        isStreaming={isStreaming}
        isCapturing={isCapturing}
        isGenerating={isGenerating}
        generatedCardImage={generatedCardImage}
        cardDisplayRef={cardDisplayRef}
        onCapturePhoto={handleCapturePhoto}
        onUploadPhoto={handleUploadPhoto}
        onNextEmployee={handleNextEmployee}
      />
    </div>
  );
}
