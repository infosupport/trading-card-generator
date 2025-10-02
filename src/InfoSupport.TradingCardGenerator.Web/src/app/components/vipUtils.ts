import mvpData from '../mvps_17sep2025.json';

interface MVPDataStructure {
  communityLeaderProfiles: Array<{
    firstName: string;
    lastName: string;
    localizedFirstName?: string;
    localizedLastName?: string;
  }>;
}

// Create a Set of normalized full names for O(1) lookup performance
const createNameLookupSet = (): Set<string> => {
  const nameSet = new Set<string>();
  const mvps = (mvpData as MVPDataStructure).communityLeaderProfiles || [];
  
  mvps.forEach(mvp => {
    const firstName = mvp.firstName?.toLowerCase().trim() || '';
    const lastName = mvp.lastName?.toLowerCase().trim() || '';
    const localizedFirst = mvp.localizedFirstName?.toLowerCase().trim() || '';
    const localizedLast = mvp.localizedLastName?.toLowerCase().trim() || '';
    
    // Add all possible name combinations
    if (firstName && lastName) {
      nameSet.add(`${firstName} ${lastName}`);
    }
    if (localizedFirst && localizedLast) {
      nameSet.add(`${localizedFirst} ${localizedLast}`);
    }
    if (firstName && localizedLast) {
      nameSet.add(`${firstName} ${localizedLast}`);
    }
    if (localizedFirst && lastName) {
      nameSet.add(`${localizedFirst} ${lastName}`);
    }
  });
  
  return nameSet;
};

// Initialize the lookup set once at module load for maximum performance
const mvpNameSet = createNameLookupSet();

/**
 * Check if a person is a VIP (MVP) - Optimized for performance with O(1) lookup
 * @param firstName - The first name to check
 * @param lastName - The last name to check
 * @returns true if the person is an MVP, false otherwise
 */
export function isVip(firstName: string, lastName: string): boolean {
  if (!firstName?.trim() || !lastName?.trim()) {
    return false;
  }

  const normalizedName = `${firstName.trim().toLowerCase()} ${lastName.trim().toLowerCase()}`;
  return mvpNameSet.has(normalizedName);
}