"use client";
import { gsap } from "gsap";
import { type ReactNode, useLayoutEffect, useRef, useState } from "react";

type IntroProps = {
  children: ReactNode;
};

export default function Intro({ children }: IntroProps) {
  const [introVisible, setIntroVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  const counterRef = useRef<HTMLDivElement>(null);
  const welcomeRef = useRef<HTMLDivElement>(null);

  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);

  /*
   * This strip covers the permanently open gap between the panels.
   * Moving it downward reveals the Hero without animating clip-path.
   */
  const seamCoverRef = useRef<HTMLDivElement>(null);

  const zipperTrackRef = useRef<HTMLDivElement>(null);
  const zipperHeadRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;

    const counter = counterRef.current;
    const welcome = welcomeRef.current;

    const leftDoor = leftDoorRef.current;
    const rightDoor = rightDoorRef.current;

    const seamCover = seamCoverRef.current;
    const zipperTrack = zipperTrackRef.current;
    const zipperHead = zipperHeadRef.current;

    if (
      !root ||
      !counter ||
      !welcome ||
      !leftDoor ||
      !rightDoor ||
      !seamCover ||
      !zipperTrack ||
      !zipperHead
    ) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const progress = {
      value: 0,
    };

    let previousPercentage = -1;

    const context = gsap.context(() => {
      /*
       * Initial transform-only states.
       */

      gsap.set([leftDoor, rightDoor], {
        xPercent: 0,
        x: 0,
        force3D: true,
      });

      gsap.set(seamCover, {
        yPercent: 0,
        autoAlpha: 0,
        force3D: true,
      });

      gsap.set([zipperTrack, zipperHead], {
        autoAlpha: 0,
      });

      gsap.set(zipperTrack, {
        scaleY: 0,
        transformOrigin: "top center",
        force3D: true,
      });

      gsap.set(zipperHead, {
        y: 0,
        force3D: true,
      });

      gsap.set(welcome, {
        autoAlpha: 0,
        y: 24,
        scale: 0.98,
      });

      const timeline = gsap.timeline({
        defaults: {
          overwrite: "auto",
        },

        onComplete: () => {
          document.body.style.overflow = previousBodyOverflow;
          document.documentElement.style.overflow = previousHtmlOverflow;

          setIntroVisible(false);
        },
      });

      /*
       * 1. Percentage
       *
       * Previous duration: 2.5 seconds
       * New duration: 1.65 seconds
       */

      timeline.to(progress, {
        value: 100,
        duration: 1.65,
        ease: "power2.out",

        onUpdate: () => {
          const percentage = Math.round(progress.value);

          /*
           * Avoid unnecessary DOM writes when the rounded value
           * has not changed.
           */
          if (percentage !== previousPercentage) {
            counter.textContent = `${percentage}%`;
            previousPercentage = percentage;
          }
        },
      });

      timeline.to(
        counter,
        {
          autoAlpha: 0,
          y: -24,
          scale: 0.97,
          duration: 0.28,
          ease: "power2.in",
        },
        "+=0.05",
      );

      /*
       * 2. Welcome
       *
       * No animated blur filter.
       */

      timeline.fromTo(
        welcome,
        {
          autoAlpha: 0,
          y: 24,
          scale: 0.98,
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "power3.out",
        },
      );

      /*
       * Shorter welcome hold.
       */

      timeline.to({}, { duration: 0.42 });

      /*
       * 3. Zipper opening
       */

      timeline.addLabel("unzip");

      timeline.to(
        welcome,
        {
          autoAlpha: 0,
          y: -16,
          scale: 0.985,
          duration: 0.26,
          ease: "power2.in",
        },
        "unzip",
      );

      /*
       * Display the zipper only when the unzip animation begins.
       */

      timeline.set(
        [seamCover, zipperTrack, zipperHead],
        {
          autoAlpha: 1,
        },
        "unzip+=0.02",
      );
      timeline.to(
        leftDoor,
        {
          x: () => (window.innerWidth < 768 ? -4 : -6),
          duration: 0.78,
          ease: "power3.inOut",
          force3D: true,
        },
        "unzip+=0.02",
      );

      timeline.to(
        rightDoor,
        {
          x: () => (window.innerWidth < 768 ? 4 : 6),
          duration: 0.78,
          ease: "power3.inOut",
          force3D: true,
        },
        "unzip+=0.02",
      );
      /*
       * Move the azure seam cover down.
       *
       * Because the actual panels already have a center gap,
       * moving this cover exposes the Hero from top to bottom.
       */

      timeline.to(
        seamCover,
        {
          yPercent: 102,
          duration: 0.78,
          ease: "power3.inOut",
          force3D: true,
        },
        "unzip+=0.02",
      );

      timeline.to(
        zipperTrack,
        {
          scaleY: 1,
          duration: 0.78,
          ease: "power3.inOut",
          force3D: true,
        },
        "unzip+=0.02",
      );

      timeline.to(
        zipperHead,
        {
          y: () => Math.max(window.innerHeight - 52, 0),
          duration: 0.78,
          ease: "power3.inOut",
          force3D: true,
        },
        "unzip+=0.02",
      );

      /*
       * 4. Slide both sides away.
       *
       * Begin just before the zipper reaches the bottom,
       * so the sequence feels continuous.
       */

      timeline.addLabel("doors", "unzip+=0.72");

      timeline.to(
        zipperHead,
        {
          autoAlpha: 0,
          scale: 0.8,
          duration: 0.12,
          ease: "power2.out",
        },
        "doors",
      );

      timeline.to(
        zipperTrack,
        {
          autoAlpha: 0,
          duration: 0.12,
          ease: "power2.out",
        },
        "doors",
      );

      timeline.to(
        leftDoor,
        {
          xPercent: -112,
          x: () => (window.innerWidth < 768 ? -4 : -6),
          duration: 0.82,
          ease: "power4.inOut",
          force3D: true,
        },
        "doors+=0.02",
      );

      timeline.to(
        rightDoor,
        {
          xPercent: 112,
          x: () => (window.innerWidth < 768 ? 4 : 6),
          duration: 0.82,
          ease: "power4.inOut",
          force3D: true,
        },
        "doors+=0.02",
      );
    }, root);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;

      context.revert();
    };
  }, []);

  const leftPanelBackground = {
    background: `
      radial-gradient(
        circle at 12% 12%,
        rgba(121, 153, 165, 0.2) 0%,
        rgba(121, 153, 165, 0.08) 30%,
        transparent 55%
      ),
      radial-gradient(
        circle at 90% 90%,
        rgba(5, 15, 20, 0.3) 0%,
        transparent 55%
      ),
      linear-gradient(
        135deg,
        #294651 0%,
        #213943 48%,
        #192f38 100%
      )
    `,
  };
  const rightPanelBackground = {
    background: `
      radial-gradient(
        circle at 88% 12%,
        rgba(121, 153, 165, 0.2) 0%,
        rgba(121, 153, 165, 0.08) 30%,
        transparent 55%
      ),
      radial-gradient(
        circle at 10% 90%,
        rgba(5, 15, 20, 0.3) 0%,
        transparent 55%
      ),
      linear-gradient(
        225deg,
        #294651 0%,
        #213943 48%,
        #192f38 100%
      )
    `,
  };

  return (
    <>
      {children}
      {introVisible && (
        <div
          className="
            fixed
            inset-0
            z-9999
            overflow-hidden
          "
        >
          <div
            ref={rootRef}
            className="
              fixed
              inset-0
              z-50
              isolate
              overflow-hidden
            "
          >
            {/* Left panel */}

            <div
              ref={leftDoorRef}
              className="
                absolute
                inset-y-0
                left-0
                z-0
                overflow-hidden
                transform-gpu
                will-change-transform
              "
              style={{
                width: "50%",
                ...leftPanelBackground,
              }}
            >
              <div className="absolute inset-0 bg-linear-to-br from-white/[0.035] via-transparent to-black/10" />
            </div>

            {/* Right panel */}

            <div
              ref={rightDoorRef}
              className="
                absolute
                inset-y-0
                right-0
                z-0
                overflow-hidden
                transform-gpu
                will-change-transform
              "
              style={{
                width: "50%",
                ...rightPanelBackground,
              }}
            >
              <div className="absolute inset-0 bg-linear-to-bl from-white/[0.035] via-transparent to-black/10" />
            </div>

            {/*
             * Azure seam cover
             *
             * The left and right panels have a 12px transparent gap.
             * This element covers that gap until it slides downward.
             */}

            <div
              ref={seamCoverRef}
              className="
              invisible
              pointer-events-none
              absolute
              left-1/2
              top-0
              z-10
              h-[105%]
              w-3
              -translate-x-1/2
              transform-gpu
              bg-[#213943]
              opacity-0
              will-change-transform
              md:w-4
            "
            />

            {/* Percentage and welcome content */}

            <div
              className="
          pointer-events-none
          absolute
          inset-0
          z-20
          flex
          items-center
          justify-center
          overflow-hidden
          px-4
        "
            >
              <div
                ref={counterRef}
                className="
            whitespace-nowrap
            text-[clamp(9rem,25vw,30rem)]
            font-light
            leading-[0.78]
            -tracking-widest
            text-[#78939d]
            transform-gpu
            will-change-transform
          "
                style={{
                  textShadow: `
              10px 10px 20px rgba(4, 14, 19, 0.76),
              -5px -5px 14px rgba(132, 169, 182, 0.2),
              1px 1px 1px rgba(255, 255, 255, 0.07)
            `,
                }}
              >
                0%
              </div>

              <div
                ref={welcomeRef}
                className="
                  absolute
                  px-5
                  text-center
                  opacity-0
                  transform-gpu
                  will-change-transform
                "
              >
                <p
                  className="
                    text-xs
                    font-medium
                    uppercase
                    tracking-[0.7em]
                    text-white/65
                    sm:text-sm
                  "
                >
                  Welcome To
                </p>

                <h1
                  className="
                    mt-5
                    text-[clamp(3.5rem,8vw,8rem)]
                    font-light
                    leading-none
                    tracking-[-0.055em]
                    text-white
                  "
                >
                  Elevia Studio
                </h1>
              </div>
            </div>

            {/* Zipper track */}

            <div
              ref={zipperTrackRef}
              className="
                invisible
                pointer-events-none
                absolute
                left-1/2
                top-0
                z-30
                h-full
                w-2.5
                -translate-x-1/2
                transform-gpu
                opacity-0
                will-change-transform
              "
            >
              <div
                className="
                  absolute
                  left-0.5
                  top-0
                  h-full
                  w-px
                  bg-linear-to-b
                  from-white/75
                  via-[#9ab5bf]/75
                  to-white/25
                "
              />

              <div
                className="
                  absolute
                  right-0.5
                  top-0
                  h-full
                  w-px
                  bg-linear-to-b
                  from-white/75
                  via-[#9ab5bf]/75
                  to-white/25
                "
              />
            </div>

            {/* Zipper handle */}

            <div
              ref={zipperHeadRef}
              className="
              invisible
              pointer-events-none
              absolute
              left-1/2
              top-3
              z-40
              flex
              h-9
              w-7
              -translate-x-1/2
              transform-gpu
              items-center
              justify-center
              rounded-full
              border
              border-white/30
              bg-[#78939d]
              opacity-0
              shadow-[0_6px_14px_rgba(0,0,0,0.35),inset_1px_1px_2px_rgba(255,255,255,0.25)]
              will-change-transform
            "
            >
              <div className="h-3 w-1.5 rounded-full border border-white/50" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
