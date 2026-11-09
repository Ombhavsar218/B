import { useMemo } from 'react';
import * as THREE from 'three';
import { KenneyModel } from './KenneyModel';

interface SignSpec {
  position: [number, number, number];
  rotationY: number;
  title: string;
  subtitle: string;
  accent?: string;
}

function makePlaqueTexture(title: string, subtitle: string, accent: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 192;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#FFF7EB';
  ctx.fillRect(0, 0, 512, 192);

  ctx.strokeStyle = accent;
  ctx.lineWidth = 10;
  ctx.strokeRect(10, 10, 492, 172);

  ctx.fillStyle = '#3B2B4B';
  ctx.font = 'bold 42px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, 256, 86);

  ctx.fillStyle = '#735599';
  ctx.font = '600 28px system-ui, sans-serif';
  ctx.fillText(subtitle, 256, 140);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function TrailSignpost({ position, rotationY, title, subtitle, accent = '#E2B362' }: SignSpec) {
  const plaqueTex = useMemo(() => makePlaqueTexture(title, subtitle, accent), [title, subtitle, accent]);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <KenneyModel url="/models/sign.glb" scale={3.1} />
      {/* Readable Front & Back Painted Directional Board */}
      <mesh position={[0, 1.02, 0.13]} castShadow>
        <boxGeometry args={[1.42, 0.56, 0.08]} />
        <meshStandardMaterial color="#8A6343" roughness={0.78} />
      </mesh>
      <mesh position={[0, 1.02, 0.18]}>
        <planeGeometry args={[1.32, 0.48]} />
        <meshStandardMaterial map={plaqueTex} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.02, 0.08]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.32, 0.48]} />
        <meshStandardMaterial map={plaqueTex} roughness={0.6} />
      </mesh>
    </group>
  );
}

const PARK_SIGNS: SignSpec[] = [
  {
    position: [-3.4, 0, 32],
    rotationY: 0.3,
    title: 'Wishing Plaza & Castle',
    subtitle: 'Straight Ahead (North)',
    accent: '#D99B38',
  },
  {
    position: [-4.8, 0, 11.8],
    rotationY: -0.7,
    title: 'Frozen Kingdom',
    subtitle: 'Northwest Bridge ->',
    accent: '#82D1F7',
  },
  {
    position: [-9.2, 0, 5.2],
    rotationY: -1.3,
    title: 'Tulip Wonderland',
    subtitle: 'West Flower Bridge ->',
    accent: '#F59BB9',
  },
  {
    position: [5.4, 0, 0.2],
    rotationY: 0.9,
    title: 'Galaxy & Celebration',
    subtitle: 'East Bridges ->',
    accent: '#A799FF',
  },
  {
    position: [7.6, 0, 10.6],
    rotationY: 2.2,
    title: 'Memories & Adventure',
    subtitle: 'Southeast Trail ->',
    accent: '#76C893',
  },
  {
    position: [-3.2, 0, -17.5],
    rotationY: 0.25,
    title: 'Fantasy Castle',
    subtitle: 'Cross Royal Bridge',
    accent: '#B89CEB',
  },
];

export function ParkSignposts() {
  return (
    <group>
      {PARK_SIGNS.map((sign, idx) => (
        <TrailSignpost key={idx} {...sign} />
      ))}
    </group>
  );
}
