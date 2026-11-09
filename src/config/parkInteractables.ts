import { birthdayConfig } from '../config/birthdayConfig';
import type { FrozenCharacterId } from '../components/scene/FrozenCharacters';

export type InteractableKind =
  | 'frozen-character'
  | 'tulip-flower'
  | 'bouquet-studio'
  | 'fantasy-relic'
  | 'adventure-chest'
  | 'galaxy-wish'
  | 'birthday-cake'
  | 'gift-box'
  | 'photo-easel'
  | 'memory-letters'
  | 'wishing-fountain'
  | 'fireworks';

export interface ParkInteractable {
  id: string;
  kind: InteractableKind;
  name: string;
  actionPrompt: string;
  position: [number, number, number];
  radius: number;
  accentColor: string;
  frozenId?: FrozenCharacterId;
  tulipId?: string;
  fantasySecretId?: string;
  chestIndex?: number;
  giftId?: string;
  photoId?: string;
}

const EASEL_WORLD_POSITIONS: [number, number, number][] = [
  [17 - 3.9, 1.1, 22 + 2.2],
  [17 + 3.9, 1.1, 22 + 2.2],
  [17 - 3.9, 1.1, 22 - 2.2],
  [17 + 3.9, 1.1, 22 - 2.2],
];

const GIFT_WORLD_POSITIONS: [number, number, number][] = [
  [48 - 3.2, 0.6, -2 + 1.8],
  [48 + 3.2, 0.6, -2 + 1.8],
  [48, 0.6, -2 + 3.8],
];

