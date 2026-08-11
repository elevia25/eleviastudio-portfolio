"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Trophy } from "lucide-react";
import { useLayoutEffect, useRef } from "react";

/*
 * IMPORTANT:
 * Change this import to the real path of your existing Elevro HeroCanvas.
 */
import HeroCanvas from "@/components/HeroCanvas";
import SectionHeading, {
  SECTION_SHELL_CLASS,
  SECTION_VIEWPORT_CLASS,
} from "./SectionHeading";

/* ==========================================================================
   TYPES
   ========================================================================== */

type ProjectType = "web" | "app";

type ProjectVisual = "elevro" | "kpwood" | "shuruup" | "anmol";

type ProjectIdentity =
  | {
      type: "logo";
      src: string;
      alt: string;
    }
  | {
      type: "text";
      value: string;
    };

type Project = {
  code: string;
  category: string;

  type: ProjectType;
  visual: ProjectVisual;

  identity: ProjectIdentity;

  background: string;
  foreground: string;
  accent: string;

  href?: string;
};

/* ==========================================================================
   DATA
   ========================================================================== */

const PROJECTS: Project[] = [
  {
    code: "W — 001",
    category: "Enterprise Engineering",

    type: "web",
    visual: "elevro",

    identity: {
      type: "logo",
      src: "/projects/elevro.svg",
      alt: "Elevro",
    },

    background: "#221129",
    foreground: "#F1E8F4",
    accent: "#A25858",

    href: "https://elevro.com",
  },

  {
    code: "W — 002",
    category: "Carpentry & Interiors",

    type: "web",
    visual: "kpwood",

    identity: {
      type: "logo",
      src: "/projects/kp_logo.svg",
      alt: "KP Wood Craft",
    },

    background: "#1C1007",
    foreground: "#F7F0E6",
    accent: "#C8843C",

    href: "https://kpwoodcraft.in",
  },

  {
    code: "W — 003",
    category: "Private Markets",

    type: "web",
    visual: "shuruup",

    identity: {
      type: "text",
      value: "Shuruup",
    },

    background: "#000000",
    foreground: "#F5F5F5",
    accent: "#5C8FC7",

    href: "https://shuruup.com",
  },

  {
    code: "W — 004",
    category: "Flutter · iOS + Android",

    type: "app",
    visual: "anmol",

    identity: {
      type: "text",
      value: "Anmol Medicare",
    },

    background: "#07151D",
    foreground: "#F0F7FA",
    accent: "#2398D0",
  },
];

