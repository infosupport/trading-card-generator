import { RefObject } from 'react';
import { toPng } from 'html-to-image';
import { PDFDocument } from 'pdf-lib';
import { TEAMS } from './constants';
import { ArrowDownTrayIcon, ArrowUpTrayIcon, PrinterIcon } from '@heroicons/react/16/solid';

interface ActionButtonsProps {
  isStreaming: boolean;
  isCapturing: boolean;
  isGenerating: boolean;
  generatedCardImage: string | null;
  teamColor?: string;
  playerName: string;
  cardDisplayRef: RefObject<HTMLDivElement | null>;
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
  playerName,
  cardDisplayRef,
  onCapturePhoto,
  onUploadPhoto,
  onReset
}: ActionButtonsProps) {

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

      console.log('Converting card front to PNG...');
      
      // Generate the front of the card as PNG
      const frontPngDataUrl = await toPng(cardDisplayRef.current, {
        quality: 1.0,
        pixelRatio: 2
      });

      // Convert data URL to array buffer
      const frontPngBytes = await fetch(frontPngDataUrl).then(res => res.arrayBuffer());

      // Fetch the back PNG template
      console.log('Fetching card back template...');
      const backPngBytes = await fetch('/tradingcard-back.png').then(res => res.arrayBuffer());

      // Create a new PDF document
      console.log('Creating PDF document...');
      const pdfDoc = await PDFDocument.create();

      // CR80 standard card size: 2.125" × 3.375" (54mm × 85.6mm) - portrait orientation
      // At 300 DPI for print quality: 638 × 1013 points
      const cardWidthPoints = 638;
      const cardHeightPoints = 1013;

      // Add first page with the front of the card
      const frontPage = pdfDoc.addPage([cardWidthPoints, cardHeightPoints]);
      const frontPngImage = await pdfDoc.embedPng(frontPngBytes);
      
      // Scale the image to fill the entire page
      const frontDims = frontPngImage.scale(1);
      const frontScale = Math.min(
        cardWidthPoints / frontDims.width,
        cardHeightPoints / frontDims.height
      );
      
      const frontWidth = frontDims.width * frontScale;
      const frontHeight = frontDims.height * frontScale;
      
      frontPage.drawImage(frontPngImage, {
        x: (cardWidthPoints - frontWidth) / 2,
        y: (cardHeightPoints - frontHeight) / 2,
        width: frontWidth,
        height: frontHeight,
      });

      // Add second page with the back of the card
      console.log('Adding card back...');
      const backPage = pdfDoc.addPage([cardWidthPoints, cardHeightPoints]);
      const backPngImage = await pdfDoc.embedPng(backPngBytes);
      
      // Scale the back image to fill the entire page
      const backDims = backPngImage.scale(1);
      const backScale = Math.min(
        cardWidthPoints / backDims.width,
        cardHeightPoints / backDims.height
      );
      
      const backWidth = backDims.width * backScale;
      const backHeight = backDims.height * backScale;
      
      backPage.drawImage(backPngImage, {
        x: (cardWidthPoints - backWidth) / 2,
        y: (cardHeightPoints - backHeight) / 2,
        width: backWidth,
        height: backHeight,
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
        };
      }

      // Clean up the blob URL after a delay
      setTimeout(() => URL.revokeObjectURL(url), 10000);

    } catch (error) {
      console.error('Error generating PDF for printing:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleDownload = async () => {
    if (!generatedCardImage || !cardDisplayRef.current) return;

    try {
      // Wait a moment for the component to fully render
      await new Promise(resolve => setTimeout(resolve, 100));

      // Ensure all images are loaded before converting
      const images = cardDisplayRef.current.querySelectorAll('img');
      await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
      }));

      console.log('Converting card to image...');
      
      const dataUrl = await toPng(cardDisplayRef.current, {
        quality: 1.0,
        pixelRatio: 2
      });
      
      // Download the image
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `techorama-trading-card-${playerName.replace(/\s+/g, '-').toLowerCase()}.png`;
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
                ? '⚡ GENERATING CARD...' 
                : isCapturing 
                  ? '📸 CAPTURING...' 
                  : '📷 CAPTURE PHOTO'
              }
            </button>

            <label className={"px-8 py-4 rounded-xl shadow-lg transition-all duration-200 border-3 font-black text-lg tracking-wider hover:scale-105 cursor-pointer inline-block"}
              style={secondaryButtonStyle}>
              <ArrowUpTrayIcon className="h-6 w-6 inline-block mr-2" />
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
              onClick={onReset}
              className="px-8 py-4 rounded-xl shadow-lg transition-all duration-200 border-3 font-black text-lg tracking-wider hover:scale-105"
              style={primaryButtonStyle}
            >
              🎯 GENERATE NEW CARD
            </button>
            
            <div className="flex gap-4 items-center">
              <button
                onClick={handlePrint}
                className="px-8 py-4 rounded-xl shadow-lg transition-all duration-200 border-3 font-black text-lg tracking-wider hover:scale-105 whitespace-nowrap"
                style={{
                  ...secondaryButtonStyle,
                  width: '280px'
                }}
              >
                <PrinterIcon className="h-6 w-6 inline-block mr-2" />
                PRINT MY CARD
              </button>
              
              <button
                onClick={handleDownload}
                className="px-6 py-4 rounded-xl shadow-lg transition-all duration-200 border-3 font-black text-lg tracking-wider hover:scale-105 whitespace-nowrap flex items-center justify-center"
                style={{
                  ...secondaryButtonStyle,
                  minWidth: '80px'
                }}
              >
                <ArrowDownTrayIcon className="h-6 w-6" />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
