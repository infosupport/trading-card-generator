import Image from 'next/image';

interface LoadingSpinnerProps {
  capturedPhoto: string;
  loadingMessage: string;
  messageIndex: number;
}

export default function LoadingSpinner({ capturedPhoto, loadingMessage, messageIndex }: LoadingSpinnerProps) {
  return (
    <>
      <Image
        src={capturedPhoto}
        alt="Captured Photo"
        width={340}
        height={340}
        className="object-cover absolute inset-0 opacity-30"
        style={{
          width: '340px',
          height: '340px',
          borderRadius: '16px',
          transform: 'scaleX(-1)'
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
        <div className="text-center text-white p-6 rounded-xl bg-black bg-opacity-40">
          {/* Enhanced Spinner */}
          <div className="relative mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-opacity-30 mx-auto"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-white border-r-transparent border-b-transparent border-l-transparent mx-auto absolute inset-0" style={{ animationDuration: '0.8s' }}></div>
            <div className="animate-ping absolute inset-0 h-16 w-16 rounded-full bg-white bg-opacity-20 mx-auto" style={{ animationDuration: '2s' }}></div>
          </div>
          {/* Rotating Message */}
          <div 
            className="text-lg font-bold tracking-wide transition-all duration-500 ease-in-out transform"
            style={{ 
              fontFamily: "'Bebas Neue', Arial, sans-serif",
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              minHeight: '28px'
            }}
            key={messageIndex} // Force re-render for animation
          >
            {loadingMessage}
          </div>
          <div className="text-sm mt-2 text-white text-opacity-80 font-medium">
            Creating your championship moment...
          </div>
        </div>
      </div>
    </>
  );
}
