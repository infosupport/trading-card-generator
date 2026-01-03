import { SPORTS } from '@/lib/constants';

interface SportSelectorProps {
  selectedSport?: string;
  onSportSelect: (sport: string) => void;
}

export default function SportSelector({
  selectedSport,
  onSportSelect
}: SportSelectorProps) {
  return (
    <div className="p-2 sm:p-4">
      <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-center text-gray-800 dark:text-gray-200" 
          style={{ fontFamily: "var(--font-bebas-neue), Arial, sans-serif" }}>
        SPORTS
      </h3>
      <div className="flex justify-between w-full max-w-[350px] sm:max-w-[400px] mx-auto gap-2">
        {Object.entries(SPORTS).map(([sportType, icon]) => {
          const isSelected = selectedSport === sportType;
          return (
            <div key={sportType} className="flex justify-center">
              <button
                onClick={() => onSportSelect(sportType)}
                className="focus:outline-none group"
                title={sportType}
              >
                <div className={`w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] rounded-full border-4 flex items-center justify-center bg-theme-card-bg hover:scale-110 transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? 'border-theme-border-active shadow-lg' 
                      : 'border-theme-border hover:border-theme-border-hover'
                  }`}>
                  <div className="text-2xl sm:text-3xl select-none">
                    {icon}
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}