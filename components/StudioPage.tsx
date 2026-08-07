"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { motion, useScroll, useTransform } from "framer-motion";
import Portfolio from "./Portfolio";
import Image from "next/image";
import FloatingLibrarySection from "./SocialMediaManagementSection";

const LOGO_URL = "/elevia_logo.png";
const FOUNDER_ONE_IMAGE = "/founder-1.jpg";
const FOUNDER_TWO_IMAGE = "/founder-2.jpg";

// --- THEME PALETTE CONSTANTS ---
const PALETTE = {
  whiteBg: "#ffffff",
  darkBg: "#0f172a", // Slate/Black background for dark sections
  azureGray: "#64748b", // Azure Gray for big headings
  golden: "#d97706", // Gold accent
  darkText: "#0f172a", // Dark Slate body text
  lightText: "#f8fafc", // Light body text on dark backgrounds
};

type SplitCharactersProps = {
  text: string;
};

function SplitCharacters({ text }: SplitCharactersProps) {
  return (
    <>
      {Array.from(text).map((character, index) => (
        <span className="char" key={`${character}-${index}`} aria-hidden="true">
          {character === " " ? "\u00A0" : character}
        </span>
      ))}
      <span className="sr-only">{text}</span>
    </>
  );
}

export default function StudioPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const threeContainerRef = useRef<HTMLDivElement>(null);
  const [activeFounder, setActiveFounder] = useState<1 | 2 | null>(null);

  // --- SCROLL COLOR ANIMATION SETUP ---
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });

  // Background Color transitions:
  // [0: Hero (White), 0.25: Portfolio (Dark), 0.65: About (White), 1.0: Footer (Dark)]
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.2, 0.35, 0.65, 0.8, 1.0],
    [
      PALETTE.whiteBg,
      PALETTE.darkBg,
      PALETTE.darkBg,
      PALETTE.whiteBg,
      PALETTE.darkBg,
      PALETTE.darkBg,
    ],
  );

  // Azure Gray Heading dynamic color mapping
  const azureHeadingColor = useTransform(
    scrollYProgress,
    [0, 0.2, 0.35, 0.65, 0.8, 1.0],
    [
      PALETTE.azureGray,
      PALETTE.golden,
      PALETTE.golden,
      PALETTE.azureGray,
      PALETTE.golden,
      PALETTE.golden,
    ],
  );

  // General Text dynamic color mapping
  const bodyTextColor = useTransform(
    scrollYProgress,
    [0, 0.2, 0.35, 0.65, 0.8, 1.0],
    [
      PALETTE.darkText,
      PALETTE.lightText,
      PALETTE.lightText,
      PALETTE.darkText,
      PALETTE.lightText,
      PALETTE.lightText,
    ],
  );

  useEffect(() => {
    const root = rootRef.current;
    const cursor = cursorRef.current;
    const backgroundCanvas = backgroundCanvasRef.current;
    const threeContainer = threeContainerRef.current;

    if (!root || !cursor || !backgroundCanvas || !threeContainer) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let cursorX = mouse.x;
    let cursorY = mouse.y;
    let cursorAnimationFrame = 0;

    const updateCursor = () => {
      cursorX += (mouse.x - cursorX) * 0.15;
      cursorY += (mouse.y - cursorY) * 0.15;
      cursor.style.left = `${cursorX - 10}px`;
      cursor.style.top = `${cursorY - 10}px`;
      cursorAnimationFrame = window.requestAnimationFrame(updateCursor);
    };

    cursorAnimationFrame = window.requestAnimationFrame(updateCursor);

    const hoverTargets = Array.from(
      root.querySelectorAll<HTMLElement>(
        "a, button, .project-tile, .project-stack-card, .founder-card, [data-cursor-interactive='true']",
      ),
    );

    const cursorHoverHandlers = hoverTargets.map((element) => {
      const enter = () => cursor.classList.add("hovering");
      const leave = () => cursor.classList.remove("hovering");
      element.addEventListener("mouseenter", enter);
      element.addEventListener("mouseleave", leave);
      return { element, enter, leave };
    });

    const threeCleanup = initialiseHeroSculpture(threeContainer, mouse);

    const magneticCleanups = Array.from(
      root.querySelectorAll<HTMLElement>(".magnetic-btn, .magnetic-target"),
    ).map((button) => {
      const move = (event: MouseEvent) => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;

        gsap.to(button, {
          x: x * 0.4,
          y: y * 0.4,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const leave = () => {
        gsap.to(button, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)",
          overwrite: "auto",
        });
      };

      button.addEventListener("mousemove", move);
      button.addEventListener("mouseleave", leave);

      return () => {
        button.removeEventListener("mousemove", move);
        button.removeEventListener("mouseleave", leave);
      };
    });

    const animationContext = gsap.context(() => {
      root.querySelectorAll<HTMLElement>(".split-text").forEach((element) => {
        gsap.from(element.querySelectorAll<HTMLElement>(".char"), {
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
          },
          opacity: 0,
          y: 20,
          stagger: 0.02,
          duration: 1,
          ease: "power4.out",
        });
      });

      root
        .querySelectorAll<HTMLElement>(".reveal-slide-up")
        .forEach((element) => {
          gsap.from(element, {
            scrollTrigger: {
              trigger: element,
              start: "top 90%",
            },
            opacity: 0,
            y: 50,
            duration: 1.2,
            ease: "power3.out",
          });
        });

      const founderStack = root.querySelector<HTMLElement>(".founder-stack");
      const founderOne = root.querySelector<HTMLElement>(".founder-entry-one");
      const founderTwo = root.querySelector<HTMLElement>(".founder-entry-two");
      const founderLocation = root.querySelector<HTMLElement>(
        ".founder-location-badge",
      );

      if (founderStack && founderOne && founderTwo) {
        const founderTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: founderStack,
            start: "top 82%",
            once: true,
          },
        });

        founderTimeline
          .from(
            founderOne,
            {
              opacity: 0,
              y: -180,
              rotate: -7,
              duration: 1.25,
              ease: "power4.out",
            },
            0,
          )
          .from(
            founderTwo,
            {
              opacity: 0,
              y: 180,
              rotate: 7,
              duration: 1.25,
              ease: "power4.out",
            },
            0.12,
          );

        if (founderLocation) {
          founderTimeline.from(
            founderLocation,
            {
              opacity: 0,
              scale: 0.85,
              y: 24,
              duration: 0.7,
              ease: "back.out(1.7)",
            },
            0.65,
          );
        }
      }
    }, root);

    ScrollTrigger.refresh();

    return () => {
      animationContext.revert();
      magneticCleanups.forEach((cleanup) => cleanup());
      threeCleanup();
      cursorHoverHandlers.forEach(({ element, enter, leave }) => {
        element.removeEventListener("mouseenter", enter);
        element.removeEventListener("mouseleave", leave);
      });
      window.cancelAnimationFrame(cursorAnimationFrame);
      window.removeEventListener("mousemove", handleMouseMove);
      cursor.classList.remove("hovering");
    };
  }, []);

  return (
    <motion.div
      ref={rootRef}
      style={{ backgroundColor }}
      className="relative isolate min-h-screen overflow-x-clip transition-colors duration-500"
    >
      <canvas ref={backgroundCanvasRef} id="bg-canvas" aria-hidden="true" />
      <div
        ref={cursorRef}
        className="custom-cursor hidden md:block"
        aria-hidden="true"
      />

      <nav className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-outline-variant/10 bg-surface/40 px-page-margin-mobile py-6 backdrop-blur-xl md:px-page-margin-desktop">
        <a
          href="#top"
          className="flex items-center gap-4"
          aria-label="Elevia Studio home"
        >
          <img
            alt="Elevia Studio Logo"
            className="h-10 w-auto object-contain md:h-12"
            src={LOGO_URL}
          />
        </a>

        <div className="hidden gap-10 md:flex">
          <a
            className="font-label-caps text-label-caps text-on-surface-variant transition-colors duration-300 hover:text-amber-500"
            href="#about"
          >
            ABOUT
          </a>
          <a
            className="font-label-caps text-label-caps text-on-surface-variant transition-colors duration-300 hover:text-amber-500"
            href="#services"
          >
            SERVICES
          </a>
          <a
            className="font-label-caps text-label-caps text-on-surface-variant transition-colors duration-300 hover:text-amber-500"
            href="#portfolio"
          >
            PORTFOLIO
          </a>
          <a
            className="font-label-caps text-label-caps text-on-surface-variant transition-colors duration-300 hover:text-amber-500"
            href="#contact"
          >
            CONTACT
          </a>
        </div>

        <div className="magnetic-wrap">
          <a
            href="#contact"
            className="magnetic-btn bg-amber-600 px-6 py-3 font-label-caps text-label-caps font-bold tracking-widest text-white transition-all duration-300 hover:bg-amber-500"
          >
            GET IN TOUCH
          </a>
        </div>
      </nav>

      <header
        id="top"
        className="relative z-10 flex h-screen w-full flex-col items-center justify-center px-page-margin-mobile text-center"
      >
        <div
          ref={threeContainerRef}
          className="threejs-container"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-8xl space-y-10">
          <div className="overflow-hidden">
            <motion.h1
              style={{ color: azureHeadingColor }}
              className="split-text font-display-lg text-display-lg-mobile uppercase md:text-display-lg transition-colors duration-300"
            >
              <SplitCharacters text="Architecting " />
              <br className="hidden md:block" />
              <SplitCharacters text="Visual" />
              <br className="hidden md:block" />
              <SplitCharacters text="Power" />
            </motion.h1>
          </div>

          <div className="reveal-slide-up flex items-center justify-center gap-6">
            <span className="h-[2px] w-16 bg-amber-600" />
            <p className="font-label-technical text-label-technical tracking-[0.4em] text-amber-600 font-semibold">
              AHMEDABAD — INDIA — GLOBAL
            </p>
            <span className="h-[2px] w-16 bg-amber-600" />
          </div>
        </div>

        <div className="reveal-slide-up absolute bottom-12 flex flex-col items-center gap-6">
          <span className="font-label-caps text-label-caps text-amber-600">
            DISCOVER
          </span>
          <div className="scroll-line" />
        </div>
      </header>

      <main className="relative z-10">
        <Portfolio />
        <FloatingLibrarySection />

        <section
          id="about"
          className="grid grid-cols-1 items-center gap-gutter border-b border-outline-variant/10 bg-surface-container-lowest/20 px-page-margin-mobile py-section-gap md:grid-cols-12 md:px-page-margin-desktop"
        >
          <div className="space-y-12 md:col-span-7">
            <div className="space-y-6">
              <span className="reveal-slide-up font-label-technical text-label-technical text-amber-600 font-semibold">
                STRATEGIC VISION
              </span>
              <motion.h2
                style={{ color: azureHeadingColor }}
                className="split-text font-headline-md-mobile leading-[1.1] md:font-headline-md transition-colors duration-300"
              >
                <SplitCharacters text="Elevia Studio is an Ahmedabad-based creative collective defining the aesthetic frontier for ambitious global brands." />
              </motion.h2>
            </div>

            <div className="flex flex-col gap-12 md:flex-row md:gap-24">
              <div className="reveal-slide-up flex-1 space-y-6">
                <motion.p
                  style={{ color: bodyTextColor }}
                  className="font-body-lg"
                >
                  We eliminate visual noise. Our methodology centers on
                  precision, clarity, and the relentless pursuit of cinematic
                  perfection in every digital touchpoint.
                </motion.p>
              </div>
              <div
                className="reveal-slide-up flex-1 space-y-6"
                style={{ transitionDelay: "0.1s" }}
              >
                <motion.p
                  style={{ color: bodyTextColor }}
                  className="font-body-lg"
                >
                  From Ahmedabad, India, we merge architectural rigor with
                  modern technology to create brand experiences that travel
                  globally and command authority.
                </motion.p>
              </div>
            </div>
          </div>

          <div className="founder-stack relative min-h-[520px] md:col-span-5 md:min-h-[660px]">
            <div
              className={`founder-entry-one absolute left-0 top-0 w-[60%] transition-[z-index] duration-300 ${
                activeFounder === 1
                  ? "z-40"
                  : activeFounder === 2
                    ? "z-10"
                    : "z-20"
              }`}
              onMouseEnter={() => setActiveFounder(1)}
              onMouseLeave={() => setActiveFounder(null)}
              onFocus={() => setActiveFounder(1)}
              onBlur={() => setActiveFounder(null)}
            >
              <article
                className="founder-card group relative overflow-hidden border border-amber-500/30 bg-surface-container/70 p-2 shadow-2xl transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:border-amber-500"
                tabIndex={0}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-surface-container-highest">
                  <Image
                    src={FOUNDER_ONE_IMAGE}
                    width={200}
                    height={200}
                    alt="Elevia Studio founder portrait one"
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    <span className="mb-2 block font-label-technical text-[10px] tracking-[0.3em] text-amber-500">
                      FOUNDER 01
                    </span>
                    <p className="font-headline-md-mobile text-xl uppercase text-white md:text-2xl">
                      Creative Leadership
                    </p>
                  </div>
                </div>
              </article>
            </div>

            <div
              className={`founder-entry-two absolute bottom-0 right-0 w-[60%] transition-[z-index] duration-300 ${
                activeFounder === 2
                  ? "z-40"
                  : activeFounder === 1
                    ? "z-10"
                    : "z-10"
              }`}
              onMouseEnter={() => setActiveFounder(2)}
              onMouseLeave={() => setActiveFounder(null)}
              onFocus={() => setActiveFounder(2)}
              onBlur={() => setActiveFounder(null)}
            >
              <article
                className="founder-card group relative overflow-hidden border border-amber-500/30 bg-surface-container/70 p-2 shadow-2xl transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:border-amber-500"
                tabIndex={0}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-surface-container-highest">
                  <Image
                    width={200}
                    height={200}
                    src={FOUNDER_TWO_IMAGE}
                    alt="Elevia Studio founder portrait two"
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    <span className="mb-2 block font-label-technical text-[10px] tracking-[0.3em] text-amber-500">
                      FOUNDER 02
                    </span>
                    <p className="font-headline-md-mobile text-xl uppercase text-white md:text-2xl">
                      Motion &amp; Strategy
                    </p>
                  </div>
                </div>
              </article>
            </div>

            <div className="founder-location-badge pointer-events-none absolute bottom-4 left-4 z-50 border border-amber-500/40 bg-slate-900/85 px-5 py-4 backdrop-blur-xl md:bottom-8 md:left-8">
              <span className="mb-2 block font-label-technical text-[9px] tracking-[0.3em] text-amber-500">
                BASED IN
              </span>
              <strong className="font-label-caps text-[11px] tracking-[0.22em] text-white">
                AHMEDABAD, INDIA
              </strong>
            </div>
          </div>
        </section>
      </main>

      <footer
        id="contact"
        className="relative z-10 w-full border-t border-slate-200/20 bg-white/50 px-page-margin-mobile py-24 backdrop-blur-md md:px-page-margin-desktop"
      >
        <div className="flex flex-col items-start justify-between md:flex-row">
          <div className="mb-12 md:mb-0">
            <img
              alt="Elevia Studio Logo"
              className="h-12 w-auto object-contain md:h-14"
              src={LOGO_URL}
            />
            <p className="mt-2 max-w-xs font-body-md text-amber-500">
              Creative Branding & Marketing Agency
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 sm:gap-16">
            <div className="flex flex-col gap-4">
              <span className="mb-4 font-label-technical text-[10px] uppercase tracking-widest text-amber-500">
                Network
              </span>
              <a
                className="font-body-md text-slate-200 transition-colors hover:text-amber-500"
                href="#"
              >
                INSTAGRAM
              </a>
              <a
                className="font-body-md text-slate-200 transition-colors hover:text-amber-500"
                href="#"
              >
                LINKEDIN
              </a>
              <a
                className="font-body-md text-slate-200 transition-colors hover:text-amber-500"
                href="#"
              >
                VIMEO
              </a>
            </div>

            <div className="flex flex-col gap-4">
              <span className="mb-4 font-label-technical text-[10px] uppercase tracking-widest text-amber-500">
                Studio
              </span>
              <a
                className="font-body-md text-slate-200 transition-colors hover:text-amber-500"
                href="#"
              >
                CAREERS
              </a>
              <a
                className="font-body-md text-slate-200 transition-colors hover:text-amber-500"
                href="mailto:hello@elevia.studio"
              >
                CONTACT
              </a>
              <a
                className="font-body-md text-slate-200 transition-colors hover:text-amber-500"
                href="#"
              >
                PRESS
              </a>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}

