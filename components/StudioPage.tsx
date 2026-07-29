"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import Portfolio from "./Portfolio";
import Image from "next/image";
import FloatingLibrarySection from "./LogoTransitions";

const LOGO_URL = "/elevia_logo.png";

const FOUNDER_ONE_IMAGE = "/founder-1.jpg";
const FOUNDER_TWO_IMAGE = "/founder-2.jpg";

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

    const backgroundCleanup = initialiseBackgroundParticles(
      backgroundCanvas,
      mouse,
    );
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

    const projectCleanups = Array.from(
      root.querySelectorAll<HTMLElement>(".project-tile"),
    ).map((tile) => {
      const inner = tile.querySelector<HTMLElement>(".tile-inner");
      const image = tile.querySelector<HTMLElement>(".parallax-img");

      if (!inner) {
        return () => undefined;
      }

      const move = (event: MouseEvent) => {
        const rect = tile.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        gsap.to(inner, {
          rotateY: (x - 0.5) * 20,
          rotateX: (0.5 - y) * 20,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        });

        if (image) {
          gsap.to(image, {
            x: (x - 0.5) * 30,
            y: (y - 0.5) * 30,
            duration: 0.5,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      };

      const leave = () => {
        gsap.to(inner, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.8,
          ease: "power3.out",
          overwrite: "auto",
        });

        if (image) {
          gsap.to(image, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            overwrite: "auto",
          });
        }
      };

      tile.addEventListener("mousemove", move);
      tile.addEventListener("mouseleave", leave);

      return () => {
        tile.removeEventListener("mousemove", move);
        tile.removeEventListener("mouseleave", leave);
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

      root.querySelectorAll<HTMLElement>(".counter").forEach((element) => {
        const target = Number(element.dataset.target ?? 0);
        const counter = { value: 0 };

        ScrollTrigger.create({
          trigger: element,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.to(counter, {
              value: target,
              duration: 2,
              ease: "power2.out",
              snap: { value: 1 },
              onUpdate: () => {
                element.textContent = String(Math.round(counter.value));
              },
            });
          },
        });
      });
    }, root);

    ScrollTrigger.refresh();

    return () => {
      animationContext.revert();
      magneticCleanups.forEach((cleanup) => cleanup());
      projectCleanups.forEach((cleanup) => cleanup());
      backgroundCleanup();
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
    <div
      ref={rootRef}
      className="relative isolate min-h-screen overflow-x-clip bg-white text-on-background"
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
          {/* Plain img intentionally preserves the source image exactly without Next image transformation. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Elevia Studio Logo"
            className="h-10 w-auto object-contain md:h-12"
            src={LOGO_URL}
          />
        </a>

        <div className="hidden gap-10 md:flex">
          <a
            className="font-label-caps text-label-caps text-on-surface-variant transition-colors duration-300 hover:text-primary"
            href="#about"
          >
            ABOUT
          </a>
          <a
            className="font-label-caps text-label-caps text-on-surface-variant transition-colors duration-300 hover:text-primary"
            href="#services"
          >
            SERVICES
          </a>
          <a
            className="font-label-caps text-label-caps text-on-surface-variant transition-colors duration-300 hover:text-primary"
            href="#portfolio"
          >
            PORTFOLIO
          </a>
          <a
            className="font-label-caps text-label-caps text-on-surface-variant transition-colors duration-300 hover:text-primary"
            href="#contact"
          >
            CONTACT
          </a>
        </div>

        <div className="magnetic-wrap">
          <a
            href="#contact"
            className="magnetic-btn bg-primary px-6 py-3 font-label-caps text-label-caps font-bold tracking-widest text-on-primary transition-all duration-300 hover:bg-primary/90"
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
            <h1 className="split-text font-display-lg text-display-lg-mobile uppercase md:text-display-lg">
              <SplitCharacters text="Architecting " />
              <br className="hidden md:block" />
              <SplitCharacters text="Visual" />
              <br className="hidden md:block" />
              <SplitCharacters text="Power" />
            </h1>
          </div>

          <div className="reveal-slide-up flex items-center justify-center gap-6">
            <span className="h-[2px] w-16 bg-primary" />
            <p className="font-label-technical text-label-technical tracking-[0.4em] text-primary">
              AHMEDABAD — INDIA — GLOBAL
            </p>
            <span className="h-[2px] w-16 bg-primary" />
          </div>
        </div>

        <div className="reveal-slide-up absolute bottom-12 flex flex-col items-center gap-6">
          <span className="font-label-caps text-label-caps text-primary/60">
            DISCOVER
          </span>
          <div className="scroll-line" />
        </div>
      </header>

      <main className="relative z-10">
        <section
          id="about"
          className="grid grid-cols-1 items-center gap-gutter border-b border-outline-variant/10 bg-surface-container-lowest/20 px-page-margin-mobile py-section-gap md:grid-cols-12 md:px-page-margin-desktop"
        >
          <div className="space-y-12 md:col-span-7">
            <div className="space-y-6">
              <span className="reveal-slide-up font-label-technical text-label-technical text-primary">
                STRATEGIC VISION
              </span>
              <h2 className="split-text font-headline-md-mobile leading-[1.1] md:font-headline-md">
                <SplitCharacters text="Elevia Studio is an Ahmedabad-based creative collective defining the aesthetic frontier for ambitious global brands." />
              </h2>
            </div>

            <div className="flex flex-col gap-12 md:flex-row md:gap-24">
              <div className="reveal-slide-up flex-1 space-y-6">
                <p className="font-body-lg text-on-surface-variant">
                  We eliminate visual noise. Our methodology centers on
                  precision, clarity, and the relentless pursuit of cinematic
                  perfection in every digital touchpoint.
                </p>
              </div>
              <div
                className="reveal-slide-up flex-1 space-y-6"
                style={{ transitionDelay: "0.1s" }}
              >
                <p className="font-body-lg text-on-surface-variant">
                  From Ahmedabad, India, we merge architectural rigor with
                  modern technology to create brand experiences that travel
                  globally and command authority.
                </p>
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
                className="founder-card group relative overflow-hidden border border-primary/20 bg-surface-container/70 p-2 shadow-[0_24px_70px_rgba(51,65,85,0.18)] transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:border-primary hover:shadow-[0_0_24px_rgba(184,134,11,0.5),0_28px_80px_rgba(51,65,85,0.22)] focus-within:border-primary focus-within:shadow-[0_0_22px_rgba(234,179,8,0.72)]"
                tabIndex={0}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-surface-container-highest">
                  {/* Keep founder1.png inside the public directory. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <Image
                    src={FOUNDER_ONE_IMAGE}
                    width={200}
                    height={200}
                    alt="Elevia Studio founder portrait one"
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105 group-focus-within:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-90" />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    <span className="mb-2 block font-label-technical text-[10px] tracking-[0.3em] text-primary">
                      FOUNDER 01
                    </span>
                    <p className="font-headline-md-mobile text-xl uppercase text-on-surface md:text-2xl">
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
                className="founder-card group relative overflow-hidden border border-primary/20 bg-surface-container/70 p-2 shadow-[0_24px_70px_rgba(51,65,85,0.18)] transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:border-primary hover:shadow-[0_0_24px_rgba(184,134,11,0.5),0_28px_80px_rgba(51,65,85,0.22)] focus-within:border-primary focus-within:shadow-[0_0_22px_rgba(234,179,8,0.72)]"
                tabIndex={0}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-surface-container-highest">
                  {/* Keep founder.2.png inside the public directory. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <Image
                    width={200}
                    height={200}
                    src={FOUNDER_TWO_IMAGE}
                    alt="Elevia Studio founder portrait two"
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105 group-focus-within:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-90" />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    <span className="mb-2 block font-label-technical text-[10px] tracking-[0.3em] text-primary">
                      FOUNDER 02
                    </span>
                    <p className="font-headline-md-mobile text-xl uppercase text-on-surface md:text-2xl">
                      Motion &amp; Strategy
                    </p>
                  </div>
                </div>
              </article>
            </div>

            <div className="founder-location-badge pointer-events-none absolute bottom-4 left-4 z-50 border border-primary/40 bg-surface/85 px-5 py-4 backdrop-blur-xl md:bottom-8 md:left-8">
              <span className="mb-2 block font-label-technical text-[9px] tracking-[0.3em] text-primary">
                BASED IN
              </span>
              <strong className="font-label-caps text-[11px] tracking-[0.22em] text-on-surface">
                AHMEDABAD, INDIA
              </strong>
            </div>
          </div>
        </section>
        <Portfolio />
        <FloatingLibrarySection />
        {/* <section
          id="services"
          className="border-y border-outline-variant/10 bg-surface-container-low/30 px-page-margin-mobile py-section-gap text-center backdrop-blur-lg md:px-page-margin-desktop"
        >
          <div className="mx-auto max-w-5xl space-y-12">
            <h2 className="split-text font-display-lg text-display-lg-mobile uppercase leading-[0.95] tracking-tight md:text-[80px]">
              <SplitCharacters text="Let's Build the " />
              <br />
              <SplitCharacters text="Exceptional" />
            </h2>
            <div className="reveal-slide-up flex flex-col justify-center gap-6 md:flex-row">
              <a
                href="#contact"
                className="magnetic-btn bg-primary px-12 py-5 font-label-caps text-label-caps font-bold tracking-[0.2em] text-on-primary transition-all duration-300 hover:-translate-y-[2px]"
              >
                START COLLABORATION
              </a>
              <a
                href="#portfolio"
                className="magnetic-btn border-2 border-primary px-12 py-5 font-label-caps text-label-caps font-bold tracking-[0.2em] text-primary transition-all duration-300 hover:bg-primary hover:text-on-primary"
              >
                VIEW SERVICES
              </a>
            </div>
          </div>
        </section> */}
      </main>

      <footer
        id="contact"
        className="relative z-10 w-full border-t border-outline-variant/30 bg-surface/80 px-page-margin-mobile py-24 backdrop-blur-md md:px-page-margin-desktop"
      >
        <div className="flex flex-col items-start justify-between md:flex-row">
          <div className="mb-12 md:mb-0">
            <Image
              alt="Elevia Studio Logo"
              className="h-11 w-auto object-contain md:h-13"
              fill
              src={LOGO_URL}
            />
            <p className="max-w-xs font-body-md text-primary">
              Creative Branding & Marketing Agency
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 sm:gap-16">
            <div className="flex flex-col gap-4">
              <span className="mb-4 font-label-technical text-[10px] uppercase tracking-widest text-primary">
                Network
              </span>
              <a
                className="font-body-md text-on-surface-variant transition-colors hover:text-primary"
                href="#"
              >
                INSTAGRAM
              </a>
              <a
                className="font-body-md text-on-surface-variant transition-colors hover:text-primary"
                href="#"
              >
                LINKEDIN
              </a>
              <a
                className="font-body-md text-on-surface-variant transition-colors hover:text-primary"
                href="#"
              >
                VIMEO
              </a>
            </div>

            <div className="flex flex-col gap-4">
              <span className="mb-4 font-label-technical text-[10px] uppercase tracking-widest text-primary">
                Studio
              </span>
              <a
                className="font-body-md text-on-surface-variant transition-colors hover:text-primary"
                href="#"
              >
                CAREERS
              </a>
              <a
                className="font-body-md text-on-surface-variant transition-colors hover:text-primary"
                href="mailto:hello@elevia.studio"
              >
                CONTACT
              </a>
              <a
                className="font-body-md text-on-surface-variant transition-colors hover:text-primary"
                href="#"
              >
                PRESS
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function initialiseBackgroundParticles(
  canvas: HTMLCanvasElement,
  mouse: { x: number; y: number },
) {
  const context = canvas.getContext("2d");

  if (!context) {
    console.warn(
      "Canvas 2D is unavailable; background particles are disabled.",
    );
    return () => undefined;
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  const particleCount = reducedMotion ? 0 : isMobile ? 42 : 88;
  const targetFrameInterval = 1000 / 30;

  type Particle = {
    x: number;
    y: number;
    radius: number;
    velocityX: number;
    velocityY: number;
    gold: boolean;
    alpha: number;
  };

  let width = window.innerWidth;
  let height = window.innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  let particles: Particle[] = [];
  let animationFrame = 0;
  let lastFrame = 0;
  let pageVisible = !document.hidden;

  const createParticles = () => {
    particles = Array.from({ length: particleCount }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: index % 7 === 0 ? 1.8 : 0.8 + Math.random() * 0.9,
      velocityX: (Math.random() - 0.5) * 0.12,
      velocityY: (Math.random() - 0.5) * 0.12,
      gold: index % 6 === 0,
      alpha: 0.12 + Math.random() * 0.18,
    }));
  };

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    createParticles();
  };

  const draw = (time: number) => {
    animationFrame = window.requestAnimationFrame(draw);

    if (!pageVisible || time - lastFrame < targetFrameInterval) {
      return;
    }

    lastFrame = time;
    context.clearRect(0, 0, width, height);

    const mouseInfluenceX = (mouse.x / Math.max(width, 1) - 0.5) * 0.08;
    const mouseInfluenceY = (mouse.y / Math.max(height, 1) - 0.5) * 0.08;

    for (const particle of particles) {
      particle.x += particle.velocityX + mouseInfluenceX;
      particle.y += particle.velocityY + mouseInfluenceY;

      if (particle.x < -12) particle.x = width + 12;
      if (particle.x > width + 12) particle.x = -12;
      if (particle.y < -12) particle.y = height + 12;
      if (particle.y > height + 12) particle.y = -12;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = particle.gold
        ? `rgba(184, 134, 11, ${particle.alpha + 0.08})`
        : `rgba(51, 65, 85, ${particle.alpha})`;
      context.fill();
    }

    const glow = context.createRadialGradient(
      mouse.x,
      mouse.y,
      0,
      mouse.x,
      mouse.y,
      Math.min(width, height) * 0.28,
    );
    glow.addColorStop(0, "rgba(184, 134, 11, 0.055)");
    glow.addColorStop(1, "rgba(184, 134, 11, 0)");

    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);
  };

  const handleVisibility = () => {
    pageVisible = !document.hidden;
  };

  resize();
  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", handleVisibility);
  animationFrame = window.requestAnimationFrame(draw);

  return () => {
    window.cancelAnimationFrame(animationFrame);
    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", handleVisibility);
    context.clearRect(0, 0, width, height);
  };
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
    color: 0xb8860b,
    wireframe: true,
    transparent: true,
    opacity: 0.26,
    emissive: 0xb8860b,
    emissiveIntensity: 0.08,
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
