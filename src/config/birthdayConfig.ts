export type ParkDestinationId =
  | 'intro'
  | 'hub'
  | 'fantasyland'
  | 'frozen-kingdom'
  | 'tulip-garden'
  | 'adventure-kingdom'
  | 'galaxy-kingdom'
  | 'surprises'
  | 'memories';

export interface DestinationConfig {
  id: ParkDestinationId;
  label: string;
  shortLabel: string;
  subtitle: string;
  description: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  explorePosition: [number, number, number];
  exploreTarget: [number, number, number];
  landmarkPosition: [number, number, number];
  worldPosition: [number, number];
  accentColor: string;
  badgeText: string;
  isKingdom: boolean;
  enterLabel: string;
}

export interface PhotoMemoryPlaceholder {
  id: string;
  title: string;
  caption: string;
  date: string;
  imageUrl?: string;
  frameTint: string;
  palette: [string, string];
}

export interface BirthdayLetterPlaceholder {
  id: string;
  title: string;
  from: string;
  preview: string;
  body: string;
}

export interface GiftMessagePlaceholder {
  id: string;
  title: string;
  ribbonColor: string;
  boxColor: string;
  message: string;
}

export interface TulipMessageItem {
  id: string;
  variety: 'Rose Tulip' | 'Lavender Tulip' | 'Buttercream Tulip' | 'Peach Tulip' | 'Daisy Blossom';
  color: string;
  position: [number, number, number];
  message: string;
}

export const WORLD_MAP_BOUNDS = {
  minX: -80,
  maxX: 80,
  minZ: -70,
  maxZ: 56,
};

export function worldToMapPercent(x: number, z: number): { left: number; top: number } {
  const left = ((x - WORLD_MAP_BOUNDS.minX) / (WORLD_MAP_BOUNDS.maxX - WORLD_MAP_BOUNDS.minX)) * 100;
  const top = ((z - WORLD_MAP_BOUNDS.minZ) / (WORLD_MAP_BOUNDS.maxZ - WORLD_MAP_BOUNDS.minZ)) * 100;
  return { left, top };
}

