"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import SectionHeading, {
  SECTION_SHELL_CLASS,
  SECTION_VIEWPORT_CLASS,
} from "./SectionHeading";
import { BLUR, EASE, PINNED_SCRUB, PINNED_SNAP } from "@/lib/motion";

const SLIDES = [
  {
    background: "#FED623",
    textColor: "#062145",
    logo: "/logos/dice/logo-1.png",
  },
  {
    background: "#06363B",
    textColor: "#CEDEC2",
    logo: "/logos/dice/logo-2.png",
  },
  {
    background: "#32A544",
    textColor: "#062145",
    logo: "/logos/dice/logo-3.png",
  },
  {
    background: "#F3B83D",
    textColor: "#062145",
    logo: "/logos/dice/logo-4.png",
  },
  {
    background: "#193B0C",
    textColor: "#CEDEC2",
    logo: "/logos/dice/logo-5.png",
  },
  {
    background: "#CEDEC2",
    textColor: "#193B0C",
    logo: "/logos/dice/logo-6.png",
  },
] as const;

const DICE_SIZE = 3.2;
const HALF_DICE = DICE_SIZE / 2;
const FACE_OFFSET = HALF_DICE + 0.012;
const FACE_SIZE = 2.66;

type FacePlacement = {
  slideIndex: number;
  position: [number, number, number];
  rotation: [number, number, number];
};

const FACE_PLACEMENTS: FacePlacement[] = [
  // Front
  {
    slideIndex: 0,
    position: [0, 0, FACE_OFFSET],
    rotation: [0, 0, 0],
  },

  // Top
  {
    slideIndex: 1,
    position: [0, FACE_OFFSET, 0],
    rotation: [-Math.PI / 2, 0, 0],
  },

  // Back
  {
    slideIndex: 2,
    position: [0, 0, -FACE_OFFSET],
    rotation: [Math.PI, 0, 0],
  },

  // Left
  {
    slideIndex: 3,
    position: [-FACE_OFFSET, 0, 0],
    rotation: [Math.PI, -Math.PI / 2, 0],
  },

  // Bottom
  {
    slideIndex: 4,
    position: [0, -FACE_OFFSET, 0],
    rotation: [Math.PI / 2, 0, -Math.PI / 2],
  },

  // Right
  {
    slideIndex: 5,
    position: [FACE_OFFSET, 0, 0],
    rotation: [0, Math.PI / 2, 0],
  },
];

