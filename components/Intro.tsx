"use client";

import { gsap } from "gsap";
import type { CSSProperties } from "react";
import { useLayoutEffect, useRef } from "react";

type IntroProps = {
  onComplete: () => void;
};

type ZipPanelStyle = CSSProperties & {
  "--zip-y": string;
  "--zip-gap": string;
};

export default function Intro({ onComplete }: IntroProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  const counterRef = useRef<HTMLDivElement>(null);
  const welcomeRef = useRef<HTMLDivElement>(null);

  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);

  const zipperTrackRef = useRef<HTMLDivElement>(null);
  const zipperHeadRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const counter = counterRef.current;
    const welcome = welcomeRef.current;
    const leftDoor = leftDoorRef.current;
    const rightDoor = rightDoorRef.current;
    const zipperTrack = zipperTrackRef.current;
    const zipperHead = zipperHeadRef.current;

    if (
      !root ||
      !counter ||
      !welcome ||
      !leftDoor ||
      !rightDoor ||
      !zipperTrack ||
      !zipperHead
    ) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const progress = {
      value: 0,
    };

    const context = gsap.context(() => {
      gsap.set([leftDoor, rightDoor], {
        xPercent: 0,
        rotationY: 0,
        scale: 1,
      });

      gsap.set(leftDoor, {
        "--zip-y": "0%",
        "--zip-gap": "0px",
      });

      gsap.set(rightDoor, {
        "--zip-y": "0%",
        "--zip-gap": "0px",
      });

      gsap.set([zipperTrack, zipperHead], {
        autoAlpha: 0,
      });

      gsap.set(zipperTrack, {
        scaleY: 0,
        transformOrigin: "top center",
      });

      const timeline = gsap.timeline({
        defaults: {
          overwrite: "auto",
        },
        onComplete: () => {
          onComplete();
          document.body.style.overflow = previousOverflow;
        },
      });

      /*
       * Percentage animation
       */

      timeline.to(progress, {
        value: 100,
        duration: 2.5,
        ease: "power2.out",
        onUpdate: () => {
          counter.textContent = `${Math.round(progress.value)}%`;
        },
      });

      timeline.to(
        counter,
        {
          autoAlpha: 0,
          y: -35,
          scale: 0.96,
          duration: 0.5,
          ease: "power2.in",
        },
        "+=0.2",
      );

      /*
       * Welcome animation
       */

      timeline.fromTo(
        welcome,
        {
          autoAlpha: 0,
          y: 35,
          filter: "blur(10px)",
        },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.85,
          ease: "power3.out",
        },
      );

      timeline.to({}, { duration: 1 });

      /*
       * The welcome text starts disappearing while the zipper
       * opens from the top toward the bottom.
       */

      timeline.addLabel("unzip");

      timeline.to(
        welcome,
        {
          autoAlpha: 0,
          y: -22,
          filter: "blur(8px)",
          duration: 0.48,
          ease: "power2.in",
        },
        "unzip",
      );

      timeline.set(
        [zipperTrack, zipperHead],
        {
          autoAlpha: 1,
        },
        "unzip+=0.05",
      );

      timeline.to(
        zipperTrack,
        {
          scaleY: 1,
          duration: 1.15,
          ease: "power2.inOut",
        },
        "unzip+=0.05",
      );

      timeline.to(
        zipperHead,
        {
          y: () => Math.max(window.innerHeight - 52, 0),
          duration: 1.15,
          ease: "power2.inOut",
        },
        "unzip+=0.05",
      );

      timeline.to(
        leftDoor,
        {
          "--zip-y": "100%",
          "--zip-gap": "12px",
          duration: 1.15,
          ease: "power2.inOut",
        },
        "unzip+=0.05",
      );

      timeline.to(
        rightDoor,
        {
          "--zip-y": "100%",
          "--zip-gap": "12px",
          duration: 1.15,
          ease: "power2.inOut",
        },
        "unzip+=0.05",
      );

      /*
       * After the zipper reaches the bottom, move both panels
       * away and slightly backward.
       */

      timeline.addLabel("doors", "unzip+=1.18");

      timeline.to(
        zipperHead,
        {
          autoAlpha: 0,
          scale: 0.75,
          duration: 0.18,
        },
        "doors",
      );

      timeline.to(
        zipperTrack,
        {
          autoAlpha: 0,
          duration: 0.18,
        },
        "doors",
      );

      timeline.to(
        leftDoor,
        {
          xPercent: -108,
          rotationY: -8,
          scale: 0.97,
          duration: 1.25,
          ease: "expo.inOut",
          force3D: true,
        },
        "doors+=0.05",
      );

      timeline.to(
        rightDoor,
        {
          xPercent: 108,
          rotationY: 8,
          scale: 0.97,
          duration: 1.25,
          ease: "expo.inOut",
          force3D: true,
        },
        "doors+=0.05",
      );
    }, root);

    return () => {
      document.body.style.overflow = previousOverflow;
      context.revert();
    };
  }, [onComplete]);

  const leftPanelStyle: ZipPanelStyle = {
    "--zip-y": "0%",
    "--zip-gap": "0px",
    transformOrigin: "100% 50%",
    clipPath: `
      polygon(
        0 0,
        calc(100% - var(--zip-gap)) 0,
        calc(100% - var(--zip-gap)) var(--zip-y),
        100% calc(var(--zip-y) + 4%),
        100% 100%,
        0 100%
      )
    `,
  };

  const rightPanelStyle: ZipPanelStyle = {
    "--zip-y": "0%",
    "--zip-gap": "0px",
    transformOrigin: "0% 50%",
    clipPath: `
      polygon(
        var(--zip-gap) 0,
        100% 0,
        100% 100%,
        0 100%,
        0 calc(var(--zip-y) + 4%),
        var(--zip-gap) var(--zip-y)
      )
    `,
  };

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50 overflow-hidden"
      style={{
        perspective: "2000px",
      }}
    >
      {/* Dark azure-gray panels */}

      <div className="absolute inset-0 flex overflow-hidden">
        <div
          ref={leftDoorRef}
          className="
            relative
            h-full
            w-[calc(50%+1px)]
            shrink-0
            overflow-hidden
            bg-[#213943]
          "
          style={leftPanelStyle}
        >
          <div
            className="
              absolute
              left-[-18%]
              top-[-22%]
              h-[70vw]
              max-h-225
              w-[70vw]
              max-w-225
              rounded-full
              bg-[#66828d]/15
              blur-[100px]
            "
          />

          <div
            className="
              absolute
              bottom-[-30%]
              right-[-30%]
              h-[60vw]
              max-h-190
              w-[60vw]
              max-w-190
              rounded-full
              bg-black/25
              blur-[110px]
            "
          />

          <div className="absolute inset-0 bg-linear-to-br from-white/[0.035] via-transparent to-black/15" />
        </div>
        <div
          ref={rightDoorRef}
          className="
            relative
            -ml-0.5
            h-full
            w-[calc(50%+1px)]
            shrink-0
            overflow-hidden
            bg-[#213943]
          "
          style={rightPanelStyle}
        >
          <div
            className="
              absolute
              right-[-18%]
              top-[-22%]
              h-[70vw]
              max-h-225
              w-[70vw]
              max-w-225
              rounded-full
              bg-[#66828d]/15
              blur-[100px]
            "
          />

          <div
            className="
              absolute
              bottom-[-30%]
              left-[-30%]
              h-[60vw]
              max-h-190
              w-[60vw]
              max-w-190
              rounded-full
              bg-black/25
              blur-[110px]
            "
          />

          <div className="absolute inset-0 bg-linear-to-bl from-white/[0.035] via-transparent to-black/15" />
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
        z-20
        h-full
        w-2.5
        -translate-x-1/2
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
            from-white/80
            via-[#9ab5bf]/80
            to-white/30
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
            from-white/80
            via-[#9ab5bf]/80
            to-white/30
          "
        />

        <div className="absolute inset-0 bg-white/15 blur-md" />
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
          z-30
          opacity-0
          flex
          h-9
          w-7
          -translate-x-1/2
          items-center
          justify-center
          rounded-full
          border
          border-white/35
          bg-[#78939d]
          shadow-[0_7px_22px_rgba(0,0,0,0.45),inset_1px_1px_2px_rgba(255,255,255,0.35)]
        "
      >
        <div className="h-3 w-1.5 rounded-full border border-white/55" />
      </div>

      {/* Percentage and welcome content */}

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-5">
        <div
          ref={counterRef}
          className="
    whitespace-nowrap
    text-[clamp(9rem,25vw,30rem)]
    font-light
    leading-[0.78]
    -tracking-widest
    text-[#78939d]
    will-change-transform
  "
          style={{
            textShadow: `
      12px 12px 22px rgba(4, 14, 19, 0.82),
      -7px -7px 18px rgba(132, 169, 182, 0.24),
      1px 1px 1px rgba(255, 255, 255, 0.08)
    `,
          }}
        >
          0%
        </div>

        <div ref={welcomeRef} className="absolute px-5 text-center opacity-0">
          <p className="text-xs font-medium uppercase tracking-[0.7em] text-white/65 sm:text-sm">
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
    </div>
  );
}
