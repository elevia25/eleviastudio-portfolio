"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

const SLIDES = [
  {
    number: "01",
    title: "Logo Design",
    background: "#ff008c",
    textColor: "#12000b",
    logo: "/logos/dice/logo-1.png",
  },
  {
    number: "02",
    title: "Brand Identity",
    background: "#e8ff52",
    textColor: "#111111",
    logo: "/logos/dice/logo-2.png",
  },
  {
    number: "03",
    title: "Web Design",
    background: "#6257ff",
    textColor: "#ffffff",
    logo: "/logos/dice/logo-3.png",
  },
  {
    number: "04",
    title: "Motion Design",
    background: "#ff7247",
    textColor: "#17100d",
    logo: "/logos/dice/logo-4.png",
  },
  {
    number: "05",
    title: "Development",
    background: "#42d6ae",
    textColor: "#081511",
    logo: "/logos/dice/logo-5.png",
  },
  {
    number: "06",
    title: "Creative Direction",
    background: "#121212",
    textColor: "#f8f5ed",
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

/**
 * The visible order is:
 *
 * Front → Top → Back → Left → Bottom → Right
 *
 * The quaternion sequence below exposes these faces using
 * one 90-degree roll for every transition.
 */
const FACE_PLACEMENTS: FacePlacement[] = [
  // Front (Faces +Z)
  {
    slideIndex: 0,
    position: [0, 0, FACE_OFFSET],
    rotation: [0, 0, 0], // No rotation needed
  },

  // Top (Faces +Y)
  // Rotate -90° around X so +Z becomes +Y.
  // We keep the image upright (0 rotation on Y/Z after the X roll).
  {
    slideIndex: 1,
    position: [0, FACE_OFFSET, 0],
    rotation: [-Math.PI / 2, 0, 0], // Corrected
  },

  // Back (Faces -Z)
  // Rotate 180° around Y to face -Z.
  {
    slideIndex: 2,
    position: [0, 0, -FACE_OFFSET],
    rotation: [Math.PI, 0, 0], // Corrected
  },

  {
    slideIndex: 3,
    position: [-FACE_OFFSET, 0, 0],
    rotation: [Math.PI, -Math.PI / 2, 0],
  },

  // Bottom (Faces -Y)
  // Rotate +90° around X so +Z becomes -Y.
  // This usually flips the image upside down relative to the top.
  {
    slideIndex: 4,
    position: [0, -FACE_OFFSET, 0],
    rotation: [Math.PI / 2, 0, -Math.PI / 2],
  },

  // Right (Faces +X)
  // Rotate -90° around Y to face +X.
  {
    slideIndex: 5,
    position: [FACE_OFFSET, 0, 0],
    rotation: [0, Math.PI / 2, 0], // Corrected
  },
];

export default function LogoDiceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  const titleRefs = useRef<Array<HTMLDivElement | null>>([]);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const shadow = shadowRef.current;

    if (!section || !stage || !canvas || !shadow) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    let disposed = false;
    let refreshFrame = 0;

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
        "WebGL2 is unavailable. Check browser hardware acceleration and WebGL support.",
      );

      return;
    }
    const renderer = new THREE.WebGLRenderer({
      canvas,
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
     * Separate groups allow responsive scaling, entrance movement,
     * and rolling movement to work independently.
     */

    const responsiveGroup = new THREE.Group();
    const entranceGroup = new THREE.Group();
    const rollingGroup = new THREE.Group();

    responsiveGroup.add(entranceGroup);
    entranceGroup.add(rollingGroup);
    scene.add(responsiveGroup);

    /*
     * Rounded dice body
     */

    const bodyGeometry = new RoundedBoxGeometry(
      DICE_SIZE,
      DICE_SIZE,
      DICE_SIZE,
      6,
      0.18,
    );

    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: "#f4efe8",
      roughness: 0.34,
      metalness: 0.04,
    });

    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.renderOrder = 1;

    rollingGroup.add(body);

    /*
     * Six logo planes
     */

    const faceGeometry = new THREE.PlaneGeometry(FACE_SIZE, FACE_SIZE);

    const textureLoader = new THREE.TextureLoader();
    const textures: THREE.Texture[] = [];
    const faceMaterials: THREE.MeshStandardMaterial[] = [];

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    FACE_PLACEMENTS.forEach((placement) => {
      const slide = SLIDES[placement.slideIndex];

      const texture = textureLoader.load(
        slide.logo,
        render,
        undefined,
        (error) => {
          console.error(`Could not load dice logo: ${slide.logo}`, error);
        },
      );

      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(8, maxAnisotropy);

      textures.push(texture);

      const material = new THREE.MeshStandardMaterial({
        map: texture,
        color: "#ffffff",
        transparent: true,
        roughness: 0.42,
        metalness: 0,
        side: THREE.FrontSide,

        // Prevent small depth flickering between the plane and dice body.
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

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x393939, 2.4);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(4, 5, 7);

    const fillLight = new THREE.DirectionalLight(0xffd8ed, 1.1);
    fillLight.position.set(-4, -1, 4);

    scene.add(hemisphereLight, keyLight, fillLight);

    /*
     * Responsive canvas and dice sizing
     */

    const resize = () => {
      const width = stage.clientWidth;
      const height = stage.clientHeight;

      const isMobile = width < 768;
      const isSmallMobile = width < 480;

      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.5),
      );

      renderer.setSize(width, height, false);

      camera.aspect = width / height;
      camera.position.z = isMobile ? 9 : 8;
      camera.updateProjectionMatrix();

      const responsiveScale = isSmallMobile ? 0.54 : isMobile ? 0.66 : 0.84;

      responsiveGroup.scale.setScalar(responsiveScale);

      responsiveGroup.position.y = isMobile ? -0.3 : -0.4;

      render();
    };
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn("Logo dice WebGL context was lost.");
    };

    const handleContextRestored = () => {
      console.info("Logo dice WebGL context was restored.");
      resize();
      render();
    };

    resize();
    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);

    window.addEventListener("resize", resize, {
      passive: true,
    });

    /*
     * Create six exact dice orientations.
     *
     * Every operation is a 90-degree world-axis roll.
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

    const applyDiceProgress = () => {
      const maximum = orientations.length - 1;

      const progress = THREE.MathUtils.clamp(scrollState.value, 0, maximum);

      if (progress >= maximum) {
        rollingGroup.quaternion.copy(orientations[maximum]);
        rollingGroup.position.y = 0;
        return;
      }

      const currentIndex = Math.floor(progress);
      const localProgress = progress - currentIndex;

      rollingGroup.quaternion.slerpQuaternions(
        orientations[currentIndex],
        orientations[currentIndex + 1],
        localProgress,
      );

      // Small upward arc while the dice rolls.
      rollingGroup.position.y = Math.sin(localProgress * Math.PI) * 0.22;
    };

    applyDiceProgress();

    const titleElements = titleRefs.current.filter(
      (element): element is HTMLDivElement => Boolean(element),
    );

    gsap.set(titleElements, {
      autoAlpha: 0,
      yPercent: 18,
    });

    if (titleElements[0]) {
      gsap.set(titleElements[0], {
        autoAlpha: 1,
        yPercent: 0,
      });
    }

    gsap.set(shadow, {
      autoAlpha: 0,
      scale: 0.55,
    });

    let gsapContext: ReturnType<typeof gsap.context> | null = null;

    /*
     * Reduced-motion fallback
     */

    if (prefersReducedMotion) {
      entranceGroup.position.y = 0;
      entranceGroup.scale.setScalar(1);

      gsap.set(shadow, {
        autoAlpha: 0.28,
        scale: 1,
      });

      render();
    } else {
      gsapContext = gsap.context(() => {
        const timeline = gsap.timeline({
          onUpdate: () => {
            applyDiceProgress();
            render();
          },

          scrollTrigger: {
            trigger: section,
            start: "top top",

            end: () => `+=${Math.round(window.innerHeight * 7.2)}`,

            pin: true,
            pinSpacing: true,

            scrub: 0.75,
            anticipatePin: 1,
            invalidateOnRefresh: true,

            snap: {
              snapTo: "labelsDirectional",
              duration: {
                min: 0.2,
                max: 0.55,
              },
              delay: 0.08,
              ease: "power2.inOut",
            },
          },
        });

        /*
         * Dice entrance from below
         */

        timeline
          .fromTo(
            entranceGroup.position,
            {
              y: -6,
            },
            {
              y: 0,
              duration: 1.15,
              ease: "back.out(1.55)",
            },
            0,
          )
          .fromTo(
            entranceGroup.scale,
            {
              x: 0.52,
              y: 0.52,
              z: 0.52,
            },
            {
              x: 1,
              y: 1,
              z: 1,
              duration: 1.15,
              ease: "back.out(1.55)",
            },
            0,
          )
          .fromTo(
            shadow,
            {
              autoAlpha: 0,
              scale: 0.5,
            },
            {
              autoAlpha: 0.3,
              scale: 1,
              duration: 0.9,
              ease: "power3.out",
            },
            0.2,
          )
          .addLabel("face-0");

        /*
         * Five scroll transitions reveal the remaining five faces.
         */

        for (let index = 1; index < SLIDES.length; index += 1) {
          const transitionStart = timeline.duration();

          timeline.to(
            scrollState,
            {
              value: index,
              duration: 1.05,
              ease: "power2.inOut",
            },
            transitionStart,
          );

          timeline.to(
            stage,
            {
              backgroundColor: SLIDES[index].background,
              duration: 1.05,
              ease: "none",
            },
            transitionStart,
          );

          timeline.to(
            shadow,
            {
              scale: 0.86,
              duration: 0.3,
              repeat: 1,
              yoyo: true,
              ease: "power2.inOut",
            },
            transitionStart + 0.1,
          );

          timeline.addLabel(`face-${index}`, transitionStart + 1.05);
        }
      }, section);

      refreshFrame = window.requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }

    render();

    return () => {
      disposed = true;

      window.cancelAnimationFrame(refreshFrame);
      window.removeEventListener("resize", resize);

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

      renderer.dispose();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Elevia Studio services"
      className="relative h-svh w-full overflow-hidden"
    >
      <div
        ref={stageRef}
        className="relative h-full w-full overflow-hidden"
        style={{
          backgroundColor: SLIDES[0].background,
        }}
      >
        {/* Background typography */}

        <div className="pointer-events-none absolute inset-0 z-10">
          <div
            ref={(element) => {
              titleRefs.current[0] = element;
            }}
            className="invisible
              absolute
              inset-x-0
              top-0
              flex
              justify-center
              px-4
              pt-[7vh]
              md:pt-[5vh]"
          >
            <h2
              className="
                          flex
                          w-full
                          max-w-full
                          items-start
                          justify-center
                          whitespace-nowrap
                          text-center
                          text-[clamp(4.5rem,13vw,14rem)]
                          font-light
                          leading-[0.78]
                          tracking-[-0.08em]
                        "
              style={{
                color: SLIDES[0].textColor,
              }}
            >
              <span
                className="
                    mr-[0.45em]
                    inline-block
                    pt-[0.1em]
                    text-[0.2em]
                    font-medium
                    tracking-normal
                  "
              >
                1
              </span>

              <span>{SLIDES[0].title}</span>
            </h2>
          </div>
        </div>

        {/* Fake shadow: less expensive than realtime WebGL shadows */}

        <div
          ref={shadowRef}
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[68%]
            z-15
            h-10
            w-[34vw]
            max-w-90
            -translate-x-1/2
            rounded-full
            bg-black/45
            blur-2xl
          "
        />
        {/* Three.js dice */}

        <canvas
          ref={canvasRef}
          className="
            pointer-events-none
            absolute
            inset-0
            z-20
            h-full
            w-full
          "
        />

        {/* Scroll hint */}

        <div
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
            text-black/55
          "
        >
          Scroll to roll
        </div>
      </div>
    </section>
  );
}
