"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Torus, Sphere } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function BronzeRings({
  pointer,
}: {
  pointer: React.RefObject<THREE.Vector2>;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // Rings rotate slowly + tilt toward cursor (magnet effect)
    groupRef.current.rotation.y += delta * 0.15;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      pointer.current.y * 0.3,
      0.05,
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      pointer.current.x * -0.2,
      0.05,
    );
  });

  return (
    <group ref={groupRef}>
      <Torus args={[2.2, 0.06, 64, 128]} rotation={[0, 0, 0]}>
        <meshStandardMaterial
          color="#C5A065"
          metalness={1}
          roughness={0.25}
          envMapIntensity={2.5}
        />
      </Torus>
      <Torus
        args={[1.8, 0.045, 64, 128]}
        rotation={[Math.PI / 3, Math.PI / 4, 0]}
      >
        <meshStandardMaterial
          color="#B87333"
          metalness={1}
          roughness={0.3}
          envMapIntensity={2}
        />
      </Torus>
      <Torus
        args={[1.4, 0.035, 64, 128]}
        rotation={[-Math.PI / 3, Math.PI / 2, Math.PI / 6]}
      >
        <meshStandardMaterial
          color="#C0C0C0"
          metalness={0.95}
          roughness={0.15}
          envMapIntensity={3}
        />
      </Torus>
    </group>
  );
}

function OrbitingSpheres({
  pointer,
}: {
  pointer: React.MutableRefObject<THREE.Vector2>;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y -= delta * 0.25;
    // Magnet pull: spheres shift toward cursor direction
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      pointer.current.x * 0.6,
      0.03,
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      pointer.current.y * 0.4,
      0.03,
    );
  });

  const spheres = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        angle: (i / 8) * Math.PI * 2,
        radius: 2.8 + Math.sin(i * 2.5) * 0.4,
        y: Math.sin(i * 1.8) * 0.8,
        size: 0.08 + Math.random() * 0.06,
      })),
    [],
  );

  return (
    <group ref={groupRef}>
      {spheres.map((s, i) => (
        <Float
          key={i}
          speed={2 + i * 0.3}
          rotationIntensity={0.5}
          floatIntensity={0.8}
        >
          <Sphere
            args={[s.size, 32, 32]}
            position={[
              Math.cos(s.angle) * s.radius,
              s.y,
              Math.sin(s.angle) * s.radius,
            ]}
          >
            <meshStandardMaterial
              color={i % 2 === 0 ? "#C5A065" : "#F5F5F5"}
              metalness={1}
              roughness={0.1}
              envMapIntensity={3}
            />
          </Sphere>
        </Float>
      ))}
    </group>
  );
}

function KineticScene() {
  const pointer = useRef(new THREE.Vector2(0, 0));

  useFrame((state) => {
    // Normalize pointer to -1..1 range
    pointer.current.set(
      (state.pointer.x * 2 - 1) * 0.8,
      (state.pointer.y * 2 - 1) * 0.8,
    );
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        color="#F5F5F5"
        castShadow
      />
      <pointLight position={[-4, 2, -4]} intensity={0.6} color="#C5A065" />
      <pointLight position={[3, -3, 4]} intensity={0.4} color="#B87333" />

      <BronzeRings pointer={pointer} />
      <OrbitingSpheres pointer={pointer} />

      <Environment preset="studio" environmentIntensity={0.4} />
    </>
  );
}

export function KineticHero() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <KineticScene />
      </Canvas>
    </div>
  );
}