export default function LogoDiceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const shadow = shadowRef.current;
    const title = titleRef.current;
    const scrollHint = scrollHintRef.current;

    if (!section || !stage || !canvas || !shadow || !title || !scrollHint) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    let disposed = false;
    let refreshFrame = 0;
    let cleanupScene: (() => void) | null = null;

    const initScene = () => {
      if (disposed) {
        return;
      }

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      /*
       * Three.js scene
       */

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(
        32,
        stage.clientWidth / stage.clientHeight,
        0.1,
        100,
      );

      camera.position.set(0, 0, 8);

      const webglContext = canvas.getContext("webgl2", {
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });

      if (!webglContext) {
        console.error(
          "WebGL2 is unavailable. Check browser hardware acceleration.",
        );

        return;
      }

      const renderer = new THREE.WebGLRenderer({
        canvas,
        context: webglContext,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });

      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;

      const render = () => {
        if (!disposed) {
          renderer.render(scene, camera);
        }
      };

      /*
       * Scene groups
       *
       * responsiveGroup: responsive size and position
       * entranceGroup: entrance movement
       * rollingGroup: scroll-controlled dice rolling
       */

      const responsiveGroup = new THREE.Group();
      const entranceGroup = new THREE.Group();
      const rollingGroup = new THREE.Group();

      responsiveGroup.add(entranceGroup);
      entranceGroup.add(rollingGroup);
      scene.add(responsiveGroup);

      /*
       * Dice body
       */

      const bodyGeometry = new RoundedBoxGeometry(
        DICE_SIZE,
        DICE_SIZE,
        DICE_SIZE,
        6,
        0.18,
      );

      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: "#F4EFE8",
        roughness: 0.34,
        metalness: 0.04,
      });

      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);

      body.renderOrder = 1;
      rollingGroup.add(body);

      /*
       * Six logo faces
       *
       * Textures are loaded through a shared LoadingManager so we can
       * gate the entrance/scroll animation until every logo has
       * actually decoded, and skip mipmap generation entirely since
       * these are flat, fixed-distance faces that never need it.
       * Skipping mipmaps removes the biggest source of main-thread
       * jank when several images finish decoding close together.
       */

      const faceGeometry = new THREE.PlaneGeometry(FACE_SIZE, FACE_SIZE);

      const loadingManager = new THREE.LoadingManager();
      const textureLoader = new THREE.TextureLoader(loadingManager);

      const textures: THREE.Texture[] = [];
      const faceMaterials: THREE.MeshStandardMaterial[] = [];

      FACE_PLACEMENTS.forEach((placement) => {
        const slide = SLIDES[placement.slideIndex];

        const texture = textureLoader.load(
          slide.logo,
          undefined,
          undefined,
          (error) => {
            console.error(`Could not load dice logo: ${slide.logo}`, error);
          },
        );

        texture.colorSpace = THREE.SRGBColorSpace;
        texture.generateMipmaps = false;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        textures.push(texture);

        const material = new THREE.MeshStandardMaterial({
          map: texture,
          color: "#FFFFFF",
          transparent: true,
          roughness: 0.42,
          metalness: 0,
          side: THREE.FrontSide,
          polygonOffset: true,
          polygonOffsetFactor: -1,
          polygonOffsetUnits: -1,
        });

        faceMaterials.push(material);

        const face = new THREE.Mesh(faceGeometry, material);

        face.position.set(...placement.position);
        face.rotation.set(...placement.rotation);
        face.renderOrder = 2;

        rollingGroup.add(face);
      });

      /*
       * Lighting
       */

      const hemisphereLight = new THREE.HemisphereLight(
        0xffffff,
        0x393939,
        2.4,
      );

      const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);

      keyLight.position.set(4, 5, 7);

      scene.add(hemisphereLight, keyLight);

      /*
       * Responsive sizing
       */

      const resize = () => {
        const width = stage.clientWidth;
        const height = stage.clientHeight;

        const isMobile = width < 768;
        const isSmallMobile = width < 480;

        renderer.setPixelRatio(
          Math.min(window.devicePixelRatio, isMobile ? 1.2 : 1.45),
        );

        renderer.setSize(width, height, false);

        camera.aspect = width / height;
        camera.position.z = isMobile ? 9 : 8;
        camera.updateProjectionMatrix();

        /*
         * Smaller than the previous dice.
         */

        const responsiveScale = isSmallMobile ? 0.44 : isMobile ? 0.52 : 0.66;

        responsiveGroup.scale.setScalar(responsiveScale);

        responsiveGroup.position.y = isMobile ? -0.12 : -0.24;

        render();
      };

      const handleContextLost = (event: Event) => {
        event.preventDefault();

        console.warn("Logo dice WebGL context was lost.");
      };

      const handleContextRestored = () => {
        resize();
        render();
      };

      canvas.addEventListener("webglcontextlost", handleContextLost);

      canvas.addEventListener("webglcontextrestored", handleContextRestored);

      window.addEventListener("resize", resize, {
        passive: true,
      });

      resize();

      /*
       * Exact dice face orientations
       */

      const xAxis = new THREE.Vector3(1, 0, 0);
      const yAxis = new THREE.Vector3(0, 1, 0);

      const rollAxes = [xAxis, xAxis, yAxis, xAxis, xAxis];

      const orientations: THREE.Quaternion[] = [new THREE.Quaternion()];

      const currentOrientation = new THREE.Quaternion();

      rollAxes.forEach((axis) => {
        const quarterTurn = new THREE.Quaternion().setFromAxisAngle(
          axis,
          Math.PI / 2,
        );

        currentOrientation.premultiply(quarterTurn).normalize();

        orientations.push(currentOrientation.clone());
      });

      const scrollState = {
        value: 0,
      };

      /*
       * Smooth scroll-based dice movement
       */

      const applyDiceProgress = () => {
        const maximum = orientations.length - 1;

        const progress = THREE.MathUtils.clamp(scrollState.value, 0, maximum);

        if (progress >= maximum) {
          rollingGroup.quaternion.copy(orientations[maximum]);

          rollingGroup.position.y = 0;
          rollingGroup.scale.setScalar(1);

          return;
        }

        const currentIndex = Math.floor(progress);

        const localProgress = progress - currentIndex;

        /*
         * Smootherstep produces softer starts and stops.
         */

        const smoothProgress =
          localProgress *
          localProgress *
          localProgress *
          (localProgress * (localProgress * 6 - 15) + 10);

        rollingGroup.quaternion.slerpQuaternions(
          orientations[currentIndex],
          orientations[currentIndex + 1],
          smoothProgress,
        );

        const arc = Math.sin(smoothProgress * Math.PI);

        /*
         * Small vertical lift while rolling.
         */

        rollingGroup.position.y = arc * 0.12;

        /*
         * Very subtle squash and stretch.
         */

        rollingGroup.scale.set(1 + arc * 0.01, 1 - arc * 0.015, 1 + arc * 0.01);
      };

      applyDiceProgress();

      /*
       * Initial DOM states
       */

      gsap.set(title, {
        autoAlpha: 0,
        y: () => Math.min(window.innerHeight * 0.34, 300),
        scale: 0.92,
        filter: `blur(${BLUR.lg}px)`,
        color: SLIDES[0].textColor,
      });

      gsap.set(shadow, {
        autoAlpha: 0,
        scale: 0.45,
      });

      gsap.set(scrollHint, {
        autoAlpha: 0,
        y: 12,
      });

      let gsapContext: ReturnType<typeof gsap.context> | null = null;

      /*
       * Build the scroll-driven animation immediately (see note
       * below on why this can't wait for textures to finish loading).
       */

      const buildTimeline = () => {
        if (disposed) {
          return;
        }

        if (prefersReducedMotion) {
          entranceGroup.position.y = 0;
          entranceGroup.scale.setScalar(1);

          gsap.set(title, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
          });

          gsap.set(shadow, {
            autoAlpha: 0.25,
            scale: 1,
          });

          gsap.set(scrollHint, {
            autoAlpha: 1,
            y: 0,
          });

          render();

          return;
        }

        gsapContext = gsap.context(() => {
          const timeline = gsap.timeline({
            onUpdate: () => {
              applyDiceProgress();
              render();
            },

            scrollTrigger: {
              trigger: section,
              start: "top top",

              end: () => `+=${Math.round(window.innerHeight * 8.5)}`,

              pin: true,
              pinSpacing: true,
              scrub: PINNED_SCRUB.desktop,
              anticipatePin: 1,
              invalidateOnRefresh: true,

              snap: {
                snapTo: PINNED_SNAP.snapTo,

                duration: PINNED_SNAP.duration,

                delay: PINNED_SNAP.delay,
                ease: PINNED_SNAP.ease,
              },
            },
          });

          /*
           * Entrance sequence:
           *
           * 1. Dice rises first.
           * 2. Dice gently settles.
           * 3. Static title rises from behind it.
           */

          timeline
            .fromTo(
              entranceGroup.position,
              {
                y: -6.2,
              },
              {
                y: 0.12,
                duration: 1.15,
                ease: EASE.entranceStrong,
              },
              0,
            )
            .to(
              entranceGroup.position,
              {
                y: 0,
                duration: 0.32,
                ease: "sine.out",
              },
              1.12,
            )
            .fromTo(
              entranceGroup.scale,
              {
                x: 0.68,
                y: 0.68,
                z: 0.68,
              },
              {
                x: 1,
                y: 1,
                z: 1,
                duration: 1.25,
                ease: EASE.entranceStrong,
              },
              0,
            )
            .fromTo(
              entranceGroup.rotation,
              {
                z: -0.1,
              },
              {
                z: 0,
                duration: 1.2,
                ease: EASE.entrance,
              },
              0,
            )
            .fromTo(
              shadow,
              {
                autoAlpha: 0,
                scale: 0.42,
              },
              {
                autoAlpha: 0.25,
                scale: 1,
                duration: 0.9,
                ease: EASE.entrance,
              },
              0.35,
            );

          /*
           * The title appears only after the dice has entered.
           * Its z-index remains behind the WebGL canvas.
           */

          timeline.fromTo(
            title,
            {
              autoAlpha: 0,
              y: () => Math.min(window.innerHeight * 0.34, 300),
              scale: 0.92,
              filter: `blur(${BLUR.lg}px)`,
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.82,
              ease: EASE.entrance,
              immediateRender: false,
            },
            1.15,
          );

          timeline.fromTo(
            scrollHint,
            {
              autoAlpha: 0,
              y: 12,
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.45,
              ease: "power2.out",
            },
            1.7,
          );

          timeline.addLabel("face-0", 2);

          /*
           * Roll through the remaining five faces.
           *
           * Text content stays:
           * "01 Logo Design"
           *
           * Only background and text color change.
           */

          for (let index = 1; index < SLIDES.length; index += 1) {
            const transitionStart = timeline.duration();

            timeline.to(
              scrollState,
              {
                value: index,
                duration: 1.25,
                ease: "none",
              },
              transitionStart,
            );

            timeline.to(
              stage,
              {
                backgroundColor: SLIDES[index].background,
                duration: 1.25,
                ease: EASE.crossfade,
              },
              transitionStart,
            );

            timeline.to(
              title,
              {
                color: SLIDES[index].textColor,
                duration: 1.25,
                ease: EASE.crossfade,
              },
              transitionStart,
            );

            timeline.to(
              shadow,
              {
                scale: 0.88,
                autoAlpha: 0.18,
                duration: 0.4,
                repeat: 1,
                yoyo: true,
                ease: "sine.inOut",
              },
              transitionStart + 0.08,
            );

            timeline.addLabel(`face-${index}`, transitionStart + 1.25);
          }
        }, section);

        refreshFrame = window.requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      };

      /*
       * Build the scroll-pinned timeline immediately. It must exist
       * before the user scrolls into the section — a pinned, scrubbed
       * ScrollTrigger needs its start position measured up front, so
       * creating it late (e.g. only after textures finish decoding)
       * causes GSAP to fast-forward or unpin early, which is what
       * produced the "skips faces / jumps to next section" bug.
       *
       * Textures continue decoding in the background; each one just
       * re-renders the frame via `render` once it lands, so faces
       * pop in individually without affecting scroll mechanics.
       */

      loadingManager.onLoad = render;

      loadingManager.onError = (url) => {
        console.error(`LoadingManager error while loading: ${url}`);
      };

      buildTimeline();

      render();

      cleanupScene = () => {
        window.cancelAnimationFrame(refreshFrame);

        window.removeEventListener("resize", resize);

        canvas.removeEventListener("webglcontextlost", handleContextLost);

        canvas.removeEventListener(
          "webglcontextrestored",
          handleContextRestored,
        );

        gsapContext?.revert();

        textures.forEach((texture) => {
          texture.dispose();
        });

        faceMaterials.forEach((material) => {
          material.dispose();
        });

        faceGeometry.dispose();
        bodyGeometry.dispose();
        bodyMaterial.dispose();

        scene.clear();
        renderer.dispose();
      };
    };

    /*
     * Scroll-pinned sections need their WebGL scene and ScrollTrigger
     * set up right away, not deferred behind an IntersectionObserver
     * — the pin start position has to be measured before the user
     * scrolls anywhere near it.
     */

    initScene();

    return () => {
      disposed = true;

      cleanupScene?.();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Logo design showcase"
      className={`${SECTION_SHELL_CLASS} h-svh`}
    >
      <div
        ref={stageRef}
        className={SECTION_VIEWPORT_CLASS}
        style={{
          backgroundColor: SLIDES[0].background,
        }}
      >
        {/* Static text behind the dice */}

        <SectionHeading
          ref={titleRef}
          number="01"
          title="Logo Design"
          subtitle="A visual signature created with purpose."
          className="opacity-0"
        />

        {/* Soft fake shadow */}

        <div
          ref={shadowRef}
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[65%]
            z-[15]
            h-8
            w-[25vw]
            max-w-[270px]
            -translate-x-1/2
            rounded-full
            bg-black/40
            blur-2xl
          "
        />

        {/* Three.js canvas */}

        <canvas
          ref={canvasRef}
          className="
            pointer-events-none
            absolute
            inset-0
            z-20
            h-full
            w-full
            will-change-transform
          "
        />

        <div
          ref={scrollHintRef}
          className="
            pointer-events-none
            absolute
            bottom-8
            left-1/2
            z-30
            -translate-x-1/2
            text-center
            text-xs
            font-medium
            uppercase
            tracking-[0.25em]
            text-white
            mix-blend-difference
          "
        >
          Scroll to roll
        </div>
      </div>
    </section>
  );
}