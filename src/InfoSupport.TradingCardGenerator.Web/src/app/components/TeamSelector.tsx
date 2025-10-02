import Image from 'next/image';
import { TEAMS } from './constants';

interface TeamSelectorProps {
  teamLogo?: string;
  onLogoSelect?: (logoPath: string) => void;
}

export default function TeamSelector({
  teamLogo,
  onLogoSelect
}: TeamSelectorProps) {
  return (
    <div className='p-4'>
      <div className="grid grid-cols-3 gap-1 w-1/2">
        {Object.values(TEAMS).flatMap(teamGroup => 
          teamGroup.teams.map(team => {
            const isSelected = teamLogo === team.logo;
            return (
              <div key={team.logo} className="flex justify-center px-3 pb-6">
                <button
                  onClick={() => onLogoSelect?.(team.logo)}
                  className="focus:outline-none"
                >
                  <Image
                    src={`/${team.logo}`}
                    alt={team.name}
                    width={70}
                    height={70}
                    className={`object-contain rounded-full border-4 w-[70px] h-[70px] bg-[#f1e4ce] hover:scale-110 transition-all duration-200 cursor-pointer ${
                      isSelected 
                        ? 'border-blue-500 shadow-lg shadow-blue-500/50' 
                        : 'border-[#eee] hover:border-gray-300'
                    }`}
                    title={team.name}
                  />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}