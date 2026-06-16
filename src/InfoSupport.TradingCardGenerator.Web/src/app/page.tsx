import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f0f0] to-[#e0e0e0] dark:from-[#1a1a1a] dark:to-[#0a0a0a] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <h1 
          className="text-4xl sm:text-6xl font-bold text-center mb-4 text-gray-800 dark:text-gray-200"
          style={{ fontFamily: "var(--font-bebas-neue), Arial, sans-serif" }}
        >
          Trading Card Generator
        </h1>
        <p className="text-center text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-12">
          Choose your adventure
        </p>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {/* Sports Card Theme */}
          <Link 
            href="/sports"
            className="group block p-8 rounded-2xl border-4 border-[#174a6f] hover:border-[#3b82f6] bg-white dark:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
          >
            <div className="text-6xl mb-4 text-center">🏀</div>
            <h2 
              className="text-3xl font-bold text-center mb-3 text-[#174a6f] group-hover:text-[#3b82f6]"
              style={{ fontFamily: "var(--font-bebas-neue), Arial, sans-serif" }}
            >
              Sports Cards
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300">
              Transform into a professional athlete with custom team logos and stats
            </p>
            <div className="mt-6 flex justify-center gap-2 text-2xl">
              🏈 ⚾ 🏒 ⚽
            </div>
          </Link>

          {/* Jurassic Card Theme */}
          <Link 
            href="/jurassic"
            className="group block p-8 rounded-2xl border-4 border-[#2d5016] hover:border-[#d4af37] bg-gradient-to-br from-[#3a2d1f] to-[#2d5016] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
          >
            <div className="text-6xl mb-4 text-center">🦖</div>
            <h2 
              className="text-3xl font-bold text-center mb-3 text-[#d4af37] group-hover:text-yellow-300"
              style={{ fontFamily: "var(--font-bebas-neue), Arial, sans-serif" }}
            >
              Jurassic Cards
            </h2>
            <p className="text-center text-gray-200">
              Journey back 65 million years and become a prehistoric legend
            </p>
            <div className="mt-6 flex justify-center gap-2 text-2xl">
              🦕 🌋 🌿 🦅
            </div>
          </Link>

          {/* Medieval Card Theme */}
          <Link
            href="/medieval"
            className="group block p-8 rounded-2xl border-4 border-[#7c2d12] hover:border-[#d4af37] bg-gradient-to-br from-[#1c0a00] to-[#7c2d12] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
          >
            <div className="text-6xl mb-4 text-center">⚔️</div>
            <h2
              className="text-3xl font-bold text-center mb-3 text-[#d4af37] group-hover:text-yellow-300"
              style={{ fontFamily: "var(--font-bebas-neue), Arial, sans-serif" }}
            >
              Medieval Cards
            </h2>
            <p className="text-center text-gray-200">
              Step into the Middle Ages and become a stained glass legend
            </p>
            <div className="mt-6 flex justify-center gap-2 text-2xl">
              🏰 🛡️ 🪨 🕯️
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
