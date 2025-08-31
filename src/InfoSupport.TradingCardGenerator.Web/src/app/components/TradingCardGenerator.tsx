'use client';

import { useState, useEffect } from 'react';
import { useWebcam } from './useWebcam';
import Image from 'next/image';

const CARD_WIDTH = 750;
const CARD_HEIGHT = 1050;

export default function TradingCardGenerator() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);

  const {
    videoRef,
    isStreaming,
    error,
    startWebcam,
    capturePhoto
  } = useWebcam({
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    facingMode: 'user'
  });

  const playerName = (firstName.trim() + ' ' + lastName.trim()).trim().toUpperCase() || 'PLAYER NAME';

  // Auto-start webcam like in the original
  useEffect(() => {
    startWebcam();
  }, [startWebcam]);

  const handleCapturePhoto = async () => {
    setIsCapturing(true);
    try {
      const blob = await capturePhoto(CARD_WIDTH, CARD_HEIGHT);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `trading-card-${playerName.replace(/\s+/g, '-').toLowerCase()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Error capturing photo:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="text-base py-5">
        <h1 className="text-2xl font-bold mb-5">Trading Card Generator</h1>
        <div className="flex justify-center gap-5 mb-5">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            className="text-lg px-1 py-1 border border-gray-300 rounded"
            style={{ fontSize: '1.2em', margin: '0 10px', padding: '5px' }}
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            className="text-lg px-1 py-1 border border-gray-300 rounded"
            style={{ fontSize: '1.2em', margin: '0 10px', padding: '5px' }}
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-5 py-3 rounded max-w-md mx-auto mb-5 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Trading Card Preview */}
      <div className="flex justify-center">
        <div 
          className="shadow-[0_4px_24px_rgba(0,0,0,0.15)]"
          style={{
            width: '375px',
            height: '575px', // Increased height to accommodate button
            backgroundColor: '#174a6f'
          }}
        >
          {/* Card Frame */}
          <div 
            className="relative"
            style={{
              backgroundColor: '#f1e4ce',
              borderRadius: '16px',
              margin: '8px 8px 0px 8px',
              height: '400px'
            }}
          >
            {/* Video Canvas Area */}
            <div className="flex justify-center">
              <div
                className="relative overflow-hidden"
                style={{
                  width: '340px',
                  height: '340px',
                  borderRadius: '16px',
                  marginTop: '8px'
                }}
              >
                {/* Video Element */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ 
                    transform: 'scaleX(-1)', // Mirror for selfie experience
                    width: '340px',
                    height: '340px',
                    objectFit: 'cover',
                    borderRadius: '16px',
                    display: isStreaming ? 'block' : 'none'
                  }}
                />
                
                {/* Placeholder when no camera */}
                {!isStreaming && (
                  <div 
                    className="bg-gray-300 flex items-center justify-center text-gray-600 absolute inset-0"
                    style={{
                      width: '340px',
                      height: '340px',
                      borderRadius: '16px'
                    }}
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-2">📷</div>
                      <div className="text-base">Camera Preview</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Player Name */}
            <div 
              className="text-center"
              style={{
                fontFamily: "'Bebas Neue', Arial, sans-serif",
                marginTop: '8px',
                fontSize: '32px',
                color: '#174a6f'
              }}
            >
              {playerName}
            </div>
          </div>

          {/* Team Logo */}
          <div className="flex justify-center" style={{ marginTop: '8px' }}>
            <div className="relative">
              <Image
                src="/logo_01.png"
                alt="Team Logo"
                width={100}
                height={100}
                className="object-contain rounded-full border-2"
                style={{
                  width: '100px',
                  height: '100px',
                  backgroundColor: '#f1e4ce',
                  borderColor: '#eee'
                }}
              />
            </div>
          </div>

          {/* Generate Button - Now properly contained within card */}
          <div className="flex justify-center" style={{ marginTop: '12px' }}>
            <button
              onClick={handleCapturePhoto}
              disabled={!isStreaming || isCapturing}
              className="px-6 py-2 bg-[#f1e4ce] text-[#174a6f] rounded-lg hover:bg-[#e8d7b8] disabled:bg-gray-400 disabled:text-gray-600 text-sm font-bold shadow-md transition-colors border-2 border-[#174a6f]"
              style={{
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              {isCapturing ? 'GENERATING...' : 'GENERATE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
