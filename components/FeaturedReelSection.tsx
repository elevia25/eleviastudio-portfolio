"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

import SectionHeading, {
  SECTION_FLOW_CONTENT_OFFSET_CLASS,
  SECTION_SHELL_CLASS,
} from "@/components/SectionHeading";
import {
  BLUR,
  DISTANCE,
  EASE,
  PARALLAX_SCRUB,
  REVEAL_TRIGGER,
  prefersReducedMotion,
} from "@/lib/motion";

export default function FeaturedReelSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const reel = reelRef.current;
    const video = videoRef.current;

    if (!section || !reel || !video) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const reducedMotion = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(reel, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotation: 0,
          filter: "blur(0px)",
        });

        return;
      }

      /* ==========================================================
         REEL ENTRANCE
         ========================================================== */

      gsap.fromTo(
        reel,
        {
          autoAlpha: 0,

          y: DISTANCE.lg * 2,

          scale: 0.88,

          rotation: -2,

          filter: `blur(${BLUR.md}px)`,

          force3D: true,
        },
        {
          autoAlpha: 1,

          y: 0,

          scale: 1,

          rotation: 0,

          filter: "blur(0px)",

          duration: 1.15,

          ease: EASE.entranceStrong,

          scrollTrigger: {
            trigger: reel,

            start: REVEAL_TRIGGER.start,

            end: "center 58%",

            scrub: PARALLAX_SCRUB,

            invalidateOnRefresh: true,
          },
        },
      );

      /* ==========================================================
         SMALL DEPTH MOVEMENT
         ========================================================== */

      gsap.to(reel, {
        y: -35,

        ease: EASE.linear,

        scrollTrigger: {
          trigger: section,

          start: "top bottom",

          end: "bottom top",

          scrub: true,

          invalidateOnRefresh: true,
        },
      });
    }, section);

    /* ============================================================
       VIDEO PLAY / PAUSE
       ============================================================ */

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          return;
        }

        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Autoplay may be blocked by browser.
          });
        } else {
          video.pause();
        }
      },
      {
        root: null,

        /*
         * Start loading/playing slightly
         * before the reel enters the screen.
         */
        rootMargin: "250px 0px",

        threshold: 0.05,
      },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();

      video.pause();

      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Production Film"
      className={`
        ${SECTION_SHELL_CLASS}
        min-h-[125svh]
        bg-[#111015]
        text-[#F5F0F2]
      `}
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
              circle at 50% 48%,
              rgba(245,74,0,.09),
              transparent 24%
            ),

            radial-gradient(
              circle at 17% 20%,
              rgba(255,255,255,.025),
              transparent 30%
            ),

            radial-gradient(
              circle at 85% 80%,
              rgba(61,34,70,.16),
              transparent 32%
            )
          `,
        }}
      />

      {/* ==========================================================
          GIANT BACKGROUND WORD
          ========================================================== */}

      <div
        aria-hidden
        className="
          pointer-events-none

          absolute
          left-1/2
          top-[51%]

          -translate-x-1/2
          -translate-y-1/2

          whitespace-nowrap

          text-[clamp(9rem,24vw,26rem)]

          font-light
          leading-none

          tracking-[-0.1em]

          text-black/25
        "
        style={{
          textShadow: `
            0 1px 0 rgba(255,255,255,.025),
            0 -1px 1px rgba(0,0,0,.5)
          `,
        }}
      >
        REEL
      </div>

      {/* ==========================================================
          HEADING
          ========================================================== */}

      <SectionHeading
        number="02"
        title="Production"
        subtitle="Stories brought to life, frame by frame."
      />

      {/* ==========================================================
          REEL AREA
          ========================================================== */}

      <div
        className={`
          ${SECTION_FLOW_CONTENT_OFFSET_CLASS}
          relative
          z-20
          flex
          min-h-[92svh]
          w-full

          items-center
          justify-center

          px-5
          pb-24

          md:pb-28
        `}
      >
        <div
          ref={reelRef}
          className="
            relative

            w-[72vw]
            max-w-[390px]

            opacity-0

            sm:w-[58vw]

            md:w-[30vw]
            md:max-w-[430px]

            xl:w-[25vw]
            xl:max-w-[460px]

            will-change-[transform,opacity,filter]
          "
        >
          {/* ======================================================
              CONTACT SHADOW
              ====================================================== */}

          <div
            aria-hidden
            className="
              pointer-events-none

              absolute
              bottom-[-5%]
              left-[8%]

              h-[16%]
              w-[84%]

              rounded-[50%]

              bg-black/50

              blur-3xl
            "
          />

          {/* ======================================================
              OUTER FRAME
              ====================================================== */}

          <div
            className="
              relative

              aspect-[9/16]
              w-full

              overflow-hidden

              rounded-[1.8rem]

              border
              border-white/[0.1]

              bg-black

              shadow-[0_45px_110px_rgba(0,0,0,.55)]

              md:rounded-[2.3rem]
            "
          >
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload="metadata"
              className="
                absolute
                inset-0

                h-full
                w-full

                object-cover
              "
            >
              <source src="/IMG_7584.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* ====================================================
                VERY LIGHT VIDEO OVERLAY
                ==================================================== */}

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
                    to bottom,
                    rgba(0,0,0,.04),
                    transparent 25%,
                    transparent 72%,
                    rgba(0,0,0,.18)
                  )
                `,
              }}
            />

            {/* ====================================================
                TOP INDEX
                ==================================================== */}

            <div
              className="
                absolute
                left-4
                top-4

                flex
                items-center
                gap-2

                rounded-full

                border
                border-white/15

                bg-black/20

                px-3
                py-1.5

                text-[7px]
                uppercase
                tracking-[0.22em]

                text-white/65

                backdrop-blur-md

                md:left-5
                md:top-5
                md:text-[8px]
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5

                  rounded-full

                  bg-[#F54A00]
                "
              />
              Production Film
            </div>

            {/* ====================================================
                BOTTOM INFO
                ==================================================== */}

            <div
              className="
                absolute

                bottom-5
                left-5
                right-5

                flex
                items-end
                justify-between

                text-white
              "
            >
              <div>
                <p
                  className="
                    text-[7px]
                    uppercase
                    tracking-[0.25em]

                    text-white/45

                    md:text-[8px]
                  "
                >
                  Production / Direction
                </p>

                <p
                  className="
                    mt-1

                    text-sm
                    font-light

                    tracking-[-0.03em]

                    md:text-base
                  "
                >
                  From concept to final frame.
                </p>
              </div>

              <span
                className="
                  text-[8px]
                  tracking-[0.18em]

                  text-white/40
                "
              >
                01 / 01
              </span>
            </div>
          </div>

          {/* ======================================================
              OUTSIDE CAPTION
              ====================================================== */}

          <div
            className="
    mt-5
    flex
    items-center
    justify-between
    text-[7px]
    uppercase
    tracking-[0.22em]
    text-white/35
    md:text-[8px]
  "
          >
            <span>Direction / Shoot / Motion</span>

            <span>Elevia Studio</span>
          </div>
        </div>
      </div>
    </section>
  );
}