export default function SelectedWorkConceptA() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);

  const identityRefs = useRef<Array<HTMLDivElement | null>>([]);

  const visualRefs = useRef<Array<HTMLDivElement | null>>([]);

  const metaRefs = useRef<Array<HTMLDivElement | null>>([]);

  const webHeadingRef = useRef<HTMLDivElement>(null);

  const appHeadingRef = useRef<HTMLDivElement>(null);

  const scrollHintRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    const stage = stageRef.current;

    const webHeading = webHeadingRef.current;

    const appHeading = appHeadingRef.current;

    const scrollHint = scrollHintRef.current;

    if (!section || !stage || !webHeading || !appHeading || !scrollHint) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const layers = layerRefs.current;

    const identities = identityRefs.current;

    const visuals = visualRefs.current;

    const metas = metaRefs.current;

    let refreshFrame = 0;

    const context = gsap.context(() => {
      /* ====================================================================
         STAGE
         ==================================================================== */

      gsap.set(stage, {
        backgroundColor: PROJECTS[0].background,

        color: PROJECTS[0].foreground,
      });

      gsap.set(webHeading, {
        autoAlpha: 0,
        y: -18,
      });

      gsap.set(appHeading, {
        autoAlpha: 0,
        y: 18,
      });

      gsap.set(scrollHint, {
        autoAlpha: 0,
        y: 10,
      });

      /* ====================================================================
         PROJECT INITIAL STATE
         ==================================================================== */

      layers.forEach((layer, index) => {
        if (!layer) return;

        gsap.set(layer, {
          autoAlpha: index === 0 ? 1 : 0,

          pointerEvents: index === 0 ? "auto" : "none",
        });

        prepareSpecialVisual(layer);
      });

      identities.forEach((identity) => {
        if (!identity) return;

        gsap.set(identity, {
          autoAlpha: 0,

          /*
           * Starts from the SCREEN bottom,
           * not from the bottom of its own container.
           */
          y: () => window.innerHeight * 0.62,

          scale: 0.94,

          filter: "blur(18px)",

          force3D: true,
        });
      });

      visuals.forEach((visual) => {
        if (!visual) return;

        gsap.set(visual, {
          autoAlpha: 0,

          x: 85,

          scale: 0.9,

          force3D: true,
        });
      });

      metas.forEach((meta) => {
        if (!meta) return;

        gsap.set(meta, {
          autoAlpha: 0,
          y: 16,
        });
      });

      /* ====================================================================
         MASTER TIMELINE
         ==================================================================== */

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,

          start: "top top",

          end: () => `+=${Math.round(window.innerHeight * 13.5)}`,

          pin: section,

          pinSpacing: true,

          scrub: 1.05,

          anticipatePin: 1,

          invalidateOnRefresh: true,

          snap: {
            snapTo: "labelsDirectional",

            duration: {
              min: 0.25,
              max: 0.7,
            },

            delay: 0.08,

            ease: "power3.inOut",
          },
        },
      });

      /* ====================================================================
         WEB DESIGN HEADER
         ==================================================================== */

      timeline.to(
        webHeading,
        {
          autoAlpha: 1,
          y: 0,

          duration: 0.48,

          ease: "power3.out",
        },
        0,
      );

      timeline.to(
        scrollHint,
        {
          autoAlpha: 1,
          y: 0,

          duration: 0.35,
        },
        0.25,
      );

      /* ====================================================================
         EACH PROJECT
         ==================================================================== */

      PROJECTS.forEach((project, projectIndex) => {
        const layer = layers[projectIndex];

        const identity = identities[projectIndex];

        const visual = visuals[projectIndex];

        const meta = metas[projectIndex];

        if (!layer || !identity || !visual || !meta) {
          return;
        }

        /* ================================================================
             TRANSITION INTO NEXT PROJECT
             ================================================================ */

        if (projectIndex > 0) {
          const previousLayer = layers[projectIndex - 1];

          timeline.to(stage, {
            backgroundColor: project.background,

            color: project.foreground,

            duration: 0.72,

            ease: "power2.inOut",
          });

          timeline.set(
            layer,
            {
              autoAlpha: 1,
              pointerEvents: "auto",
            },
            "<0.25",
          );

          if (previousLayer) {
            timeline.set(
              previousLayer,
              {
                autoAlpha: 0,

                pointerEvents: "none",
              },
              "<",
            );
          }
        }

        /* ================================================================
             SWITCH WEB → APP HEADER
             ================================================================ */

        if (projectIndex === 3) {
          timeline.to(
            webHeading,
            {
              autoAlpha: 0,

              y: -16,

              duration: 0.35,
            },
            "<",
          );

          timeline.to(
            appHeading,
            {
              autoAlpha: 1,

              y: 0,

              duration: 0.5,

              ease: "power3.out",
            },
            "<0.12",
          );
        }

        /* ================================================================
             META
             ================================================================ */

        timeline.to(
          meta,
          {
            autoAlpha: 1,

            y: 0,

            duration: 0.32,

            ease: "power2.out",
          },
          projectIndex === 0 ? "<0.1" : "<0.15",
        );

        /* ================================================================
             IDENTITY COMES FROM VIEWPORT BOTTOM
             ================================================================ */

        timeline.to(
          identity,
          {
            autoAlpha: 1,

            y: 0,

            scale: 1,

            filter: "blur(0px)",

            duration: 0.9,

            ease: "power4.out",
          },
          "<0.08",
        );

        /* ================================================================
             RIGHT VISUAL
             ================================================================ */

        timeline.to(
          visual,
          {
            autoAlpha: 1,

            x: 0,

            scale: 1,

            duration: 0.78,

            ease: "power4.out",
          },
          "<0.2",
        );

        /* ================================================================
             PROJECT-SPECIFIC HERO SEQUENCE
             ================================================================ */

        appendSpecialVisualAnimation(timeline, layer, project.visual);

        timeline.addLabel(`project-${projectIndex}`);

        /* ================================================================
             HOLD
             ================================================================ */

        timeline.to(
          {},
          {
            duration: project.visual === "shuruup" ? 0.65 : 0.8,
          },
        );

        /* ================================================================
             LAST PROJECT
             ================================================================ */

        if (projectIndex === PROJECTS.length - 1) {
          timeline.to(
            {},
            {
              duration: 0.65,
            },
          );

          return;
        }

        /* ================================================================
             EXIT
             ================================================================ */

        timeline.to(meta, {
          autoAlpha: 0,

          y: -15,

          duration: 0.3,
        });

        timeline.to(
          identity,
          {
            autoAlpha: 0,

            y: -85,

            scale: 0.96,

            filter: "blur(10px)",

            duration: 0.48,

            ease: "power3.in",
          },
          "<",
        );

        timeline.to(
          visual,
          {
            autoAlpha: 0,

            x: 70,

            scale: 0.94,

            duration: 0.48,

            ease: "power3.in",
          },
          "<0.05",
        );
      });

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
      aria-label="Selected projects"
      className={`${SECTION_SHELL_CLASS} z-0 h-svh`}
    >
      <div
        ref={stageRef}
        className={SECTION_VIEWPORT_CLASS}
      >
        {/* ========================================================
            GLOBAL TEXTURE
            ======================================================== */}

        <div
          aria-hidden
          className="
            pointer-events-none
            absolute
            inset-0
            z-0
            opacity-40
          "
          style={{
            backgroundImage: `
              radial-gradient(
                circle at 18% 22%,
                rgba(255,255,255,.025),
                transparent 26%
              ),

              radial-gradient(
                circle at 78% 74%,
                rgba(0,0,0,.18),
                transparent 35%
              )
            `,
          }}
        />

        {/* ========================================================
            WEB HEADING
            ======================================================== */}

        <SectionHeading
          ref={webHeadingRef}
          number="03"
          title="Web Design"
          subtitle="Digital experiences built around the brand."
          className="opacity-0"
        />

        {/* ========================================================
            APP HEADING
            ======================================================== */}

        <SectionHeading
          ref={appHeadingRef}
          number="04"
          title="App Development"
          subtitle="Turning an idea into something people can use."
          className="opacity-0"
        />

        {/* ========================================================
            PROJECTS
            ======================================================== */}

        {PROJECTS.map((project, projectIndex) => (
          <div
            key={project.code}
            ref={(element) => {
              layerRefs.current[projectIndex] = element;
            }}
            className="
                invisible
                absolute
                inset-0
                z-10
                opacity-0
              "
          >
            {/* ==================================================
                  PROJECT META
                  ================================================== */}

            <div
              ref={(element) => {
                metaRefs.current[projectIndex] = element;
              }}
              className="
                  absolute
                  bottom-6
                  left-5
                  z-[70]

                  opacity-0

                  md:bottom-9
                  md:left-10
                "
            >
              <p
                className="
                    text-[8px]
                    uppercase
                    tracking-[0.28em]
                    opacity-40

                    md:text-[9px]
                  "
              >
                {project.code}
              </p>

              <p
                className="
                    mt-1.5
                    text-[9px]
                    uppercase
                    tracking-[0.18em]

                    md:text-[10px]
                  "
              >
                {project.category}
              </p>
            </div>

            {/* ==================================================
                  IDENTITY — LEFT
                  ================================================== */}

            <div
              className="
                  absolute

                  left-5
                  top-[10.5rem]

                  z-30

                  w-[90vw]

                  md:left-[5vw]
                  md:top-1/2
                  md:w-[39vw]

                  md:-translate-y-1/2
                "
            >
              <div
                ref={(element) => {
                  identityRefs.current[projectIndex] = element;
                }}
                className="
                    will-change-[transform,opacity,filter]
                  "
              >
                <ProjectIdentity project={project} />
              </div>
            </div>

            {/* ==================================================
                  VISUAL — RIGHT
                  ================================================== */}

            <div
              className="
                  absolute

                  left-1/2

                  z-20
                h-full
                  w-[96vw]

                  -translate-x-1/2

                  md:bottom-auto
                  md:right-0
                  md:top-1/2

                  md:w-[55vw]

                  md:translate-x-0
                  md:-translate-y-1/2

                  xl:right-[3vw]
                  xl:w-[54vw]
                "
            >
              <div
                ref={(element) => {
                  visualRefs.current[projectIndex] = element;
                }}
                className="
                    relative
                    h-full
                    w-full

                    opacity-0

                    will-change-transform
                  "
              >
                <ProjectHeroVisual project={project} />
              </div>
            </div>

            {/* ==================================================
                  VIEW PROJECT
                  ================================================== */}

            {project.href && (
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="
                    absolute
                    top-7
                    right-6
                    z-[80]

                    hidden

                    items-center
                    gap-2

                    text-[8px]
                    uppercase
                    tracking-[0.24em]

                    opacity-50

                    transition-opacity
                    duration-300

                    hover:opacity-100

                    md:flex
                    md:right-10
                  "
              >
                View project
                <ArrowRight size={13} />
              </a>
            )}
          </div>
        ))}

        {/* ========================================================
            HINT
            ======================================================== */}

        <div
          ref={scrollHintRef}
          className="
            pointer-events-none

            absolute
            bottom-7
            left-1/2
            z-[100]

            -translate-x-1/2

            whitespace-nowrap

            text-[7px]
            uppercase
            tracking-[0.27em]

            opacity-0

            md:text-[8px]
          "
        >
          Scroll to explore ↓
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   IDENTITY
   ========================================================================== */

