import { RefObject, forwardRef } from 'react';
import Image from 'next/image';
import { TEAMS, SPECIAL_PROPERTIES } from '@/lib/constants';
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
      className="w-[320px] h-[509px] sm:w-[375px] sm:h-[597px] shadow-[0_4px_24px_rgba(0,0,0,0.15)] transition-all duration-700 ease-in-out flex flex-col justify-between p-1.5 sm:p-2 rounded-xl mx-auto bg-theme-primary"
    >
      {/* Card Frame */}
      <div className="relative bg-theme-card-bg rounded-2xl h-[358px] sm:h-[420px]">
        {/* Special Property Badge - Top Right Corner */}
        {specialProperty !== 'none' && (
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-yellow-400 shadow-lg flex items-center justify-center">
              {SPECIAL_PROPERTIES[specialProperty].icon.endsWith('.png') ? (
                <Image
                  src={`/${SPECIAL_PROPERTIES[specialProperty].icon}`}
                  alt={SPECIAL_PROPERTIES[specialProperty].name}
                  width={28}
                  height={28}
                  className="object-contain sm:w-8 sm:h-8"
                />
              ) : (
                <div className="text-base sm:text-lg">
                  {SPECIAL_PROPERTIES[specialProperty].icon}
                </div>
              )}
            </div>
          </div>
        )}
        {/* Video Canvas Area */}
        <div className="flex justify-center">
          <div
            className="relative overflow-hidden w-[290px] h-[307px] sm:w-[340px] sm:h-[360px] rounded-2xl mt-1.5 sm:mt-2"
          >
            {generatedCardImage ? (
              /* Show generated card image */
              <Image
                src={generatedCardImage}
                alt="Generated Trading Card"
                width={340}
                height={360}
                className="object-cover w-[290px] h-[307px] sm:w-[340px] sm:h-[360px] rounded-2xl"
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
                  className={`scale-x-[-1] w-[290px] h-[307px] sm:w-[340px] sm:h-[360px] object-cover rounded-2xl ${isStreaming ? 'block' : 'hidden'}`}
                />
                
                {/* Placeholder when no camera */}
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

      {/* Team Logo */}
      <div className="flex justify-center items-center mt-1.5 sm:mt-2 grow">
          {teamLogo ? (
            <Image
              src={`/${teamLogo}`}
              alt="Team Logo"
              width={110}
              height={110}
              className="object-contain rounded-full border-2 bg-theme-card-bg border-theme-border sm:w-[130px] sm:h-[130px]"
            />
          ) : (
            <div className="rounded-full border-2 flex items-center justify-center w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] bg-theme-card-bg border-theme-border">
              <div className="text-gray-400 text-xs">Loading...</div>
            </div>
          )}
      </div>
    </div>
  );
});

TradingCard.displayName = 'TradingCard';

export default TradingCard;