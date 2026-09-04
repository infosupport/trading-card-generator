import { RefObject } from 'react';
import { toPng } from 'html-to-image';
import { ArrowDownTrayIcon, ArrowPathIcon, ArrowUpTrayIcon, CameraIcon, PrinterIcon } from '@heroicons/react/16/solid';

interface IsksActionButtonsProps {
  isStreaming: boolean;
  isCapturing: boolean;
  isGenerating: boolean;
  generatedCardImage: string | null;
  cardDisplayRef: RefObject<HTMLDivElement | null>;
  onCapturePhoto: () => void;
  onUploadPhoto: (file: File) => void;
  onNextEmployee: () => void;
}

export default function IsksActionButtons({
  isStreaming,
  isCapturing,
  isGenerating,
  generatedCardImage,
  cardDisplayRef,
  onCapturePhoto,
  onUploadPhoto,
  onNextEmployee
}: IsksActionButtonsProps) {

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
      a.download = `isks-card-${Date.now()}.png`;
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

  // Chunky beveled edges, the way every button looked before gradients were invented
  const buttonBaseStyle = {
    fontFamily: "var(--font-geist-mono), 'Courier New', monospace",
    fontSize: '14px',
    letterSpacing: '0.05em',
    borderRadius: 0,
    borderWidth: '2px',
    borderStyle: 'outset' as const,
  };

  const primaryButtonStyle = {
    ...buttonBaseStyle,
    background: '#d4d0c8',
    borderColor: '#f0f0f0 #808080 #808080 #f0f0f0',
    color: '#1e3a8a',
  };

  const secondaryButtonStyle = {
    ...buttonBaseStyle,
    background: '#1e3a8a',
    borderColor: '#4f6fc0 #0d1f52 #0d1f52 #4f6fc0',
    color: '#e8e4d9',
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-6 px-4">
      {generatedCardImage ? (
        <button
          onClick={onNextEmployee}
          className="flex items-center gap-2 px-6 py-2.5 transition-all duration-150 active:border-inset"
          style={primaryButtonStyle}
        >
          <ArrowPathIcon className="w-4 h-4" />
          NEXT EMPLOYEE
        </button>
      ) : (
        <>
          <button
            onClick={onCapturePhoto}
            disabled={!isStreaming || isCapturing || isGenerating}
            className="flex items-center gap-2 px-6 py-2.5 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            style={primaryButtonStyle}
          >
            <CameraIcon className="w-4 h-4" />
            {isGenerating ? 'DEVELOPING...' : 'TAKE PHOTO'}
          </button>

          <label
            className={`flex items-center gap-2 px-6 py-2.5 transition-all duration-150 ${
              isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
            style={primaryButtonStyle}
          >
            <ArrowUpTrayIcon className="w-4 h-4" />
            UPLOAD PHOTO
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isGenerating}
              className="hidden"
            />
          </label>
        </>
      )}

      {generatedCardImage && (
        <>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-2.5 transition-all duration-150"
            style={secondaryButtonStyle}
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            SAVE TO DISK
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2.5 transition-all duration-150"
            style={secondaryButtonStyle}
          >
            <PrinterIcon className="w-4 h-4" />
            PRINT CARD
          </button>
        </>
      )}
    </div>
  );
}
