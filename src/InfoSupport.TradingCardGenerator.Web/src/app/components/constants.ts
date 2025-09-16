// Display dimensions (what user sees)
export const CARD_WIDTH = 750;
export const CARD_HEIGHT = 1050;

// Capture dimensions (what gets sent to API) - optimized for smaller file size
export const CAPTURE_WIDTH = 400;
export const CAPTURE_HEIGHT = 560;

// Image quality settings
export const IMAGE_FORMAT = 'image/jpeg' as const;
export const IMAGE_QUALITY = 0.85; // 85% quality - good balance between size and quality

// Available sports
export const SPORTS = ['basketball', 'football', 'baseball', 'ice hockey'];

// Special properties that can be applied to trading cards
export const SPECIAL_PROPERTIES = {
  none: {
    id: 'none',
    name: 'None',
    icon: '🚫', // Circle with diagonal strike through
    description: 'No special property'
  },
  mvp: {
    id: 'mvp',
    name: 'MVP',
    icon: 'mvp.png', // MVP logo from public folder
    description: 'Most Valuable Player'
  }
} as const;

// Fun loading messages that combine tech and sports themes
export const LOADING_MESSAGES = [
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
];

// Team configuration with logos and colors
export const TEAMS = {
  blue: {
    color: '#174a6f',
    teams: [
      { name: 'Encryption Eagles', logo: 'blue-encryption-eagles.png' },
      { name: 'Linefeed Lions', logo: 'blue-linefeed-lions.png' },
      { name: 'Recursive Rams', logo: 'blue-recursive-rams.png' },
      { name: 'Workflow Wolves', logo: 'blue-workflow-wolves.png' },
    ],
  },
  brown: {
    color: '#8B4513',
    teams: [
      { name: 'Backup Bobcats', logo: 'brown-backup-bobcats.png' },
      { name: 'Byte Bears', logo: 'brown-byte-bears.png' },
      { name: 'Handle Hornets', logo: 'brown-handle-hornets.png' },
      { name: 'Telnet Tigers', logo: 'brown-telnet-tigers.png' },
    ],
  },
  green: {
    color: '#228B22',
    teams: [
      { name: 'Buffer Badgers', logo: 'green-buffer-badgers.png' },
      { name: 'Firewall Foxes', logo: 'green-firewall-foxes.png' },
      { name: 'Log Leopards', logo: 'green-log-leopards.png' },
      { name: 'Router Ravens', logo: 'green-router-ravens.png' },
    ],
  },
  red: {
    color: '#DC143C',
    teams: [
      { name: 'Daemon Dogs', logo: 'red-daemon-dogs.png' },
      { name: 'Data Dolphins', logo: 'red-data-dolphins.png' },
      { name: 'Script Sharks', logo: 'red-script-sharks.png' },
      { name: 'Stack Stallions', logo: 'red-stack-stallions.png' },
    ],
  },
};
