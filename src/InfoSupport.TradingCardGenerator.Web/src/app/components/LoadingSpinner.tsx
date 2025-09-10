interface LoadingSpinnerProps {
  capturedPhoto: string;
  loadingMessage: string;
  messageIndex: number;
}

export default function LoadingSpinner({ capturedPhoto, loadingMessage, messageIndex }: LoadingSpinnerProps) {
  return (
    <div className="relative w-[340px] h-[340px] rounded-2xl overflow-hidden">
      <img
        src={capturedPhoto}
        alt="Captured Photo"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-40"
        style={{
          transform: 'scaleX(-1)'
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white p-4">
          {/* Enhanced Spinner */}
          <div className="relative mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-opacity-30 mx-auto"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-white border-r-transparent border-b-transparent border-l-transparent mx-auto absolute inset-0" style={{ animationDuration: '0.8s' }}></div>
            <div className="animate-ping absolute inset-0 h-16 w-16 rounded-full bg-white bg-opacity-20 mx-auto" style={{ animationDuration: '2s' }}></div>
          </div>
          {/* Rotating Message */}
          <div 
            className="text-lg font-bold tracking-wide bg-black bg-opacity-60 px-4 py-2 rounded-lg"
            style={{ 
              fontFamily: "'Bebas Neue', Arial, sans-serif",
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}
            key={messageIndex}
          >
            {loadingMessage}
          </div>
          <div className="text-sm mt-2 text-white bg-black bg-opacity-60 px-3 py-1 rounded">
            Creating your championship moment...
          </div>
        </div>
      </div>
    </div>
  );
}
