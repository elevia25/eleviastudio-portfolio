"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";
import SectionHeading from "./SectionHeading";

/* ==========================================================================
   DATA
   ========================================================================== */

const PACKAGING_ITEMS = [
  {
    number: "01",
    title: "Packaging Study",
    category: "Packaging / Identity",
    image: "/poster-01.png",
    description:
      "Identity translated from a visual system into a physical piece people can see, touch and hold.",
  },
  {
    number: "02",
    title: "Print Direction",
    category: "Print / Art Direction",
    image: "/poster-02.png",
    description:
      "A print-led composition built around typography, hierarchy and material presence.",
  },
  {
    number: "03",
    title: "Physical Identity",
    category: "Brand / Packaging",
    image: "/poster-02.png",
    description:
      "A physical expression of the brand designed to carry the identity beyond the screen.",
  },
  {
    number: "04",
    title: "Poster System",
    category: "Graphic / Print",
    image: "/poster-01.png",
    description:
      "A large-format visual system where typography, imagery and layout become one strong physical composition.",
  },
] as const;

/* ==========================================================================
   COMPONENT
   ========================================================================== */

export default function PackagingShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const stageRef = useRef<HTMLDivElement>(null);

  const posterRefs = useRef<Array<HTMLDivElement | null>>([]);

  const contentRefs = useRef<Array<HTMLDivElement | null>>([]);

  const giantWordRef = useRef<HTMLDivElement>(null);

  const progressRef = useRef<HTMLDivElement>(null);

  const sectionTitleRef = useRef<HTMLDivElement>(null);

  const outroRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    const stage = stageRef.current;

    const giantWord = giantWordRef.current;

    const progress = progressRef.current;

    const sectionTitle = sectionTitleRef.current;

    const outro = outroRef.current;

    const posters = posterRefs.current.filter(Boolean) as HTMLDivElement[];

    const contents = contentRefs.current.filter(Boolean) as HTMLDivElement[];

    if (
      !section ||
      !stage ||
      !giantWord ||
      !progress ||
      !sectionTitle ||
      !outro ||
      posters.length !== PACKAGING_ITEMS.length ||
      contents.length !== PACKAGING_ITEMS.length
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* ====================================================================
         DESKTOP
         ==================================================================== */

      mm.add("(min-width: 768px)", () => {
        /* --------------------------------------------------------------
             INITIAL STATE
             -------------------------------------------------------------- */

        posters.forEach((poster, index) => {
          gsap.set(poster, {
            autoAlpha: index === 0 ? 1 : 0,

            yPercent: index === 0 ? 34 : 55,

            scale: index === 0 ? 0.83 : 0.88,

            rotation: index === 0 ? -5 : 4,

            transformOrigin: "50% 70%",

            force3D: true,
          });
        });

        contents.forEach((content, index) => {
          gsap.set(content, {
            autoAlpha: index === 0 ? 1 : 0,

            y: index === 0 ? 30 : 45,
          });
        });

        gsap.set(giantWord, {
          autoAlpha: 0,
          scale: 0.94,
          yPercent: 8,
        });

        gsap.set(sectionTitle, {
          autoAlpha: 0,
          y: 15,
        });

        gsap.set(progress, {
          autoAlpha: 0,
        });

        gsap.set(outro, {
          autoAlpha: 0,
          y: 12,
        });

        /* --------------------------------------------------------------
             TIMELINE
             -------------------------------------------------------------- */

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,

            start: "top top",

            end: "bottom bottom",

            scrub: 1.05,

            invalidateOnRefresh: true,
          },
        });

        /* ==============================================================
             INTRO / POSTER 01
             ============================================================== */

        timeline.to(
          stage,
          {
            backgroundColor: "#160E18",

            duration: 0.2,
          },
          0,
        );

        timeline.to(
          giantWord,
          {
            autoAlpha: 1,
            scale: 1,
            yPercent: 0,

            duration: 0.8,

            ease: "power3.out",
          },
          0.05,
        );

        timeline.to(
          sectionTitle,
          {
            autoAlpha: 1,
            y: 0,

            duration: 0.45,
          },
          0.12,
        );

        timeline.to(
          progress,
          {
            autoAlpha: 1,

            duration: 0.35,
          },
          0.18,
        );

        timeline.to(
          posters[0],
          {
            yPercent: 0,

            scale: 1,

            rotation: 0,

            duration: 0.9,

            ease: "power3.out",
          },
          0.12,
        );

        timeline.to(
          contents[0],
          {
            y: 0,

            duration: 0.55,

            ease: "power3.out",
          },
          0.3,
        );

        timeline.addLabel("poster-01");

        timeline.to(
          {},
          {
            duration: 0.55,
          },
        );

        /* ==============================================================
             POSTERS 02 → 04
             ============================================================== */

        for (let index = 1; index < PACKAGING_ITEMS.length; index += 1) {
          const previous = posters[index - 1];

          const current = posters[index];

          const previousContent = contents[index - 1];

          const currentContent = contents[index];

          /* ----------------------------------------------------------
               Previous poster sinks back into the material
               ---------------------------------------------------------- */

          timeline.to(previousContent, {
            autoAlpha: 0,

            y: -28,

            duration: 0.32,

            ease: "power2.in",
          });

          timeline.to(
            previous,
            {
              yPercent: -12,

              scale: 0.76,

              rotation: index % 2 === 0 ? -3 : 3,

              autoAlpha: 0.16,

              duration: 0.55,

              ease: "power3.inOut",
            },
            "<",
          );

          /* ----------------------------------------------------------
               Current poster rises over it
               ---------------------------------------------------------- */

          timeline.to(
            current,
            {
              autoAlpha: 1,

              yPercent: 0,

              scale: 1,

              rotation: 0,

              duration: 0.72,

              ease: "power4.out",
            },
            "<0.18",
          );

          timeline.to(
            currentContent,
            {
              autoAlpha: 1,

              y: 0,

              duration: 0.5,

              ease: "power3.out",
            },
            "<0.18",
          );

          timeline.addLabel(`poster-0${index + 1}`);

          timeline.to(
            {},
            {
              duration: 0.62,
            },
          );
        }

        /* ==============================================================
             FINAL TRANSITION → SELECTED WORK
             ============================================================== */

        const lastPoster = posters[posters.length - 1];

        const lastContent = contents[contents.length - 1];

        timeline.to(lastContent, {
          autoAlpha: 0,
          y: -28,

          duration: 0.35,
        });

        timeline.to(
          [sectionTitle, progress],
          {
            autoAlpha: 0,

            duration: 0.3,
          },
          "<",
        );

        timeline.to(
          lastPoster,
          {
            scale: 0.68,

            yPercent: -8,

            rotation: 2,

            duration: 0.65,

            ease: "power3.inOut",
          },
          "<0.05",
        );

        timeline.to(
          giantWord,
          {
            autoAlpha: 0.1,

            scale: 1.06,

            duration: 0.6,
          },
          "<",
        );

        /*
         * Selected Work starts with Elevro #221129.
         */

        timeline.to(
          stage,
          {
            backgroundColor: "#221129",

            duration: 0.75,

            ease: "power2.inOut",
          },
          "<0.05",
        );

        timeline.to(
          outro,
          {
            autoAlpha: 1,
            y: 0,

            duration: 0.35,
          },
          "<0.3",
        );

        timeline.to(
          [lastPoster, giantWord, outro],
          {
            autoAlpha: 0,

            duration: 0.38,
          },
          "+=0.25",
        );
      });

      /* ====================================================================
         MOBILE
         ==================================================================== */

      mm.add("(max-width: 767px)", () => {
        posters.forEach((poster, index) => {
          gsap.set(poster, {
            autoAlpha: index === 0 ? 1 : 0,

            yPercent: index === 0 ? 30 : 45,

            scale: index === 0 ? 0.88 : 0.92,

            rotation: index === 0 ? -3 : 3,
          });
        });

        contents.forEach((content, index) => {
          gsap.set(content, {
            autoAlpha: index === 0 ? 1 : 0,

            y: index === 0 ? 20 : 28,
          });
        });

        gsap.set(giantWord, {
          autoAlpha: 0,
          scale: 0.94,
        });

        gsap.set(sectionTitle, {
          autoAlpha: 0,
        });

        gsap.set(progress, {
          autoAlpha: 0,
        });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,

            start: "top top",

            end: "bottom bottom",

            scrub: 0.9,

            invalidateOnRefresh: true,
          },
        });

        timeline.to(giantWord, {
          autoAlpha: 1,
          scale: 1,

          duration: 0.5,
        });

        timeline.to(
          [sectionTitle, progress],
          {
            autoAlpha: 1,

            duration: 0.35,
          },
          "<",
        );

        timeline.to(
          posters[0],
          {
            yPercent: 0,
            scale: 1,
            rotation: 0,

            duration: 0.75,

            ease: "power3.out",
          },
          "<0.05",
        );

        timeline.to(
          contents[0],
          {
            y: 0,

            duration: 0.45,
          },
          "<0.2",
        );

        timeline.to(
          {},
          {
            duration: 0.5,
          },
        );

        for (let index = 1; index < posters.length; index += 1) {
          timeline.to(contents[index - 1], {
            autoAlpha: 0,
            y: -18,

            duration: 0.25,
          });

          timeline.to(
            posters[index - 1],
            {
              scale: 0.76,

              yPercent: -8,

              autoAlpha: 0,

              duration: 0.4,
            },
            "<",
          );

          timeline.to(
            posters[index],
            {
              autoAlpha: 1,

              yPercent: 0,

              scale: 1,

              rotation: 0,

              duration: 0.55,

              ease: "power3.out",
            },
            "<0.1",
          );

          timeline.to(
            contents[index],
            {
              autoAlpha: 1,

              y: 0,

              duration: 0.4,
            },
            "<0.15",
          );

          timeline.to(
            {},
            {
              duration: 0.5,
            },
          );
        }

        timeline.to(contents[contents.length - 1], {
          autoAlpha: 0,

          duration: 0.3,
        });

        timeline.to(
          posters[posters.length - 1],
          {
            scale: 0.72,
            yPercent: -7,

            duration: 0.5,
          },
          "<",
        );

        timeline.to(
          stage,
          {
            backgroundColor: "#221129",

            duration: 0.6,
          },
          "<",
        );

        timeline.to(
          [posters[posters.length - 1], giantWord, sectionTitle, progress],
          {
            autoAlpha: 0,

            duration: 0.3,
          },
        );
      });

      return () => {
        mm.revert();
      };
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Packaging and print design"
      className="
        relative
        min-h-[480svh]
        w-full

        md:min-h-[520svh]
      "
    >
      {/* ==========================================================
          STICKY STAGE
          ========================================================== */}

      <div
        ref={stageRef}
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
            BACKGROUND SURFACE
            ======================================================== */}

        <div
          aria-hidden
          className="
            pointer-events-none
            absolute
            inset-0
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

        {/* material grain */}

        <div
          aria-hidden
          className="
            pointer-events-none
            absolute
            inset-0
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
            GIANT WORD
            ======================================================== */}

        <div
          ref={giantWordRef}
          aria-hidden
          className="
            pointer-events-none
            absolute

            left-1/2
            top-[44%]

            z-[1]

            -translate-x-1/2
            -translate-y-1/2

            whitespace-nowrap

            text-[clamp(7rem,19vw,21rem)]

            font-light
            leading-none
            tracking-[-0.09em]

            opacity-0
          "
          style={{
            color: "rgba(0,0,0,.24)",

            textShadow: `
              0 1px 0 rgba(255,255,255,.035),
              0 -1px 1px rgba(0,0,0,.5)
            `,
          }}
        >
          PACKAGING
        </div>

        <SectionHeading
          ref={sectionTitleRef}
          number="05"
          title="Packaging"
          subtitle="Making the first impression before the product speaks."
          className="
    absolute
    left-1/2
    top-5
    z-50

    w-[92vw]

    -translate-x-1/2

    opacity-0

    md:top-7
  "
        />

        {/* ========================================================
            COUNTER / PROGRESS
            ======================================================== */}

        <div
          ref={progressRef}
          className="
            absolute

            right-5
            top-5

            z-50

            text-[9px]
            uppercase
            tracking-[0.22em]

            opacity-0

            md:right-10
            md:top-8
          "
        >
          04 selected pieces
        </div>

        {/* ========================================================
            PROJECT CONTENT
            ======================================================== */}

        {PACKAGING_ITEMS.map((item, index) => (
          <div
            key={item.number}
            ref={(element) => {
              contentRefs.current[index] = element;
            }}
            className="
  pointer-events-none
  absolute

  left-5
  top-[15vh]

  z-30

  w-[88vw]

  opacity-0

  md:left-[5vw]
  md:top-0

  md:flex
  md:h-full
  md:w-[35vw]
  md:max-w-[520px]
  md:flex-col
  md:justify-center
"
          >
            {/* NUMBER */}

            <div
              className="
                  mb-2
                  flex
                  items-center
                  gap-3

                  text-[8px]
                  uppercase
                  tracking-[0.3em]

                  opacity-45

                  md:mb-6
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

                  text-[12px]
                  uppercase
                  tracking-[0.25em]

                  text-[#A879B5]

                  md:mb-5
                  md:text-[16px]
                "
            >
              {item.category}
            </p>

            {/* TITLE */}

            <h2
              className="
                  text-[clamp(2.8rem,6vw,7rem)]

                  font-light
                  leading-[0.82]
                  tracking-[-0.07em]
                "
            >
              {item.title}
            </h2>

            {/* DESCRIPTION */}

            <p
              className="
                  mt-2

                  max-w-[370px]

                  text-[12px]
                  font-light
                  leading-[1.55]

                  opacity-55

                  md:mt-8
                  md:text-[20px]
                "
            >
              {item.description}
            </p>

            {/* META */}

            <div
              className="
                  mt-1

                  flex
                  items-center
                  gap-3

                  text-[12px]
                  uppercase
                  tracking-[0.2em]

                  opacity-35

                  md:mt-9
                  md:text-[16px]
                "
            >
              <span>Print</span>

              <span>/</span>

              <span>Packaging</span>

              <span>/</span>

              <span>Identity</span>
            </div>
          </div>
        ))}

        {/* ========================================================
            POSTERS
            ======================================================== */}

        <div
          className="
            absolute

            bottom-[7vh]
            left-1/2

            z-20

            h-[55vh]
            w-[84vw]

            max-w-[520px]

            -translate-x-1/2

            md:bottom-auto
            md:left-auto
            md:right-[4vw]
            md:top-1/2

            md:h-[78vh]
            md:w-[48vw]
            md:max-w-[760px]

            md:translate-x-0
            md:-translate-y-1/2
          "
        >
          {PACKAGING_ITEMS.map((item, index) => (
            <div
              key={item.image}
              ref={(element) => {
                posterRefs.current[index] = element;
              }}
              className="
                  absolute
                  inset-0

                  opacity-0

                  will-change-transform
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

              {/* SECOND EDGE */}

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

              {/* ARTWORK */}

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
                  alt={`${item.title} packaging artwork`}
                  fill
                  sizes="
                      (max-width: 767px) 84vw,
                      48vw
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

                    -bottom-7
                    left-0

                    flex
                    items-center
                    gap-2

                    text-[7px]
                    uppercase
                    tracking-[0.22em]

                    opacity-35

                    md:-bottom-8
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
            BOTTOM LABEL
            ======================================================== */}

        <div
          className="
            absolute

            bottom-5
            left-5

            z-50

            hidden

            text-[8px]
            uppercase
            tracking-[0.25em]

            opacity-30

            md:bottom-8
            md:left-10
            md:block
          "
        >
          Physical design / visual identity
        </div>

        {/* ========================================================
            OUTRO
            ======================================================== */}

        <div
          ref={outroRef}
          className="
            pointer-events-none

            absolute

            bottom-8
            left-1/2

            z-[70]

            -translate-x-1/2

            whitespace-nowrap

            text-[8px]
            uppercase
            tracking-[0.32em]

            opacity-0
          "
        >
          Selected work follows
        </div>
      </div>
    </section>
  );
}
