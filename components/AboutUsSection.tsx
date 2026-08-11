"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import SectionHeading from "./SectionHeading";

/* ==========================================================================
   FOUNDERS
   ========================================================================== */

const FOUNDERS = [
  {
    number: "01",

    name: "RAVI PRAJAPATI",

    label: "THE BUILDER",

    intro: "From engineering logic to creative thinking.",

    statement: (
      <>
        I used to build systems.
        <br />
        Now, I build brands.
      </>
    ),

    journey: [
      "ENGINEER",
      "PROBLEM SOLVER",
      "BUILDER",
      "ELEVIA",
    ],

    image: "/about/Ravi.jpeg",

    imagePosition: "center center",
  },

  {
    number: "02",

    name: "KHUSHI PRAJAPATI",

    label: "THE CREATIVE MIND",

    intro: "Ideas before execution.",

    statement: (
      <>
        From marketing to making —
        <br />
        I build brands through ideas, content
        <br className="hidden md:block" />
        {" "}and creative direction.
      </>
    ),

    journey: [
      "IDEAS",
      "WORDS",
      "VISUALS",
      "BRANDS",
    ],

    image: "/about/founder-2.jpg",

    imagePosition: "center center",
  },
] as const;

/* ==========================================================================
   MAIN
   ========================================================================== */

