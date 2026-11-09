import { birthdayConfig, type ParkDestinationId } from '../config/birthdayConfig';

export interface CircleCollider {
  x: number;
  z: number;
  radius: number;
  label?: string;
}

export interface BoxCollider {
  x: number;
  z: number;
  halfW: number;
  halfD: number;
  rotY?: number;
  label?: string;
}

export interface WalkableBridgeSpan {
  id: string;
  x: number;
  z: number;
  rotY: number;
  halfW: number;
  halfDeckLen: number;
  rampLen: number;
  deckHeight: number;
  surface: 'wood' | 'stone';
}

export const WALKABLE_BRIDGES: WalkableBridgeSpan[] = [
  // North Royal Bridge (Hub -> Fantasy Kingdom)
  { id: 'canal-north', x: 0, z: -21.5, rotY: 0, halfW: 1.95, halfDeckLen: 3.3, rampLen: 1.5, deckHeight: 0.45, surface: 'stone' },
  // Northwest Crystal Bridge (Hub -> Frozen Kingdom)
  { id: 'canal-nw', x: -14.3, z: -15.7, rotY: -0.78, halfW: 1.55, halfDeckLen: 3.3, rampLen: 1.5, deckHeight: 0.45, surface: 'stone' },
  // West Tulip Footbridge (Hub -> Tulip Wonderland)
  { id: 'canal-w', x: -19.2, z: 3.8, rotY: 1.45, halfW: 1.65, halfDeckLen: 3.25, rampLen: 1.5, deckHeight: 0.45, surface: 'stone' },
  // Northeast Starlight Bridge (Hub -> Galaxy Kingdom)
  { id: 'canal-ne', x: 14.3, z: -15.7, rotY: 0.78, halfW: 1.55, halfDeckLen: 3.3, rampLen: 1.5, deckHeight: 0.45, surface: 'stone' },
  // East Celebration Bridge (Hub -> Celebration Kingdom)
  { id: 'canal-e', x: 19.8, z: 0.8, rotY: 1.42, halfW: 1.65, halfDeckLen: 3.3, rampLen: 1.5, deckHeight: 0.45, surface: 'stone' },
  // Southeast Memory & Adventure Bridge
  { id: 'canal-se', x: 11.8, z: 14.2, rotY: -0.63, halfW: 1.55, halfDeckLen: 3.25, rampLen: 1.5, deckHeight: 0.45, surface: 'stone' },
  // Frozen Lake Internal Ice Bridge
  { id: 'frozen-lake', x: -41.5, z: -26.2, rotY: -0.7, halfW: 1.4, halfDeckLen: 3.7, rampLen: 1.4, deckHeight: 0.5, surface: 'stone' },
  // Tulip Pond Garden Bridge
  { id: 'tulip-pond', x: -37.5, z: 20.5, rotY: 0.62, halfW: 1.25, halfDeckLen: 3.2, rampLen: 1.4, deckHeight: 0.45, surface: 'wood' },
  // Adventure Jungle River Bridge
  { id: 'adventure-river', x: 41, z: 27, rotY: 0.35, halfW: 1.45, halfDeckLen: 3.4, rampLen: 1.4, deckHeight: 0.48, surface: 'wood' },
];

const PLAYER_RADIUS = 0.48;

