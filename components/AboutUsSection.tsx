"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";

const FOUNDERS = [
  {
    number: "01",

    /*
     * Replace with actual founder name.
     */
    name: "Founder One",

    /*
     * Replace with actual role.
     */
    role: "Co-Founder / Creative",

    image: "/about/founder-1.jpg",

    imagePosition: "center center",
  },

  {
    number: "02",

    name: "Founder Two",

    role: "Co-Founder / Technology",

    image: "/about/founder-2.jpg",

    imagePosition: "center center",
  },
] as const;

export default function AboutUsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const eyebrowRef = useRef<HTMLParagraphElement>(null);

  const founderRefs = useRef<Array<HTMLDivElement | null>>([]);

  const founderInfoRefs = useRef<Array<HTMLDivElement | null>>([]);

  const titleOneRef = useRef<HTMLHeadingElement>(null);

  const titleTwoRef = useRef<HTMLHeadingElement>(null);

  const statementRef = useRef<HTMLDivElement>(null);

  const lineRef = useRef<HTMLDivElement>(null);

  const indexRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;

    const eyebrow = eyebrowRef.current;

    const founderCards = founderRefs.current.filter(
      (element): element is HTMLDivElement => Boolean(element),
    );

    const founderInfos = founderInfoRefs.current.filter(
      (element): element is HTMLDivElement => Boolean(element),
    );

    const titleOne = titleOneRef.current;
    const titleTwo = titleTwoRef.current;

    const statement = statementRef.current;
    const line = lineRef.current;
    const index = indexRef.current;

    if (
      !section ||
      !stage ||
      !eyebrow ||
      founderCards.length !== 2 ||
      founderInfos.length !== 2 ||
      !titleOne ||
      !titleTwo ||
      !statement ||
      !line ||
      !index
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    let refreshFrame = 0;

    const context = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      /*
       * ------------------------------------------------------------
       * Initial states
       * ------------------------------------------------------------
       */

      gsap.set(eyebrow, {
        autoAlpha: 0,
        y: 18,
      });

      /*
       * Both founder images begin around the center.
       */

      gsap.set(founderCards[0], {
        xPercent: -50,
        yPercent: -50,

        x: isMobile ? -18 : -40,
        y: isMobile ? -25 : 0,

        rotation: -2,

        scale: 0.84,
        autoAlpha: 0,

        force3D: true,
      });

      gsap.set(founderCards[1], {
        xPercent: -50,
        yPercent: -50,

        x: isMobile ? 18 : 40,
        y: isMobile ? 25 : 0,

        rotation: 2,

        scale: 0.84,
        autoAlpha: 0,

        force3D: true,
      });

      gsap.set(founderInfos, {
        autoAlpha: 0,
        y: 20,
      });

      gsap.set([titleOne, titleTwo], {
        autoAlpha: 0,
        yPercent: 110,

        force3D: true,
      });

      gsap.set(statement, {
        autoAlpha: 0,
        y: 45,
      });

      gsap.set(line, {
        scaleX: 0,

        transformOrigin: "center center",
      });

      gsap.set(index, {
        autoAlpha: 0,
        y: 10,
      });

      /*
       * ------------------------------------------------------------
       * Timeline
       *
       * NO GSAP PIN.
       * The sticky element is handled by CSS.
       * ------------------------------------------------------------
       */

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,

          start: "top top",
          end: "bottom bottom",

          scrub: 1,

          invalidateOnRefresh: true,
        },
      });

      /*
       * 1. Section label.
       */

      timeline.to(
        eyebrow,
        {
          autoAlpha: 1,
          y: 0,

          duration: 0.3,
          ease: "power2.out",
        },
        0,
      );

      /*
       * 2. Both founders appear together.
       */

      timeline.to(
        founderCards,
        {
          autoAlpha: 1,

          scale: 1,

          duration: 0.7,

          stagger: 0.07,

          ease: "power3.out",
        },
        0.05,
      );

      /*
       * 3. Separate portraits.
       */

      timeline.to(
        founderCards[0],
        {
          x: () => (isMobile ? -82 : -Math.min(window.innerWidth * 0.23, 390)),

          y: isMobile ? -55 : 20,

          rotation: isMobile ? -3 : -5,

          duration: 0.9,

          ease: "power3.inOut",

          force3D: true,
        },
        0.48,
      );

      timeline.to(
        founderCards[1],
        {
          x: () => (isMobile ? 82 : Math.min(window.innerWidth * 0.23, 390)),

          y: isMobile ? 65 : -15,

          rotation: isMobile ? 3 : 5,

          duration: 0.9,

          ease: "power3.inOut",

          force3D: true,
        },
        0.48,
      );

      /*
       * 4. Giant title rises from behind founders.
       */

      timeline.to(
        titleOne,
        {
          autoAlpha: 1,
          yPercent: 0,

          duration: 0.72,

          ease: "power4.out",
        },
        0.84,
      );

      timeline.to(
        titleTwo,
        {
          autoAlpha: 1,
          yPercent: 0,

          duration: 0.72,

          ease: "power4.out",
        },
        0.94,
      );

      /*
       * 5. Small connecting line.
       */

      timeline.to(
        line,
        {
          scaleX: 1,

          duration: 0.5,

          ease: "power3.out",
        },
        1.2,
      );

      /*
       * 6. Founder details.
       */

      timeline.to(
        founderInfos,
        {
          autoAlpha: 1,
          y: 0,

          duration: 0.4,

          stagger: 0.08,

          ease: "power2.out",
        },
        1.25,
      );

      /*
       * 7. Studio statement.
       */

      timeline.to(
        statement,
        {
          autoAlpha: 1,
          y: 0,

          duration: 0.65,

          ease: "power3.out",
        },
        1.48,
      );

      timeline.to(
        index,
        {
          autoAlpha: 1,
          y: 0,

          duration: 0.35,
        },
        1.55,
      );

      /*
       * Tiny final movement for depth.
       */

      timeline.to(
        founderCards[0],
        {
          y: isMobile ? -62 : 12,

          duration: 0.55,

          ease: "sine.inOut",
        },
        1.7,
      );

      timeline.to(
        founderCards[1],
        {
          y: isMobile ? 58 : -7,

          duration: 0.55,

          ease: "sine.inOut",
        },
        1.7,
      );

      /*
       * Hold final composition.
       */

      timeline.to(
        {},
        {
          duration: 0.6,
        },
      );

      refreshFrame = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, section);

    return () => {
      cancelAnimationFrame(refreshFrame);

      context.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="About Elevia Studio"
      className="
        relative
        min-h-[210svh]
        w-full
        bg-[#E9E4DA]
        text-[#213943]
      "
    >
      {/* ========================================================== */}
      {/* STICKY VIEWPORT                                            */}
      {/* ========================================================== */}

      <div
        ref={stageRef}
        className="
          sticky
          top-0
          h-svh
          w-full
          overflow-hidden
        "
      >
        {/* ======================================================== */}
        {/* BACKGROUND DETAILS                                       */}
        {/* ======================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-x-0
            top-1/2
            h-px
            bg-[#213943]/10
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-0
            left-1/2
            top-0
            w-px
            bg-[#213943]/[0.055]
          "
        />

        {/* Big background number */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -bottom-[8vh]
            -right-[2vw]
            text-[clamp(15rem,34vw,36rem)]
            font-light
            leading-none
            tracking-[-0.1em]
            text-[#213943]/[0.035]
          "
        >
          05
        </div>

        {/* ======================================================== */}
        {/* TOP AREA                                                 */}
        {/* ======================================================== */}

        <div
          className="
            absolute
            inset-x-0
            top-0
            z-50
            flex
            items-center
            justify-between
            px-5
            pt-6
            md:px-10
            md:pt-8
          "
        >
          <p
            ref={eyebrowRef}
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.3em]
              text-[#213943]/50
              opacity-0
              md:text-xs
            "
          >
            05 / About us
          </p>

          <p
            className="
              hidden
              text-[10px]
              uppercase
              tracking-[0.22em]
              text-[#213943]/40
              md:block
            "
          >
            Elevia Studio
          </p>
        </div>

        {/* ======================================================== */}
        {/* TYPOGRAPHY BEHIND FOUNDERS                               */}
        {/* ======================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-10
          "
        >
          {/* TWO MINDS */}

          <div
            className="
              absolute
              left-0
              top-[12vh]
              w-full
              overflow-hidden
              px-4
              md:top-[9vh]
              md:px-8
            "
          >
            <h2
              ref={titleOneRef}
              className="
                text-center
                text-[clamp(4.5rem,14vw,15rem)]
                font-light
                leading-[0.76]
                tracking-[-0.09em]
              "
            >
              Two Minds
            </h2>
          </div>

          {/* ONE DIRECTION */}

          <div
            className="
              absolute
              bottom-[12vh]
              left-0
              w-full
              overflow-hidden
              px-4
              md:bottom-[7vh]
              md:px-8
            "
          >
            <h2
              ref={titleTwoRef}
              className="
                whitespace-nowrap
                text-center
                text-[clamp(3.9rem,11.5vw,12.5rem)]
                font-light
                leading-[0.76]
                tracking-[-0.085em]
              "
            >
              One Direction
            </h2>
          </div>
        </div>

        {/* ======================================================== */}
        {/* FOUNDERS                                                 */}
        {/* ======================================================== */}

        <div
          className="
            absolute
            inset-0
            z-20
          "
        >
          {FOUNDERS.map((founder, index) => (
            <div
              key={founder.number}
              ref={(element) => {
                founderRefs.current[index] = element;
              }}
              className="
                  absolute
                  left-1/2
                  top-[49%]
                  w-[42vw]
                  max-w-[260px]
                  opacity-0
                  will-change-transform
                  sm:w-[34vw]
                  md:top-[50%]
                  md:w-[24vw]
                  md:max-w-[390px]
                "
            >
              {/* Portrait */}

              <div
                className="
                    group
                    relative
                    aspect-[4/5]
                    overflow-hidden
                    rounded-[2rem]
                    bg-[#213943]
                    shadow-[0_30px_70px_rgba(33,57,67,0.18)]
                    md:rounded-[2.7rem]
                  "
              >
                <Image
                  src={founder.image}
                  alt={founder.name}
                  fill
                  sizes="
                      (max-width: 767px) 42vw,
                      24vw
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

                {/* Soft image gradient */}

                <div
                  className="
                      pointer-events-none
                      absolute
                      inset-0
                      bg-linear-to-t
                      from-[#152B34]/45
                      via-transparent
                      to-white/[0.05]
                    "
                />

                {/* Number */}

                <div
                  className="
                      absolute
                      left-4
                      top-4
                      flex
                      h-9
                      w-9
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
                      md:left-5
                      md:top-5
                    "
                >
                  {founder.number}
                </div>

                {/* Little orange detail */}

                <div
                  className="
                      absolute
                      bottom-4
                      right-4
                      h-2
                      w-2
                      rounded-full
                      bg-[#F54A00]
                      md:bottom-5
                      md:right-5
                    "
                />
              </div>

              {/* Founder info */}

              <div
                ref={(element) => {
                  founderInfoRefs.current[index] = element;
                }}
                className="
                    mt-4
                    opacity-0
                    md:mt-5
                  "
              >
                <div
                  className="
                      flex
                      items-start
                      justify-between
                      gap-3
                    "
                >
                  <p
                    className="
                        text-lg
                        font-light
                        tracking-[-0.04em]
                        md:text-2xl
                      "
                  >
                    {founder.name}
                  </p>

                  <span
                    className="
                        mt-2
                        h-1.5
                        w-1.5
                        shrink-0
                        rounded-full
                        bg-[#F54A00]
                      "
                  />
                </div>

                <p
                  className="
                      mt-1
                      text-[9px]
                      font-medium
                      uppercase
                      tracking-[0.19em]
                      text-[#213943]/45
                      md:text-[10px]
                    "
                >
                  {founder.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ======================================================== */}
        {/* CENTRAL CONNECTION                                       */}
        {/* ======================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[51%]
            z-30
            hidden
            w-[11vw]
            max-w-[150px]
            -translate-x-1/2
            md:block
          "
        >
          <div
            ref={lineRef}
            className="
              h-px
              w-full
              bg-[#213943]/25
            "
          />

          <div
            className="
              absolute
              left-1/2
              top-1/2
              h-2
              w-2
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              border
              border-[#213943]/30
              bg-[#E9E4DA]
            "
          />
        </div>

        {/* ======================================================== */}
        {/* MANIFESTO                                                */}
        {/* ======================================================== */}

        <div
          ref={statementRef}
          className="
            invisible
            absolute
            bottom-[5vh]
            left-5
            z-40
            max-w-[88vw]
            opacity-0
            md:bottom-[6vh]
            md:left-10
            md:max-w-[30vw]
          "
        >
          <p
            className="
              mb-3
              text-[9px]
              font-medium
              uppercase
              tracking-[0.27em]
              text-[#213943]/45
            "
          >
            The studio
          </p>

          <p
            className="
              text-[clamp(1.25rem,2vw,2.15rem)]
              font-light
              leading-[1.05]
              tracking-[-0.045em]
            "
          >
            Two founders. Different instincts. One standard for the work — ideas
            that are clear, memorable and built to move.
          </p>

          <div
            className="
              mt-5
              flex
              flex-wrap
              gap-x-5
              gap-y-2
              text-[8px]
              font-medium
              uppercase
              tracking-[0.2em]
              text-[#213943]/40
              md:text-[9px]
            "
          >
            <span>Strategy</span>
            <span>Design</span>
            <span>Technology</span>
            <span>Motion</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT BOTTOM INDEX                                       */}
        {/* ======================================================== */}

        <div
          ref={indexRef}
          className="
            absolute
            bottom-6
            right-5
            z-40
            hidden
            items-center
            gap-4
            opacity-0
            md:bottom-8
            md:right-10
            md:flex
          "
        >
          <span
            className="
              text-[9px]
              uppercase
              tracking-[0.2em]
              text-[#213943]/40
            "
          >
            Built together
          </span>

          <span
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              border
              border-[#213943]/15
              text-xs
            "
          >
            +
          </span>
        </div>
      </div>
    </section>
  );
}