export default function AboutUsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const headingRef =
    useRef<HTMLDivElement>(null);

  const rowRefs =
    useRef<Array<HTMLDivElement | null>>([]);

  const imageRefs =
    useRef<Array<HTMLDivElement | null>>([]);

  const contentRefs =
    useRef<Array<HTMLDivElement | null>>([]);

  const lineRefs =
    useRef<Array<HTMLDivElement | null>>([]);

  const journeyRefs =
    useRef<Array<HTMLDivElement | null>>([]);

  useLayoutEffect(() => {
    const section =
      sectionRef.current;

    const heading =
      headingRef.current;

    if (!section || !heading) {
      return;
    }

    gsap.registerPlugin(
      ScrollTrigger,
    );

    const ctx = gsap.context(() => {
      /* ================================================================
         SECTION HEADING
         ================================================================ */

      gsap.fromTo(
        heading,
        {
          autoAlpha: 0,
          y: 25,
        },
        {
          autoAlpha: 1,
          y: 0,

          duration: 0.8,

          ease: "power3.out",

          scrollTrigger: {
            trigger: section,

            start: "top 82%",

            once: true,
          },
        },
      );

      /* ================================================================
         FOUNDER ROWS
         ================================================================ */

      rowRefs.current.forEach(
        (row, index) => {
          const image =
            imageRefs.current[index];

          const content =
            contentRefs.current[index];

          const line =
            lineRefs.current[index];

          const journey =
            journeyRefs.current[index];

          if (
            !row ||
            !image ||
            !content ||
            !line ||
            !journey
          ) {
            return;
          }

          const isReverse =
            index === 1;

          /* ------------------------------------------------------------
             Initial image
             ------------------------------------------------------------ */

          gsap.set(image, {
            autoAlpha: 0,

            y: 70,

            x: isReverse
              ? 35
              : -35,

            scale: 0.94,

            rotation:
              isReverse
                ? 1.5
                : -1.5,

            force3D: true,
          });

          /* ------------------------------------------------------------
             Initial text
             ------------------------------------------------------------ */

          gsap.set(content, {
            autoAlpha: 0,

            y: 55,

            x: isReverse
              ? -25
              : 25,

            filter:
              "blur(10px)",

            force3D: true,
          });

          gsap.set(line, {
            scaleX: 0,

            transformOrigin:
              isReverse
                ? "right center"
                : "left center",
          });

          gsap.set(journey.children, {
            autoAlpha: 0,

            y: 12,
          });

          /* ------------------------------------------------------------
             Timeline
             ------------------------------------------------------------ */

          const timeline =
            gsap.timeline({
              scrollTrigger: {
                trigger: row,

                start:
                  "top 76%",

                end:
                  "center 46%",

                scrub: 0.85,

                invalidateOnRefresh:
                  true,
              },
            });

          timeline.to(
            image,
            {
              autoAlpha: 1,

              y: 0,
              x: 0,

              scale: 1,

              rotation: 0,

              duration: 0.9,

              ease:
                "power4.out",
            },
            0,
          );

          timeline.to(
            content,
            {
              autoAlpha: 1,

              y: 0,
              x: 0,

              filter:
                "blur(0px)",

              duration: 0.82,

              ease:
                "power3.out",
            },
            0.1,
          );

          timeline.to(
            line,
            {
              scaleX: 1,

              duration: 0.55,

              ease:
                "power3.out",
            },
            0.48,
          );

          timeline.to(
            journey.children,
            {
              autoAlpha: 1,

              y: 0,

              duration: 0.35,

              stagger: 0.065,

              ease:
                "power2.out",
            },
            0.55,
          );

          /* ------------------------------------------------------------
             Tiny parallax at end
             ------------------------------------------------------------ */

          timeline.to(
            image,
            {
              y: -18,

              duration: 0.45,

              ease:
                "none",
            },
            0.78,
          );
        },
      );
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="About Elevia Studio"
      className="
        relative
        w-full
        overflow-hidden

        bg-[#E9E4DA]
        text-[#213943]
      "
    >
      {/* ==========================================================
          BACKGROUND
          ========================================================== */}

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
              circle at 10% 16%,
              rgba(245,74,0,.045),
              transparent 26%
            ),

            radial-gradient(
              circle at 90% 72%,
              rgba(33,57,67,.055),
              transparent 31%
            )
          `,
        }}
      />

      {/* vertical guide */}

      <div
        aria-hidden
        className="
          pointer-events-none
          absolute
          bottom-0
          left-1/2
          top-0

          hidden
          w-px

          bg-[#213943]/[0.055]

          md:block
        "
      />

      {/* ==========================================================
          SECTION HEADER
          ========================================================== */}

      <SectionHeading
        ref={headingRef}
        number="08"
        title="About Us"
        subtitle="Two people. Different strengths. One studio."
        className="
    relative
    z-20

    mx-auto
    w-[92vw]

    max-w-[1500px]

    opacity-0
  "
      />

      {/* ==========================================================
          FOUNDER 01 — IMAGE / CONTENT
          ========================================================== */}

      <FounderRow
        founder={FOUNDERS[0]}
        index={0}
        reverse={false}
        rowRef={(element) => {
          rowRefs.current[0] = element;
        }}
        imageRef={(element) => {
          imageRefs.current[0] = element;
        }}
        contentRef={(element) => {
          contentRefs.current[0] = element;
        }}
        lineRef={(element) => {
          lineRefs.current[0] = element;
        }}
        journeyRef={(element) => {
          journeyRefs.current[0] = element;
        }}
      />

      {/* ==========================================================
          DIVIDER
          ========================================================== */}

      <div
        className="
          mx-auto
          h-px
          w-[calc(100%-40px)]
          max-w-[1500px]

          bg-[#213943]/10

          md:w-[calc(100%-80px)]
        "
      />

      {/* ==========================================================
          FOUNDER 02 — CONTENT / IMAGE
          ========================================================== */}

      <FounderRow
        founder={FOUNDERS[1]}
        index={1}
        reverse
        rowRef={(element) => {
          rowRefs.current[1] = element;
        }}
        imageRef={(element) => {
          imageRefs.current[1] = element;
        }}
        contentRef={(element) => {
          contentRefs.current[1] = element;
        }}
        lineRef={(element) => {
          lineRefs.current[1] = element;
        }}
        journeyRef={(element) => {
          journeyRefs.current[1] = element;
        }}
      />

      {/* ==========================================================
          END MARK
          ========================================================== */}

      <div
        className="
          relative
          z-10

          mx-auto

          flex
          max-w-[1500px]

          items-center
          justify-between

          border-t
          border-[#213943]/10

          px-5
          py-8

          text-[8px]
          uppercase
          tracking-[0.24em]

          text-[#213943]/35

          md:px-10
          md:py-10
          md:text-[9px]
        "
      >
        <span>Elevia Studio</span>

        <span>Built together</span>
      </div>
    </section>
  );
}

/* ==========================================================================
   FOUNDER ROW
   ========================================================================== */

function FounderRow({
  founder,
  index,
  reverse,

  rowRef,
  imageRef,
  contentRef,
  lineRef,
  journeyRef,
}: {
  founder:
    (typeof FOUNDERS)[number];

  index: number;

  reverse: boolean;

  rowRef: (
    element:
      | HTMLDivElement
      | null,
  ) => void;

  imageRef: (
    element:
      | HTMLDivElement
      | null,
  ) => void;

  contentRef: (
    element:
      | HTMLDivElement
      | null,
  ) => void;

  lineRef: (
    element:
      | HTMLDivElement
      | null,
  ) => void;

  journeyRef: (
    element:
      | HTMLDivElement
      | null,
  ) => void;
}) {
  return (
    <div
      ref={rowRef}
      className="
        relative
        z-10

        mx-auto

        grid
        min-h-[88svh]
        w-full
        max-w-[1600px]

        grid-cols-1

        items-center

        gap-10

        px-5
        py-20

        md:min-h-[90svh]
        md:grid-cols-2
        md:gap-[4vw]
        md:px-10
        md:py-[10vh]
      "
    >
      {/* ========================================================
          IMAGE
          ======================================================== */}

      <div
        ref={imageRef}
        className={`
          relative

          ${
            reverse
              ? "order-2 md:order-2"
              : "order-1 md:order-1"
          }

          will-change-transform
        `}
      >
        <FounderImage
          founder={founder}
          index={index}
        />
      </div>

      {/* ========================================================
          TEXT
          ======================================================== */}

      <div
        ref={contentRef}
        className={`
          ${
            reverse
              ? "order-1 md:order-1"
              : "order-2 md:order-2"
          }

          relative

          will-change-[transform,opacity,filter]
        `}
      >
        {/* Number */}

        <div
          className="
            mb-7

            flex
            items-center
            gap-4

            text-[9px]
            uppercase
            tracking-[0.28em]

            text-[#213943]/35
          "
        >
          <span>
            {founder.number}
          </span>

          <span
            className="
              h-px
              w-10

              bg-[#213943]/20
            "
          />

          <span>
            Founder
          </span>
        </div>

        {/* Name */}

        <h3
          className="
            text-[clamp(2.8rem,6vw,6.6rem)]

            font-light
            leading-[0.86]

            tracking-[-0.07em]
          "
        >
          {founder.name}
        </h3>

        {/* Role */}

        <p
          className="
            mt-4

            text-[11px]
            font-medium
            uppercase
            tracking-[0.32em]

            text-[#F54A00]

            md:text-xs
          "
        >
          {founder.label}
        </p>

        {/* divider */}

        <div
          ref={lineRef}
          className="
            my-9

            h-px
            w-full
            max-w-[520px]

            bg-[#213943]/20

            md:my-11
          "
        />

        {/* Intro */}

        <p
          className="
            max-w-[610px]

            text-[clamp(1.25rem,2vw,2rem)]

            font-light
            leading-[1.25]

            tracking-[-0.035em]

            text-[#213943]/55
          "
        >
          {founder.intro}
        </p>

        {/* Statement */}

        <p
          className="
            mt-7
            max-w-[680px]

            text-[clamp(1.8rem,3.2vw,3.8rem)]

            font-light
            leading-[1.04]

            tracking-[-0.055em]

            md:mt-9
          "
        >
          {founder.statement}
        </p>

        {/* Journey */}

        <div
          ref={journeyRef}
          className="
            mt-10

            flex
            max-w-[720px]

            flex-wrap
            items-center

            gap-x-3
            gap-y-3

            md:mt-12
            md:gap-x-4
          "
        >
          {founder.journey.map(
            (step, stepIndex) => (
              <div
                key={step}
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    text-[8px]
                    font-medium
                    uppercase
                    tracking-[0.2em]

                    text-[#213943]/55

                    md:text-[9px]
                  "
                >
                  {step}
                </span>

                {stepIndex !==
                  founder.journey
                    .length -
                    1 && (
                  <span
                    className="
                      text-sm
                      font-light

                      text-[#F54A00]/70
                    "
                  >
                    →
                  </span>
                )}
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   IMAGE
   ========================================================================== */

function FounderImage({
  founder,
  index,
}: {
  founder:
    (typeof FOUNDERS)[number];

  index: number;
}) {
  return (
    <div
      className="
    relative
  
    mx-auto
  
    w-[78vw]
    max-w-[340px]
  
    sm:w-[62vw]
    sm:max-w-[380px]
  
    md:w-[32vw]
    md:max-w-[430px]
  
    lg:w-[28vw]
    lg:max-w-[460px]
  
    xl:w-[25vw]
    xl:max-w-[480px]
  
    md:mx-auto
  "
    >
      {/* giant number behind */}

      <div
        aria-hidden
        className={`
          pointer-events-none

          absolute
          -top-[12%]

          ${index === 0 ? "-left-[8%]" : "-right-[8%]"}

          z-0

          text-[clamp(8rem,17vw,17rem)]

          font-light
          leading-none

          tracking-[-0.1em]

          text-[#213943]/[0.035]
        `}
      >
        {founder.number}
      </div>

      {/* orange mark */}

      <div
        aria-hidden
        className={`
          absolute

          ${index === 0 ? "-left-3 top-[16%]" : "-right-3 top-[16%]"}

          z-20

          h-[18%]
          w-[3px]

          bg-[#F54A00]
        `}
      />

      {/* portrait */}

      <div
        className="
          group
          relative
          z-10

          aspect-[4/5]

          overflow-hidden

          rounded-[1.8rem]

          bg-[#213943]

          shadow-[0_35px_90px_rgba(33,57,67,0.16)]

          md:rounded-[2.5rem]
        "
      >
        <Image
          src={founder.image}
          alt={founder.name}
          fill
          sizes="
  (max-width: 639px) 78vw,
  (max-width: 767px) 62vw,
  (max-width: 1279px) 32vw,
  25vw
"
          className="
            select-none

            object-cover

            transition-transform
            duration-700
            ease-out

            group-hover:scale-[1.025]
          "
          style={{
            objectPosition: founder.imagePosition,
          }}
          draggable={false}
        />

        {/* image wash */}

        <div
          aria-hidden
          className="
            pointer-events-none
            absolute
            inset-0

            bg-linear-to-t

            from-[#152B34]/30
            via-transparent
            to-white/[0.04]
          "
        />

        {/* corner index */}

        <div
          className="
            absolute

            left-5
            top-5

            flex
            h-10
            w-10

            items-center
            justify-center

            rounded-full

            border
            border-white/25

            bg-black/10

            text-[9px]
            font-medium
            tracking-[0.1em]

            text-white

            backdrop-blur-md
          "
        >
          {founder.number}
        </div>

        {/* orange dot */}

        <span
          className="
            absolute
            bottom-5
            right-5

            h-2
            w-2

            rounded-full

            bg-[#F54A00]
          "
        />
      </div>
    </div>
  );
}