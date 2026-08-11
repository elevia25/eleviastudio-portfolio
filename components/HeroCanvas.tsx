"use client";

import { useEffect, useRef } from "react";

import * as THREE from "three";

type HeroVariant = "orb" | "inspection" | "pipeline";

type HeroSectionProps = {
  variant?: HeroVariant;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const smoothstep = (edge0: number, edge1: number, value: number) => {
  const x = clamp01((value - edge0) / (edge1 - edge0));
  return x * x * (3 - 2 * x);
};

const fract = (value: number) => value - Math.floor(value);

const seeded = (index: number, salt = 1) => {
  return fract(Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453);
};

function setupRenderer(
  container: HTMLDivElement,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
) {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  container.appendChild(renderer.domElement);

  const resize = () => {
    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);

    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();

  return () => {
    observer.disconnect();

    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }

    renderer.dispose();
  };
}

function FloatingBadge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`absolute rounded-full border border-cyan-300/20 bg-white/4 px-4 py-2 text-xs font-medium text-cyan-50/80 shadow-[0_0_30px_rgba(34,211,238,0.12)] backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
}

function QualityIntelligenceCore() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 3.45);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    const cleanupRenderer = setupRenderer(container, camera, renderer);

    const particleCount = 3600;
    const radius = 1;

    const basePositions = new Float32Array(particleCount * 3);
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const offsets = new Float32Array(particleCount * 3);
    const defectFlags = new Uint8Array(particleCount);

    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      const index = i * 3;

      basePositions[index] = x * radius;
      basePositions[index + 1] = y * radius;
      basePositions[index + 2] = z * radius;

      positions[index] = basePositions[index];
      positions[index + 1] = basePositions[index + 1];
      positions[index + 2] = basePositions[index + 2];

      offsets[index] = (seeded(i, 1) - 0.5) * 0.22;
      offsets[index + 1] = (seeded(i, 2) - 0.5) * 0.22;
      offsets[index + 2] = (seeded(i, 3) - 0.5) * 0.22;
    }

    for (let i = 0; i < 52; i++) {
      defectFlags[(i * 89 + 31) % particleCount] = 1;
    }

    const geometry = new THREE.BufferGeometry();
    const positionAttribute = new THREE.BufferAttribute(positions, 3);
    const colorAttribute = new THREE.BufferAttribute(colors, 3);

    positionAttribute.setUsage(THREE.DynamicDrawUsage);
    colorAttribute.setUsage(THREE.DynamicDrawUsage);

    geometry.setAttribute("position", positionAttribute);
    geometry.setAttribute("color", colorAttribute);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.017,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    const sphere = new THREE.Points(geometry, particleMaterial);
    sphere.rotation.x = 0.28;
    sphere.rotation.z = 0.12;
    scene.add(sphere);

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: "#4ee7ff",
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    });

    const ringGroup = new THREE.Group();

    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(1.18, 0.003, 8, 180),
      ringMaterial.clone(),
    );
    ring1.rotation.x = Math.PI / 2.7;

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.26, 0.003, 8, 180),
      ringMaterial.clone(),
    );
    ring2.rotation.y = Math.PI / 2.2;

    const ring3 = new THREE.Mesh(
      new THREE.TorusGeometry(1.1, 0.003, 8, 180),
      ringMaterial.clone(),
    );
    ring3.rotation.x = Math.PI / 2;
    ring3.rotation.z = Math.PI / 4;

    ringGroup.add(ring1, ring2, ring3);
    scene.add(ringGroup);

    const scannerMaterial = new THREE.MeshBasicMaterial({
      color: "#7cf9ff",
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // const scannerRing = new THREE.Mesh(
    //   new THREE.TorusGeometry(1.04, 0.006, 10, 180),
    //   scannerMaterial,
    // );
    // scannerRing.rotation.x = Math.PI / 2;

    const verificationMaterial = new THREE.MeshBasicMaterial({
      color: "#9bffcf",
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const verificationRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.74, 0.005, 10, 160),
      verificationMaterial,
    );
    // scene.add(verificationRing);

    const baseColor = new THREE.Color("#dff8ff");
    const accentColor = new THREE.Color("#4ee7ff");
    const correctionColor = new THREE.Color("#9bffcf");
    const defectColor = new THREE.Color("#ffbf69");

    let animationFrameId = 0;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = (now - start) / 1000;
      const cycle = (elapsed % 9) / 9;

      const scanProgress = cycle < 0.68 ? cycle / 0.68 : 1;
      const scanY = -1.14 + scanProgress * 2.28;

      // scannerRing.position.y = scanY;
      scannerMaterial.opacity = cycle < 0.72 ? 0.78 : 0;

      const defectIn = smoothstep(0.16, 0.34, cycle);
      const defectOut = 1 - smoothstep(0.52, 0.74, cycle);
      const defectAmount = defectIn * defectOut;

      const verifyGrow = smoothstep(0.68, 0.94, cycle);
      const verifyFade = 1 - smoothstep(0.74, 0.96, cycle);
      verificationRing.scale.setScalar(0.85 + verifyGrow * 0.58);
      verificationMaterial.opacity =
        verifyFade * smoothstep(0.66, 0.74, cycle) * 0.5;

      for (let i = 0; i < particleCount; i++) {
        const index = i * 3;

        const baseX = basePositions[index];
        const baseY = basePositions[index + 1];
        const baseZ = basePositions[index + 2];

        const isDefect = defectFlags[i] === 1;

        positions[index] =
          baseX + (isDefect ? offsets[index] * defectAmount : 0);
        positions[index + 1] =
          baseY + (isDefect ? offsets[index + 1] * defectAmount : 0);
        positions[index + 2] =
          baseZ + (isDefect ? offsets[index + 2] * defectAmount : 0);

        const distToScan = Math.abs(baseY - scanY);
        const scanGlow = clamp01(1 - distToScan / 0.075);
        const frontDepth = clamp01((baseZ + 1) / 2);

        const color = baseColor.clone();
        color.multiplyScalar(0.42 + frontDepth * 0.52);

        if (scanGlow > 0) {
          color.lerp(accentColor, scanGlow * 0.9);
        }

        if (isDefect && defectAmount > 0.08) {
          color.lerp(defectColor, defectAmount * 0.85);
        }

        if (isDefect && cycle > 0.62 && cycle < 0.82) {
          color.lerp(correctionColor, 0.6);
        }

        colors[index] = clamp01(color.r);
        colors[index + 1] = clamp01(color.g);
        colors[index + 2] = clamp01(color.b);
      }

      positionAttribute.needsUpdate = true;
      colorAttribute.needsUpdate = true;

      sphere.rotation.y += 0.003;
      sphere.rotation.x += 0.0008;

      ringGroup.rotation.y -= 0.0016;
      ringGroup.rotation.x += 0.0008;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);

      geometry.dispose();
      particleMaterial.dispose();

      ring1.geometry.dispose();
      ring2.geometry.dispose();
      ring3.geometry.dispose();
      // scannerRing.geometry.dispose();
      // verificationRing.geometry.dispose();

      ringMaterial.dispose();
      scannerMaterial.dispose();
      verificationMaterial.dispose();

      cleanupRenderer();
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="absolute inset-0" />

      <FloatingBadge className="left-[5%] top-[18%]">Detect</FloatingBadge>
      <FloatingBadge className="right-[7%] top-[25%]">Verify</FloatingBadge>
      <FloatingBadge className="bottom-[20%] left-[9%]">Correct</FloatingBadge>
      <FloatingBadge className="bottom-[14%] right-[12%]">
        Improve
      </FloatingBadge>
    </div>
  );
}

export default function HeroCanvas({ variant }: HeroSectionProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.35, 4),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#77241D"),
        roughness: 0.28,
        metalness: 0.52,
        transparent: true,
        opacity: 0.88,
      }),
    );
    group.add(core);

    const wire = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.72, 0.012, 240, 12),
      new THREE.MeshBasicMaterial({
        color: "#F7EEE8",
        transparent: true,
        opacity: 0.54,
      }),
    );
    group.add(wire);

    const particleCount = 320;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const radius = 2.2 + Math.random() * 1.55;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    const particles = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({
        color: "#D6B8AD",
        size: 0.022,
        transparent: true,
        opacity: 0.8,
      }),
    );
    group.add(particles);

    const ambient = new THREE.AmbientLight("#ffffff", 1.3);
    scene.add(ambient);
    const warmLight = new THREE.PointLight("#C75542", 5, 12);
    warmLight.position.set(2.4, 2.2, 3.8);
    scene.add(warmLight);
    const coolLight = new THREE.PointLight("#F7EEE8", 2.2, 10);
    coolLight.position.set(-3, -1.8, 2.5);
    scene.add(coolLight);

    let frameId = 0;
    const pointer = { x: 0, y: 0 };

    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 0.5;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 0.5;
    };

    const onResize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    mount.addEventListener("pointermove", onPointerMove);
    window.addEventListener("resize", onResize);

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      group.rotation.y += 0.004;
      group.rotation.x += 0.0018;
      particles.rotation.y -= 0.0015;
      core.rotation.y += 0.002;
      wire.rotation.x += 0.004;
      camera.position.x += (pointer.x - camera.position.x) * 0.035;
      camera.position.y += (-pointer.y - camera.position.y) * 0.035;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      mount.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      core.geometry.dispose();
      wire.geometry.dispose();
      particleGeo.dispose();
    };
  }, []);
  return variant === "orb" ? (
    <QualityIntelligenceCore />
  ) : (
    <div
      ref={mountRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