const CIRCLE_COLLIDERS: CircleCollider[] = [
  // Wishing Fountain (Center Hub)
  { x: 0, z: 6.0, radius: 2.35 },
  // Plaza Topiaries
  { x: -5.4, z: 11.2, radius: 0.75 },
  { x: 5.4, z: 11.2, radius: 0.75 },
  { x: -5.4, z: 0.8, radius: 0.75 },
  { x: 5.4, z: 0.8, radius: 0.75 },
  { x: -4.2, z: 36.5, radius: 0.75 },
  { x: 4.2, z: 36.5, radius: 0.75 },
  { x: -10.2, z: 6.0, radius: 0.75 },
  { x: 10.2, z: 6.0, radius: 0.75 },
  // Plaza Benches
  { x: -5.2, z: 8.6, radius: 0.9 },
  { x: 5.2, z: 8.6, radius: 0.9 },
  { x: -5.2, z: 3.4, radius: 0.9 },
  { x: 5.2, z: 3.4, radius: 0.9 },
  // Gate Pillars (z = 38, entrance opening at x = -2.4..2.4)
  { x: -3.1, z: 38, radius: 0.65 },
  { x: 3.1, z: 38, radius: 0.65 },
  // Entrance Souvenir / Ticket Booths
  { x: -7.8, z: 43.5, radius: 1.8 },
  { x: 7.8, z: 43.5, radius: 1.8 },
  // ParkDecor Trees
  { x: -7.5, z: 32, radius: 0.65 },
  { x: 7.5, z: 32, radius: 0.65 },
  { x: -8.5, z: 22, radius: 0.65 },
  { x: 8.5, z: 22, radius: 0.65 },
  { x: -11.5, z: 12, radius: 0.65 },
  { x: 11.5, z: 11, radius: 0.65 },
  { x: -12.5, z: -4, radius: 0.65 },
  { x: 12.5, z: -4, radius: 0.65 },
  // Fantasy Kingdom Side Fountains & Trees
  { x: -11.5, z: -30, radius: 1.55 },
  { x: 11.5, z: -30, radius: 1.55 },
  { x: -14.5, z: -39, radius: 0.7 },
  { x: 14.5, z: -39, radius: 0.7 },
  { x: -10.5, z: -45, radius: 0.7 },
  { x: 10.5, z: -45, radius: 0.7 },
  // Fantasy Relic Pedestals
  { x: -9.2, z: -24.5, radius: 0.65 },
  { x: 9.2, z: -24.5, radius: 0.65 },
  // Tulip Wonderland Flower House & Trees
  { x: -56, z: 8, radius: 2.75 },
  { x: -30.5, z: 12.0, radius: 0.35 },
  { x: -30.5, z: 15.0, radius: 0.35 },
  ...birthdayConfig.tulipMessages.map((t) => ({ x: t.position[0], z: t.position[2], radius: 0.6 })),
  // Frozen Kingdom (Ice Palace, Mountains, Cottages, Characters, Pines)
  { x: -52, z: -40, radius: 5.5 },
  { x: -62, z: -48, radius: 7.5 },
  { x: -49, z: -56, radius: 9.0 },
  { x: -34, z: -51, radius: 6.5 },
  { x: -68, z: -34, radius: 6.2 },
  { x: -31.5, z: -17.5, radius: 1.75 },
  { x: -36.2, z: -14.2, radius: 1.75 },
  { x: -29.2, z: -22.5, radius: 1.75 },
  { x: -47, z: -31, radius: 0.95 }, // Elsa
  { x: -34.5, z: -21, radius: 0.95 }, // Anna
  { x: -39.5, z: -22.5, radius: 0.65 }, // Olaf
  { x: -42.5, z: -29.5, radius: 0.65 },
  { x: -37.2, z: -28.1, radius: 0.65 },
  // Galaxy Kingdom (Observatory, Pods, Spinner, Wish Beacon)
  { x: 49, z: -38, radius: 4.1 },
  { x: 43.8, z: -35.8, radius: 2.0 },
  { x: 54.2, z: -35.8, radius: 2.0 },
  { x: 39, z: -27, radius: 2.2 },
  { x: 45, z: -31, radius: 0.75 },
  // Celebration Kingdom (Cake & Gifts)
  { x: 48, z: -2, radius: 2.0 },
  { x: 44.8, z: -0.2, radius: 0.7 },
  { x: 51.2, z: -0.2, radius: 0.7 },
  { x: 48, z: 1.8, radius: 0.7 },
  // Adventure Kingdom (Temple, Cliff Waterfall, Chests, Palms)
  { x: 57, z: 32.5, radius: 4.8 },
  { x: 46.5, z: 24.5, radius: 0.8 },
  { x: 52.5, z: 28.5, radius: 0.8 },
  { x: 34, z: 21, radius: 0.5 },
  { x: 38, z: 35, radius: 0.5 },
  { x: 54, z: 17, radius: 0.5 },
  { x: 60, z: 27, radius: 0.5 },
  { x: 44, z: 38, radius: 0.5 },
  // Memory Pavilion Columns & Easels (keep center walkable inside gazebo!)
  { x: 13.1, z: 24.2, radius: 0.6 },
  { x: 20.9, z: 24.2, radius: 0.6 },
  { x: 13.1, z: 19.8, radius: 0.6 },
  { x: 20.9, z: 19.8, radius: 0.6 },
];

const BOX_COLLIDERS: BoxCollider[] = [
  // Fairytale Castle Main Keep Body (at [0, -34], scale 1.15)
  { x: 0, z: -34.2, halfW: 5.2, halfD: 3.6, rotY: 0 },
  // Entrance Left/Right Wall Fences leaving x in [-2.4, 2.4] open!
  { x: -8.6, z: 38, halfW: 5.0, halfD: 0.7, rotY: 0 },
  { x: 8.6, z: 38, halfW: 5.0, halfD: 0.7, rotY: 0 },
  // Adventure Temple Ruins
  { x: 49, z: 19.5, halfW: 3.3, halfD: 2.8, rotY: -0.3 },
];

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export function getBridgeInfoAt(
  x: number,
  z: number
): { bridge: WalkableBridgeSpan; height: number } | null {
  for (const b of WALKABLE_BRIDGES) {
    const dx = x - b.x;
    const dz = z - b.z;
    const cos = Math.cos(-b.rotY);
    const sin = Math.sin(-b.rotY);
    const lx = dx * cos - dz * sin;
    const lz = dx * sin + dz * cos;

    const absX = Math.abs(lx);
    const absZ = Math.abs(lz);

    if (absX <= b.halfW + 0.25 && absZ <= b.halfDeckLen + b.rampLen) {
      if (absZ <= b.halfDeckLen) {
        return { bridge: b, height: b.deckHeight };
      }
      const distOut = absZ - b.halfDeckLen;
      const t = 1 - Math.min(1, distOut / b.rampLen);
      return { bridge: b, height: b.deckHeight * t };
    }
  }
  return null;
}

