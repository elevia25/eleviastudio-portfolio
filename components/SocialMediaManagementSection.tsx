"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import SectionHeading from "./SectionHeading";

const SOCIAL_PLATFORMS = [
  {
    name: "Instagram",
    icon: "/social/instagram.svg",
  },
  {
    name: "Facebook",
    icon: "/social/facebook.svg",
  },
  {
    name: "LinkedIn",
    icon: "/social/linkedin.svg",
  },
  {
    name: "YouTube",
    icon: "/social/youtube.svg",
  },
  {
    name: "X",
    icon: "/social/x.svg",
  },
  {
    name: "TikTok",
    icon: "/social/tiktok.svg",
  },
  {
    name: "Pinterest",
    icon: "/social/pinterest.svg",
  },
  {
    name: "WhatsApp",
    icon: "/social/whatsapp.svg",
  },
] as const;

/*
 * Replace these placeholders with your real verified numbers.
 */
const MANAGED_ACCOUNTS = "15+";
const AVERAGE_GROWTH = "84%";

type IconPosition = {
  x: number;
  y: number;
  rotation: number;
  scale?: number;
};

const DESKTOP_POSITIONS: IconPosition[] = [
  { x: -350, y: -95, rotation: -12 },
  { x: -300, y: 125, rotation: 10 },
  { x: -155, y: 245, rotation: -8 },
  { x: 155, y: 245, rotation: 8 },
  { x: 300, y: 125, rotation: -10 },
  { x: 350, y: -75, rotation: 12 },
  { x: 205, y: -180, rotation: -7 },
  { x: -205, y: -180, rotation: 7 },
];

const TABLET_POSITIONS: IconPosition[] = [
  { x: -245, y: -85, rotation: -12 },
  { x: -215, y: 105, rotation: 10 },
  { x: -105, y: 210, rotation: -8 },
  { x: 105, y: 210, rotation: 8 },
  { x: 215, y: 105, rotation: -10 },
  { x: 245, y: -85, rotation: 12 },
  { x: 150, y: -205, rotation: -7 },
  { x: -150, y: -205, rotation: 7 },
];

const MOBILE_POSITIONS: IconPosition[] = [
  { x: -128, y: -90, rotation: -10, scale: 0.88 },
  { x: -105, y: 50, rotation: 8, scale: 0.82 },
  { x: -48, y: 165, rotation: -7, scale: 0.78 },
  { x: 48, y: 165, rotation: 7, scale: 0.78 },
  { x: 105, y: 50, rotation: -8, scale: 0.82 },
  { x: 128, y: -90, rotation: 10, scale: 0.88 },
  { x: 58, y: -200, rotation: -6, scale: 0.78 },
  { x: -58, y: -200, rotation: 6, scale: 0.78 },
];