export const birthdayConfig = {
  // ============================================================================
  // PERSONALIZATION — Edit these details for your sister
  // ============================================================================
  sisterName: 'Lily', // Replace with your sister's name
  sisterNickname: 'Birthday Princess',
  age: 22, // Replace with her upcoming age
  birthdayDate: 'November 11, 2026',
  parkTitle: "Lily's Magical Birthday Wonderland",
  heroTagline: 'A Six-Kingdom Fairytale Park Crafted Just For You',

  personalBirthdayMessage:
    'Happy Birthday, Lily! May your year bloom brighter than a thousand pastel tulips, shimmer like northern starlight, and overflow with adventure, laughter, and magic.',

  favoriteMusic: {
    title: 'Waltz of the Pastel Tulips',
    artist: 'Wonderland Music Box',
    audioUrl: '',
  },

  characterGreetings: {
    elsa: {
      name: 'Queen Elsa',
      title: 'Ice Palace Greeting',
      greeting:
        'Happy Birthday, Lily! May your heart stay as fearless as the northern wind and your year sparkle like fresh crystal snow. Press the magic aura to summon a birthday blizzard!',
      magicWish: 'Let your brightest dreams shimmer into reality this year!',
    },
    anna: {
      name: 'Princess Anna',
      title: 'Arendelle Village Surprise',
      greeting:
        'Happy, happy birthday, Lily!! I baked invisible snow-chocolate cupcakes and decorated the whole village for you! Tap below for a warm Arendelle birthday surprise!',
      surpriseNote: 'Surprise: Endless warm hugs, laughter, and spontaneous chocolate runs await you!',
    },
    olaf: {
      name: 'Olaf',
      title: 'Warm Hugs!',
      greeting:
        'Hi Lily! Some birthdays are worth melting for—and yours is definitely at the top of my list!',
    },
  },

  tulipMessages: [
    {
      id: 'tulip-1',
      variety: 'Rose Tulip',
      color: '#F596B6',
      position: [-41, 0.25, 11],
      message: 'Wishing you gentle mornings filled with warmth and simple joys.',
    },
    {
      id: 'tulip-2',
      variety: 'Lavender Tulip',
      color: '#C9ADEF',
      position: [-49, 0.35, 15],
      message: 'You bring calm, kindness, and quiet magic to everyone around you.',
    },
    {
      id: 'tulip-3',
      variety: 'Buttercream Tulip',
      color: '#FFE6A3',
      position: [-44, 0.25, 19],
      message: 'May every new dream you plant this year grow taller than the last!',
    },
    {
      id: 'tulip-4',
      variety: 'Peach Tulip',
      color: '#FFC8B4',
      position: [-52, 0.3, 8],
      message: 'Thank you for every shared laugh, late-night talk, and bright memory.',
    },
    {
      id: 'tulip-5',
      variety: 'Daisy Blossom',
      color: '#FFFDF8',
      position: [-38, 0.2, 16],
      message: 'Here is to sunny adventures and flowers along every path you walk!',
    },
  ] as TulipMessageItem[],

  bouquetCompletionMessage:
    'A custom birthday bouquet arranged just for you, Lily! Every petal carries a wish for joy, wonder, and a truly unforgettable year ahead.',

  photos: [
    {
      id: 'mem-1',
      title: 'Golden Afternoon Smiles',
      caption: 'Replace with a favorite childhood or recent photo together.',
      date: 'Spring Memories',
      frameTint: '#F7C6D9',
      palette: ['#FADAE6', '#FFE5B4'],
    },
    {
      id: 'mem-2',
      title: 'Endless Laughter',
      caption: 'One of the brightest moments worth keeping forever.',
      date: 'Summer Adventures',
      frameTint: '#D9CCF2',
      palette: ['#D9CCF2', '#BCE3FA'],
    },
    {
      id: 'mem-3',
      title: 'Starlit Celebrations',
      caption: 'To many more magical birthdays side by side.',
      date: 'Celebration Day',
      frameTint: '#BCE3FA',
      palette: ['#BCE3FA', '#FADAE6'],
    },
    {
      id: 'mem-4',
      title: 'Tulip Garden Strolls',
      caption: 'Sunny days, pastel skies, and unforgettable moments.',
      date: 'Favorite Days',
      frameTint: '#FFE6A3',
      palette: ['#FFF2CC', '#F7C6D9'],
    },
  ] as PhotoMemoryPlaceholder[],

  letters: [
    {
      id: 'letter-1',
      title: 'A Note From Your Sibling',
      from: 'With all my love',
      preview: 'Thank you for bringing warmth and light wherever you go...',
      body: 'Dearest Lily, watching you grow, dream, and shine has been one of life’s greatest joys. Welcome to your very own six-kingdom fairytale wonderland—every tower, petal, and spark of starlight here is a wish for your happiness.',
    },
    {
      id: 'letter-2',
      title: 'Wishes For Your New Year',
      from: 'Your Wonderland Guide',
      preview: 'May every doorway open to kindness and adventure...',
      body: 'Here is to quiet mornings with warm tea, bold adventures across bright skies, and a year where magic meets you at every turn.',
    },
  ] as BirthdayLetterPlaceholder[],

  giftMessages: [
    {
      id: 'gift-1',
      title: 'Blush Ribbon Keepsake',
      ribbonColor: '#F39BB8',
      boxColor: '#FFF9F2',
      message: 'Gift #1: Unlimited coffee dates, spontaneous drives, and movie nights—redeemable anytime!',
    },
    {
      id: 'gift-2',
      title: 'Lavender Wish Box',
      ribbonColor: '#B398E8',
      boxColor: '#F7F1FF',
      message: 'Gift #2: A bouquet of your favorite flowers and a full day dedicated to celebrating you.',
    },
    {
      id: 'gift-3',
      title: 'Golden Star Surprise',
      ribbonColor: '#F6BE65',
      boxColor: '#FFF4DE',
      message: 'Gift #3: A special birthday surprise waiting for you in person!',
    },
  ] as GiftMessagePlaceholder[],

  adventureTreasures: [
    'Ancient Emerald Compass: May you always follow what excites your heart!',
    'Golden Jungle Relic: A wish for fearless travels and unforgettable discoveries!',
  ],

  // ============================================================================
  // INTERCONNECTED 6-KINGDOM WORLD DESTINATIONS
  // ============================================================================
  destinations: {
    intro: {
      id: 'intro',
      label: 'Wonderland Gates',
      shortLabel: 'Home',
      subtitle: 'Grand Entrance Vista',
      description:
        'Look across the golden promenade, Wishing Plaza, and enchanted moat toward the full Fairytale Castle.',
      cameraPosition: [0, 11.8, 56],
      cameraTarget: [0, 6.4, -18],
      explorePosition: [0, 8.5, 42],
      exploreTarget: [0, 4.5, -14],
      landmarkPosition: [0, 3.2, 34],
      worldPosition: [0, 38],
      accentColor: '#F6BE65',
      badgeText: 'Grand Entrance',
      isKingdom: false,
      enterLabel: 'Enter Wonderland',
    },
    hub: {
      id: 'hub',
      label: 'Wishing Plaza',
      shortLabel: 'Main Park',
      subtitle: 'Central Wonderland Hub',
      description:
        'The sunlit hub of the six-kingdom park, surrounded by arched stone bridges, pastel gardens, and the Wishing Fountain.',
      cameraPosition: [26, 26, 46],
      cameraTarget: [0, 2.5, -2],
      explorePosition: [12, 7.5, 20],
      exploreTarget: [0, 2.5, 6],
      landmarkPosition: [0, 4.2, 6],
      worldPosition: [0, 6],
      accentColor: '#8ECDF2',
      badgeText: 'Central Hub',
      isKingdom: false,
      enterLabel: 'Walk the Plaza',
    },
    fantasyland: {
      id: 'fantasyland',
      label: 'Fantasy Kingdom',
      shortLabel: 'Fantasy',
      subtitle: 'Royal Fairytale Castle & Gardens',
      description:
        'Cross the royal moat bridge to explore the multi-tower castle, manicured gardens, princess charms, and hidden magic.',
      cameraPosition: [0, 13.5, -2],
      cameraTarget: [0, 6.2, -34],
      explorePosition: [9.5, 6.2, -16],
      exploreTarget: [0, 5.2, -33],
      landmarkPosition: [0, 4.5, -20],
      worldPosition: [0, -34],
      accentColor: '#B89CEB',
      badgeText: 'Kingdom II',
      isKingdom: true,
      enterLabel: 'Enter Fantasy Kingdom',
    },
    'frozen-kingdom': {
      id: 'frozen-kingdom',
      label: 'Frozen Kingdom',
      shortLabel: 'Frozen',
      subtitle: 'Ice Palace, Snowy Village & Northern Lights',
      description:
        'Venture north to Elsa’s shimmering Ice Palace and Anna’s snowy village beneath dancing aurora lights.',
      cameraPosition: [-20, 14, -4],
      cameraTarget: [-46, 4.5, -32],
      explorePosition: [-31.5, 6.4, -12.5],
      exploreTarget: [-44.5, 2.2, -28.5],
      landmarkPosition: [-46, 5.2, -30],
      worldPosition: [-46, -34],
      accentColor: '#99E5FF',
      badgeText: 'Kingdom I',
      isKingdom: true,
      enterLabel: 'Enter Frozen Kingdom',
    },
    'tulip-garden': {
      id: 'tulip-garden',
      label: 'Tulip Wonderland',
      shortLabel: 'Tulip Kingdom',
      subtitle: 'Blossom Fields, Flower House & Bouquet Garden',
      description:
        'Wander across flower-covered bridges and blooming meadows, collect favorite stems, and build your birthday bouquet.',
      cameraPosition: [-20, 12.5, 28],
      cameraTarget: [-46, 1.8, 12],
      explorePosition: [-34, 5.2, 22],
      exploreTarget: [-46, 1.5, 13],
      landmarkPosition: [-46, 4.0, 12],
      worldPosition: [-46, 14],
      accentColor: '#F59BB9',
      badgeText: 'Kingdom III',
      isKingdom: true,
      enterLabel: 'Enter Tulip Wonderland',
    },
    'adventure-kingdom': {
      id: 'adventure-kingdom',
      label: 'Adventure Kingdom',
      shortLabel: 'Adventure',
      subtitle: 'Tropical Jungle, Waterfalls & Ancient Ruins',
      description:
        'Cross wooden jungle bridges past cascading waterfalls and ancient temple ruins to unlock hidden treasure chests.',
      cameraPosition: [25, 13.5, 35],
      cameraTarget: [48, 2.8, 26.5],
      explorePosition: [34.5, 6.0, 31.5],
      exploreTarget: [48, 2.2, 26],
      landmarkPosition: [46, 4.6, 26],
      worldPosition: [48, 28],
      accentColor: '#76C893',
      badgeText: 'Kingdom IV',
      isKingdom: true,
      enterLabel: 'Enter Adventure Kingdom',
    },
    'galaxy-kingdom': {
      id: 'galaxy-kingdom',
      label: 'Galaxy Kingdom',
      shortLabel: 'Galaxy',
      subtitle: 'Floating Planets & Starlight Observatory',
      description:
        'Step onto the cosmic terrace beneath floating ringed planets, futuristic domes, and glowing starlight attractions.',
      cameraPosition: [28, 13.5, -14],
      cameraTarget: [46, 4.8, -34],
      explorePosition: [34, 6.2, -20],
      exploreTarget: [46, 3.8, -34],
      landmarkPosition: [46, 5.2, -32],
      worldPosition: [46, -34],
      accentColor: '#A799FF',
      badgeText: 'Kingdom V',
      isKingdom: true,
      enterLabel: 'Enter Galaxy Kingdom',
    },
    surprises: {
      id: 'surprises',
      label: 'Birthday Celebration',
      shortLabel: 'Celebration',
      subtitle: 'Grand Cake Stage, Gifts & Balloons',
      description:
        'Celebrate at the festive amphitheater with a giant candlelit birthday cake, floating balloons, and gift boxes.',
      cameraPosition: [31, 10.5, 11],
      cameraTarget: [48, 2.6, -2],
      explorePosition: [38.5, 4.8, 6.5],
      exploreTarget: [48, 2.0, -2],
      landmarkPosition: [48, 4.5, -2],
      worldPosition: [48, -2],
      accentColor: '#FFD07B',
      badgeText: 'Kingdom VI',
      isKingdom: true,
      enterLabel: 'Enter Celebration Kingdom',
    },
    memories: {
      id: 'memories',
      label: 'Memory Pavilion',
      shortLabel: 'Memories',
      subtitle: 'Family Photo Gallery & Birthday Letters',
      description:
        'Stroll into the garden gazebo to browse framed keepsake memories and read heartfelt birthday letters.',
      cameraPosition: [8, 8.8, 32],
      cameraTarget: [17, 2.2, 22],
      explorePosition: [12.5, 4.0, 26.5],
      exploreTarget: [17, 1.8, 22],
      landmarkPosition: [17, 4.8, 22],
      worldPosition: [17, 22],
      accentColor: '#9ED7F6',
      badgeText: 'Keepsake Pavilion',
      isKingdom: false,
      enterLabel: 'Open Memory Gallery',
    },
  } as Record<ParkDestinationId, DestinationConfig>,
};
