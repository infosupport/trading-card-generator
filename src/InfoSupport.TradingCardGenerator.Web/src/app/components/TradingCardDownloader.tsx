'use client';

import { useRef, forwardRef, useImperativeHandle } from 'react';
import { TEAMS } from './constants';

interface TradingCardDownloaderProps {
  generatedCardImage: string | null;
  playerName: string;
  teamColor?: string;
  teamLogo?: string;
  onDownload: (dataUrl: string) => void;
}

export interface TradingCardDownloaderRef {
  generateCardImage: () => void;
}

const TradingCardDownloader = forwardRef<TradingCardDownloaderRef, TradingCardDownloaderProps>(({
  generatedCardImage,
  playerName,
  teamColor,
  teamLogo,
  onDownload
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateCardImage = async () => {
    if (!generatedCardImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Match TradingCardDisplay dimensions exactly but scaled up for print quality
    // Display: 375x575, Print: 750x1150 (2x scale)
    const CARD_WIDTH = 750;
    const CARD_HEIGHT = 1150;
    const dpr = devicePixelRatio;
    
    canvas.width = CARD_WIDTH * dpr;
    canvas.height = CARD_HEIGHT * dpr;
    canvas.style.width = `${CARD_WIDTH}px`;
    canvas.style.height = `${CARD_HEIGHT}px`;
    ctx.scale(dpr, dpr);

    // Fill background with team color (matches outer div)
    const backgroundColor = teamColor ? TEAMS[teamColor as keyof typeof TEAMS].color : '#174a6f';
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

    // Draw main card frame (matches the inner frame div)
    // Display: p-2 = 8px padding, frame height 400px
    // Print: 16px padding, frame height 800px
    const frameMargin = 16;
    const frameWidth = CARD_WIDTH - (frameMargin * 2);
    const frameHeight = 800;
    const frameColor = '#f1e4ce';
    
    // Rounded rectangle for card frame
    ctx.fillStyle = frameColor;
    ctx.beginPath();
    ctx.roundRect(frameMargin, frameMargin, frameWidth, frameHeight, 32);
    ctx.fill();

    // Draw the AI-generated image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        // Match TradingCardDisplay image dimensions exactly
        // Display: 340x340px with mt-2 (8px from top)
        // Print: 680x680px with 16px from frame top
        const imageSize = 680;
        const imageX = (CARD_WIDTH - imageSize) / 2;
        const imageY = frameMargin + 16; // 16px margin from frame top (matches mt-2 scaled)

        // Draw rounded image using modern Canvas API
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(imageX, imageY, imageSize, imageSize, 32);
        ctx.clip();
        ctx.drawImage(img, imageX, imageY, imageSize, imageSize);
        ctx.restore();

        resolve();
      };
      img.onerror = reject;
      img.src = generatedCardImage;
    });

    // Draw player name
    ctx.fillStyle = backgroundColor;
    ctx.font = 'bold 64px "Bebas Neue", Arial, sans-serif'; // Display uses 32px, so 64px for 2x scale
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Center text in the space between image bottom and frame bottom
    const imageSize = 680;
    const imageY = frameMargin + 16;
    const imageBottom = imageY + imageSize;
    const frameBottom = frameMargin + frameHeight;
    const availableTextSpace = frameBottom - imageBottom;
    const textY = imageBottom + (availableTextSpace / 2);
    ctx.fillText(playerName, CARD_WIDTH / 2, textY);

    // Draw team logo if available
    if (teamLogo) {
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      
      await new Promise<void>((resolve, reject) => {
        logoImg.onload = () => {
          // Match TradingCardDisplay logo dimensions exactly
          // Display: 100x100px, Print: 200x200px (2x scale)
          const logoSize = 200;
          const logoX = (CARD_WIDTH - logoSize) / 2;
          
          // Position logo in the remaining space below the frame
          // The logo should be centered in the bottom area (grow class behavior)
          const frameBottom = frameMargin + frameHeight;
          const availableHeight = CARD_HEIGHT - frameBottom - 16; // 16px bottom margin
          const logoY = frameBottom + (availableHeight - logoSize) / 2;

          // Draw circular background for logo (matches bg-[#f1e4ce])
          ctx.fillStyle = frameColor;
          ctx.beginPath();
          ctx.arc(logoX + logoSize/2, logoY + logoSize/2, logoSize/2, 0, 2 * Math.PI);
          ctx.fill();

          // Draw border (matches border-[#eee])
          ctx.strokeStyle = '#eee';
          ctx.lineWidth = 4; // matches border-2 scaled
          ctx.stroke();

          // Draw logo in circle (matches rounded-full and object-contain)
          ctx.save();
          ctx.beginPath();
          ctx.arc(logoX + logoSize/2, logoY + logoSize/2, logoSize/2 - 2, 0, 2 * Math.PI);
          ctx.clip();
          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
          ctx.restore();

          resolve();
        };
        logoImg.onerror = reject;
        logoImg.src = `/${teamLogo}`;
      });
    }

    // Convert canvas to data URL and trigger download
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    onDownload(dataUrl);
  };

  useImperativeHandle(ref, () => ({
    generateCardImage
  }));

  return (
    <div className="hidden">
      <canvas 
        ref={canvasRef}
        style={{ display: 'none' }}
      />
    </div>
  );
});

TradingCardDownloader.displayName = 'TradingCardDownloader';

export default TradingCardDownloader;