export const PARK_INTERACTABLES: ParkInteractable[] = [
  // Wishing Plaza Fountain
  {
    id: 'wishing-fountain',
    kind: 'wishing-fountain',
    name: 'Central Wishing Fountain',
    actionPrompt: 'Make a Birthday Wish',
    position: [0, 1.4, 6.0],
    radius: 4.5,
    accentColor: '#8ECDF2',
  },
  // Fantasy Kingdom Relics & Castle Gates
  {
    id: 'fantasy-rose',
    kind: 'fantasy-relic',
    name: 'Enchanted Rose Dome',
    actionPrompt: 'Inspect Enchanted Rose',
    position: [-9.2, 1.2, -24.5],
    radius: 3.4,
    accentColor: '#F59BB9',
    fantasySecretId: 'enchanted-rose',
  },
  {
    id: 'fantasy-tiara',
    kind: 'fantasy-relic',
    name: 'Royal Birthday Tiara',
    actionPrompt: 'Inspect Royal Tiara',
    position: [9.2, 1.2, -24.5],
    radius: 3.4,
    accentColor: '#FFD98E',
    fantasySecretId: 'crystal-tiara',
  },
  {
    id: 'fantasy-gates',
    kind: 'fantasy-relic',
    name: 'Fairytale Castle Doors',
    actionPrompt: 'Knock on Castle Gates',
    position: [0, 1.4, -25.2],
    radius: 4.2,
    accentColor: '#C6A8F4',
    fantasySecretId: 'castle-gates',
  },
  // Tulip Wonderland
  ...birthdayConfig.tulipMessages.map((item) => ({
    id: `tulip-${item.id}`,
    kind: 'tulip-flower' as const,
    name: item.variety,
    actionPrompt: `Read Message & Collect ${item.variety}`,
    position: [item.position[0], 1.1, item.position[2]] as [number, number, number],
    radius: 3.3,
    accentColor: item.color,
    tulipId: item.id,
  })),
  {
    id: 'flower-house-bouquet',
    kind: 'bouquet-studio',
    name: 'Flower House Bouquet Studio',
    actionPrompt: 'Open Bouquet Builder',
    position: [-53.2, 1.2, 9.5],
    radius: 4.2,
    accentColor: '#F59BB9',
  },
  // Frozen Kingdom Characters
  {
    id: 'frozen-elsa',
    kind: 'frozen-character',
    name: 'Queen Elsa',
    actionPrompt: 'Talk to Queen Elsa',
    position: [-47, 1.6, -31],
    radius: 4.2,
    accentColor: '#99E5FF',
    frozenId: 'elsa',
  },
  {
    id: 'frozen-anna',
    kind: 'frozen-character',
    name: 'Princess Anna',
    actionPrompt: 'Talk to Princess Anna',
    position: [-34.5, 1.5, -21],
    radius: 4.2,
    accentColor: '#F59BB9',
    frozenId: 'anna',
  },
  {
    id: 'frozen-olaf',
    kind: 'frozen-character',
    name: 'Olaf',
    actionPrompt: 'Talk to Olaf',
    position: [-39.5, 1.1, -22.5],
    radius: 3.6,
    accentColor: '#BCE3FA',
    frozenId: 'olaf',
  },
  // Adventure Kingdom Chests
  {
    id: 'adv-chest-0',
    kind: 'adventure-chest',
    name: 'Jungle Emerald Chest',
    actionPrompt: 'Open Treasure Chest',
    position: [46.5, 0.8, 24.5],
    radius: 3.4,
    accentColor: '#76C893',
    chestIndex: 0,
  },
  {
    id: 'adv-chest-1',
    kind: 'adventure-chest',
    name: 'Waterfall Golden Relic',
    actionPrompt: 'Open Relic Chest',
    position: [52.5, 0.8, 28.5],
    radius: 3.4,
    accentColor: '#76C893',
    chestIndex: 1,
  },
  // Galaxy Kingdom Wish Star
  {
    id: 'galaxy-wish-star',
    kind: 'galaxy-wish',
    name: 'Starlight Cosmic Beacon',
    actionPrompt: 'Make a Starlight Wish',
    position: [45, 1.5, -31],
    radius: 4.0,
    accentColor: '#A799FF',
  },
  // Birthday Celebration Kingdom
  {
    id: 'celebration-cake',
    kind: 'birthday-cake',
    name: 'Giant Birthday Cake',
    actionPrompt: 'Start Birthday Celebration & Candles',
    position: [48, 1.8, -2],
    radius: 4.8,
    accentColor: '#FFD07B',
  },
  ...birthdayConfig.giftMessages.map((gift, idx) => ({
    id: `gift-${gift.id}`,
    kind: 'gift-box' as const,
    name: gift.title,
    actionPrompt: `Open ${gift.title}`,
    position: GIFT_WORLD_POSITIONS[idx % GIFT_WORLD_POSITIONS.length],
    radius: 3.2,
    accentColor: gift.ribbonColor,
    giftId: gift.id,
  })),
  // Memory Pavilion Easels + Center Letters Lectern
  ...birthdayConfig.photos.slice(0, 4).map((photo, idx) => ({
    id: `photo-${photo.id}`,
    kind: 'photo-easel' as const,
    name: photo.title,
    actionPrompt: 'View Keepsake Memory',
    position: EASEL_WORLD_POSITIONS[idx],
    radius: 3.0,
    accentColor: photo.frameTint,
    photoId: photo.id,
  })),
  {
    id: 'memory-letters-gazebo',
    kind: 'memory-letters',
    name: 'Memory Pavilion Letters',
    actionPrompt: 'Read Birthday Letters & Photos',
    position: [17, 1.3, 22],
    radius: 3.5,
    accentColor: '#9ED7F6',
  },
];

export function findNearestInteractable(
  px: number,
  pz: number,
  yaw: number
): ParkInteractable | null {
  const fwdX = -Math.sin(yaw);
  const fwdZ = -Math.cos(yaw);

  let best: ParkInteractable | null = null;
  let bestScore = Infinity;

  for (const item of PARK_INTERACTABLES) {
    const dx = item.position[0] - px;
    const dz = item.position[2] - pz;
    const dist = Math.hypot(dx, dz);
    if (dist <= item.radius) {
      // Slightly prefer objects in front of where the player is looking
      const inv = dist > 0.001 ? 1 / dist : 0;
      const dot = dx * inv * fwdX + dz * inv * fwdZ;
      const score = dist - dot * 0.65;
      if (score < bestScore) {
        bestScore = score;
        best = item;
      }
    }
  }

  return best;
}
