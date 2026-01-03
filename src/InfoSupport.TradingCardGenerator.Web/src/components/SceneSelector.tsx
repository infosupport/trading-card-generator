'use client';

interface SceneSelectorProps {
  selectedScene?: string;
  onSceneSelect: (sceneId: string) => void;
  scenes: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
  }>;
}

export default function SceneSelector({
  selectedScene,
  onSceneSelect,
  scenes
}: SceneSelectorProps) {
  return (
    <div className="p-2 sm:p-4">
      <h3 
        className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-center text-gray-100"
        style={{ fontFamily: "var(--font-bebas-neue), Arial, sans-serif" }}
      >
        Choose Scene
      </h3>
      <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full max-w-[320px] mx-auto">
        {scenes.map((scene) => {
          const isSelected = selectedScene === scene.id;
          return (
            <button
              key={scene.id}
              onClick={() => onSceneSelect(scene.id)}
              className={`p-2 rounded-lg border-4 transition-all duration-200 hover:scale-105 text-left bg-theme-card-bg ${
                isSelected
                  ? 'border-theme-border-active shadow-lg'
                  : 'border-theme-border hover:border-theme-border-hover'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl">{scene.icon}</span>
                <div className="font-bold text-[10px] text-center text-gray-800 dark:text-gray-200 leading-tight">
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
