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
    <div className="mb-4 sm:mb-6">
      <h3 
        className="text-base sm:text-lg font-bold mb-3 text-center text-gray-800 dark:text-gray-200"
        style={{ fontFamily: "var(--font-bebas-neue), Arial, sans-serif" }}
      >
        Choose Your Scene
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto px-4">
        {scenes.map((scene) => {
          const isSelected = selectedScene === scene.id;
          return (
            <button
              key={scene.id}
              onClick={() => onSceneSelect(scene.id)}
              className={`p-3 sm:p-4 rounded-lg border-4 transition-all duration-200 hover:scale-105 text-left bg-theme-card-bg ${
                isSelected
                  ? 'border-theme-border-active shadow-lg'
                  : 'border-theme-border hover:border-theme-border-hover'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{scene.icon}</span>
                <div className="font-bold text-sm sm:text-base text-gray-800 dark:text-gray-200">
                  {scene.name}
                </div>
              </div>
              <div className="text-xs sm:text-sm opacity-75 text-gray-700 dark:text-gray-300">
                {scene.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
