import { RefObject, forwardRef } from 'react';
import Image from 'next/image';
import { TEAMS, SPECIAL_PROPERTIES } from './constants';
import LoadingSpinner from './LoadingSpinner';

interface TradingCardProps {
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
  specialProperty: keyof typeof SPECIAL_PROPERTIES;
}

const TradingCard = forwardRef<HTMLDivElement, TradingCardProps>(({
  teamColor,
  playerName,
  teamLogo,
  generatedCardImage,
  isGenerating,
  capturedPhoto,
  loadingMessage,
  messageIndex,
  videoRef,
  isStreaming,
  specialProperty
}, ref) => {
  return (
    <div
      ref={ref}
      className="w-[375px] h-[575px] shadow-[0_4px_24px_rgba(0,0,0,0.15)] transition-all duration-700 ease-in-out flex flex-col justify-between p-2 rounded-xl"
      style={{
        backgroundColor: teamColor ? TEAMS[teamColor as keyof typeof TEAMS].color : '#174a6f'
      }}
    >
      {/* Card Frame */}
      <div 
        className="relative bg-[#f1e4ce] rounded-2xl h-[400px]"
      >
        {/* Special Property Badge - Top Right Corner */}
        {specialProperty !== 'none' && (
          <div className="absolute top-4 right-4 z-10">
            <div className="w-12 h-12 rounded-full bg-white border-2 border-yellow-400 shadow-lg flex items-center justify-center">
              {SPECIAL_PROPERTIES[specialProperty].icon.endsWith('.png') ? (
                <Image
                  src={`/${SPECIAL_PROPERTIES[specialProperty].icon}`}
                  alt={SPECIAL_PROPERTIES[specialProperty].name}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              ) : (
                <div className="text-lg">
                  {SPECIAL_PROPERTIES[specialProperty].icon}
                </div>
              )}
            </div>
          </div>
        )}
        {/* Video Canvas Area */}
        <div className="flex justify-center">
          <div
            className="relative overflow-hidden w-[340px] h-[340px] rounded-2xl mt-2"
          >
            {generatedCardImage ? (
              /* Show generated card image */
              <Image
                src={generatedCardImage}
                alt="Generated Trading Card"
                width={340}
                height={340}
                className="object-cover w-[340px] h-[340px] rounded-2xl"
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
                  className={`scale-x-[-1] w-[340px] h-[340px] object-cover rounded-2xl ${isStreaming ? 'block' : 'hidden'}`}
                />
                
                {/* Placeholder when no camera */}
                {!isStreaming && (
                  <div 
                    className="bg-gray-300 flex items-center justify-center text-gray-600 absolute inset-0 w-[340px] h-[340px] rounded-2xl"
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
          className="text-center mt-2 text-[32px]"
          style={{
            color: teamColor ? TEAMS[teamColor as keyof typeof TEAMS].color : '#174a6f',
            fontFamily: "var(--font-bebas-neue), Arial, sans-serif"
          }}
        >
          {playerName}
        </div>
      </div>

      {/* Team Logo */}
      <div className="flex justify-center items-center mt-2 grow">
          {teamLogo ? (
            <Image
              src={`/${teamLogo}`}
              alt="Team Logo"
              width={100}
              height={100}
              className="object-contain rounded-full border-2 w-[100px] h-[100px] bg-[#f1e4ce] border-[#eee]"
            />
          ) : (
            <div
              className="rounded-full border-2 flex items-center justify-center w-[100px] h-[100px] bg-[#f1e4ce] border-[#eee]"
            >
              <div className="text-gray-400 text-xs">Loading...</div>
            </div>
          )}
      </div>
    </div>
  );
});

TradingCard.displayName = 'TradingCard';

export default TradingCard;