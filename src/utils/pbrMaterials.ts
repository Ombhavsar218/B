import * as THREE from 'three';

export type TextureSetId =
  | 'castle_brick_02_white'
  | 'cobblestone_floor_02'
  | 'leafy_grass'
  | 'snow_02'
  | 'oak_wood_planks'
  | 'marble_01';

export interface PBRTextureSet {
  map: THREE.Texture;
  normalMap: THREE.Texture;
  roughnessMap: THREE.Texture;
}

const loader = new THREE.TextureLoader();
const setCache = new Map<string, PBRTextureSet>();
let waterNormalCache: THREE.Texture | null = null;

function configureTexture(
  tex: THREE.Texture,
  repeatX: number,
  repeatY: number,
  isColor: boolean
): THREE.Texture {
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = 8;
  tex.colorSpace = isColor ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function getPBRTextureSet(
  id: TextureSetId,
  repeatX = 4,
  repeatY = 4
): PBRTextureSet {
  const key = `${id}:${repeatX}:${repeatY}`;
  const existing = setCache.get(key);
  if (existing) return existing;

  const base = `/textures/${id}`;
  const set: PBRTextureSet = {
    map: configureTexture(loader.load(`${base}/diff.jpg`), repeatX, repeatY, true),
    normalMap: configureTexture(loader.load(`${base}/nor.jpg`), repeatX, repeatY, false),
    roughnessMap: configureTexture(loader.load(`${base}/rough.jpg`), repeatX, repeatY, false),
  };

  setCache.set(key, set);
  return set;
}

export function getWaterNormalTexture(repeatX = 8, repeatY = 8): THREE.Texture {
  if (!waterNormalCache) {
    waterNormalCache = configureTexture(
      loader.load('/textures/waternormals.jpg'),
      repeatX,
      repeatY,
      false
    );
  }
  return waterNormalCache;
}
