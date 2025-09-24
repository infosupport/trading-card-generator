import Image from 'next/image';
import { SPECIAL_PROPERTIES } from './constants';

interface SpecialPropertySelectorProps {
  selectedProperty: keyof typeof SPECIAL_PROPERTIES;
  onPropertySelect: (propertyId: keyof typeof SPECIAL_PROPERTIES) => void;
}

export default function SpecialPropertySelector({
  selectedProperty,
  onPropertySelect
}: SpecialPropertySelectorProps) {
  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-4 text-center text-gray-800 dark:text-gray-200" 
          style={{ fontFamily: "var(--font-bebas-neue), Arial, sans-serif" }}>
        SPECIAL PROPERTIES
      </h3>
      <div className="grid grid-cols-1 gap-4 w-full max-w-[200px] mx-auto">
        {Object.entries(SPECIAL_PROPERTIES).map(([key, property]) => {
          const isSelected = selectedProperty === key;
          return (
            <div key={key} className="flex justify-center">
              <button
                onClick={() => onPropertySelect(key as keyof typeof SPECIAL_PROPERTIES)}
                className="focus:outline-none group"
                title={property.description}
              >
                <div 
                  className={`w-[80px] h-[80px] rounded-full border-4 flex items-center justify-center bg-[#f1e4ce] hover:scale-110 transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? 'border-blue-500 shadow-lg shadow-blue-500/50' 
                      : 'border-[#eee] hover:border-gray-300'
                  }`}
                >
                  {property.icon.endsWith('.png') ? (
                    <Image
                      src={`/${property.icon}`}
                      alt={property.name}
                      width={60}
                      height={60}
                      className="object-contain"
                    />
                  ) : (
                    <div className="text-3xl select-none">
                      {property.icon}
                    </div>
                  )}
                </div>
                <div className="mt-2 text-xs font-bold text-center text-gray-700 dark:text-gray-300 tracking-wide"
                     style={{ fontFamily: "var(--font-bebas-neue), Arial, sans-serif" }}>
                  {property.name}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}