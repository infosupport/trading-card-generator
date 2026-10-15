'use client';

import { medievalTheme } from '@/lib/theme-config';
import { SCENE_EMBLEMS } from './MedievalCardGenerator';

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
        className="text-xl sm:text-2xl mb-3 sm:mb-4 text-center tracking-wide"
        style={{ fontFamily: "var(--font-metal-mania), 'Georgia', serif", color: 'var(--theme-primary)' }}
      >
        {medievalTheme.sceneSelectorLabel}
      </h3>
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 w-full max-w-95 mx-auto">
        {scenes.map((scene) => {
          const isSelected = selectedScene === scene.id;
          return (
            <button
              key={scene.id}
              onClick={() => onSceneSelect(scene.id)}
              title={scene.name}
              aria-label={scene.name}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                isSelected ? 'shadow-[0_0_14px_rgba(212,175,55,0.6)]' : 'hover:shadow-[0_0_10px_rgba(212,175,55,0.35)]'
              }`}
              style={{
                borderColor: isSelected ? 'var(--theme-border-active)' : 'var(--theme-border)',
              }}
            >
              <img
                src={SCENE_EMBLEMS[scene.id] ?? SCENE_EMBLEMS.scene01}
                alt={scene.name}
                className="w-full h-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
