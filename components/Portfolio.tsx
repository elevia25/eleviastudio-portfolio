import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

export default function Portfolio() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      gsap.from(".projects-heading", {
        opacity: 0,
        y: 48,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".projects-heading",
          start: "top 88%",
          once: true,
        },
      });

      const cards = gsap.utils.toArray<HTMLElement>(".project-stack-card");

      cards.forEach((card, index) => {
        const motionLayer = card.querySelector<HTMLElement>(
          ".project-card-motion",
        );
        const shade = card.querySelector<HTMLElement>(".project-card-shade");

        if (!motionLayer) {
          return;
        }

        gsap.fromTo(
          motionLayer,
          {
            y: () => Math.min(window.innerHeight * 0.24, 190),
            scale: 0.975,
            opacity: 0.72,
          },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            force3D: true,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 100%",
              end: "top 58%",
              scrub: 0.25,
              invalidateOnRefresh: true,
            },
          },
        );

        const nextCard = cards[index + 1];

        if (nextCard) {
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: nextCard,
              start: "top 91%",
              end: "top 34%",
              scrub: 0.3,
              invalidateOnRefresh: true,
            },
          });

          timeline.to(
            motionLayer,
            {
              y: -18,
              scale: 0.965,
              force3D: true,
              ease: "none",
            },
            0,
          );

          if (shade) {
            timeline.to(
              shade,
              {
                opacity: 0.28,
                ease: "none",
              },
              0,
            );
          }
        }
      });
    }, root);

    ScrollTrigger.refresh();

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="portfolio"
      className="relative z-10 px-page-margin-mobile  pt-section-gap md:px-page-margin-desktop"
    >
      <div className="projects-heading mx-auto mb-14 flex max-w-7xl items-end justify-between gap-8 md:mb-20">
        <div>
          <span className="mb-4 block font-label-technical text-[11px] uppercase tracking-[0.35em] text-primary">
            Projects Done
          </span>
          <h2 className="font-headline-md text-headline-md-mobile uppercase text-on-surface md:text-headline-md">
            Selected Work
          </h2>
        </div>

        <p className="hidden max-w-sm text-right font-body-md text-on-surface-variant md:block">
          Scroll through the archive. Each project rises from below and layers
          over the previous one.
        </p>
      </div>

      <div className="mx-auto max-w-7xl">
        {PROJECTS.map((project, index) => (
          <article
            key={project.id}
            className="project-stack-card sticky top-20 mb-[22vh] h-[68svh] min-h-[470px] md:top-28 md:h-[76svh] md:min-h-[620px]"
            style={{ zIndex: 20 + index }}
            data-cursor-interactive="true"
          >
            <div className="project-card-motion group relative h-full overflow-hidden border border-outline-variant/70 bg-white shadow-[0_26px_80px_rgba(51,65,85,0.18)]">
              <img
                src={project.image}
                alt={project.alt}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                className="portfolio-image h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
              />

              <div className="project-card-shade pointer-events-none absolute inset-0 z-[3] bg-azure/70 opacity-0" />
              <div className="absolute inset-0 z-[2] bg-gradient-to-t from-azure-deep/90 via-azure-deep/20 to-transparent" />
              <div className="absolute inset-0 z-[2] bg-[linear-gradient(110deg,rgba(51,65,85,0.20),transparent_62%)]" />

              <div className="absolute left-5 top-5 z-10 flex items-center gap-3 md:left-8 md:top-8">
                <span className="font-label-technical text-[10px] tracking-[0.28em] text-gold-light">
                  {project.id}
                </span>
                <span className="h-px w-10 bg-gold-light/70" />
                <span className="font-label-technical text-[10px] uppercase tracking-[0.22em] text-white/75">
                  {project.category}
                </span>
              </div>

              <div className="absolute inset-x-5 bottom-6 z-10 flex items-end justify-between gap-6 md:inset-x-10 md:bottom-10">
                <div className="max-w-3xl">
                  <h3 className="project-title-pulse font-headline-md text-3xl text-white sm:text-4xl md:text-6xl">
                    {project.title}
                  </h3>
                  <p className="mt-4 max-w-xl font-body-md text-sm text-white/70 sm:text-base md:text-body-md">
                    {project.description}
                  </p>
                </div>

                <span className="magnetic-target material-symbols-outlined shrink-0 text-3xl text-gold-light md:text-5xl">
                  {project.icon}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
