"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

import SectionHeading from "./SectionHeading";
import { EASE, PINNED_SCRUB, prefersReducedMotion } from "@/lib/motion";

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
   COMPONENT
   ========================================================================== */

export default function BrandingShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const posterRefs = useRef<Array<HTMLDivElement | null>>([]);

  const contentRefs = useRef<Array<HTMLDivElement | null>>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const posters = posterRefs.current.filter(
      (element): element is HTMLDivElement => Boolean(element),
    );

    const contents = contentRefs.current.filter(
      (element): element is HTMLDivElement => Boolean(element),
    );

    if (
      posters.length !== BRANDING_ITEMS.length ||
      contents.length !== BRANDING_ITEMS.length
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const reducedMotion = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        posters.forEach((poster, index) => {
          gsap.set(poster, {
            autoAlpha: index === 0 ? 1 : 0,
            yPercent: 0,
            scale: 1,
            rotation: 0,
          });
        });

        contents.forEach((content, index) => {
          gsap.set(content, { autoAlpha: index === 0 ? 1 : 0, y: 0 });
        });

        return;
      }

      const media = gsap.matchMedia();

      /* ==================================================================
         DESKTOP
         ================================================================== */

      media.add("(min-width: 768px)", () => {
        /* --------------------------------------------------------------
           INITIAL STATE

           First project is already visible when Branding enters.
           -------------------------------------------------------------- */

        posters.forEach((poster, index) => {
          gsap.set(poster, {
            autoAlpha: index === 0 ? 1 : 0,

            yPercent: index === 0 ? 4 : 42,

            scale: index === 0 ? 0.98 : 0.9,

            rotation: index === 0 ? -0.8 : 3,

            transformOrigin: "50% 70%",

            force3D: true,
          });
        });

        contents.forEach((content, index) => {
          gsap.set(content, {
            autoAlpha: index === 0 ? 1 : 0,

            y: index === 0 ? 0 : 32,

            force3D: true,
          });
        });

        /* --------------------------------------------------------------
           MAIN SCROLL TIMELINE
           -------------------------------------------------------------- */

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,

            start: "top top",

            end: "bottom bottom",

            scrub: PINNED_SCRUB.desktop,

            invalidateOnRefresh: true,
          },
        });

        /* --------------------------------------------------------------
           FIRST POSTER SETTLES QUICKLY
           -------------------------------------------------------------- */

        timeline.to(
          posters[0],
          {
            yPercent: 0,

            scale: 1,

            rotation: 0,

            duration: 0.26,

            ease: EASE.entrance,
          },
          0,
        );

        timeline.addLabel("branding-01");

        /*
         * Small hold only.
         *
         * Do not waste a large portion of the
         * section before the next project starts.
         */

        timeline.to(
          {},
          {
            duration: 0.18,
          },
        );

        /* --------------------------------------------------------------
           PROJECT 02 → 04
           -------------------------------------------------------------- */

        for (let index = 1; index < BRANDING_ITEMS.length; index += 1) {
          const previousPoster = posters[index - 1];

          const currentPoster = posters[index];

          const previousContent = contents[index - 1];

          const currentContent = contents[index];

          /* previous text leaves */

          timeline.to(previousContent, {
            autoAlpha: 0,

            y: -24,

            duration: 0.26,

            ease: EASE.exit,
          });

          /* previous artwork sinks */

          timeline.to(
            previousPoster,
            {
              autoAlpha: 0.12,

              yPercent: -9,

              scale: 0.8,

              rotation: index % 2 === 0 ? -2 : 2,

              duration: 0.42,

              ease: EASE.timeline,
            },
            "<",
          );

          /* new artwork rises */

          timeline.to(
            currentPoster,
            {
              autoAlpha: 1,

              yPercent: 0,

              scale: 1,

              rotation: 0,

              duration: 0.58,

              ease: EASE.entranceStrong,
            },
            "<0.12",
          );

          /* new text arrives */

          timeline.to(
            currentContent,
            {
              autoAlpha: 1,

              y: 0,

              duration: 0.38,

              ease: EASE.entrance,
            },
            "<0.14",
          );

          timeline.addLabel(`branding-0${index + 1}`);

          /*
           * Short readable pause.
           */

          timeline.to(
            {},
            {
              duration: 0.26,
            },
          );
        }

        /*
         * IMPORTANT:
         *
         * Do not fade the final state.
         * Do not change the Branding background.
         * Do not add another artificial outro.
         *
         * Sticky simply releases and the next
         * section naturally enters.
         */
      });

      /* ==================================================================
         MOBILE
         ================================================================== */

      media.add("(max-width: 767px)", () => {
        posters.forEach((poster, index) => {
          gsap.set(poster, {
            autoAlpha: index === 0 ? 1 : 0,

            yPercent: index === 0 ? 3 : 34,

            scale: index === 0 ? 0.98 : 0.92,

            rotation: index === 0 ? -0.5 : 2,

            force3D: true,
          });
        });

        contents.forEach((content, index) => {
          gsap.set(content, {
            autoAlpha: index === 0 ? 1 : 0,

            y: index === 0 ? 0 : 22,

            force3D: true,
          });
        });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,

            start: "top top",

            end: "bottom bottom",

            scrub: PINNED_SCRUB.mobile,

            invalidateOnRefresh: true,
          },
        });

        /* first state */

        timeline.to(
          posters[0],
          {
            yPercent: 0,

            scale: 1,

            rotation: 0,

            duration: 0.24,

            ease: EASE.entrance,
          },
          0,
        );

        timeline.addLabel("branding-mobile-01");

        timeline.to(
          {},
          {
            duration: 0.15,
          },
        );

        /* remaining states */

        for (let index = 1; index < BRANDING_ITEMS.length; index += 1) {
          const previousPoster = posters[index - 1];

          const currentPoster = posters[index];

          const previousContent = contents[index - 1];

          const currentContent = contents[index];

          timeline.to(previousContent, {
            autoAlpha: 0,

            y: -16,

            duration: 0.22,

            ease: EASE.exit,
          });

          timeline.to(
            previousPoster,
            {
              autoAlpha: 0,

              yPercent: -6,

              scale: 0.82,

              duration: 0.34,

              ease: EASE.timeline,
            },
            "<",
          );

          timeline.to(
            currentPoster,
            {
              autoAlpha: 1,

              yPercent: 0,

              scale: 1,

              rotation: 0,

              duration: 0.48,

              ease: EASE.entrance,
            },
            "<0.08",
          );

          timeline.to(
            currentContent,
            {
              autoAlpha: 1,

              y: 0,

              duration: 0.32,

              ease: EASE.entrance,
            },
            "<0.12",
          );

          timeline.addLabel(`branding-mobile-0${index + 1}`);

          timeline.to(
            {},
            {
              duration: 0.22,
            },
          );
        }
      });

      return () => {
        media.revert();
      };
    }, section);

    /*
     * One refresh after layout/assets have mounted.
     */

    const refreshFrame = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(refreshFrame);

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

        min-h-[340svh]
        w-full

        bg-[#160E18]

        md:min-h-[360svh]
      "
    >
      {/* ==========================================================
          STICKY VIEWPORT

          IMPORTANT:
          Do NOT put overflow-hidden on the outer section.
          ========================================================== */}

      <div
        className="
          sticky
          top-0

          h-svh
          w-full

          overflow-hidden

          bg-[#160E18]
          text-[#F1E9F2]
        "
      >
        {/* ========================================================
            BACKGROUND DEPTH
            ======================================================== */}

        <div
          aria-hidden
          className="
            pointer-events-none
            absolute
            inset-0
            z-0
          "
          style={{
            background: `
              radial-gradient(
                circle at 72% 40%,
                rgba(168,121,181,.08),
                transparent 34%
              ),

              radial-gradient(
                circle at 14% 86%,
                rgba(255,255,255,.025),
                transparent 28%
              ),

              linear-gradient(
                135deg,
                rgba(255,255,255,.012),
                transparent 38%,
                rgba(0,0,0,.15)
              )
            `,
          }}
        />

        {/* ========================================================
            MATERIAL GRAIN
            ======================================================== */}

        <div
          aria-hidden
          className="
            pointer-events-none
            absolute
            inset-0

            z-0

            opacity-30
          "
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                8deg,
                transparent 0,
                transparent 48px,
                rgba(255,255,255,.012) 49px,
                transparent 50px
              )
            `,
          }}
        />

        {/* ========================================================
            GIANT BACKGROUND WORD
            ======================================================== */}

        <div
          aria-hidden
          className="
            pointer-events-none

            absolute
            left-1/2
            top-[48%]

            z-[1]

            -translate-x-1/2
            -translate-y-1/2

            whitespace-nowrap

            text-[clamp(7rem,19vw,21rem)]

            font-light
            leading-none

            tracking-[-0.09em]
          "
          style={{
            color: "rgba(0,0,0,.24)",

            textShadow: `
              0 1px 0 rgba(255,255,255,.035),
              0 -1px 1px rgba(0,0,0,.5)
            `,
          }}
        >
          BRANDING
        </div>

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
            PROJECT COUNT

            Desktop only so it does not fight the mobile heading.
            ======================================================== */}

        <div
          className="
            pointer-events-none

            absolute

            right-8
            top-8

            z-[60]

            hidden

            text-[8px]
            uppercase

            tracking-[0.22em]

            text-current/45

            lg:block
          "
        >
          04 selected pieces
        </div>

        {/* ========================================================
            PROJECT CONTENT
            ======================================================== */}

        {BRANDING_ITEMS.map((item, index) => (
          <div
            key={item.number}
            ref={(element) => {
              contentRefs.current[index] = element;
            }}
            className="
              pointer-events-none

              absolute

              left-5
              top-[9.75rem]

              z-30

              w-[88vw]

              opacity-0

              sm:left-7

              md:left-[5vw]
              md:top-[56%]

              md:w-[34vw]
              md:max-w-[500px]

              md:-translate-y-1/2
            "
          >
            {/* NUMBER */}

            <div
              className="
                mb-2

                flex
                items-center
                gap-3

                text-[13px]
                uppercase
                tracking-[0.3em]

                opacity-45

                md:mb-5
                md:text-[14px]
              "
            >
              <span>{item.number}</span>

              <span>/</span>

              <span>04</span>
            </div>

            {/* CATEGORY */}

            <p
              className="
                mb-2

                text-[13px]
                uppercase
                tracking-[0.24em]

                text-[#A879B5]

                md:mb-4
                md:text-[15px]
              "
            >
              {item.category}
            </p>

            {/* TITLE */}

            <h2
              className="
                max-w-[560px]

                text-[clamp(2.35rem,5.2vw,6rem)]

                font-light
                leading-[0.84]

                tracking-[-0.065em]
              "
            >
              {item.title}
            </h2>

            {/* DESCRIPTION */}

            <p
              className="
                mt-3

                max-w-[390px]

                text-[15px]
                font-light
                leading-[1.5]

                opacity-55

                md:mt-6
                md:text-sm

                lg:text-base
              "
            >
              {item.description}
            </p>

            {/* META */}

            <div
              className="
                mt-3

                flex
                flex-wrap
                items-center

                gap-x-3
                gap-y-1

                text-[7px]
                uppercase
                tracking-[0.18em]

                opacity-35

                md:mt-7
                md:text-[8px]
              "
            >
              <span>Branding</span>

              <span>/</span>

              <span>Identity</span>

              <span>/</span>

              <span>Print</span>
            </div>
          </div>
        ))}

        {/* ========================================================
            ARTWORK AREA

            Mobile:
            intentionally below heading + project copy.

            Desktop:
            sits on right and slightly below the common heading.
            ======================================================== */}

        <div
          className="
            absolute

            left-1/2
            top-[58%]

            z-20

            h-[39vh]
            w-[72vw]

            max-w-[380px]

            -translate-x-1/2

            sm:h-[41vh]
            sm:w-[68vw]
            sm:max-w-[420px]

            md:left-auto
            md:right-[5vw]
            md:top-[60%]

            md:h-[62vh]
            md:w-[41vw]

            md:max-w-[640px]

            md:translate-x-0
            md:-translate-y-1/2

            lg:right-[6vw]

            lg:h-[64vh]
            lg:w-[40vw]

            lg:max-w-[670px]

            xl:right-[7vw]

            xl:h-[65vh]
            xl:w-[39vw]

            xl:max-w-[700px]
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

                will-change-[transform,opacity]
              "
            >
              {/* CONTACT SHADOW */}

              <div
                aria-hidden
                className="
                  absolute

                  bottom-[-3%]
                  left-[7%]

                  h-[13%]
                  w-[86%]

                  rounded-[50%]

                  bg-black/35

                  blur-2xl
                "
              />

              {/* PAPER BACK EDGE */}

              <div
                aria-hidden
                className="
                  absolute
                  inset-0

                  translate-x-[5px]
                  translate-y-[6px]

                  bg-[#9B8F98]

                  md:translate-x-[8px]
                  md:translate-y-[9px]
                "
              />

              {/* SECOND PAPER EDGE */}

              <div
                aria-hidden
                className="
                  absolute
                  inset-0

                  translate-x-[2px]
                  translate-y-[3px]

                  bg-[#CFC5CC]
                "
              />

              {/* ====================================================
                  ARTWORK
                  ==================================================== */}

              <div
                className="
                  relative

                  h-full
                  w-full

                  overflow-hidden

                  bg-[#EEE8EC]

                  shadow-[0_35px_90px_rgba(0,0,0,0.34)]
                "
              >
                <Image
                  src={item.image}
                  alt={`${item.title} branding artwork`}
                  fill
                  sizes="
                    (max-width: 767px) 72vw,
                    (max-width: 1279px) 41vw,
                    39vw
                  "
                  className="
                    object-contain
                    object-center
                  "
                  onLoad={() => {
                    ScrollTrigger.refresh();
                  }}
                />

                {/* PAPER LIGHT */}

                <div
                  aria-hidden
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                  "
                  style={{
                    background: `
                      linear-gradient(
                        120deg,
                        rgba(255,255,255,.07),
                        transparent 27%,
                        transparent 73%,
                        rgba(0,0,0,.04)
                      )
                    `,
                  }}
                />
              </div>

              {/* PIECE LABEL */}

              <div
                className="
                  absolute

                  -bottom-6
                  left-0

                  flex
                  items-center
                  gap-2

                  text-[7px]
                  uppercase
                  tracking-[0.2em]

                  opacity-35

                  md:-bottom-7
                  md:text-[8px]
                "
              >
                <span>Selected piece</span>

                <span>/</span>

                <span>{item.number}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ========================================================
            BOTTOM DESCRIPTOR
            ======================================================== */}

        <div
          className="
            pointer-events-none

            absolute

            bottom-7
            left-8

            z-50

            hidden

            text-[8px]
            uppercase

            tracking-[0.24em]

            opacity-30

            md:block
          "
        >
          Brand systems / visual identity
        </div>
      </div>
    </section>
  );
}