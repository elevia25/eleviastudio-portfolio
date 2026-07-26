"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef } from "react";
import * as THREE from "three";

const URBAN_BREW_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCzx2xwYkXVEtBLI1GqDvBhiD2PFukUny9p9YiDmezSg_K0pBQtG1APChoSdpidcf-CoQjAPIPw2W_nQemyHsBnHssdjrDrIA5yRRnDFCPfIT26dlW5rAWDFvdbQWEK_uSyrd_TkGUyvlB4z4uCnixV7H6iISFiAUaraLII-TQ4wjZyhAaPqu8u8Z3JH6vbuZ5aVYZO3XM_VW9QeDpxgON0nlMEmu-tZlEF8-Ht0K5r-K7msj3X2I2EV-5V_SG6RrA59_DQd7-7Kzo";

const AYUSH_ESTATE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBnfUcaeuFV3WmimdbII-7Imp5qokxzuXGPYcr5v8wN-isJNa-j3xpAHb8OiotpJ_GwPNMkc8jeszrZJk2bwvmKWyspm8FjDo_iuCST5ytT7_ZQZ8AIBl9Kis0JvSojEjP01XRmlugth4kM-tiPSupqyJVgJrtxDKdz7i_pCgZ2LfHrqPpMX7j8fNW-kOqnc5ar2xqJ3odI7KAmKDVCU5rnloW9S8lN20JXlhZDBd1Z2oIeDbQbIWZhv3EL98ujsjA9RX1w8T554P4";

const ASTROVASTU_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB7D1GwtU8274tLNXtpwr_WKYd_EGn2VsQX9S03U9t3sJdyYnA9g8D9JLlWdOVvRyiyTGxhh5eekqCIXliNkrasI5R4Yh0knaGcexwtdK5hZoeMgoAmjUBxDq-EKYXwznJJ10pLZFY8J3g518w_C8CDQiv6MBiRF9b-2VXMoO9PCOnvRwmty9QorY_cYBBYxfqMMQAJU4KZcLNOdg03LMEsucaFfzXHReiwGc4JZb-giWsCleX4LAGK4ZwjOXzWM4F2CRvEN7WimW0";

const SNEHA_BHAVSAR_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAu0KhyjHB9rMb2WbqRlymrQAewXW7-3ipOj16vILeED7y9MEjwnzPV6kGQsHbPa3ctH1MTqg5Ps1MLhsQ0djJzUIdhcRbR19vW_XzHE3-d1frR3tw8e71IaQHGTrmMjHzteYcoLi6V4lseCJ0ctOgs-eTjRh8XJljg-1OINNCOuggmw_RL8Nrp2bBJAvGYjay1JfvfwrFKmjsb3kby6b3zF1-w5mmWKOmstPJnt9sIHv79u26lwJbP7JpqdFHOIkIY9ZvKFb-1zec";

type MousePosition = {
  x: number;
  y: number;
};

