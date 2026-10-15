'use client';

import { LeaderboardEntry } from '@/lib/types';

interface MedievalLeaderboardProps {
  entries: LeaderboardEntry[];
}

export default function MedievalLeaderboard({ entries }: MedievalLeaderboardProps) {
  return (
    <div className="p-2 sm:p-4">
      <h3
        className="text-xl sm:text-2xl mb-3 sm:mb-4 text-center tracking-wide"
        style={{ fontFamily: "var(--font-metal-mania), 'Georgia', serif", color: 'var(--theme-primary)' }}
      >
        Hall of Fame
      </h3>
      <div
        className="w-full max-w-95 mx-auto rounded-lg overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, var(--theme-card-bg) 0%, #e4cfa0 100%)',
          border: '2px solid var(--theme-border)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
        }}
      >
        {entries.length === 0 ? (
          <p
            className="text-sm sm:text-base italic text-center py-5 px-3"
            style={{ fontFamily: 'Georgia, serif', color: 'var(--theme-primary)' }}
          >
            No legends forged yet
          </p>
        ) : (
          <table className="w-full text-sm sm:text-base">
            <thead>
              <tr style={{ color: 'var(--theme-primary)' }}>
                <th className="py-2.5 px-2 text-left font-bold tracking-widest w-8">#</th>
                <th className="py-2.5 px-2 text-left font-bold tracking-widest">Name</th>
                <th className="py-2.5 px-1.5 text-center font-bold tracking-widest">STR</th>
                <th className="py-2.5 px-1.5 text-center font-bold tracking-widest">WIS</th>
                <th className="py-2.5 px-1.5 text-center font-bold tracking-widest">CHA</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr
                  key={`${entry.firstName}-${entry.lastName}-${index}`}
                  style={{ borderTop: '1px solid rgba(146,64,14,0.25)' }}
                >
                  <td className="py-2.5 px-2" style={{ color: 'var(--theme-primary)' }}>
                    {index + 1}
                  </td>
                  <td
                    className="py-2.5 px-2 truncate max-w-35"
                    style={{ fontFamily: "var(--font-metal-mania), 'Georgia', serif", color: 'var(--theme-primary)' }}
                  >
                    {`${entry.firstName} ${entry.lastName}`}
                  </td>
                  <td className="py-2.5 px-1.5 text-center" style={{ color: 'var(--theme-primary)' }}>
                    {entry.strength}
                  </td>
                  <td className="py-2.5 px-1.5 text-center" style={{ color: 'var(--theme-primary)' }}>
                    {entry.wisdom}
                  </td>
                  <td className="py-2.5 px-1.5 text-center" style={{ color: 'var(--theme-primary)' }}>
                    {entry.charisma}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