export function getGroundHeight(x: number, z: number): number {
  const onBridge = getBridgeInfoAt(x, z);
  if (onBridge) {
    return onBridge.height;
  }

  let h = 0.05;

  // Fantasy Castle Terrace & Front Steps (at [0, -33.6], radius 7.9, height 0.48)
  const castleDist = Math.hypot(x, z + 33.6);
  if (Math.abs(x) < 2.2 && z >= -27.2 && z <= -24.2) {
    h = Math.max(h, smoothstep(-24.2, -26.8, z) * 0.48);
  } else if (castleDist <= 8.2) {
    h = Math.max(h, smoothstep(8.2, 7.2, castleDist) * 0.48);
  }

  // Celebration Stage (at [48, -2], radius 6.4, height 0.36)
  const celDist = Math.hypot(x - 48, z + 2);
  if (celDist <= 6.8) {
    h = Math.max(h, smoothstep(6.8, 5.9, celDist) * 0.36);
  }

  // Memory Pavilion Gazebo Steps (at [17, 22], radius 3.55, height 0.34)
  const memDist = Math.hypot(x - 17, z - 22);
  if (memDist <= 3.9) {
    h = Math.max(h, smoothstep(3.9, 3.1, memDist) * 0.34);
  }

  // Wishing Plaza Step (at [0, 6], radius 8.5, height 0.09)
  const plazaDist = Math.hypot(x, z - 6);
  if (plazaDist <= 8.6) {
    h = Math.max(h, 0.09);
  }

  // Tulip Wonderland Terraced Lawn Hills
  if (Math.hypot(x + 45, z - 13) <= 7.5) h = Math.max(h, 0.19);
  if (Math.hypot(x + 52, z - 18) <= 6.2) h = Math.max(h, 0.32);

  return h;
}

export function resolvePlayerCollisions(
  nextX: number,
  nextZ: number,
  prevX: number,
  prevZ: number
): { x: number; z: number } {
  let x = nextX;
  let z = nextZ;

  // 1. World Perimeter Bounds
  // Outside gates entrance plaza (z > 38..53.5, |x| <= 14.5), inside park island radius <= 79 around [0, -4]
  if (z > 38.2) {
    x = Math.max(-13.5, Math.min(13.5, x));
    z = Math.min(53.2, z);
  } else {
    const islandDist = Math.hypot(x, z + 4);
    const maxR = 79.0;
    if (islandDist > maxR) {
      const k = maxR / islandDist;
      x *= k;
      z = -4 + (z + 4) * k;
    }
  }

  // 2. Circle Obstacles Push-out
  for (const c of CIRCLE_COLLIDERS) {
    const dx = x - c.x;
    const dz = z - c.z;
    const minDist = c.radius + PLAYER_RADIUS;
    const distSq = dx * dx + dz * dz;
    if (distSq < minDist * minDist) {
      const dist = Math.sqrt(distSq);
      if (dist > 0.0001) {
        const push = (minDist - dist) / dist;
        x += dx * push;
        z += dz * push;
      } else {
        x = prevX;
        z = prevZ;
      }
    }
  }

  // 3. Oriented Box Obstacles Push-out
  for (const b of BOX_COLLIDERS) {
    const rot = b.rotY || 0;
    const cos = Math.cos(-rot);
    const sin = Math.sin(-rot);
    const dx = x - b.x;
    const dz = z - b.z;
    const lx = dx * cos - dz * sin;
    const lz = dx * sin + dz * cos;

    const ex = b.halfW + PLAYER_RADIUS;
    const ez = b.halfD + PLAYER_RADIUS;
    if (Math.abs(lx) < ex && Math.abs(lz) < ez) {
      const penX = ex - Math.abs(lx);
      const penZ = ez - Math.abs(lz);
      let nlx = lx;
      let nlz = lz;
      if (penX < penZ) {
        nlx = lx >= 0 ? ex : -ex;
      } else {
        nlz = lz >= 0 ? ez : -ez;
      }
      const wCos = Math.cos(rot);
      const wSin = Math.sin(rot);
      x = b.x + (nlx * wCos - nlz * wSin);
      z = b.z + (nlx * wSin + nlz * wCos);
    }
  }

  // 4. Water Bodies Barrier (unless standing on a walkable bridge!)
  if (!getBridgeInfoAt(x, z)) {
    // Central Enchanted Canal Ring around [0, -2] (r = 17.6..22.4)
    const cx = x;
    const cz = z + 2;
    const canalR = Math.hypot(cx, cz);
    if (canalR > 17.6 - PLAYER_RADIUS && canalR < 22.4 + PLAYER_RADIUS) {
      const targetR = canalR < 20.0 ? 17.6 - PLAYER_RADIUS : 22.4 + PLAYER_RADIUS;
      if (canalR > 0.001) {
        x = (cx / canalR) * targetR;
        z = -2 + (cz / canalR) * targetR;
      }
    }

    // Frozen Lake ([-40, -24.5], r = 6.2)
    const flx = x + 40;
    const flz = z + 24.5;
    const flD = Math.hypot(flx, flz);
    if (flD < 6.2 + PLAYER_RADIUS && flD > 0.001) {
      const k = (6.2 + PLAYER_RADIUS) / flD;
      x = -40 + flx * k;
      z = -24.5 + flz * k;
    }

    // Tulip Lily Lake ([-36, 22.5], r = 5.2)
    const tlx = x + 36;
    const tlz = z - 22.5;
    const tlD = Math.hypot(tlx, tlz);
    if (tlD < 5.2 + PLAYER_RADIUS && tlD > 0.001) {
      const k = (5.2 + PLAYER_RADIUS) / tlD;
      x = -36 + tlx * k;
      z = 22.5 + tlz * k;
    }
  }

  return { x, z };
}

