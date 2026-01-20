import { RefObject } from 'react';
import { toPng } from 'html-to-image';
import { PDFDocument } from 'pdf-lib';
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

  const handlePrint = async () => {
    if (!generatedCardImage || !cardDisplayRef.current) return;

    try {
      // Wait for the component to fully render
      await new Promise(resolve => setTimeout(resolve, 100));

      // Ensure all images are loaded
      const images = cardDisplayRef.current.querySelectorAll('img');
      await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
      }));

      console.log('Converting Jurassic card to PNG...');
      
      // Generate the card as PNG
      const cardPngDataUrl = await toPng(cardDisplayRef.current, {
        quality: 1.0,
        pixelRatio: 2
      });

      // Convert data URL to array buffer
      const cardPngBytes = await fetch(cardPngDataUrl).then(res => res.arrayBuffer());

      // Create a new PDF document
      console.log('Creating PDF document for A6 printing...');
      const pdfDoc = await PDFDocument.create();

      // A6 size: 105mm × 148mm (portrait orientation)
      // PDF uses 72 points per inch: 105mm = 297.64pt, 148mm = 419.53pt
      const a6WidthPoints = 298;
      const a6HeightPoints = 420;

      // Add page with the card (one-sided)
      const page = pdfDoc.addPage([a6WidthPoints, a6HeightPoints]);
      const cardPngImage = await pdfDoc.embedPng(cardPngBytes);
      
      // Scale the image to fill the entire A6 page
      const cardDims = cardPngImage.scale(1);
      const scale = Math.min(
        a6WidthPoints / cardDims.width,
        a6HeightPoints / cardDims.height
      );
      
      const cardWidth = cardDims.width * scale;
      const cardHeight = cardDims.height * scale;
      
      page.drawImage(cardPngImage, {
        x: (a6WidthPoints - cardWidth) / 2,
        y: (a6HeightPoints - cardHeight) / 2,
        width: cardWidth,
        height: cardHeight,
      });

      // Save the PDF
      console.log('Generating final PDF...');
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      // Open in new window for printing
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
          
          // Close the window after printing dialog is closed
          printWindow.addEventListener('afterprint', () => {
            printWindow.close();
            URL.revokeObjectURL(url);
          });
          
          // Fallback: close after 5 seconds if afterprint doesn't fire
          setTimeout(() => {
            printWindow.close();
            URL.revokeObjectURL(url);
          }, 5000);
        };
      } else {
        // Clean up if window couldn't be opened
        URL.revokeObjectURL(url);
      }

    } catch (error) {
      console.error('Error generating PDF for printing:', error);
      alert('Failed to generate PDF. Please try again.');
    }
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
