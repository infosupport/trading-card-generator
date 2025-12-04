import { RefObject, forwardRef } from 'react';
import { SPECIAL_PROPERTIES } from './constants';
import SpecialPropertySelector from './SpecialPropertySelector';
import SportSelector from './SportSelector';
import TradingCard from './TradingCard';
import TeamSelector from './TeamSelector';

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
  onLogoSelect?: (logoPath: string) => void;
  specialProperty: keyof typeof SPECIAL_PROPERTIES;
  onSpecialPropertySelect: (propertyId: keyof typeof SPECIAL_PROPERTIES) => void;
  selectedSport?: string;
  onSportSelect: (sport: string) => void;
  isVipMode?: boolean;
}

const TradingCardDisplay = forwardRef<HTMLDivElement, TradingCardDisplayProps>(({
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
  onLogoSelect,
  specialProperty,
  onSpecialPropertySelect,
  selectedSport,
  onSportSelect,
  isVipMode = false
}, ref) => {
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[1fr_375px_1fr] gap-4 lg:gap-0 justify-center items-start lg:items-center">
      <div className='flex flex-col w-full lg:w-auto'>
        {isVipMode && (
          <>
            <SportSelector
              selectedSport={selectedSport}
              onSportSelect={onSportSelect}
            />
            <SpecialPropertySelector
              selectedProperty={specialProperty}
              onPropertySelect={onSpecialPropertySelect}
            />
          </>
        )}
      </div>

      <div className="flex justify-center w-full lg:w-auto">
        <TradingCard
          ref={ref}
          teamColor={teamColor}
          playerName={playerName}
          teamLogo={teamLogo}
          generatedCardImage={generatedCardImage}
          isGenerating={isGenerating}
          capturedPhoto={capturedPhoto}
          loadingMessage={loadingMessage}
          messageIndex={messageIndex}
          videoRef={videoRef}
          isStreaming={isStreaming}
          specialProperty={specialProperty}
        />
      </div>

      <div className='flex flex-col w-full lg:w-auto'>
        {isVipMode && (
          <TeamSelector
            teamLogo={teamLogo}
            onLogoSelect={onLogoSelect}
          />
        )}
      </div>
    </div>
  );
});

TradingCardDisplay.displayName = 'TradingCardDisplay';

export default TradingCardDisplay;
