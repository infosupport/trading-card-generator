import { RefObject } from 'react';
import { toPng } from 'html-to-image';
import { ArrowDownTrayIcon, ArrowPathIcon, ArrowUpTrayIcon, CameraIcon, PrinterIcon } from '@heroicons/react/16/solid';

interface Isks8BitActionButtonsProps {
  isStreaming: boolean;
  isCapturing: boolean;
  isGenerating: boolean;
  generatedCardImage: string | null;
  cardDisplayRef: RefObject<HTMLDivElement | null>;
  onCapturePhoto: () => void;
  onUploadPhoto: (file: File) => void;
  onReset: () => void;
}

export default function Isks8BitActionButtons({
  isStreaming,
  isCapturing,
  isGenerating,
  generatedCardImage,
  cardDisplayRef,
  onCapturePhoto,
  onUploadPhoto,
  onReset
}: Isks8BitActionButtonsProps) {

  const handlePrint = () => {
    if (!generatedCardImage) return;
    window.print();
  };

  const handleDownload = async () => {
    if (!generatedCardImage || !cardDisplayRef.current) return;

    try {
      const dataUrl = await toPng(cardDisplayRef.current, { quality: 1.0, pixelRatio: 2 });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `isks-8bit-postcard-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating postcard image:', error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onUploadPhoto(file);
    }
    event.target.value = '';
  };

  const buttonBaseStyle = {
    fontFamily: "var(--font-geist-mono), 'Courier New', monospace",
    fontSize: '14px',
    letterSpacing: '0.05em',
    borderRadius: '4px',
    borderWidth: '2px',
    boxShadow: '3px 3px 0 rgba(0,0,0,0.25)',
  };

  const primaryButtonStyle = {
    ...buttonBaseStyle,
    background: '#ea580c',
    borderColor: '#c2410c',
    color: '#ffffff',
  };

  const secondaryButtonStyle = {
    ...buttonBaseStyle,
    background: '#7c2d12',
    borderColor: '#431407',
    color: '#fed7aa',
  };

  const neutralButtonStyle = {
    ...buttonBaseStyle,
    background: '#fef3c7',
    borderColor: '#d97706',
    color: '#78350f',
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-6 px-4">
      {generatedCardImage ? (
        <>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-6 py-3 font-bold transition-all duration-150 hover:brightness-110 active:translate-y-0.5"
            style={neutralButtonStyle}
          >
            <ArrowPathIcon className="w-4 h-4" />
            NEW SOUVENIR
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 font-bold transition-all duration-150 hover:brightness-110 active:translate-y-0.5"
            style={primaryButtonStyle}
          >
            <PrinterIcon className="w-4 h-4" />
            PRINT POSTCARD
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 font-bold transition-all duration-150 hover:brightness-110 active:translate-y-0.5"
            style={secondaryButtonStyle}
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            SAVE IMAGE
          </button>
        </>
      ) : (
        <>
          <button
            onClick={onCapturePhoto}
            disabled={!isStreaming || isCapturing || isGenerating}
            className="flex items-center gap-2 px-6 py-3 font-bold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 active:translate-y-0.5"
            style={primaryButtonStyle}
          >
            <CameraIcon className="w-4 h-4" />
            {isGenerating ? 'PIXELATING...' : isCapturing ? 'CAPTURING...' : 'TAKE 8-BIT PHOTO'}
          </button>

          <label
            className="flex items-center gap-2 px-6 py-3 font-bold transition-all duration-150 cursor-pointer hover:brightness-110 active:translate-y-0.5"
            style={secondaryButtonStyle}
          >
            <ArrowUpTrayIcon className="w-4 h-4" />
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
      )}
    </div>
  );
}
