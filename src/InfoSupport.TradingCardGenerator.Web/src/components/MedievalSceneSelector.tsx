'use client';

import { medievalTheme } from '@/lib/theme-config';

interface MedievalSceneSelectorProps {
  selectedScene?: string;
  onSceneSelect: (sceneId: string) => void;
  scenes: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
  }>;
}

export default function MedievalSceneSelector({
  selectedScene,
  onSceneSelect,
  scenes
}: MedievalSceneSelectorProps) {
  return (
    <div className="p-2 sm:p-4">
      <h3
        className="text-lg sm:text-xl mb-3 sm:mb-4 text-center tracking-wide"
        style={{ fontFamily: "var(--font-metal-mania), 'Georgia', serif", color: 'var(--theme-primary)' }}
      >
        {medievalTheme.sceneSelectorLabel}
      </h3>
      <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full max-w-[320px] mx-auto">
        {scenes.map((scene) => {
          const isSelected = selectedScene === scene.id;
          return (
            <button
              key={scene.id}
              onClick={() => onSceneSelect(scene.id)}
              className={`p-2 rounded-lg border-2 transition-all duration-200 hover:scale-105 text-left ${
                isSelected ? 'shadow-[0_0_14px_rgba(212,175,55,0.6)]' : 'hover:shadow-[0_0_10px_rgba(212,175,55,0.35)]'
              }`}
              style={{
                background: 'linear-gradient(180deg, var(--theme-card-bg) 0%, #e4cfa0 100%)',
                borderColor: isSelected ? 'var(--theme-border-active)' : 'var(--theme-border)',
                boxShadow: isSelected
                  ? '0 0 14px rgba(212,175,55,0.6), inset 0 1px 0 rgba(255,255,255,0.6)'
                  : 'inset 0 1px 0 rgba(255,255,255,0.6)',
              }}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl">{scene.icon}</span>
                <div
                  className="text-[11px] text-center leading-tight tracking-wide"
                  style={{ fontFamily: "var(--font-metal-mania), 'Georgia', serif", color: 'var(--theme-primary)' }}
                >
                  {scene.name}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
