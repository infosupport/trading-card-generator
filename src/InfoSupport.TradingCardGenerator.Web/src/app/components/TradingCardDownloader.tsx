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

    // Set canvas to trading card dimensions with high DPI support
    const CARD_WIDTH = 750;
    const CARD_HEIGHT = 1050;
    const dpr = devicePixelRatio;
    
    canvas.width = CARD_WIDTH * dpr;
    canvas.height = CARD_HEIGHT * dpr;
    canvas.style.width = `${CARD_WIDTH}px`;
    canvas.style.height = `${CARD_HEIGHT}px`;
    ctx.scale(dpr, dpr);

    // Fill background with team color
    const backgroundColor = teamColor ? TEAMS[teamColor as keyof typeof TEAMS].color : '#174a6f';
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

    // Draw main card frame
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
        // Calculate dimensions for the image area
        const imageMargin = 32;
        const imageSize = 680;
        const imageX = (CARD_WIDTH - imageSize) / 2;
        const imageY = frameMargin + imageMargin;

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
    ctx.font = 'bold 64px "Bebas Neue", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const textY = frameMargin + 680 + 80;
    ctx.fillText(playerName, CARD_WIDTH / 2, textY);

    // Draw team logo if available
    if (teamLogo) {
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      
      await new Promise<void>((resolve, reject) => {
        logoImg.onload = () => {
          const logoSize = 200;
          const logoX = (CARD_WIDTH - logoSize) / 2;
          const logoY = 830;

          // Draw circular background for logo
          ctx.fillStyle = frameColor;
          ctx.beginPath();
          ctx.arc(logoX + logoSize/2, logoY + logoSize/2, logoSize/2 + 8, 0, 2 * Math.PI);
          ctx.fill();

          // Draw border
          ctx.strokeStyle = '#eee';
          ctx.lineWidth = 4;
          ctx.stroke();

          // Draw logo in circle
          ctx.save();
          ctx.beginPath();
          ctx.arc(logoX + logoSize/2, logoY + logoSize/2, logoSize/2, 0, 2 * Math.PI);
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
