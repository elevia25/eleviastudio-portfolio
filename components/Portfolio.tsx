import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

const PROJECTS = [
  {
    id: "01",
    title: "Urban Brew",
    category: "Featured Project",
    description:
      "Redefining metropolitan coffee culture through cinematic minimalism.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCzx2xwYkXVEtBLI1GqDvBhiD2PFukUny9p9YiDmezSg_K0pBQtG1APChoSdpidcf-CoQjAPIPw2W_nQemyHsBnHssdjrDrIA5yRRnDFCPfIT26dlW5rAWDFvdbQWEK_uSyrd_TkGUyvlB4z4uCnixV7H6iISFiAUaraLII-TQ4wjZyhAaPqu8u8Z3JH6vbuZ5aVYZO3XM_VW9QeDpxgON0nlMEmu-tZlEF8-Ht0K5r-K7msj3X2I2EV-5V_SG6RrA59_DQd7-7Kzo",
    alt: "Urban Brew project",
    icon: "arrow_outward",
  },
  {
    id: "02",
    title: "Luxury Assets",
    category: "Real Estate",
    description:
      "A premium property narrative shaped through atmosphere, scale, and architectural detail.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBnfUcaeuFV3WmimdbII-7Imp5qokxzuXGPYcr5v8wN-isJNa-j3xpAHb8OiotpJ_GwPNMkc8jeszrZJk2bwvmKWyspm8FjDo_iuCST5ytT7_ZQZ8AIBl9Kis0JvSojEjP01XRmlugth4kM-tiPSupqyJVgJrtxDKdz7i_pCgZ2LfHrqPpMX7j8fNW-kOqnc5ar2xqJ3odI7KAmKDVCU5rnloW9S8lN20JXlhZDBd1Z2oIeDbQbIWZhv3EL98ujsjA9RX1w8T554P4",
    alt: "Luxury estate project",
    icon: "arrow_right_alt",
  },
  {
    id: "03",
    title: "Daily Horoscope",
    category: "UI/UX Design",
    description:
      "A calm celestial interface balancing daily guidance with a precise digital product system.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB7D1GwtU8274tLNXtpwr_WKYd_EGn2VsQX9S03U9t3sJdyYnA9g8D9JLlWdOVvRyiyTGxhh5eekqCIXliNkrasI5R4Yh0knaGcexwtdK5hZoeMgoAmjUBxDq-EKYXwznJJ10pLZFY8J3g518w_C8CDQiv6MBiRF9b-2VXMoO9PCOnvRwmty9QorY_cYBBYxfqMMQAJU4KZcLNOdg03LMEsucaFfzXHReiwGc4JZb-giWsCleX4LAGK4ZwjOXzWM4F2CRvEN7WimW0",
    alt: "Daily Horoscope interface",
    icon: "open_in_new",
  },
  {
    id: "04",
    title: "Aesthetic Stories",
    category: "Branding",
    description:
      "A visual identity built around personality, editorial rhythm, and expressive storytelling.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAu0KhyjHB9rMb2WbqRlymrQAewXW7-3ipOj16vILeED7y9MEjwnzPV6kGQsHbPa3ctH1MTqg5Ps1MLhsQ0djJzUIdhcRbR19vW_XzHE3-d1frR3tw8e71IaQHGTrmMjHzteYcoLi6V4lseCJ0ctOgs-eTjRh8XJljg-1OINNCOuggmw_RL8Nrp2bBJAvGYjay1JfvfwrFKmjsb3kby6b3zF1-w5mmWKOmstPJnt9sIHv79u26lwJbP7JpqdFHOIkIY9ZvKFb-1zec",
    alt: "Aesthetic Stories branding",
    icon: "arrow_outward",
  },
] as const;

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

  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.inset = "0";
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.pointerEvents = "none";

  container.replaceChildren(renderer.domElement);

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
    renderer.setSize(window.innerWidth, window.innerHeight, false);
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
      className="portfolio-image h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
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

    gsap.registerPlugin(ScrollTrigger);

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
      root.querySelectorAll(
        "a, button, .glitch-hover, [data-cursor-interactive='true']",
      ),
    ) as HTMLElement[];

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

    const magneticCleanups = (
      Array.from(root.querySelectorAll(".magnetic-target")) as HTMLElement[]
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
      root.querySelectorAll(".bento-item"),
    ) as HTMLElement[];

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
      element.style.transitionDelay = `${Math.min(index, 2) * 90}ms`;
      observer.observe(element);
    });

    const stackContext = gsap.context(() => {
      const cards = gsap.utils.toArray(".project-stack-card") as HTMLElement[];

      cards.forEach((card, index) => {
        const motionLayer = card.querySelector<HTMLElement>(
          ".project-card-motion",
        );

        if (!motionLayer) {
          return;
        }

        gsap.fromTo(
          motionLayer,
          {
            y: () => Math.min(window.innerHeight * 0.22, 180),
            scale: 0.96,
            opacity: 0.45,
          },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 98%",
              end: "top 64%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );

        const nextCard = cards[index + 1];

        if (nextCard) {
          gsap.to(motionLayer, {
            y: -28,
            scale: 0.94,
            filter: "brightness(0.48) saturate(0.78)",
            ease: "none",
            scrollTrigger: {
              trigger: nextCard,
              start: "top 92%",
              end: "top 24%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }
      });
    }, root);

    ScrollTrigger.refresh();

    return () => {
      stackContext.revert();
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
    <div
      ref={rootRef}
      className="relative isolate min-h-screen overflow-x-clip bg-transparent"
    >
      <div
        ref={particleContainerRef}
        id="threejs-background"
        className="pointer-events-none fixed inset-0 -z-10 h-screen w-screen overflow-hidden"
        aria-hidden="true"
      />

      <div
        ref={cursorRef}
        className="custom-cursor hidden md:block"
        aria-hidden="true"
      >
        <div className="cursor-inner" />
      </div>

      <main id="top" className="relative z-10">
        <section
          id="about"
          className="mb-24 px-page-margin-mobile pt-20 md:mb-32 md:px-page-margin-desktop md:pt-28"
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
          className="relative px-page-margin-mobile md:px-page-margin-desktop"
        >
          <div className="mx-auto mb-14 flex max-w-7xl items-end justify-between gap-8 md:mb-20">
            <div>
              <span className="bento-item mb-4 block font-label-technical text-[11px] uppercase tracking-[0.35em] text-primary">
                Projects Done
              </span>
              <h2 className="bento-item font-headline-md text-headline-md-mobile uppercase md:text-headline-md">
                Selected Work
              </h2>
            </div>
            <p className="bento-item hidden max-w-sm text-right font-body-md text-on-surface-variant md:block">
              Scroll to move through the archive. Each new project rises over
              the previous one.
            </p>
          </div>

          <div className="mx-auto max-w-7xl">
            {PROJECTS.map((project, index) => (
              <article
                key={project.id}
                className="project-stack-card sticky top-20 mb-[18vh] h-[68svh] min-h-[470px] md:top-28 md:h-[76svh] md:min-h-[620px]"
                style={{ zIndex: 20 + index }}
                data-cursor-interactive="true"
              >
                <div className="project-card-motion glitch-hover group relative h-full overflow-hidden border border-outline-variant/40 bg-surface-container-lowest shadow-[0_30px_100px_rgba(0,0,0,0.48)] will-change-transform">
                  <ProjectImage src={project.image} alt={project.alt} />

                  <div className="lens-flare" />
                  <div className="absolute inset-0 z-[2] bg-gradient-to-t from-surface-container-lowest via-surface/25 to-transparent" />
                  <div className="absolute inset-0 z-[2] bg-[linear-gradient(110deg,rgba(15,23,42,0.18),transparent_60%)]" />

                  <div className="absolute left-5 top-5 z-10 flex items-center gap-3 md:left-8 md:top-8">
                    <span className="font-label-technical text-[10px] tracking-[0.28em] text-primary">
                      {project.id}
                    </span>
                    <span className="h-px w-10 bg-primary/60" />
                    <span className="font-label-technical text-[10px] uppercase tracking-[0.22em] text-white/65">
                      {project.category}
                    </span>
                  </div>

                  <div className="absolute inset-x-5 bottom-6 z-10 flex items-end justify-between gap-6 md:inset-x-10 md:bottom-10">
                    <div className="max-w-3xl">
                      <h3 className="project-title-pulse font-headline-md text-3xl text-white sm:text-4xl md:text-6xl">
                        {project.title}
                      </h3>
                      <p className="mt-4 max-w-xl font-body-md text-sm text-white/65 sm:text-base md:text-body-md">
                        {project.description}
                      </p>
                    </div>

                    <span className="magnetic-target material-symbols-outlined shrink-0 text-3xl text-primary md:text-5xl">
                      {project.icon}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
