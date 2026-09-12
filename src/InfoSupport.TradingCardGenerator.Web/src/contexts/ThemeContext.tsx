'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';

type ThemeType = 'sports' | 'jurassic' | 'medieval' | 'isks' | 'isks-8bit';

interface ThemeContextType {
  theme: ThemeType;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ 
  theme, 
  children 
}: { 
  theme: ThemeType; 
  children: ReactNode 
}) {
  useEffect(() => {
    // Set the data-theme attribute on the document element
    document.documentElement.setAttribute('data-theme', theme);
    
    return () => {
      // Cleanup: reset to default theme
      document.documentElement.setAttribute('data-theme', 'sports');
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
