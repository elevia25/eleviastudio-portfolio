"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import Portfolio from "./Portfolio";

const LOGO_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDs6n0IDeLXO6-ptmwGEkrb9BByHRdSGuBhaHkUX9jFoMjEOQGz3rsrHaiX03hJF9W-OVpt_C6ulh7n-n5pHz-scuBxXR6ErIPnoRh6gdhZc4SHcKsTOT_t9HkUsmL5DzxLpRYAvI0qn0ooYCgxWn4yvwZbxEJP_0bw6HdeGLaptvjvcXUDrHpy5KC55dobQfTXLrO3TEbM7iKQpu8Cj9t0eEgmGpSYD1aJcXXSzuaMUTvT7JeUxJdcqVlhaylzgBfeL0NNgYX5FKA";

const OBSIDIAN_HOUSE_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCIsD3BPm5nqVaMw9NNo7YjgQv2whp3-inVHmZ8ODaapZPa3pnWdCqRlnhZADdij0Vw_OArIL9s0n-GS26Hxr9J05QIqx_8SZAqOIZMJGR5fpgao6n8vyF_gDTSTCJcZhDqrmP0Zjo2wGtSrXxskagxXmUQZvOeHE98mKKexpsOC-Q8oBu8gvGML8Pa515jw2uiqdawyVQm6p1aN34wevEXiMiZN6Lz5F6VPeduEUZn73On516pVtcjt0KjPIMjG-HXuYrZLdUr5VA";

