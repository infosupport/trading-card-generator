// Theme configuration for reusable components

export interface ThemeColors {
  // Main theme color (used for card border, buttons, etc.)
  primary: string;
  // Card background color
  cardBackground: string;
  // Border colors
  border: string;
  borderHover: string;
  borderActive: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  colors: ThemeColors;
  loadingMessages: string[];
}

// Sports theme configuration
export const sportsTheme: ThemeConfig = {
  id: 'sports',
  name: 'Sports Trading Cards',
  title: 'Trading Card Generator',
  subtitle: 'Transform your photo into a professional sports trading card',
  colors: {
    primary: '#174a6f',
    cardBackground: '#f1e4ce',
    border: '#eee',
    borderHover: '#d1d5db',
    borderActive: '#fbbf24', // yellow-400
  },
  loadingMessages: [
    "⚡ Compiling your legendary stats...",
    "🏆 Deploying championship algorithms...",
    "🚀 Loading your MVP profile...",
    "⚽ Debugging your athletic prowess...",
    "🏀 Merging code with pure talent...",
    "🎯 Optimizing your game performance...",
    "💻 Running victory simulations...",
    "🔥 Executing championship queries...",
    "⭐ Initializing hall of fame data...",
    "🎪 Rendering your tech superpowers...",
    "🏃‍♂️ Sprinting through the pipeline...",
    "🎮 Calculating your skill coefficients...",
    "🌟 Bootstrapping your stardom...",
    "🚁 Elevating your profile status...",
    "🎨 Painting your digital masterpiece..."
  ],
};

// Jurassic theme configuration
export const jurassicTheme: ThemeConfig = {
  id: 'jurassic',
  name: 'Jurassic Cards',
  title: 'Jurassic Card Generator',
  subtitle: 'Journey back in time and become a prehistoric legend',
  colors: {
    primary: '#2d5016', // forest green
    cardBackground: '#3a2d1f', // dark brown/tan
    border: '#4a3f2f',
    borderHover: '#6b5f4f',
    borderActive: '#d4af37', // gold
  },
  loadingMessages: [
    "🦖 Traveling back 65 million years...",
    "🌋 Rendering prehistoric landscapes...",
    "🦕 Awakening ancient giants...",
    "🌿 Growing Jurassic vegetation...",
    "⚡ Charging the time machine...",
    "🔬 Extracting DNA sequences...",
    "🥚 Hatching your dinosaur card...",
    "🌍 Reshaping continental plates...",
    "🦴 Excavating fossil records...",
    "🌙 Aligning prehistoric constellations...",
    "🔥 Igniting volcanic activity...",
    "🌊 Creating primordial oceans...",
    "🦎 Evolving reptilian features...",
    "🌟 Summoning meteor showers...",
    "🏔️ Building ancient mountain ranges..."
  ],
};
