export interface DestinationConfig {
  id: 'intro' | 'hub' | 'tulip-garden' | 'fantasyland' | 'memories' | 'surprises';
  label: string;
  shortLabel: string;
  subtitle: string;
  description: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  landmarkPosition: [number, number, number];
  accentColor: string;
  badgeText: string;
}

export interface PhotoMemoryPlaceholder {
  id: string;
  title: string;
  caption: string;
  date: string;
  imageUrl?: string;
  frameTint: string;
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

export const birthdayConfig = {
  // ============================================================================
  // PERSONALIZATION — Edit these details for your sister
  // ============================================================================
  sisterName: 'Lily', // Replace with your sister's name
  sisterNickname: 'Birthday Princess',
  age: 22, // Replace with her upcoming age
  birthdayDate: 'November 11, 2026',
  parkTitle: "Lily's Magical Birthday Wonderland",
  heroTagline: 'A Fairytale Tulip Kingdom Crafted Just For You',

  personalBirthdayMessage:
    'Happy Birthday! May your year bloom brighter than a thousand pastel tulips, filled with wonder, laughter, gentle magic, and every dream your heart holds dear.',

  favoriteMusic: {
    title: 'Waltz of the Pastel Tulips',
    artist: 'Wonderland Music Box',
    // Replace with an MP3/OGG path inside /public/audio/ when ready
    audioUrl: '',
  },

  photos: [
    {
      id: 'mem-1',
      title: 'Golden Afternoon Smiles',
      caption: 'Replace with a favorite childhood or recent photo together.',
      date: 'Spring Memories',
      frameTint: '#F7C6D9',
    },
    {
      id: 'mem-2',
      title: 'Endless Laughter',
      caption: 'One of the brightest moments worth keeping forever.',
      date: 'Summer Adventures',
      frameTint: '#D9CCF2',
    },
    {
      id: 'mem-3',
      title: 'Starlit Celebrations',
      caption: 'To many more magical birthdays side by side.',
      date: 'Celebration Day',
      frameTint: '#BCE3FA',
    },
  ] as PhotoMemoryPlaceholder[],

  letters: [
    {
      id: 'letter-1',
      title: 'A Note From Your Sibling',
      from: 'With all my love',
      preview: 'Thank you for bringing warmth and light wherever you go...',
      body: 'Dearest Lily, watching you grow, dream, and shine has been one of life’s greatest joys. Welcome to your very own fairytale wonderland—every tower, petal, and spark of light here is a wish for your happiness.',
    },
    {
      id: 'letter-2',
      title: 'Wishes For Your New Year',
      from: 'Your Wonderland Guide',
      preview: 'May every doorway open to kindness and adventure...',
      body: 'Here is to quiet mornings with warm tea, bold adventures under blue skies, and a year where magic meets you at every turn.',
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

  // ============================================================================
  // PARK DESTINATIONS & CURATED CAMERA VIEWPOINTS
  // ============================================================================
  destinations: {
    intro: {
      id: 'intro',
      label: 'Wonderland Gates',
      shortLabel: 'Home',
      subtitle: 'Grand Entrance Vista',
      description:
        'Look down the pastel promenade toward the fairytale castle glowing beneath drifting tulip petals and golden stars.',
      cameraPosition: [0, 5.2, 27],
      cameraTarget: [0, 4.8, -6],
      landmarkPosition: [0, 2.2, 16.5],
      accentColor: '#F6BE65',
      badgeText: 'Grand Entrance',
    },
    hub: {
      id: 'hub',
      label: 'Wishing Plaza',
      shortLabel: 'Park Map',
      subtitle: 'Central Wonderland Hub',
      description:
        'The heart of the park, where sunlit cobblestone paths curve around the Wishing Fountain toward every magical land.',
      cameraPosition: [13.5, 12.5, 21.5],
      cameraTarget: [0, 2.2, -1],
      landmarkPosition: [0, 3.6, 2.0],
      accentColor: '#8ECDF2',
      badgeText: 'Central Hub',
    },
    'tulip-garden': {
      id: 'tulip-garden',
      label: 'Tulip Wonderland',
      shortLabel: 'Tulip Garden',
      subtitle: 'Pastel Blossom Terraces',
      description:
        'Terraced hills overflowing with pink, lavender, buttercream, and rose-gold tulips swaying gently in the afternoon breeze.',
      cameraPosition: [-18.5, 6.2, 13.5],
      cameraTarget: [-11.5, 1.0, 3.5],
      landmarkPosition: [-11.5, 3.0, 3.5],
      accentColor: '#F59BB9',
      badgeText: 'Blooming Terraces',
    },
    fantasyland: {
      id: 'fantasyland',
      label: 'Fantasyland Castle',
      shortLabel: 'Fantasyland',
      subtitle: 'Royal Fairytale Spire',
      description:
        'The jewel of the kingdom: blush-stone battlements, lavender turrets, golden spires, and a sunlit royal courtyard.',
      cameraPosition: [6.0, 7.2, 3.8],
      cameraTarget: [0, 5.0, -11.5],
      landmarkPosition: [0, 2.8, -5.2],
      accentColor: '#B89CEB',
      badgeText: 'Royal Castle',
    },
    memories: {
      id: 'memories',
      label: 'Memory Pavilion',
      shortLabel: 'Memories',
      subtitle: 'Garden Gazebo & Letters',
      description:
        'A serene lavender-draped pavilion overlooking the eastern gardens, built to hold cherished photographs and heartfelt notes.',
      cameraPosition: [18.5, 5.8, 10.0],
      cameraTarget: [11.2, 2.0, 2.5],
      landmarkPosition: [11.2, 4.4, 2.5],
      accentColor: '#9ED7F6',
      badgeText: 'Garden Gazebo',
    },
    surprises: {
      id: 'surprises',
      label: 'Celebration Lawn',
      shortLabel: 'Birthday Surprises',
      subtitle: 'Festive Birthday Terrace',
      description:
        'A lantern-lit terrace wrapped in pastel bunting where birthday surprises, cake, and evening celebrations await.',
      cameraPosition: [17.0, 6.2, -15.5],
      cameraTarget: [10.0, 1.8, -8.0],
      landmarkPosition: [10.0, 3.4, -8.0],
      accentColor: '#FFD07B',
      badgeText: 'Celebration Stage',
    },
  } as Record<DestinationConfig['id'], DestinationConfig>,
};
