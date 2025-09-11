import { useRef } from 'react';
import { TEAMS } from './constants';
import TradingCardDownloader, { TradingCardDownloaderRef } from './TradingCardDownloader';

interface ActionButtonsProps {
  isStreaming: boolean;
  isCapturing: boolean;
  isGenerating: boolean;
  generatedCardImage: string | null;
  teamColor?: string;
  teamLogo?: string;
  playerName: string;
  onCapturePhoto: () => void;
  onUploadPhoto: (file: File) => void;
  onReset: () => void;
}

export default function ActionButtons({
  isStreaming,
  isCapturing,
  isGenerating,
  generatedCardImage,
  teamColor,
  teamLogo,
  playerName,
  onCapturePhoto,
  onUploadPhoto,
  onReset
}: ActionButtonsProps) {
  const downloaderRef = useRef<TradingCardDownloaderRef>(null);

  const handleDownload = () => {
    if (generatedCardImage && downloaderRef.current) {
      downloaderRef.current.generateCardImage();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onUploadPhoto(file);
    }
    // Reset the input value so the same file can be selected again
    event.target.value = '';
  };

  const handleCardDownload = (dataUrl: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `techorama-trading-card-${playerName.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const buttonBaseStyle = {
    fontSize: '16px',
    fontWeight: 'bold' as const,
    fontFamily: "'Bebas Neue', Arial, sans-serif",
    borderWidth: '3px',
  };

  const primaryButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: '#f1e4ce',
    color: teamColor ? TEAMS[teamColor as keyof typeof TEAMS].color : '#174a6f',
    borderColor: teamColor ? TEAMS[teamColor as keyof typeof TEAMS].color : '#174a6f',
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
  };

  const secondaryButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: teamColor ? TEAMS[teamColor as keyof typeof TEAMS].color : '#174a6f',
    color: '#f1e4ce',
    borderColor: teamColor ? TEAMS[teamColor as keyof typeof TEAMS].color : '#174a6f',
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
  };

  return (
    <>
      <div className="flex justify-center gap-4 mt-8">
        {!generatedCardImage ? (
          <>
            <button
              onClick={onCapturePhoto}
              disabled={!isStreaming || isCapturing || isGenerating}
              className="px-8 py-4 rounded-xl shadow-lg transition-all duration-200 border-3 font-black text-lg tracking-wider hover:scale-105 disabled:bg-gray-400 disabled:text-gray-600 disabled:hover:scale-100 disabled:cursor-not-allowed"
              style={primaryButtonStyle}
            >
              {isGenerating 
                ? '⚡ GENERATING MAGIC...' 
                : isCapturing 
                  ? '📸 CAPTURING...' 
                  : '📷 CAPTURE PHOTO'
              }
            </button>
            
            <label className="px-8 py-4 rounded-xl shadow-lg transition-all duration-200 border-3 font-black text-lg tracking-wider hover:scale-105 cursor-pointer inline-block"
              style={secondaryButtonStyle}>
              �️ UPLOAD PHOTO
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isGenerating || isCapturing}
                className="hidden"
              />
            </label>
          </>
        ) : (
          <>
            <button
              onClick={onReset}
              className="px-8 py-4 rounded-xl shadow-lg transition-all duration-200 border-3 font-black text-lg tracking-wider hover:scale-105"
              style={primaryButtonStyle}
            >
              🎯 GENERATE NEW CARD
            </button>
            
            <button
              onClick={handleDownload}
              className="px-8 py-4 rounded-xl shadow-lg transition-all duration-200 border-3 font-black text-lg tracking-wider hover:scale-105"
              style={secondaryButtonStyle}
            >
              🏆 DOWNLOAD MY CARD
            </button>
          </>
        )}
      </div>

      {/* Hidden downloader component */}
      <TradingCardDownloader
        ref={downloaderRef}
        generatedCardImage={generatedCardImage}
        playerName={playerName}
        teamColor={teamColor}
        teamLogo={teamLogo}
        onDownload={handleCardDownload}
      />
    </>
  );
}
