import { useMemo } from 'react';
import * as THREE from 'three';

function CurvedPath({
  points,
  radius = 1.15,
  color = '#FAF0E6',
}: {
  points: [number, number, number][];
  radius?: number;
  color?: string;
}) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      points.map((p) => new THREE.Vector3(p[0], 0, p[2]))
    );
    return new THREE.TubeGeometry(curve, 32, radius, 8, false);
  }, [points, radius]);

  return (
    <mesh geometry={geometry} position={[0, 0.015, 0]} scale={[1, 0.07, 1]} receiveShadow>
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  );
}

export function ParkGrounds() {
  const promenadeLanternPositions: [number, number, number][] = useMemo(
    () => [
      [-2.3, 0, 18.5],
      [2.3, 0, 18.5],
      [-2.3, 0, 13.5],
      [2.3, 0, 13.5],
      [-2.3, 0, 8.8],
      [2.3, 0, 8.8],
      [-2.4, 0, -2.2],
      [2.4, 0, -2.2],
    ],
    []
  );

  return (
    <group>
      {/* Main Lush Pastel-Emerald Meadow Island (Top at y = 0) */}
      <mesh position={[0, -0.45, 0]} receiveShadow>
        <cylinderGeometry args={[26.2, 25.6, 0.9, 56]} />
        <meshStandardMaterial color="#BFE5C2" roughness={0.9} />
      </mesh>

      {/* Soft Inner Sunlit Grass Halo */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[20.5, 48]} />
        <meshStandardMaterial color="#CBEBCB" roughness={0.92} />
      </mesh>

      {/* Outer Island Sandstone Rim & Floating Base */}
      <mesh position={[0, -2.2, 0]}>
        <cylinderGeometry args={[25.4, 18.2, 2.9, 36]} />
        <meshStandardMaterial color="#EADAD2" roughness={0.88} />
      </mesh>
      <mesh position={[0, -0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[26.1, 0.28, 10, 64]} />
        <meshStandardMaterial color="#F7EBDD" roughness={0.78} />
      </mesh>

      {/* Central Wishing Plaza (centered at [0, 0, 2]) */}
      <mesh position={[0, 0.03, 2.0]} receiveShadow>
        <cylinderGeometry args={[5.8, 5.95, 0.08, 48]} />
        <meshStandardMaterial color="#FDF3E7" roughness={0.8} />
      </mesh>
      {/* Decorative Lavender & Pink Plaza Inlay Rings */}
      <mesh position={[0, 0.075, 2.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.9, 4.45, 48]} />
        <meshStandardMaterial color="#E6DAF8" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.078, 2.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.35, 5.65, 48]} />
        <meshStandardMaterial color="#F7D5E2" roughness={0.75} />
      </mesh>

      {/* Grand Entrance Promenade (South -> Central Plaza) */}
      <mesh position={[0, 0.03, 13.8]} receiveShadow>
        <boxGeometry args={[3.4, 0.08, 15.2]} />
        <meshStandardMaterial color="#FDF3E7" roughness={0.82} />
      </mesh>
      {/* Promenade Golden/Pink Side Edging */}
      {[-1.78, 1.78].map((x) => (
        <mesh key={x} position={[x, 0.06, 13.8]} receiveShadow>
          <boxGeometry args={[0.22, 0.1, 15.2]} />
          <meshStandardMaterial color="#F2D7DF" roughness={0.75} />
        </mesh>
      ))}

      {/* Royal Castle Avenue (Central Plaza -> Castle Terrace) */}
      <mesh position={[0, 0.035, -2.5]} receiveShadow>
        <boxGeometry args={[3.6, 0.08, 4.6]} />
        <meshStandardMaterial color="#FDF3E7" roughness={0.82} />
      </mesh>

      {/* Curved Stone Pathways to All Park Lands */}
      {/* Plaza -> Tulip Wonderland (West) */}
      <CurvedPath
        points={[
          [-4.8, 0, 2.2],
          [-7.6, 0, 3.0],
          [-11.5, 0, 3.5],
        ]}
        radius={1.15}
      />
      {/* Plaza -> Memory Pavilion (East) */}
      <CurvedPath
        points={[
          [4.8, 0, 2.2],
          [8.0, 0, 2.5],
          [11.2, 0, 2.5],
        ]}
        radius={1.1}
      />
      {/* Plaza / Castle Avenue -> Celebration Lawn (Northeast) */}
      <CurvedPath
        points={[
          [2.2, 0, -1.6],
          [6.2, 0, -4.6],
          [10.0, 0, -8.0],
        ]}
        radius={1.05}
      />

      {/* Wonderland Entrance Golden Gate Pillars (at z = 20.8) */}
      {[-2.25, 2.25].map((x) => (
        <group key={x} position={[x, 0, 20.8]}>
          <mesh position={[0, 0.9, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.4, 1.8, 14]} />
            <meshStandardMaterial color="#FFF6EC" roughness={0.65} />
          </mesh>
          <mesh position={[0, 1.9, 0]} castShadow>
            <sphereGeometry args={[0.34, 14, 14]} />
            <meshStandardMaterial color="#F7C6D9" roughness={0.5} />
          </mesh>
          <mesh position={[0, 2.38, 0]}>
            <octahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial
              color="#FFD98E"
              emissive="#F6BE65"
              emissiveIntensity={0.45}
              metalness={0.4}
              roughness={0.25}
            />
          </mesh>
        </group>
      ))}

      {/* Ornamental Path Lanterns */}
      {promenadeLanternPositions.map((pos, idx) => (
        <group key={idx} position={pos}>
          <mesh position={[0, 0.72, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.09, 1.44, 10]} />
            <meshStandardMaterial color="#6D5783" roughness={0.5} />
          </mesh>
          <mesh position={[0, 1.52, 0]}>
            <sphereGeometry args={[0.17, 12, 12]} />
            <meshStandardMaterial
              color="#FFF0BF"
              emissive="#FFD47D"
              emissiveIntensity={0.8}
            />
          </mesh>
          <mesh position={[0, 1.72, 0]}>
            <coneGeometry args={[0.22, 0.16, 8]} />
            <meshStandardMaterial color="#9A7BC8" roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
