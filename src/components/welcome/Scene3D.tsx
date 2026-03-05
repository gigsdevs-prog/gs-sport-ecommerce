// ============================================
// GS SPORT - 3D Scene Components
// Three.js scene for the welcome intro
// ============================================

'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Center, Float, MeshReflectorMaterial, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';

// ---- 3D Logo with Extruded Look using multiple layers ----
function LogoLayer({ z, opacity, color }: { z: number; opacity: number; color: string }) {
  return (
    <Text
      fontSize={1.6}
      font="/fonts/Inter-Bold.woff"
      letterSpacing={0.15}
      position={[0, 0, z]}
      material-transparent
      material-opacity={opacity}
    >
      GS
      <meshStandardMaterial
        color={color}
        roughness={0.2}
        metalness={0.8}
        transparent
        opacity={opacity}
      />
    </Text>
  );
}

export function LogoText() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.12;
    const scale = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.008;
    groupRef.current.scale.setScalar(scale);
  });

  // Create layered depth effect
  const layers = useMemo(() => {
    const arr = [];
    const count = 8;
    for (let i = 0; i < count; i++) {
      const t = i / count;
      arr.push({
        z: -t * 0.12,
        opacity: i === 0 ? 1 : 0.15 + (1 - t) * 0.3,
        color: i === 0 ? '#0a0a0a' : `rgb(${30 + t * 40}, ${30 + t * 40}, ${30 + t * 40})`,
      });
    }
    return arr;
  }, []);

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.08}
      floatIntensity={0.25}
      floatingRange={[-0.04, 0.04]}
    >
      <Center>
        <group ref={groupRef}>
          {layers.map((layer, i) => (
            <LogoLayer key={i} {...layer} />
          ))}
        </group>
      </Center>
    </Float>
  );
}

// ---- Subtle "SPORT" text below ----
export function SportText() {
  return (
    <Text
      fontSize={0.35}
      font="/fonts/Inter-Bold.woff"
      letterSpacing={0.5}
      position={[0, -1.0, 0]}
      material-transparent
    >
      SPORT
      <meshStandardMaterial
        color="#0a0a0a"
        roughness={0.3}
        metalness={0.7}
        transparent
        opacity={0.9}
      />
    </Text>
  );
}

// ---- Light Sweep Effect ----
export function LightSweep() {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!lightRef.current) return;
    const t = state.clock.elapsedTime;
    lightRef.current.position.x = Math.sin(t * 0.5) * 4;
    lightRef.current.position.z = Math.cos(t * 0.5) * 3;
    lightRef.current.intensity = 15 + Math.sin(t * 2) * 5;
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-3, 3, -3]} intensity={0.5} />
      <pointLight ref={lightRef} position={[0, 2, 3]} intensity={15} color="#ffffff" />
      <spotLight
        position={[0, 8, 0]}
        angle={0.4}
        penumbra={0.8}
        intensity={1.5}
        castShadow
        shadow-mapSize={512}
      />
    </>
  );
}

// ---- Reflective Floor ----
export function ReflectiveFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <MeshReflectorMaterial
        mirror={0.12}
        blur={[300, 100]}
        resolution={512}
        mixBlur={1}
        mixStrength={0.25}
        roughness={1}
        depthScale={1}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#f5f5f5"
        metalness={0}
      />
    </mesh>
  );
}

// ---- Cursor Parallax Camera ----
export function ParallaxCamera() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  useFrame(() => {
    camera.position.x += (mouse.current.x * 0.3 - camera.position.x) * 0.05;
    camera.position.y += (-mouse.current.y * 0.2 + 0.5 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ---- Full Scene ----
export function Scene() {
  return (
    <>
      <LightSweep />
      <LogoText />
      <ReflectiveFloor />
      <ParallaxCamera />
      <Environment preset="studio" environmentIntensity={0.5} />
      <fog attach="fog" args={['#fafafa', 5, 15]} />
    </>
  );
}