function ProjectIdentity({ project }: { project: Project }) {
  if (project.identity.type === "logo") {
    return (
      <div className="relative">
        <Image
          src={project.identity.src}
          alt={project.identity.alt}
          width={620}
          height={220}
          priority={false}
          className="
            h-auto
            max-h-[140px]
            w-[65vw]

            object-contain
            object-left

            md:max-h-[190px]
            md:w-[34vw]
          "
        />

        <IdentityUnderline color={project.accent} />
      </div>
    );
  }

  return (
    <div>
      <h2
        className="
          max-w-[760px]

          text-[clamp(4rem,8vw,9rem)]

          font-light
          leading-[0.79]

          tracking-[-0.085em]
        "
      >
        {project.identity.value}
      </h2>

      <IdentityUnderline color={project.accent} />
    </div>
  );
}

function IdentityUnderline({ color }: { color: string }) {
  return (
    <div
      className="
        mt-7
        h-px
        w-20
      "
      style={{
        backgroundColor: color,
      }}
    />
  );
}

/* ==========================================================================
   VISUAL SWITCH
   ========================================================================== */

function ProjectHeroVisual({ project }: { project: Project }) {
  switch (project.visual) {
    case "elevro":
      return <ElevroHeroVisual />;

    case "kpwood":
      return <KPWoodHeroVisual />;

    case "shuruup":
      return <ShuruupHeroVisual />;

    case "anmol":
      return <AnmolHeroVisual />;
  }
}

