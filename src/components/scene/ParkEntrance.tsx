import { useMemo } from 'react';
import * as THREE from 'three';
import { birthdayConfig } from '../../config/birthdayConfig';
import { getPBRTextureSet } from '../../utils/pbrMaterials';
import { KenneyModel } from './KenneyModel';

function makeWelcomeBannerTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 1024, 0);
  grad.addColorStop(0, '#FDF0F5');
  grad.addColorStop(0.5, '#FFF8EE');
  grad.addColorStop(1, '#EDE5FA');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 256);

  ctx.strokeStyle = '#E2A84B';
  ctx.lineWidth = 14;
  ctx.strokeRect(14, 14, 996, 228);

  ctx.fillStyle = '#8D6EC2';
  ctx.font = '700 28px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('WELCOME TO', 512, 72);

  ctx.fillStyle = '#3B2B4B';
  ctx.font = 'bold 58px Georgia, serif';
  ctx.fillText(birthdayConfig.parkTitle, 512, 152);

  ctx.fillStyle = '#C8842B';
  ctx.font = '600 24px system-ui, sans-serif';
  ctx.fillText('Six Fairytale Kingdoms • Walk Through The Gates', 512, 206);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function ParkEntrance() {
  const cobbleTex = useMemo(() => getPBRTextureSet('cobblestone_floor_02', 6, 4), []);
  const brickTex = useMemo(() => getPBRTextureSet('castle_brick_02_white', 3, 2), []);
  const bannerTex = useMemo(() => makeWelcomeBannerTexture(), []);

  return (
    <group>
      {/* Outside-the-Gates Forecourt Cobblestone Plaza (z = 38..56) */}
      <mesh position={[0, 0.032, 46.5]} receiveShadow>
        <boxGeometry args={[28, 0.08, 17.5]} />
        <meshStandardMaterial
          map={cobbleTex.map}
          normalMap={cobbleTex.normalMap}
          roughnessMap={cobbleTex.roughnessMap}
          color="#FFF2EC"
          roughness={0.85}
        />
      </mesh>
      {/* Curb Trim Around Entrance Court */}
      <mesh position={[0, 0.06, 55.2]} receiveShadow>
        <boxGeometry args={[28.6, 0.14, 0.6]} />
        <meshStandardMaterial color="#E6D5CE" roughness={0.78} />
      </mesh>

      {/* Left & Right Ticket / Welcome Pavilions (Kenney CC0 Models!) */}
      <group position={[-7.8, 0.06, 43.5]} rotation={[0, 0.35, 0]}>
        <KenneyModel url="/models/stall-green.glb" scale={2.6} tintColor="#BFE3D0" />
      </group>
      <group position={[7.8, 0.06, 43.5]} rotation={[0, -0.35, 0]}>
        <KenneyModel url="/models/stall-red.glb" scale={2.6} tintColor="#FADAE6" />
      </group>

      {/* Flanking Garden Brick Boundary Walls & Decorative Wrought Gates at z = 38 */}
      {[-1, 1].map((side) => (
        <group key={side}>
          {/* Brick Low Wall Segment */}
          <mesh position={[side * 8.6, 0.72, 38]} castShadow receiveShadow>
            <boxGeometry args={[10.2, 1.4, 0.75]} />
            <meshStandardMaterial
              map={brickTex.map}
              normalMap={brickTex.normalMap}
              roughnessMap={brickTex.roughnessMap}
              color="#FFF1EE"
              roughness={0.72}
            />
          </mesh>
          {/* Coping Top */}
          <mesh position={[side * 8.6, 1.46, 38]} castShadow>
            <boxGeometry args={[10.4, 0.16, 0.92]} />
            <meshStandardMaterial color="#F7DFEA" roughness={0.62} />
          </mesh>

          {/* Ornamental Kenney Iron/Wood Gate & Hedge Planters */}
          <KenneyModel
            url="/models/fence-gate.glb"
            position={[side * 5.2, 1.86, 38]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[1.8, 1.9, 1.8]}
          />
          <KenneyModel
            url="/models/hedge-large.glb"
            position={[side * 6.2, 0.06, 40.2]}
            rotation={[0, Math.PI / 2, 0]}
            scale={2.2}
          />
          <KenneyModel
            url="/models/hedge-large.glb"
            position={[side * 10.6, 0.06, 40.2]}
            rotation={[0, Math.PI / 2, 0]}
            scale={2.2}
          />

          {/* Exterior Planter Flower Clumps */}
          <KenneyModel url="/models/flower_redA.glb" position={[side * 5.0, 0.06, 42.2]} scale={2.2} />
          <KenneyModel url="/models/flower_purpleA.glb" position={[side * 6.0, 0.06, 42.6]} scale={2.2} />
          <KenneyModel url="/models/flower_yellowA.glb" position={[side * 7.0, 0.06, 42.1]} scale={2.2} />

          {/* Ornate Entrance Street Lanterns */}
          <KenneyModel url="/models/lantern.glb" position={[side * 3.8, 0.06, 41.2]} scale={2.2} />
          <KenneyModel url="/models/lantern.glb" position={[side * 4.5, 0.06, 49.5]} scale={2.2} />
        </group>
      ))}

      {/* Grand Welcome Plaque Overhead Above Entrance Archway (faces outside camera at +Z) */}
      <group position={[0, 5.1, 38]}>
        <mesh castShadow>
          <boxGeometry args={[7.4, 1.85, 0.34]} />
          <meshStandardMaterial color="#F6BE65" metalness={0.45} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.19]}>
          <planeGeometry args={[7.0, 1.65]} />
          <meshStandardMaterial map={bannerTex} roughness={0.45} />
        </mesh>
        <mesh position={[0, 0, -0.19]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[7.0, 1.65]} />
          <meshStandardMaterial map={bannerTex} roughness={0.45} />
        </mesh>
      </group>

      {/* Subtle Warm Gatehouse Light */}
      <pointLight position={[0, 4.6, 40.5]} intensity={2.2} distance={18} color="#FFE0A3" />
    </group>
  );
}
