import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PETAL_COLORS = ['#F7C6D9', '#FADAE6', '#FFF3EA', '#E3D5FA', '#FFDCE8'];

export function MagicalAtmosphere() {
  const petalsRef = useRef<THREE.InstancedMesh>(null);
  const starsRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const petalGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(0.12, 0.14, 0.06, 0.3);
    shape.quadraticCurveTo(0, 0.36, -0.06, 0.3);
    shape.quadraticCurveTo(-0.12, 0.14, 0, 0);
    return new THREE.ShapeGeometry(shape, 6);
  }, []);

  const petalSeeds = useMemo(() => {
    let s = 109;
    const rand = () => {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };

    return Array.from({ length: 85 }, () => ({
      x: (rand() - 0.5) * 34,
      y: 1.5 + rand() * 14,
      z: (rand() - 0.5) * 38,
      speedY: 0.32 + rand() * 0.45,
      swayAmp: 0.45 + rand() * 0.65,
      phase: rand() * Math.PI * 2,
      scale: 0.65 + rand() * 0.65,
      color: new THREE.Color(PETAL_COLORS[Math.floor(rand() * PETAL_COLORS.length)]),
    }));
  }, []);

  const starSeeds = useMemo(() => {
    let s = 777;
    const rand = () => {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };

    return Array.from({ length: 70 }, () => ({
      x: (rand() - 0.5) * 44,
      y: 3.5 + rand() * 18,
      z: -24 + rand() * 44,
      phase: rand() * Math.PI * 2,
      speed: 1.4 + rand() * 1.8,
      baseScale: 0.08 + rand() * 0.12,
    }));
  }, []);

  const skyShaderArgs = useMemo(
    () => ({
      uniforms: {
        topColor: { value: new THREE.Color('#9ED4F5') },
        midColor: { value: new THREE.Color('#E3D7FA') },
        bottomColor: { value: new THREE.Color('#FFF2E6') },
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 midColor;
        uniform vec3 bottomColor;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition).y;
          vec3 col = mix(bottomColor, midColor, smoothstep(-0.08, 0.28, h));
          col = mix(col, topColor, smoothstep(0.24, 0.78, h));
          gl_FragColor = vec4(col, 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false,
    }),
    []
  );

  useEffect(() => {
    if (!petalsRef.current) return;
    petalSeeds.forEach((seed, idx) => {
      petalsRef.current!.setColorAt(idx, seed.color);
    });
    if (petalsRef.current.instanceColor) {
      petalsRef.current.instanceColor.needsUpdate = true;
    }
  }, [petalSeeds]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (petalsRef.current) {
      for (let i = 0; i < petalSeeds.length; i++) {
        const p = petalSeeds[i];
        const yRange = 14;
        const y = ((p.y - t * p.speedY) % yRange + yRange) % yRange + 0.8;
        const x = p.x + Math.sin(t * 0.8 + p.phase) * p.swayAmp;
        const z = p.z + Math.cos(t * 0.65 + p.phase) * p.swayAmp * 0.7;

        dummy.position.set(x, y, z);
        dummy.rotation.set(
          t * 0.7 + p.phase,
          t * 0.9 + p.phase,
          Math.sin(t + p.phase) * 0.6
        );
        dummy.scale.setScalar(p.scale);
        dummy.updateMatrix();
        petalsRef.current.setMatrixAt(i, dummy.matrix);
      }
      petalsRef.current.instanceMatrix.needsUpdate = true;
    }

    if (starsRef.current) {
      for (let i = 0; i < starSeeds.length; i++) {
        const st = starSeeds[i];
        const twinkle = 0.55 + 0.45 * Math.sin(t * st.speed + st.phase);
        dummy.position.set(st.x, st.y + Math.sin(t * 0.6 + st.phase) * 0.2, st.z);
        dummy.rotation.set(0, t * 0.8 + st.phase, Math.PI / 4);
        dummy.scale.setScalar(st.baseScale * twinkle);
        dummy.updateMatrix();
        starsRef.current.setMatrixAt(i, dummy.matrix);
      }
      starsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Painterly Pastel Sky Dome */}
      <mesh>
        <sphereGeometry args={[95, 24, 16]} />
        <shaderMaterial args={[skyShaderArgs]} />
      </mesh>

      {/* Floating Pastel Tulip Petals */}
      <instancedMesh
        ref={petalsRef}
        args={[petalGeometry, undefined, petalSeeds.length]}
      >
        <meshStandardMaterial
          color="#FFFFFF"
          side={THREE.DoubleSide}
          roughness={0.55}
        />
      </instancedMesh>

      {/* Sparkling Golden Stars */}
      <instancedMesh
        ref={starsRef}
        args={[undefined, undefined, starSeeds.length]}
      >
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#FFF2BD"
          emissive="#FFD372"
          emissiveIntensity={1.15}
          roughness={0.2}
        />
      </instancedMesh>
    </group>
  );
}