function initialiseHeroSculpture(
  container: HTMLDivElement,
  mouse: { x: number; y: number },
) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });

  renderer.setClearColor(0xffffff, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.35));
  container.replaceChildren(renderer.domElement);

  const geometry = new THREE.IcosahedronGeometry(1.2, 3);
  const material = new THREE.MeshPhongMaterial({
    color: 0xd97706,
    wireframe: true,
    transparent: true,
    opacity: 0.35,
    emissive: 0xd97706,
    emissiveIntensity: 0.12,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const light = new THREE.PointLight(0xffffff, 1.15, 100);
  light.position.set(8, 8, 10);
  scene.add(light);
  camera.position.z = 3.5;

  const resize = () => {
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.35));
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  let sectionVisible = true;
  let pageVisible = !document.hidden;
  let animationFrame = 0;
  let lastFrame = 0;
  const targetFrameInterval = 1000 / 30;

  const visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      sectionVisible = entry.isIntersecting;
    },
    { rootMargin: "120px 0px 120px 0px" },
  );

  const handleVisibility = () => {
    pageVisible = !document.hidden;
  };

  const animate = (time: number) => {
    animationFrame = window.requestAnimationFrame(animate);

    if (
      !sectionVisible ||
      !pageVisible ||
      time - lastFrame < targetFrameInterval
    ) {
      return;
    }

    lastFrame = time;
    mesh.rotation.x += 0.0024;
    mesh.rotation.y += 0.0032;

    const targetX = (mouse.x / window.innerWidth - 0.5) * 1.65;
    const targetY = -(mouse.y / window.innerHeight - 0.5) * 1.65;
    mesh.position.x += (targetX - mesh.position.x) * 0.045;
    mesh.position.y += (targetY - mesh.position.y) * 0.045;

    renderer.render(scene, camera);
  };

  resize();
  visibilityObserver.observe(container);
  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", handleVisibility);
  animationFrame = window.requestAnimationFrame(animate);

  return () => {
    window.cancelAnimationFrame(animationFrame);
    visibilityObserver.disconnect();
    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", handleVisibility);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
