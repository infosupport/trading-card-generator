'use client';

interface MedievalCardBackProps {
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onRollFate: () => void;
  isRolling: boolean;
  canRoll: boolean;
}

export default function MedievalCardBack({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  onRollFate,
  isRolling,
  canRoll,
}: MedievalCardBackProps) {
  const inputStyle = {
    fontFamily: "var(--font-metal-mania), 'Georgia', serif",
    background: 'linear-gradient(180deg, var(--theme-card-bg) 0%, #e4cfa0 100%)',
    color: 'var(--theme-primary)',
    border: '2px solid var(--theme-border-active)',
  };

  return (
    <div
      className="w-[420px] h-[587px] p-6 sm:p-8 rounded-2xl mx-auto flex flex-col items-center justify-center gap-4 sm:gap-5 text-center"
      style={{
        background: 'linear-gradient(135deg, #5a3d24 0%, #2b1c10 100%)',
        border: '3px solid var(--theme-border-active)',
        boxShadow: '0 14px 32px rgba(0,0,0,0.5)',
      }}
    >
      <div className="text-5xl sm:text-6xl" style={{ color: 'var(--theme-border-active)' }}>
        🛡️
      </div>
      <h2
        className="text-2xl sm:text-3xl tracking-wide"
        style={{ fontFamily: "var(--font-metal-mania), 'Georgia', serif", color: 'var(--theme-border-active)' }}
      >
        Forge Thy Legend
      </h2>

      <div className="flex flex-col gap-2 w-full max-w-[260px]">
        <input
          value={firstName}
          onChange={(e) => onFirstNameChange(e.target.value)}
          placeholder="First Name"
          maxLength={20}
          className="px-3 py-2 rounded-lg text-center outline-none"
          style={inputStyle}
        />
        <input
          value={lastName}
          onChange={(e) => onLastNameChange(e.target.value)}
          placeholder="Last Name"
          maxLength={20}
          className="px-3 py-2 rounded-lg text-center outline-none"
          style={inputStyle}
        />
      </div>

      <button
        onClick={onRollFate}
        disabled={!canRoll || isRolling}
        className="flex items-center justify-center gap-2 px-6 py-3 rounded-full transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        style={{
          fontFamily: "var(--font-metal-mania), 'Georgia', serif",
          background: 'linear-gradient(180deg, var(--theme-primary) 0%, #5a1d0c 100%)',
          color: 'var(--theme-card-bg)',
          border: '2px solid var(--theme-border-active)',
          boxShadow: '0 3px 0 rgba(0,0,0,0.4)',
        }}
      >
        <span className={isRolling ? 'inline-block animate-spin' : 'inline-block'}>🎲</span>
        Roll for Fate
      </button>

      <p className="text-xs sm:text-sm italic" style={{ fontFamily: 'Georgia, serif', color: '#e8d9b8' }}>
        Enter thy name to seal thy fate
      </p>
    </div>
  );
}
