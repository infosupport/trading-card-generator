interface LoadingDinosaurProps {
  capturedPhoto: string;
  loadingMessage: string;
  messageIndex: number;
}

export default function LoadingDinosaur({ capturedPhoto, loadingMessage, messageIndex }: LoadingDinosaurProps) {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <img
        src={capturedPhoto}
        alt="Captured Photo"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-40"
        style={{
          transform: 'scaleX(-1)'
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center -mt-32">
        {/* Dinosaur Sprite Animation */}
        <div className="bg-white/20 rounded-full w-28 h-28 flex items-center justify-center">
          <div 
            className="relative w-[42px] h-[62px]"
            style={{
              backgroundImage: 'url(/offline-sprite-1x.png)',
              backgroundPosition: '-678px -3px',
              backgroundSize: 'auto',
              animation: 'dinoRun 0.6s steps(1) infinite'
            }}
          />
        </div>
        <style jsx>{`
          @keyframes dinoRun {
            0% { background-position: -766px -3px; }
            50% { background-position: -810px -3px; }
          }
        `}</style>
      </div>
      {/* Message positioned separately at bottom */}
      <div className="absolute top-1/2 -mt-2 left-1/2 -translate-x-1/2 w-full max-w-[320px] flex justify-center">
        <div 
          className="text-lg font-bold tracking-wide px-6 py-2 rounded-lg text-amber-100 text-center whitespace-nowrap font-[family-name:var(--font-rye)] bg-white/20 -rotate-5"
          style={{ 
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}
          key={messageIndex}
        >
          {loadingMessage}
        </div>
      </div>
    </div>
  );
}