function initialiseParticleBackground(
  container: HTMLDivElement,
  mouse: MousePosition,
): () => void {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  const particleCount = 1200;
  const positions = new Float32Array(particleCount * 3);

  for (let index = 0; index < particleCount; index += 1) {
    positions[index * 3] = (Math.random() - 0.5) * 15;
    positions[index * 3 + 1] = (Math.random() - 0.5) * 15;
    positions[index * 3 + 2] = (Math.random() - 0.5) * 15;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xeab308,
    size: 0.018,
    transparent: true,
    opacity: 0.48,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
  camera.position.z = 5;

  let animationFrame = 0;
  let previousTime = performance.now();

  const animate = (time: number) => {
    const delta = Math.min((time - previousTime) / 16.667, 2);
    previousTime = time;

    particles.rotation.y += 0.0005 * delta;
    particles.rotation.x += 0.0002 * delta;

    const targetX = (mouse.x / window.innerWidth - 0.5) * 0.5;
    const targetY = (mouse.y / window.innerHeight - 0.5) * 0.5;

    particles.position.x += (targetX - particles.position.x) * 0.05;
    particles.position.y += (-targetY - particles.position.y) * 0.05;

    renderer.render(scene, camera);
    animationFrame = window.requestAnimationFrame(animate);
  };

  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  window.addEventListener("resize", handleResize, { passive: true });
  animationFrame = window.requestAnimationFrame(animate);

  return () => {
    window.cancelAnimationFrame(animationFrame);
    window.removeEventListener("resize", handleResize);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}

function ProjectImage({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      alt={alt}
      className="portfolio-image h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
      src={src}
    />
  );
}

export default function Portfolio() {
  const rootRef = useRef<HTMLDivElement>(null);
  const particleContainerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const particleContainer = particleContainerRef.current;
    const cursor = cursorRef.current;

    if (!root || !particleContainer || !cursor) {
      return;
    }

    const mouse: MousePosition = {
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
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      cursorAnimationFrame = window.requestAnimationFrame(updateCursor);
    };

    cursorAnimationFrame = window.requestAnimationFrame(updateCursor);

    const particleCleanup = initialiseParticleBackground(
      particleContainer,
      mouse,
    );

    const hoverTargets = Array.from(
      root.querySelectorAll<HTMLElement>(
        "a, button, .glitch-hover, [data-cursor-interactive='true']",
      ),
    );

    const hoverCleanups = hoverTargets.map((element) => {
      const enter = () => cursor.classList.add("hover-active");
      const leave = () => cursor.classList.remove("hover-active");
      element.addEventListener("mouseenter", enter);
      element.addEventListener("mouseleave", leave);

      return () => {
        element.removeEventListener("mouseenter", enter);
        element.removeEventListener("mouseleave", leave);
      };
    });

    const magneticCleanups = Array.from(
      root.querySelectorAll<HTMLElement>(".magnetic-target"),
    ).map((element) => {
      const move = (event: MouseEvent) => {
        const rectangle = element.getBoundingClientRect();
        const distanceX =
          event.clientX - (rectangle.left + rectangle.width / 2);
        const distanceY =
          event.clientY - (rectangle.top + rectangle.height / 2);

        element.style.transform = `translate3d(${distanceX * 0.3}px, ${distanceY * 0.3}px, 0)`;
        cursor.classList.add("hover-active");
      };

      const leave = () => {
        element.style.transform = "translate3d(0, 0, 0)";
        cursor.classList.remove("hover-active");
      };

      element.addEventListener("mousemove", move);
      element.addEventListener("mouseleave", leave);

      return () => {
        element.removeEventListener("mousemove", move);
        element.removeEventListener("mouseleave", leave);
      };
    });

    const revealItems = Array.from(
      root.querySelectorAll<HTMLElement>(".bento-item"),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );

    revealItems.forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index % 3, 2) * 90}ms`;
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
      hoverCleanups.forEach((cleanup) => cleanup());
      magneticCleanups.forEach((cleanup) => cleanup());
      particleCleanup();
      window.cancelAnimationFrame(cursorAnimationFrame);
      window.removeEventListener("mousemove", handleMouseMove);
      cursor.classList.remove("hover-active");
    };
  }, []);

  return (
    <div ref={rootRef} className="relative min-h-screen overflow-x-hidden">
      <div
        ref={particleContainerRef}
        id="threejs-background"
        aria-hidden="true"
      />

      <div
        ref={cursorRef}
        className="custom-cursor hidden md:block"
        aria-hidden="true"
      >
        <div className="cursor-inner" />
      </div>

      <main id="top" className="relative z-10 pb-8">
        <section
          id="about"
          className="mb-24 px-page-margin-mobile md:mb-32 md:px-page-margin-desktop"
        >
          <div className="max-w-5xl">
            <span className="bento-item mb-6 block font-label-technical text-[11px] uppercase tracking-[0.4em] text-primary md:text-label-technical">
              Crafting the Future
            </span>
            <h1 className="bento-item font-display-lg text-display-lg-mobile leading-[0.9] md:text-display-lg">
              Creative Vision.
              <br />
              <span className="text-outline">Motion Excellence.</span>
            </h1>
          </div>
        </section>

        <section
          id="portfolio"
          className="grid auto-rows-[300px] grid-cols-1 gap-8 px-page-margin-mobile md:auto-rows-[450px] md:grid-cols-12 md:px-page-margin-desktop"
        >
          <article
            className="portfolio-card glitch-hover bento-item group relative overflow-hidden border border-outline-variant/30 md:col-span-8 md:row-span-2"
            data-cursor-interactive="true"
          >
            <ProjectImage src={URBAN_BREW_IMAGE} alt="Urban Brew project" />
            <div className="lens-flare" />
            <div className="absolute inset-0 z-[3] bg-gradient-to-t from-surface-container-lowest via-surface/20 to-transparent" />
            <div className="absolute inset-x-6 bottom-7 z-10 md:inset-x-10 md:bottom-10">
              <span className="mb-2 block font-label-technical text-[10px] uppercase tracking-widest text-primary">
                Featured Project
              </span>
              <div className="flex items-end justify-between gap-5">
                <div>
                  <h2 className="project-title-pulse font-headline-md text-4xl text-white md:text-5xl">
                    Urban Brew
                  </h2>
                  <p className="mt-4 hidden max-w-sm font-body-md text-white/60 md:block">
                    Redefining metropolitan coffee culture through cinematic
                    minimalism.
                  </p>
                </div>
                <span className="magnetic-target material-symbols-outlined text-4xl text-primary">
                  arrow_outward
                </span>
              </div>
            </div>
          </article>

          <article
            className="portfolio-card glitch-hover bento-item group relative overflow-hidden border border-outline-variant/30 md:col-span-4 md:row-span-2"
            data-cursor-interactive="true"
          >
            <ProjectImage
              src={AYUSH_ESTATE_IMAGE}
              alt="Luxury estate project"
            />
            <div className="lens-flare" />
            <div className="absolute inset-0 z-[3] bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />
            <div className="absolute inset-x-6 bottom-7 z-10 md:inset-x-10 md:bottom-10">
              <span className="mb-2 block font-label-technical text-[10px] uppercase text-primary">
                Real Estate
              </span>
              <h2 className="project-title-pulse font-headline-md text-3xl text-white">
                Luxury Assets
              </h2>
              <span className="magnetic-target material-symbols-outlined mt-6 text-3xl text-white/50 transition-colors group-hover:text-primary">
                arrow_right_alt
              </span>
            </div>
          </article>

          <article
            className="portfolio-card glitch-hover bento-item group relative overflow-hidden border border-outline-variant/30 md:col-span-6"
            data-cursor-interactive="true"
          >
            <ProjectImage
              src={ASTROVASTU_IMAGE}
              alt="Daily Horoscope interface"
            />
            <div className="lens-flare" />
            <div className="absolute inset-0 z-[3] bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />
            <div className="absolute inset-x-6 bottom-7 z-10 flex items-center justify-between md:inset-x-8 md:bottom-8">
              <div>
                <span className="mb-1 block font-label-technical text-[10px] uppercase text-primary">
                  UI/UX Design
                </span>
                <h2 className="project-title-pulse font-headline-md text-2xl text-white">
                  Daily Horoscope
                </h2>
              </div>
              <span className="magnetic-target material-symbols-outlined text-white/50 transition-colors group-hover:text-primary">
                open_in_new
              </span>
            </div>
          </article>

          <article
            className="portfolio-card glitch-hover bento-item group relative overflow-hidden border border-outline-variant/30 md:col-span-6"
            data-cursor-interactive="true"
          >
            <ProjectImage
              src={SNEHA_BHAVSAR_IMAGE}
              alt="Aesthetic Stories branding"
            />
            <div className="lens-flare" />
            <div className="absolute inset-0 z-[3] bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />
            <div className="absolute inset-x-6 bottom-7 z-10 flex items-center justify-between md:inset-x-8 md:bottom-8">
              <div>
                <span className="mb-1 block font-label-technical text-[10px] uppercase text-primary">
                  Branding
                </span>
                <h2 className="project-title-pulse font-headline-md text-2xl text-white">
                  Aesthetic Stories
                </h2>
              </div>
              <span className="magnetic-target material-symbols-outlined text-white/50 transition-colors group-hover:text-primary">
                arrow_outward
              </span>
            </div>
          </article>
        </section>

        <section
          id="services"
          className="mt-section-gap px-page-margin-mobile text-center md:px-page-margin-desktop"
        >
          <h2 className="bento-item mb-16 font-display-lg text-display-lg-mobile md:text-display-lg">
            Start Your <span className="italic text-primary">Motion</span>.
          </h2>
          <div className="bento-item flex flex-col justify-center gap-8 md:flex-row">
            <a
              className="magnetic-target justify-center bg-primary px-12 py-6 font-label-caps text-sm font-bold text-on-primary transition-colors duration-500 hover:bg-primary/90"
              href="#contact"
            >
              INITIATE PROJECT
            </a>
            <a
              className="magnetic-target justify-center border border-outline-variant px-12 py-6 font-label-caps text-sm text-on-surface transition-all duration-500 hover:border-primary hover:bg-primary hover:text-on-primary"
              href="#portfolio"
            >
              VIEW SHOWREEL
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
