import { SPORTS } from './constants';

interface SportSelectorProps {
  selectedSport?: string;
  onSportSelect: (sport: string) => void;
}

export default function SportSelector({
  selectedSport,
  onSportSelect
}: SportSelectorProps) {
  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-4 text-center text-gray-800 dark:text-gray-200" 
          style={{ fontFamily: "var(--font-bebas-neue), Arial, sans-serif" }}>
        SPORTS
      </h3>
      <div className="flex justify-between w-full max-w-[400px] mx-auto">
        {Object.entries(SPORTS).map(([sportType, icon]) => {
          const isSelected = selectedSport === sportType;
          return (
            <div key={sportType} className="flex justify-center">
              <button
                onClick={() => onSportSelect(sportType)}
                className="focus:outline-none group"
                title={sportType}
              >
                <div 
                  className={`w-[80px] h-[80px] rounded-full border-4 flex items-center justify-center bg-[#f1e4ce] hover:scale-110 transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? 'border-blue-500 shadow-lg shadow-blue-500/50' 
                      : 'border-[#eee] hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl select-none">
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