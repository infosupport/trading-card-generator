import { RefObject } from 'react';
import { toPng } from 'html-to-image';
import { ArrowDownTrayIcon, ArrowUpTrayIcon, CameraIcon, PrinterIcon } from '@heroicons/react/16/solid';

interface MedievalActionButtonsProps {
  isStreaming: boolean;
  isCapturing: boolean;
  isGenerating: boolean;
  canCapture: boolean;
  generatedCardImage: string | null;
  cardDisplayRef: RefObject<HTMLDivElement | null>;
  onCapturePhoto: () => void;
  onUploadPhoto: (file: File) => void;
}

export default function MedievalActionButtons({
  isStreaming,
  isCapturing,
  isGenerating,
  canCapture,
  generatedCardImage,
  cardDisplayRef,
  onCapturePhoto,
  onUploadPhoto
}: MedievalActionButtonsProps) {

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
      a.download = `medieval-card-${Date.now()}.png`;
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
    event.target.value = '';
  };

  const buttonBaseStyle = {
    fontSize: '17px',
    fontWeight: 'normal' as const,
    fontFamily: "var(--font-metal-mania), 'Georgia', serif",
    letterSpacing: '0.03em',
    borderWidth: '2px',
    borderColor: 'var(--theme-border-active)',
  };

  const primaryButtonStyle = {
    ...buttonBaseStyle,
    background: 'linear-gradient(180deg, var(--theme-card-bg) 0%, #e4cfa0 100%)',
    color: 'var(--theme-primary)',
    boxShadow: '0 3px 0 rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.6)',
  };

  const secondaryButtonStyle = {
    ...buttonBaseStyle,
    background: 'linear-gradient(180deg, var(--theme-primary) 0%, #5a1d0c 100%)',
    color: 'var(--theme-card-bg)',
    boxShadow: '0 3px 0 rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-6 px-4">
      {/* Capture button */}
      <button
        onClick={onCapturePhoto}
        disabled={!canCapture || !isStreaming || isCapturing || isGenerating}
        className="flex items-center gap-2 px-7 py-3 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-[0_0_14px_rgba(212,175,55,0.6)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
        style={primaryButtonStyle}
      >
        <CameraIcon className="w-5 h-5" />
        {isGenerating ? 'Illuminating...' : 'Capture & Generate'}
      </button>

      {/* Upload button */}
      <label
        className={`flex items-center gap-2 px-7 py-3 rounded-full transition-all duration-200 cursor-pointer ${
          isGenerating || !canCapture ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-[0_0_14px_rgba(212,175,55,0.6)]'
        }`}
        style={primaryButtonStyle}
      >
        <ArrowUpTrayIcon className="w-5 h-5" />
        Upload Photo
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={isGenerating || !canCapture}
          className="hidden"
        />
      </label>

      {/* Download button */}
      {generatedCardImage && (
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-7 py-3 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-[0_0_14px_rgba(212,175,55,0.6)]"
          style={secondaryButtonStyle}
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
          Download Card
        </button>
      )}

      {/* Print button */}
      {generatedCardImage && (
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-7 py-3 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-[0_0_14px_rgba(212,175,55,0.6)]"
          style={secondaryButtonStyle}
        >
          <PrinterIcon className="w-5 h-5" />
          Print Card
        </button>
      )}
    </div>
  );
}
