import { TEAMS } from './constants';

interface TradingCardHeaderProps {
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  teamColor?: string;
  error?: string;
  isVipMode?: boolean;
}

export default function TradingCardHeader({ 
  firstName, 
  lastName, 
  onFirstNameChange, 
  onLastNameChange, 
  teamColor, 
  error,
  isVipMode = false
}: TradingCardHeaderProps) {
  return (
    <div className="text-base py-5">
      <h1 className="text-4xl font-black mb-2 text-gray-900 dark:text-gray-100 tracking-wider" style={{ fontFamily: "var(--font-bebas-neue), 'Arial Black', sans-serif" }}>
        🏆 TECHORAMA SPORTS EDITION 🏆
      </h1>
      <h2 className="text-xl font-bold mb-6 text-gray-700 dark:text-gray-300 tracking-wide" style={{ fontFamily: "var(--font-bebas-neue), Arial, sans-serif" }}>
        ULTIMATE TECH TRADING CARD CREATOR
      </h2>
      
      {isVipMode && (
        <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-full font-bold text-sm shadow-lg animate-pulse">
          <span>⭐</span>
          <span>VIP MODE ACTIVATED</span>
          <span>⭐</span>
        </div>
      )}
      <div className="flex justify-center gap-5 mb-5">
        <input
          type="text"
          value={firstName}
          onChange={(e) => onFirstNameChange(e.target.value)}
          placeholder="⚡ PLAYER FIRST NAME"
          className="text-lg px-4 py-3 border-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 font-bold tracking-wide transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          style={{ fontSize: '1.1em', fontFamily: "var(--font-bebas-neue), Arial, sans-serif", borderColor: teamColor ? TEAMS[teamColor as keyof typeof TEAMS].color : '#174a6f' }}
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => onLastNameChange(e.target.value)}
          placeholder="🚀 PLAYER LAST NAME"
          className="text-lg px-4 py-3 border-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 font-bold tracking-wide transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          style={{ fontSize: '1.1em', fontFamily: "var(--font-bebas-neue), Arial, sans-serif", borderColor: teamColor ? TEAMS[teamColor as keyof typeof TEAMS].color : '#174a6f' }}
        />
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-5 py-3 rounded max-w-md mx-auto mb-5 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