const CHRONOS_ELITE_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDzwkfMYhNQhgNsGOZk0EcSKZdjtN5cJhUzLE5Y4rI46A1SYCuEscp0syfHui2kDVF0hoCqUs9B1Loyf2rXl-VmsCXv6LyGuy6wQHVM1RTttQs29bdm5XUALTpnGBgex2_LIG6-BxJOQ-5SEbDXXD3hmpU9ilmJrRmlOs36DjgA2EADUMhJtOe1WzcqWVmztUq4FM7g6SfcUqU64cnHRoQJcYJIye7fZq_YK6zAVLgfrRn5egJ_3dpEN-jCuP8QdNSl5sOgQvV0HeY";

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

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);

  if (!shader) {
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      "WebGL shader compilation failed:",
      gl.getShaderInfoLog(shader),
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export default function StudioPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const threeContainerRef = useRef<HTMLDivElement>(null);

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
      root.querySelectorAll<HTMLElement>("a, button, .project-tile"),
    );

    const cursorHoverHandlers = hoverTargets.map((element) => {
      const enter = () => cursor.classList.add("hovering");
      const leave = () => cursor.classList.remove("hovering");
      element.addEventListener("mouseenter", enter);
      element.addEventListener("mouseleave", leave);
      return { element, enter, leave };
    });

    const shaderCleanup = initialiseBackgroundShader(backgroundCanvas, mouse);
    const threeCleanup = initialiseHeroSculpture(threeContainer, mouse);

    const magneticCleanups = Array.from(
      root.querySelectorAll<HTMLElement>(".magnetic-btn"),
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
      shaderCleanup();
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
    <div ref={rootRef}>
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
            className="h-6 w-auto object-contain md:h-8"
            src={LOGO_URL}
          />
          <span className="font-display-lg text-[18px] uppercase tracking-tighter text-on-surface">
            ELEVIA STUDIO
          </span>
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
        className="relative flex h-screen w-full flex-col items-center justify-center px-page-margin-mobile text-center"
      >
        <div
          ref={threeContainerRef}
          className="threejs-container"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl space-y-10">
          <div className="overflow-hidden">
            <h1 className="split-text font-display-lg text-display-lg-mobile uppercase md:text-display-lg">
              <SplitCharacters text="Architecting " />
              <br className="hidden md:block" />
              <SplitCharacters text="Visual Power" />
            </h1>
          </div>

          <div className="reveal-slide-up flex items-center justify-center gap-6">
            <span className="h-[2px] w-16 bg-primary" />
            <p className="font-label-technical text-label-technical tracking-[0.4em] text-primary">
              LONDON — NEW YORK — DUBAI
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

      <main>
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
                <SplitCharacters text="Elevia Studio is a high-performance creative collective defining the aesthetic frontier for global luxury brands." />
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
                  Merging the architectural rigor of classical design with the
                  velocity of modern tech, we create brand experiences that
                  command authority.
                </p>
              </div>
            </div>
          </div>

          <div
            className="reveal-slide-up relative aspect-square md:col-span-5"
            style={{ transitionDelay: "0.2s" }}
          >
            <div className="sharp-edge absolute inset-0 flex items-center justify-center bg-surface-container/30 p-12 backdrop-blur-lg">
              <div className="space-y-6 text-center">
                <div
                  className="counter font-display-lg text-7xl text-primary"
                  data-target="12"
                >
                  0
                </div>
                <div className="font-label-caps text-label-caps tracking-[0.3em] text-on-surface">
                  GLOBAL AWARDS
                </div>
                <p className="font-body-md text-on-surface-variant">
                  Validated excellence in design and strategy.
                </p>
              </div>
            </div>
          </div>
        </section>
        <Portfolio />
        <section
          id="portfolio"
          className="px-page-margin-mobile py-section-gap md:px-page-margin-desktop"
        >
          <div className="mb-16 flex flex-col items-end justify-between gap-8 md:flex-row">
            <div className="max-w-2xl space-y-4 self-start">
              <span className="reveal-slide-up font-label-technical text-label-technical text-primary">
                ARCHIVE
              </span>
              <h3 className="split-text font-headline-md text-headline-md-mobile uppercase md:text-headline-md">
                <SplitCharacters text="Selected Works" />
              </h3>
            </div>

            <div className="reveal-slide-up flex flex-wrap gap-4">
              {["ALL PROJECTS", "STRATEGY", "DESIGN"].map((label) => (
                <button
                  key={label}
                  type="button"
                  className="magnetic-btn border border-outline-variant/30 bg-surface-container/50 px-6 py-3 font-label-caps text-label-caps text-on-surface backdrop-blur-md transition-colors hover:border-primary"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <article className="project-tile reveal-slide-up group flex flex-col overflow-hidden border border-outline-variant/10">
              <div className="tile-inner">
                <div className="parallax-img-container relative aspect-[4/3] overflow-hidden bg-surface-container-highest">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="parallax-img h-full w-full object-cover"
                    alt="A high-end cinematic shot of a modern architectural structure in a desert landscape at dusk."
                    src={OBSIDIAN_HOUSE_URL}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-surface/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="border border-primary px-6 py-2 font-label-caps text-label-caps text-primary">
                      DETAILS
                    </span>
                  </div>
                </div>
                <div className="border-t border-outline-variant/10 bg-surface-container/50 p-6">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-headline-md-mobile text-lg font-bold uppercase tracking-tight">
                      Obsidian House
                    </h4>
                    <span className="bg-primary/10 px-2 py-1 font-label-technical text-[10px] text-primary">
                      2024
                    </span>
                  </div>
                  <p className="font-label-technical text-[11px] text-on-surface-variant">
                    ARCHITECTURAL BRANDING
                  </p>
                </div>
              </div>
            </article>

            <article
              className="project-tile reveal-slide-up group flex flex-col overflow-hidden border border-outline-variant/10"
              style={{ transitionDelay: "0.1s" }}
            >
              <div className="tile-inner">
                <div className="parallax-img-container relative aspect-[4/3] overflow-hidden bg-surface-container-highest">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="parallax-img h-full w-full object-cover"
                    alt="A macro studio shot of a high-end luxury watch face with intricate mechanical details."
                    src={CHRONOS_ELITE_URL}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-surface/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="border border-primary px-6 py-2 font-label-caps text-label-caps text-primary">
                      DETAILS
                    </span>
                  </div>
                </div>
                <div className="border-t border-outline-variant/10 bg-surface-container/50 p-6">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-headline-md-mobile text-lg font-bold uppercase tracking-tight">
                      Chronos Elite
                    </h4>
                    <span className="bg-primary/10 px-2 py-1 font-label-technical text-[10px] text-primary">
                      2024
                    </span>
                  </div>
                  <p className="font-label-technical text-[11px] text-on-surface-variant">
                    DIGITAL ECOMMERCE
                  </p>
                </div>
              </div>
            </article>

            <article
              className="project-tile reveal-slide-up group flex flex-col overflow-hidden border border-outline-variant/10"
              style={{ transitionDelay: "0.2s" }}
            >
              <div className="tile-inner">
                <div className="parallax-img-container relative aspect-[4/3] overflow-hidden bg-surface-container-highest">
                  <div className="flex h-full w-full items-center justify-center bg-[#162033]/50">
                    <span className="font-label-caps text-on-surface-variant">
                      UPCOMING WORK
                    </span>
                  </div>
                </div>
                <div className="border-t border-outline-variant/10 bg-surface-container/50 p-6">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-headline-md-mobile text-lg font-bold uppercase tracking-tight">
                      Aethelred Labs
                    </h4>
                    <span className="bg-primary/10 px-2 py-1 font-label-technical text-[10px] text-primary">
                      COMING SOON
                    </span>
                  </div>
                  <p className="font-label-technical text-[11px] text-on-surface-variant">
                    VISUAL IDENTITY
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section
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
        </section>
      </main>

      <footer
        id="contact"
        className="relative z-10 w-full border-t border-outline-variant/30 bg-surface/80 px-page-margin-mobile py-24 backdrop-blur-md md:px-page-margin-desktop"
      >
        <div className="flex flex-col items-start justify-between md:flex-row">
          <div className="mb-12 md:mb-0">
            <span className="mb-6 block font-display-lg text-4xl text-on-surface">
              ELEVIA STUDIO
            </span>
            <p className="max-w-xs font-body-md text-on-surface-variant">
              © 2024. Pushing visual boundaries through cinematic storytelling
              and advanced motion design.
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

function initialiseBackgroundShader(
  canvas: HTMLCanvasElement,
  mouse: { x: number; y: number },
) {
  const gl = canvas.getContext("webgl");

  if (!gl) {
    console.warn("WebGL is unavailable; the animated background is disabled.");
    return () => undefined;
  }

  const vertexShaderSource = `
    attribute vec2 a_position;
    varying vec2 v_texCoord;

    void main() {
      v_texCoord = a_position * 0.5 + 0.5;
      v_texCoord.y = 1.0 - v_texCoord.y;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fragmentShaderSource = `
    precision highp float;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    varying vec2 v_texCoord;

    void main() {
      vec2 uv = v_texCoord;
      vec2 mousePosition = u_mouse / u_resolution;
      float t = u_time * 0.15;
      vec2 p = uv * 2.0 - 1.0;
      p.x *= u_resolution.x / u_resolution.y;

      float noise = 0.0;
      vec2 q = p;

      for (float i = 1.0; i < 4.0; i++) {
        q.x += 0.5 * sin(i * q.y + t);
        q.y += 0.5 * cos(i * q.x + t);
        noise += sin(length(q) * 2.0) / i;
      }

      vec3 color1 = vec3(0.06, 0.09, 0.16);
      vec3 color2 = vec3(0.12, 0.15, 0.22);
      vec3 accent = vec3(0.92, 0.70, 0.03);
      float distanceFromMouse = length(p - (mousePosition * 2.0 - 1.0));
      float mask = smoothstep(0.6, 0.0, distanceFromMouse);
      vec3 finalColor = mix(color1, color2, noise * 0.5 + 0.5);
      finalColor += accent * mask * 0.15;
      finalColor += accent * (noise * 0.05);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = compileShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource,
  );

  if (!vertexShader || !fragmentShader) {
    return () => undefined;
  }

  const program = gl.createProgram();
  const positionBuffer = gl.createBuffer();

  if (!program || !positionBuffer) {
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return () => undefined;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(
      "WebGL program linking failed:",
      gl.getProgramInfoLog(program),
    );
    gl.deleteProgram(program);
    gl.deleteBuffer(positionBuffer);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return () => undefined;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );

  const positionLocation = gl.getAttribLocation(program, "a_position");
  const timeLocation = gl.getUniformLocation(program, "u_time");
  const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  const mouseLocation = gl.getUniformLocation(program, "u_mouse");

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  };

  resize();
  window.addEventListener("resize", resize, { passive: true });

  let animationFrame = 0;

  const render = (time: number) => {
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1f(timeLocation, time * 0.001);
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniform2f(mouseLocation, mouse.x, canvas.height - mouse.y);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    animationFrame = window.requestAnimationFrame(render);
  };

  animationFrame = window.requestAnimationFrame(render);

  return () => {
    window.cancelAnimationFrame(animationFrame);
    window.removeEventListener("resize", resize);
    gl.deleteBuffer(positionBuffer);
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
  };
}

function initialiseHeroSculpture(
  container: HTMLDivElement,
  mouse: { x: number; y: number },
) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Detail 15 from the source would create billions of triangles and freeze a browser.
  // Detail 5 preserves the same smooth wireframe appearance at a safe GPU cost.
  const geometry = new THREE.IcosahedronGeometry(1.2, 5);
  const material = new THREE.MeshPhongMaterial({
    color: 0xeab308,
    wireframe: true,
    transparent: true,
    opacity: 0.25,
    emissive: 0xeab308,
    emissiveIntensity: 0.1,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const light = new THREE.PointLight(0xffffff, 1.5, 100);
  light.position.set(10, 10, 10);
  scene.add(light);
  camera.position.z = 3.5;

  const resize = () => {
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  resize();
  window.addEventListener("resize", resize, { passive: true });

  let animationFrame = 0;

  const animate = () => {
    mesh.rotation.x += 0.0015;
    mesh.rotation.y += 0.002;

    const targetX = (mouse.x / window.innerWidth - 0.5) * 2;
    const targetY = -(mouse.y / window.innerHeight - 0.5) * 2;
    mesh.position.x += (targetX - mesh.position.x) * 0.05;
    mesh.position.y += (targetY - mesh.position.y) * 0.05;

    renderer.render(scene, camera);
    animationFrame = window.requestAnimationFrame(animate);
  };

  animationFrame = window.requestAnimationFrame(animate);

  return () => {
    window.cancelAnimationFrame(animationFrame);
    window.removeEventListener("resize", resize);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