export function getSurfaceKind(
  x: number,
  z: number
): 'wood' | 'stone' | 'cobble' | 'snow' | 'grass' {
  const onBridge = getBridgeInfoAt(x, z);
  if (onBridge) return onBridge.bridge.surface;

  if (Math.hypot(x + 46, z + 33) <= 24 || Math.hypot(x + 35, z + 20) <= 12) {
    return 'snow';
  }
  // Entrance promenade & plaza cobblestone
  if ((Math.abs(x) <= 2.6 && z >= -18 && z <= 55) || Math.hypot(x, z - 6) <= 8.6 || Math.hypot(x, z + 33.6) <= 8.0) {
    return 'cobble';
  }
  if (Math.hypot(x - 48, z + 2) <= 6.5 || Math.hypot(x - 17, z - 22) <= 3.6) {
    return 'stone';
  }
  return 'grass';
}

export function getZoneForPosition(x: number, z: number): {
  id: ParkDestinationId;
  name: string;
} {
  if (z > 38.2) {
    return { id: 'intro', name: 'Main Entrance Courtyard' };
  }
  if (Math.hypot(x + 46, z + 34) < 25) {
    return { id: 'frozen-kingdom', name: 'Frozen Kingdom' };
  }
  if (Math.hypot(x, z + 34) < 18) {
    return { id: 'fantasyland', name: 'Fantasy Kingdom' };
  }
  if (Math.hypot(x + 46, z - 14) < 22) {
    return { id: 'tulip-garden', name: 'Tulip Wonderland' };
  }
  if (Math.hypot(x - 46, z + 34) < 24) {
    return { id: 'galaxy-kingdom', name: 'Galaxy Kingdom' };
  }
  if (Math.hypot(x - 48, z + 2) < 16) {
    return { id: 'surprises', name: 'Birthday Celebration Kingdom' };
  }
  if (Math.hypot(x - 17, z - 22) < 9.5) {
    return { id: 'memories', name: 'Memory Pavilion' };
  }
  if (Math.hypot(x - 48, z - 28) < 22) {
    return { id: 'adventure-kingdom', name: 'Adventure Kingdom' };
  }
  if (Math.hypot(x, z - 6) < 15) {
    return { id: 'hub', name: 'Wishing Plaza' };
  }
  if (Math.abs(x) <= 6 && z >= 14 && z <= 38.2) {
    return { id: 'hub', name: 'Royal Promenade' };
  }
  return { id: 'hub', name: 'Wonderland Pathways' };
}

export function getNearestWaterDistance(x: number, z: number): number {
  const canalR = Math.hypot(x, z + 2);
  const canalDist = Math.abs(canalR - 20.0);
  const fountainDist = Math.hypot(x, z - 6.0);
  const waterfallDist = Math.hypot(x - 56, z - 32.5);
  const tulipPondDist = Math.hypot(x + 36, z - 22.5);
  return Math.min(canalDist, fountainDist, waterfallDist, tulipPondDist);
}
