"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

import SectionHeading from "./SectionHeading";
import { EASE, prefersReducedMotion } from "@/lib/motion";

/* ==========================================================================
   DATA
   ========================================================================== */

const BRANDING_ITEMS = [
  {
    number: "01",
    title: "Brand Identity",
    category: "Branding / Identity",
    image: "/poster-01.jpeg",
    description:
      "A visual identity translated into a system that works across print, packaging and physical touchpoints.",
  },
  {
    number: "02",
    title: "Print Direction",
    category: "Branding / Print",
    image: "/poster-02.jpeg",
    description:
      "Typography, composition and visual language shaped into a recognisable physical brand presence.",
  },
  {
    number: "03",
    title: "Physical Identity",
    category: "Brand / Experience",
    image: "/poster-03.jpeg",
    description:
      "Taking the identity beyond the screen through materials, applications and real-world brand moments.",
  },
] as const;

/* ==========================================================================
   CARD-STACK GEOMETRY

   depth 0 is the front image (fully visible, caption showing).
   Every depth after that sits further back - offset to alternating
   sides, rotated, scaled down and dimmed - so it reads as a
   scattered stack of photos with only the top one fully in view.
   ========================================================================== */

const TOTAL_CARDS = BRANDING_ITEMS.length;

type StackStyle = {
  xPercent: number;
  yPercent: number;
  rotation: number;
  scale: number;
  autoAlpha: number;
  zIndex: number;
};

const getStackStyle = (depth: number, side: number): StackStyle => {
  if (depth === 0) {
    return {
      xPercent: 0,
      yPercent: 0,
      rotation: 0,
      scale: 1,
      autoAlpha: 1,
      zIndex: TOTAL_CARDS + 1,
    };
  }

  return {
    xPercent: side * (38 + (depth - 1) * 22),
    yPercent: 0,
    rotation: 0,
    scale: 1 - depth * 0.045,
    autoAlpha: Math.max(1 - depth * 0.18, 0.55),
    zIndex: TOTAL_CARDS - depth,
  };
};

/*
 * With an odd stack, the item right after the active one and the
 * item right before it should look identical (same depth, mirrored
 * side) so the front card reads as truly centered instead of one
 * neighbour appearing closer/brighter than the other.
 */

const getRelativeSlot = (i: number, activeIndex: number) => {
  const relative = (i - activeIndex + TOTAL_CARDS) % TOTAL_CARDS;

  if (relative === 0) {
    return { depth: 0, side: 0 };
  }

  const mirrored = TOTAL_CARDS - relative;

  const depth = Math.min(relative, mirrored);

  const side = relative <= mirrored ? 1 : -1;

  return { depth, side };
};

/* ==========================================================================
   COMPONENT
   ========================================================================== */