export default function SocialMediaManagementSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const titleRef = useRef<HTMLDivElement>(null);
  const accountsRef = useRef<HTMLDivElement>(null);
  const growthRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const iconRefs = useRef<Array<HTMLDivElement | null>>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const title = titleRef.current;
    const accounts = accountsRef.current;
    const growth = growthRef.current;
    const hint = hintRef.current;

    const icons = iconRefs.current.filter(
      (element): element is HTMLDivElement => Boolean(element),
    );

    if (
      !section ||
      !stage ||
      !title ||
      !accounts ||
      !growth ||
      !hint ||
      icons.length !== SOCIAL_PLATFORMS.length
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const floatingElements = icons
      .map((icon) => icon.querySelector<HTMLElement>("[data-floating-icon]"))
      .filter((element): element is HTMLElement => Boolean(element));

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let refreshFrame = 0;

    const context = gsap.context(() => {
      /*
       * Prevent elements flashing before GSAP applies the timeline.
       */

      gsap.set(icons, {
        autoAlpha: 0,
        x: 0,
        y: 0,
        scale: 0.15,
        rotation: 0,
        force3D: true,
      });

      gsap.set(title, {
        autoAlpha: 0,
        y: () => Math.min(window.innerHeight * 0.32, 280),
        scale: 0.92,
        filter: "blur(12px)",
      });

      gsap.set([accounts, growth], {
        autoAlpha: 0,
        y: 50,
        scale: 0.92,
      });

      gsap.set(hint, {
        autoAlpha: 0,
        y: 12,
      });

      /*
       * Transform-only floating animations.
       *
       * The outer icon moves to its layout position.
       * The inner element handles floating, preventing transform conflicts.
       */

      const floatingAnimations = floatingElements.map((element, index) => {
        const distance = 7 + (index % 3) * 2;
        const duration = 1.8 + (index % 4) * 0.22;
        const direction = index % 2 === 0 ? -1 : 1;

        return gsap.to(element, {
          y: direction * distance,
          rotation: direction * 2.5,
          duration,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          paused: true,
          force3D: true,
        });
      });

      const startFloating = () => {
        floatingAnimations.forEach((animation) => {
          animation.play();
        });
      };

      const pauseFloating = () => {
        floatingAnimations.forEach((animation) => {
          animation.pause();
        });
      };

      if (prefersReducedMotion) {
        icons.forEach((icon, index) => {
          const position =
            window.innerWidth < 640
              ? MOBILE_POSITIONS[index]
              : window.innerWidth < 1024
                ? TABLET_POSITIONS[index]
                : DESKTOP_POSITIONS[index];

          gsap.set(icon, {
            autoAlpha: 1,
            x: position.x,
            y: position.y,
            rotation: position.rotation,
            scale: position.scale ?? 1,
          });
        });

        gsap.set(title, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        });

        gsap.set(accounts, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
        });

        return;
      }

      const media = gsap.matchMedia();

      media.add(
        {
          desktop: "(min-width: 1024px)",
          tablet: "(min-width: 640px) and (max-width: 1023px)",
          mobile: "(max-width: 639px)",
        },
        (mediaContext) => {
          const conditions = mediaContext.conditions;

          let positions = DESKTOP_POSITIONS;

          if (conditions?.mobile) {
            positions = MOBILE_POSITIONS;
          } else if (conditions?.tablet) {
            positions = TABLET_POSITIONS;
          }

          const timeline = gsap.timeline({
            onUpdate: () => {
              /*
               * Forces subpixel positions onto GPU compositor layers.
               */
              icons.forEach((icon) => {
                icon.style.transform = icon.style.transform;
              });
            },

            scrollTrigger: {
              trigger: section,
              start: "top top",

              end: () =>
                `+=${Math.round(
                  window.innerHeight * (window.innerWidth < 640 ? 5.4 : 6),
                )}`,

              /*
               * IMPORTANT:
               * Pin the actual flow section, not the inner stage.
               */
              pin: section,
              pinSpacing: true,

              scrub: 1.05,
              anticipatePin: 1,
              invalidateOnRefresh: true,

              snap: {
                snapTo: "labelsDirectional",

                duration: {
                  min: 0.25,
                  max: 0.65,
                },

                delay: 0.1,
                ease: "power3.inOut",
              },

              onEnter: startFloating,
              onEnterBack: startFloating,
              onLeave: pauseFloating,
              onLeaveBack: pauseFloating,
            },
          });

          /*
           * State 1:
           * Icons appear tightly from the center.
           */

          timeline
            .to(
              icons,
              {
                autoAlpha: 1,
                scale: 0.45,
                duration: 0.38,
                stagger: {
                  each: 0.04,
                  from: "center",
                },
                ease: "power2.out",
              },
              0,
            )

            /*
             * Icons spread into an elliptical composition.
             */

            .to(
              icons,
              {
                x: (index) => positions[index].x,
                y: (index) => positions[index].y,
                rotation: (index) => positions[index].rotation,
                scale: (index) => positions[index].scale ?? 1,
                duration: 1.15,
                stagger: {
                  each: 0.045,
                  from: "center",
                },
                ease: "back.out(1.45)",
                force3D: true,
              },
              0.22,
            )

            /*
             * Slight settle after the outward movement.
             */

            .to(
              icons,
              {
                scale: (index) => (positions[index].scale ?? 1) * 0.97,
                duration: 0.22,
                stagger: 0.015,
                ease: "sine.inOut",
              },
              1.18,
            )
            .to(
              icons,
              {
                scale: (index) => positions[index].scale ?? 1,
                duration: 0.24,
                stagger: 0.015,
                ease: "sine.out",
              },
              1.4,
            );

          /*
           * State 2:
           * Title rises from behind the icons and sticks at the top.
           */

          timeline.fromTo(
            title,
            {
              autoAlpha: 0,
              y: () => Math.min(window.innerHeight * 0.32, 280),
              scale: 0.92,
              filter: "blur(12px)",
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.78,
              ease: "power3.out",
              immediateRender: false,
            },
            1.34,
          );

          timeline.fromTo(
            hint,
            {
              autoAlpha: 0,
              y: 12,
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.36,
              ease: "power2.out",
            },
            1.85,
          );

          timeline.addLabel("social-title", 2.05);

          /*
           * State 3:
           * Managed client accounts.
           */

          timeline.fromTo(
            accounts,
            {
              autoAlpha: 0,
              y: 55,
              scale: 0.9,
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.72,
              ease: "power3.out",
              immediateRender: false,
            },
            2.12,
          );

          timeline.addLabel("managed-accounts", 2.84);

          /*
           * Keep the account metric briefly visible.
           */

          timeline.to({}, { duration: 0.55 });

          /*
           * State 4:
           * Hide account count and reveal client growth.
           */

          timeline.to(accounts, {
            autoAlpha: 0,
            y: -45,
            scale: 0.94,
            duration: 0.42,
            ease: "power2.in",
          });

          timeline.fromTo(
            growth,
            {
              autoAlpha: 0,
              y: 55,
              scale: 0.9,
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.72,
              ease: "power3.out",
              immediateRender: false,
            },
            "<0.18",
          );

          timeline.addLabel("growth-rate", timeline.duration());

          /*
           * Hold the final state before releasing the section.
           */

          timeline.to({}, { duration: 0.7 });

          return () => {
            timeline.kill();
          };
        },
      );

      refreshFrame = window.requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      return () => {
        floatingAnimations.forEach((animation) => {
          animation.kill();
        });

        media.revert();
      };
    }, section);

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      context.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Social media management"
      className="relative isolate
      z-0
      h-svh
      w-fulll bg-[#102A33]"
    >
      <div
        ref={stageRef}
        className="
          relative
          h-svh
          w-full
          overflow-hidden
          bg-[#102A33]
        "
      >
        {/* Soft background depth */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-[65vw]
            max-h-212.5
            w-[65vw]
            max-w-212.5
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#335863]/20
            blur-[90px]
          "
        />

        {/* Static title behind all social icons */}

        <div className="pointer-events-none absolute inset-0 z-10">
          <SectionHeading
            ref={titleRef}
            titleClassName="flex
            w-full
            items-start
            justify-center
            whitespace-nowrap
            text-center
            text-[clamp(3rem,10.5vw,11.5rem)]
            font-light
            leading-[0.8]
            tracking-[-0.075em]
            text-[#E6F0E3]"
            subtitleClassName="text-[#E6F0E3]"
            number="06"
            title="Social Management"
            subtitle="Building brands where their audience already lives."
            className="
    absolute
    left-1/2
    top-5
    z-50

    w-[92vw]

    -translate-x-1/2

    md:top-7
  "
          />
        </div>

        {/* Metrics */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-20
            flex
            items-center
            justify-center
            px-5
          "
        >
          <div
            ref={accountsRef}
            className="
              invisible
              absolute
              flex
              flex-col
              items-center
              text-center
              opacity-0
              will-change-transform
            "
          >
            <p
              className="
                text-[clamp(5.5rem,14vw,13rem)]
                font-light
                leading-none
                tracking-[-0.075em]
                text-white
              "
            >
              {MANAGED_ACCOUNTS}
            </p>

            <p
              className="
                mt-5
                max-w-md
                text-sm
                uppercase
                tracking-[0.3em]
                text-[#B9CEC7]
                sm:text-base
              "
            >
              Client accounts managed
            </p>
          </div>

          <div
            ref={growthRef}
            className="
              invisible
              absolute
              flex
              flex-col
              items-center
              text-center
              opacity-0
              will-change-transform
            "
          >
            <p
              className="
                text-[clamp(5.5rem,14vw,13rem)]
                font-light
                leading-none
                tracking-[-0.075em]
                text-[#FED623]
              "
            >
              {AVERAGE_GROWTH}
            </p>

            <p
              className="
                mt-5
                max-w-md
                text-sm
                uppercase
                tracking-[0.3em]
                text-[#B9CEC7]
                sm:text-base
              "
            >
              Average client account growth
            </p>
          </div>
        </div>

        {/* Social logos */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            z-30
            h-0
            w-0
          "
        >
          {SOCIAL_PLATFORMS.map((platform, index) => (
            <div
              key={platform.name}
              ref={(element) => {
                iconRefs.current[index] = element;
              }}
              className="
                invisible
                absolute
                left-0
                top-0
                opacity-0
                will-change-transform
              "
            >
              <div
                data-floating-icon
                className="
                  relative
                  flex
                  h-[clamp(4.2rem,7vw,6.5rem)]
                  w-[clamp(4.2rem,7vw,6.5rem)]
                  -translate-x-1/2
                  -translate-y-1/2
                  transform-gpu
                  items-center
                  justify-center
                  rounded-[1.6rem]

                  border
                  border-white/15
                  bg-white/9
                  p-[clamp(0.9rem,1.7vw,1.4rem)]
                  shadow-[0_18px_45px_rgba(0,0,0,0.3),inset_1px_1px_1px_rgba(255,255,255,0.14)]
                  backdrop-blur-md
                  will-change-transform
                  overflow-hidden
                "
              >
                <Image
                  src={platform.icon}
                  alt={platform.name}
                  fill
                  aria-hidden="true"
                  draggable={false}
                  className="
                    h-full
                    w-full
                    select-none
                    object-contain
                  "
                />
              </div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}

        <div
          ref={hintRef}
          className="
            pointer-events-none
            absolute
            bottom-8
            left-1/2
            z-40
            -translate-x-1/2
            whitespace-nowrap
            text-center
            text-xs
            font-medium
            uppercase
            tracking-[0.25em]
            text-white
            opacity-0
            mix-blend-difference
          "
        >
          Scroll to explore
        </div>
      </div>
    </section>
  );
}
