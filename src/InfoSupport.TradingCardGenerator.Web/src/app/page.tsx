import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f0f0] to-[#e0e0e0] dark:from-[#1a1a1a] dark:to-[#0a0a0a] flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <h1 
          className="text-4xl sm:text-6xl font-bold text-center mb-4 text-gray-800 dark:text-gray-200"
          style={{ fontFamily: "var(--font-bebas-neue), Arial, sans-serif" }}
        >
          Trading Card Generator
        </h1>
        <p className="text-center text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-12">
          Choose your adventure
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {/* Sports Card Theme */}
          <Link 
            href="/sports"
            className="group block p-6 sm:p-8 rounded-2xl border-4 border-[#174a6f] hover:border-[#3b82f6] bg-white dark:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="text-5xl sm:text-6xl mb-4 text-center">🏀</div>
              <h2 
                className="text-2xl sm:text-3xl font-bold text-center mb-3 text-[#174a6f] group-hover:text-[#3b82f6]"
                style={{ fontFamily: "var(--font-bebas-neue), Arial, sans-serif" }}
              >
                Sports Cards
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                Transform into a professional athlete with custom team logos and stats
              </p>
            </div>
            <div className="mt-6 flex justify-center gap-2 text-xl sm:text-2xl">
              🏈 ⚾ 🏒 ⚽
            </div>
          </Link>

          {/* Jurassic Card Theme */}
          <Link 
            href="/jurassic"
            className="group block p-6 sm:p-8 rounded-2xl border-4 border-[#2d5016] hover:border-[#d4af37] bg-gradient-to-br from-[#3a2d1f] to-[#2d5016] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="text-5xl sm:text-6xl mb-4 text-center">🦖</div>
              <h2 
                className="text-2xl sm:text-3xl font-bold text-center mb-3 text-[#d4af37] group-hover:text-yellow-300"
                style={{ fontFamily: "var(--font-bebas-neue), Arial, sans-serif" }}
              >
                Jurassic Cards
              </h2>
              <p className="text-center text-gray-200 text-sm sm:text-base">
                Journey back 65 million years and become a prehistoric legend
              </p>
            </div>
            <div className="mt-6 flex justify-center gap-2 text-xl sm:text-2xl">
              🦕 🌋 🌿 🦅
            </div>
          </Link>

          {/* Medieval Card Theme */}
          <Link
            href="/medieval"
            className="group block p-6 sm:p-8 rounded-2xl border-4 border-[#7c2d12] hover:border-[#d4af37] bg-gradient-to-br from-[#1c0a00] to-[#7c2d12] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="text-5xl sm:text-6xl mb-4 text-center">⚔️</div>
              <h2
                className="text-2xl sm:text-3xl font-bold text-center mb-3 text-[#d4af37] group-hover:text-yellow-300"
                style={{ fontFamily: "var(--font-bebas-neue), Arial, sans-serif" }}
              >
                Medieval Cards
              </h2>
              <p className="text-center text-gray-200 text-sm sm:text-base">
                Step into the Middle Ages and become a stained glass legend
              </p>
            </div>
            <div className="mt-6 flex justify-center gap-2 text-xl sm:text-2xl">
              🏰 🛡️ 🪨 🕯️
            </div>
          </Link>

          {/* ISKS 2026 Theme */}
          <Link
            href="/isks"
            className="group block p-6 sm:p-8 rounded-2xl border-4 border-[#1e3a8a] hover:border-[#c0c0c0] bg-gradient-to-br from-[#3f4a5a] to-[#1e3a8a] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="text-5xl sm:text-6xl mb-4 text-center">🖨️</div>
              <h2
                className="text-2xl sm:text-3xl font-bold text-center mb-3 text-[#e8e4d9] group-hover:text-white"
                style={{ fontFamily: "var(--font-bebas-neue), Arial, sans-serif" }}
              >
                ISKS 2026
              </h2>
              <p className="text-center text-gray-200 text-sm sm:text-base">
                Party like it's 1990
              </p>
            </div>
            <div className="mt-6 flex justify-center gap-2 text-xl sm:text-2xl">
              💾 📠 ☎️ 📼
            </div>
          </Link>

          {/* ISKS 2026 8-Bit Postcard */}
          <Link
            href="/isks-8bit"
            className="group block p-6 sm:p-8 rounded-2xl border-4 border-[#9a3412] hover:border-[#fbbf24] bg-gradient-to-br from-[#431407] via-[#7c2d12] to-[#c2410c] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="text-5xl sm:text-6xl mb-4 text-center">🕹️</div>
              <h2
                className="text-2xl sm:text-3xl font-bold text-center mb-3 text-[#fed7aa] group-hover:text-yellow-200"
                style={{ fontFamily: "var(--font-bebas-neue), Arial, sans-serif" }}
              >
                ISKS 2026
              </h2>
              <p className="text-center text-amber-100 text-sm sm:text-base">
                Pixels, anyone?
              </p>
            </div>
            <div className="mt-6 flex justify-center gap-2 text-xl sm:text-2xl">
              👾 🎪 ⛺ ☀️
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