export default function BrandingShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const stageRef = useRef<HTMLDivElement>(null);

  const posterRefs = useRef<Array<HTMLDivElement | null>>([]);

  const overlayRefs = useRef<Array<HTMLDivElement | null>>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    const stage = stageRef.current;

    if (!section || !stage) {
      return;
    }

    const posters = posterRefs.current.filter(
      (element): element is HTMLDivElement => Boolean(element),
    );

    const overlays = overlayRefs.current.filter(
      (element): element is HTMLDivElement => Boolean(element),
    );

    if (
      posters.length !== BRANDING_ITEMS.length ||
      overlays.length !== BRANDING_ITEMS.length
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const reducedMotion = prefersReducedMotion();

    let activeIndex = 0;

    let autoCycleTimeline: gsap.core.Timeline | null = null;

    /*
     * Move every image to the slot that matches its distance behind
     * whichever one is currently "front". `animate: false` snaps
     * instantly (initial paint); `animate: true` tweens into place
     * for the auto-shuffle. The caption only shows on the front
     * image.
     */

    const applyStack = (index: number, animate: boolean) => {
      posters.forEach((poster, i) => {
        const { depth, side } = getRelativeSlot(i, index);

        const style = getStackStyle(depth, side);

        gsap.set(poster, { zIndex: style.zIndex });

        if (animate) {
          gsap.to(poster, {
            xPercent: style.xPercent,
            yPercent: style.yPercent,
            rotation: style.rotation,
            scale: style.scale,
            autoAlpha: style.autoAlpha,
            duration: 0.9,
            ease: EASE.entranceStrong,
          });
        } else {
          gsap.set(poster, {
            xPercent: style.xPercent,
            yPercent: style.yPercent,
            rotation: style.rotation,
            scale: style.scale,
            autoAlpha: style.autoAlpha,
            transformOrigin: "50% 65%",
            force3D: true,
          });
        }
      });

      overlays.forEach((overlay, i) => {
        const isActive = i === index;

        if (animate) {
          gsap.to(overlay, {
            autoAlpha: isActive ? 1 : 0,
            y: isActive ? 0 : 14,
            duration: 0.5,
            ease: isActive ? EASE.entrance : EASE.exit,
          });
        } else {
          gsap.set(overlay, {
            autoAlpha: isActive ? 1 : 0,
            y: 0,
            force3D: true,
          });
        }
      });
    };

    const ctx = gsap.context(() => {
      applyStack(0, false);

      if (reducedMotion) {
        gsap.set(stage, { autoAlpha: 1, y: 0 });

        return;
      }

      gsap.set(stage, { autoAlpha: 0, y: 40 });

      /*
       * Auto-shuffle: once the stack has entered, it keeps cycling
       * through every image forever - each becomes the fully
       * visible front card in turn, no scrolling required.
       */

      const startAutoCycle = () => {
        autoCycleTimeline = gsap.timeline({ repeat: -1 });

        for (let step = 0; step < TOTAL_CARDS; step += 1) {
          autoCycleTimeline
            .call(() => {
              activeIndex = (activeIndex + 1) % TOTAL_CARDS;

              applyStack(activeIndex, true);
            })
            .to({}, { duration: 3.2 });
        }
      };

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none none",
            once: true,
          },

          onComplete: startAutoCycle,
        })
        .to(stage, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: EASE.entrance,
        });
    }, section);

    const refreshFrame = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(refreshFrame);

      autoCycleTimeline?.kill();

      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Branding and identity showcase"
      className="
        relative
        isolate

        h-svh
        w-full

        overflow-hidden

        bg-[#160E18]
        text-[#F1E9F2]
      "
    >
      {/* ========================================================
          COMMON SECTION HEADING

          Static and immediately visible.
          ======================================================== */}

      <SectionHeading
        number="05"
        title="Branding"
        subtitle="Making the first impression before the product speaks."
      />

      {/* ========================================================
          STAGE

          Scattered photo stack, centered on screen. Only the
          front image is fully visible; the rest peek out from
          behind it. Fades/rises in once, then the auto-shuffle
          takes over.
          ======================================================== */}

      <div
        ref={stageRef}
        className="
          absolute

          left-1/2
          top-[190px]

          z-10

          h-[50vh]
          w-[70vw]

          max-w-[380px]

          -translate-x-1/2

          sm:top-[200px]
          sm:h-[54vh]
          sm:w-[58vw]
          sm:max-w-[440px]

          md:top-[220px]
          md:h-[56vh]
          md:w-[34vw]
          md:max-w-[520px]

          lg:top-[240px]
          lg:h-[58vh]
          lg:w-[30vw]
          lg:max-w-[560px]
        "
      >
        {BRANDING_ITEMS.map((item, index) => (
          <div
            key={`${item.number}-${item.image}`}
            ref={(element) => {
              posterRefs.current[index] = element;
            }}
            className="
              absolute
              inset-0

              opacity-0

              overflow-hidden
              rounded-[1.25rem]

              shadow-[0_35px_90px_rgba(0,0,0,0.45)]

              will-change-[transform,opacity]
            "
          >
            {/* IMAGE - no mount, no card, just the photo */}

            <Image
              src={item.image}
              alt={`${item.title} branding artwork`}
              fill
              sizes="
                (max-width: 639px) 74vw,
                (max-width: 1023px) 40vw,
                32vw
              "
              className="
                object-contain
                object-center
              "
              onLoad={() => {
                ScrollTrigger.refresh();
              }}
            />

            {/* BOTTOM CAPTION OVERLAY */}

            <div
              aria-hidden
              className="
                pointer-events-none
                absolute
                inset-x-0
                bottom-0

                h-2/3

                bg-gradient-to-t
                from-black/85
                via-black/35
                to-transparent
              "
            />

            <div
              ref={(element) => {
                overlayRefs.current[index] = element;
              }}
              className="
                absolute
                inset-x-0
                bottom-0

                p-5

                opacity-0

                sm:p-7

                md:p-8
              "
            >
              <p
                className="
                  mb-1.5

                  text-[11px]
                  uppercase
                  tracking-[0.24em]

                  text-[#A879B5]

                  md:mb-2
                  md:text-[12px]
                "
              >
                {item.category}
              </p>

              <h2
                className="
                  text-[clamp(1.5rem,3.6vw,2.6rem)]

                  font-light
                  leading-[0.95]

                  tracking-[-0.03em]

                  text-[#F1E9F2]
                "
              >
                {item.title}
              </h2>

              <p
                className="
                  mt-2

                  max-w-[38ch]

                  text-[13px]
                  font-light
                  leading-[1.45]

                  text-[#F1E9F2]/70

                  md:mt-3
                  md:text-sm
                "
              >
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
