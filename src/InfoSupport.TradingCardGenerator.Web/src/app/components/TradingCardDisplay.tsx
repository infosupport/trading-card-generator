import { RefObject } from 'react';
import Image from 'next/image';
import { TEAMS } from './constants';
import LoadingSpinner from './LoadingSpinner';

interface TradingCardDisplayProps {
  teamColor?: string;
  playerName: string;
  teamLogo?: string;
  generatedCardImage: string | null;
  isGenerating: boolean;
  capturedPhoto: string | null;
  loadingMessage: string;
  messageIndex: number;
  videoRef: RefObject<HTMLVideoElement | null>;
  isStreaming: boolean;
}

export default function TradingCardDisplay({
  teamColor,
  playerName,
  teamLogo,
  generatedCardImage,
  isGenerating,
  capturedPhoto,
  loadingMessage,
  messageIndex,
  videoRef,
  isStreaming
}: TradingCardDisplayProps) {
  return (
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
                <LoadingSpinner 
                  capturedPhoto={capturedPhoto}
                  loadingMessage={loadingMessage}
                  messageIndex={messageIndex}
                />
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
  );
}
