import { RefObject } from 'react';
import { toPng } from 'html-to-image';
import { ArrowDownTrayIcon, ArrowUpTrayIcon, PrinterIcon } from '@heroicons/react/16/solid';

interface MedievalActionButtonsProps {
  isStreaming: boolean;
  isCapturing: boolean;
  isGenerating: boolean;
  generatedCardImage: string | null;
  cardDisplayRef: RefObject<HTMLDivElement | null>;
  onCapturePhoto: () => void;
  onUploadPhoto: (file: File) => void;
}

export default function MedievalActionButtons({
  isStreaming,
  isCapturing,
  isGenerating,
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
  };

  const secondaryButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: 'var(--theme-primary)',
    color: 'var(--theme-card-bg)',
    borderColor: 'var(--theme-primary)',
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-6 px-4">
      {/* Capture button */}
      <button
        onClick={onCapturePhoto}
        disabled={!isStreaming || isCapturing || isGenerating}
        className="flex items-center gap-2 px-6 py-3 rounded-lg border-4 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        style={primaryButtonStyle}
      >
        📷 {isGenerating ? 'Illuminating...' : 'Capture & Generate'}
      </button>

      {/* Upload button */}
      <label
        className={`flex items-center gap-2 px-6 py-3 rounded-lg border-4 transition-all duration-200 cursor-pointer ${
          isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
        }`}
        style={primaryButtonStyle}
      >
        <ArrowUpTrayIcon className="w-5 h-5" />
        Upload Photo
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={isGenerating}
          className="hidden"
        />
      </label>

      {/* Download button */}
      {generatedCardImage && (
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 rounded-lg border-4 transition-all duration-200 hover:scale-105"
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
          className="flex items-center gap-2 px-6 py-3 rounded-lg border-4 transition-all duration-200 hover:scale-105"
          style={secondaryButtonStyle}
        >
          <PrinterIcon className="w-5 h-5" />
          Print Card
        </button>
      )}
    </div>
  );
}