/* ==========================================================================
   ELEVRO
   ========================================================================== */

   function ElevroHeroVisual() {
     return (
       <div className="relative h-full w-full">
         {/* ========================================================
            AMBIENT GLOW
            ======================================================== */}

         <div
           aria-hidden
           className="
            pointer-events-none
            absolute
  
            left-[5%]
            top-[57%]
  
            h-[52%]
            w-[105%]
  
            -translate-y-1/2
  
            rounded-full
  
            bg-[#A25858]/20
            blur-[90px]
  
            md:left-1/2
            md:top-1/2
  
            md:h-[55%]
            md:w-[58%]
  
            md:-translate-x-1/2
          "
         />

         {/* ========================================================
            HERO CANVAS
            ======================================================== */}

         <div
           className="
            absolute
  
            /*
             * MOBILE
             *
             * Start near the left edge and give Three.js a much
             * wider viewport. Any excess is allowed to clip on
             * the RIGHT side of the screen.
             */
            left-[3%]
            top-[57%]
  
            h-[60%]
            w-[115%]
  
            -translate-y-1/2
  
            /*
             * TABLET
             */
            sm:left-[4%]
            sm:h-[63%]
            sm:w-full
  
            /*
             * DESKTOP
             *
             * Return to the previous centered composition.
             */
            md:left-1/2
            md:top-1/2
  
            md:h-[68%]
            md:w-[72%]
  
            md:-translate-x-1/2
  
            lg:h-[70%]
            lg:w-[68%]
  
            xl:h-[72%]
            xl:w-[66%]
  
            will-change-transform
          "
         >
           <HeroCanvas variant="orb" />
         </div>
       </div>
     );
   }

/* ==========================================================================
   KP WOOD CRAFT
   ========================================================================== */

function KPWoodHeroVisual() {
  return (
    <div
      className="
        relative
        h-full
        w-full
      "
    >
      <div
        className="
          absolute
          overflow-hidden

          border
          border-[#C8843C]/20

          bg-[#110904]
          h-full
          w-full
          shadow-[0_40px_100px_rgba(0,0,0,.42)]
        "
      >
        <Image
          src="/projects/photo-1.avif"
          alt="Master craftsman woodworking"
          fill
          sizes="55vw"
          className="
            object-cover
            brightness-[0.72]
          "
          onLoad={() => {
            ScrollTrigger.refresh();
          }}
        />

        {/* image depth */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
          "
          style={{
            background: `
              linear-gradient(
                90deg,
                rgba(28,16,7,.5),
                transparent 30%,
                transparent 75%,
                rgba(0,0,0,.2)
              )
            `,
          }}
        />
      </div>

      {/* experience badge */}

      <div
        data-kp-badge
        className="
          absolute

          bottom-[8%]
          left-[-1%]

          z-20

          flex
          items-center
          gap-3

          border
          border-[#C8843C]/30

          bg-[#1C1007]/95

          px-4
          py-3

          opacity-0

          shadow-2xl

          backdrop-blur-sm

          md:px-5
          md:py-4
        "
      >
        <Trophy size={20} className="text-[#C8843C]" />

        <div>
          <strong
            className="
              block
              text-[10px]
              font-medium
              text-[#F7F0E6]

              md:text-sm
            "
          >
            25+ Years Experience
          </strong>

          <span
            className="
              text-[7px]
              text-[#8C6845]

              md:text-[10px]
            "
          >
            Master Carpenter · All India
          </span>
        </div>
      </div>

      {/* tiny craft markers */}

      <div
        className="
          absolute
          right-[1%]
          top-[1%]

          text-[7px]
          uppercase
          tracking-[0.3em]

          text-[#C8843C]/40
        "
      >
        Since 1998
      </div>
    </div>
  );
}

/* ==========================================================================
   SHURUUP
   ========================================================================== */

   function ShuruupHeroVisual() {
     return (
       <div
         className="
          relative
  
          flex
          h-full
          w-full
  
          items-center
          justify-center
        "
       >
         {/* subtle background depth */}

         <div
           aria-hidden
           className="
            pointer-events-none
  
            absolute
            left-1/2
            top-1/2
  
            h-[58%]
            w-[72%]
  
            -translate-x-1/2
            -translate-y-1/2
  
            rounded-full
  
            bg-[#5C8FC7]/[0.07]
  
            blur-[90px]
          "
         />

         {/* VIDEO */}

         <div
           className="
            relative
            z-10
  
            flex
            h-[68%]
            w-[86%]
  
            max-w-[860px]
  
            items-center
            justify-center
  
            overflow-hidden
  
            md:h-[72%]
            md:w-[82%]
  
            xl:h-[74%]
            xl:w-[78%]
          "
         >
           <video
             autoPlay
             muted
             playsInline
             loop
             preload="metadata"
             className="
              block
  
              max-h-full
              max-w-full
  
              object-contain
              object-center
            "
           >
             <source src="/projects/home_video.mp4" type="video/mp4" />
             Your browser does not support the video tag.
           </video>
         </div>
       </div>
     );
   }

/* ==========================================================================
   ANMOL MEDICARE
   ========================================================================== */
   function AnmolHeroVisual() {
     return (
       <div
         className="
          relative
          h-full
          w-full
        "
       >
         {/* ========================================================
            GLOW
            ======================================================== */}

         <div
           aria-hidden
           className="
            pointer-events-none
            absolute
  
            left-1/2
            top-[65%]
  
            h-[44%]
            w-[55%]
  
            -translate-x-1/2
            -translate-y-1/2
  
            rounded-full
  
            bg-[#2398D0]/15
  
            blur-[85px]
  
            md:left-1/2
            md:top-1/2
  
            md:h-[58%]
            md:w-[58%]
          "
         />

         {/* ========================================================
            ANMOL APP IMAGE
            ======================================================== */}

         <div
           data-anmol-phone
           className="
            absolute
            z-20
  
            /*
             * MOBILE:
             * centered and below heading/content
             */
            left-1/2
            top-[67%]
  
            h-[54vh]
            w-[76vw]
  
            max-h-[540px]
            max-w-[310px]
  
            -translate-x-1/2
            -translate-y-1/2
  
            opacity-0
  
            /*
             * TABLET
             */
            sm:top-[66%]
  
            sm:h-[58vh]
            sm:w-[58vw]
  
            sm:max-w-[325px]
  
            /*
             * DESKTOP:
             * back to previous centered style
             */
            md:left-1/2
            md:top-1/2
  
            md:h-[76vh]
            md:w-[48%]
  
            md:max-h-[720px]
            md:max-w-[345px]
  
            lg:h-[78vh]
            lg:w-[46%]
  
            lg:max-w-[355px]
  
            xl:h-[80vh]
            xl:w-[44%]
  
            xl:max-w-[365px]
  
            will-change-[transform,opacity]
          "
         >
           <Image
             src="/projects/anmol-mobile.jpeg"
             alt="Anmol Medicare mobile application"
             fill
             priority={false}
             sizes="
              (max-width: 639px) 76vw,
              (max-width: 767px) 58vw,
              (max-width: 1279px) 48vw,
              44vw
            "
             className="
              select-none
              object-contain
              object-center
            "
             draggable={false}
           />
         </div>
       </div>
     );
   }



/* ==========================================================================
   SPECIAL ANIMATION PREPARATION
   ========================================================================== */

function prepareSpecialVisual(layer: HTMLElement) {
  /* ----------------------------------------------------------------------
     KP
     ---------------------------------------------------------------------- */

  const kpBadge = layer.querySelector<HTMLElement>("[data-kp-badge]");

  if (kpBadge) {
    gsap.set(kpBadge, {
      autoAlpha: 0,
      y: 35,
      scale: 0.94,
    });
  }

  /* ----------------------------------------------------------------------
     ANMOL
     ---------------------------------------------------------------------- */

  const anmolPhone = layer.querySelector<HTMLElement>("[data-anmol-phone]");

  if (anmolPhone) {
    gsap.set(anmolPhone, {
      autoAlpha: 0,

      y: 75,

      scale: 0.88,

      rotation: 5,
    });
  }

}

/* ==========================================================================
   SPECIAL TIMELINES
   ========================================================================== */

function appendSpecialVisualAnimation(
  timeline: gsap.core.Timeline,
  layer: HTMLElement,
  visual: ProjectVisual,
) {
  /* ----------------------------------------------------------------------
     ELEVRO
     ---------------------------------------------------------------------- */

  if (visual === "elevro") {
    timeline.to(
      {},
      {
        duration: 0.22,
      },
    );

    return;
  }

  /* ----------------------------------------------------------------------
     KP WOOD CRAFT
     ---------------------------------------------------------------------- */

  if (visual === "kpwood") {
    const badge = layer.querySelector<HTMLElement>("[data-kp-badge]");

    if (badge) {
      timeline.to(
        badge,
        {
          autoAlpha: 1,

          y: 0,

          scale: 1,

          duration: 0.42,

          ease: "back.out(1.6)",
        },
        "<0.16",
      );
    }

    return;
  }

  /* ----------------------------------------------------------------------
     SHURUUP
     ---------------------------------------------------------------------- */

  if (visual === "shuruup") {
    timeline.to({}, { duration: 0.22 });
    return;
  }

  /* ----------------------------------------------------------------------
     ANMOL
     ---------------------------------------------------------------------- */

  if (visual === "anmol") {
    const phone = layer.querySelector<HTMLElement>("[data-anmol-phone]");

    if (phone) {
      timeline.to(
        phone,
        {
          autoAlpha: 1,

          y: 0,

          scale: 1,

          rotation: 0,

          duration: 0.68,

          ease: "power4.out",
        },
        "<0.12",
      );
    }

  }
}