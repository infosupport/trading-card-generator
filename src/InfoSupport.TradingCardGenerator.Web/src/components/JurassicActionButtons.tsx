import { RefObject } from 'react';
import { toPng } from 'html-to-image';
import { ArrowDownTrayIcon, ArrowUpTrayIcon, PrinterIcon } from '@heroicons/react/16/solid';

interface JurassicActionButtonsProps {
  isStreaming: boolean;
  isCapturing: boolean;
  isGenerating: boolean;
  generatedCardImage: string | null;
  cardDisplayRef: RefObject<HTMLDivElement | null>;
  onCapturePhoto: () => void;
  onUploadPhoto: (file: File) => void;
}

export default function JurassicActionButtons({
  isStreaming,
  isCapturing,
  isGenerating,
  generatedCardImage,
  cardDisplayRef,
  onCapturePhoto,
  onUploadPhoto
}: JurassicActionButtonsProps) {

  const handlePrint = () => {
    if (!generatedCardImage) return;
    
    // Simply trigger the browser's print dialog
    // CSS @media print rules will handle showing only the card
    window.print();
  };

  const handleDownload = async () => {
    if (!generatedCardImage || !cardDisplayRef.current) return;

    try {
      const dataUrl = await toPng(cardDisplayRef.current, { quality: 1.0, pixelRatio: 2 });
      
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `jurassic-card-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('Error generating card image:', error);
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

  const buttonBaseStyle = {
    fontSize: '16px',
    fontWeight: 'bold' as const,
    fontFamily: "var(--font-bebas-neue), Arial, sans-serif",
    borderWidth: '3px',
  };

  const primaryButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: 'var(--theme-card-bg)',
    color: 'var(--theme-primary)',
    borderColor: 'var(--theme-primary)',
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
  };

  const secondaryButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: 'var(--theme-primary)',
    color: 'var(--theme-card-bg)',
    borderColor: 'var(--theme-primary)',
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-3 sm:mt-4 px-2">
        {!generatedCardImage ? (
          <>
            <button
              onClick={onCapturePhoto}
              disabled={!isStreaming || isCapturing || isGenerating}
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg transition-all duration-200 border-3 font-black text-base sm:text-lg tracking-wider hover:scale-105 disabled:bg-gray-400 disabled:text-gray-600 disabled:hover:scale-100 disabled:cursor-not-allowed w-full sm:w-auto"
              style={primaryButtonStyle}
            >
              {isGenerating 
                ? '⚡ GENERATING CARD...' 
                : isCapturing 
                  ? '📸 CAPTURING...' 
                  : '📷 CAPTURE PHOTO'
              }
            </button>

            <label className={"px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg transition-all duration-200 border-3 font-black text-base sm:text-lg tracking-wider hover:scale-105 cursor-pointer inline-block w-full sm:w-auto text-center"}
              style={secondaryButtonStyle}>
              <ArrowUpTrayIcon className="h-5 w-5 sm:h-6 sm:w-6 inline-block mr-2" />
              UPLOAD PHOTO
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
              onClick={() => window.location.reload()}
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg transition-all duration-200 border-3 font-black text-base sm:text-lg tracking-wider hover:scale-105 w-full sm:w-auto"
              style={primaryButtonStyle}
            >
              🎯 GENERATE NEW CARD
            </button>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center w-full sm:w-auto">
              <button
                onClick={handlePrint}
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg transition-all duration-200 border-3 font-black text-base sm:text-lg tracking-wider hover:scale-105 whitespace-nowrap w-full sm:w-[280px]"
                style={secondaryButtonStyle}
              >
                <PrinterIcon className="h-5 w-5 sm:h-6 sm:w-6 inline-block mr-2" />
                PRINT MY CARD
              </button>
              
              <button
                onClick={handleDownload}
                className="px-6 py-3 sm:py-4 rounded-xl shadow-lg transition-all duration-200 border-3 font-black text-base sm:text-lg tracking-wider hover:scale-105 whitespace-nowrap flex items-center justify-center w-full sm:w-auto sm:min-w-[80px]"
                style={secondaryButtonStyle}
              >
                <ArrowDownTrayIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
