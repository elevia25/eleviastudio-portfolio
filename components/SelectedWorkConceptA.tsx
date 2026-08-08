"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CSSProperties, forwardRef, type ReactNode, useLayoutEffect, useRef } from "react";

import { WORK_PROJECTS, type WorkProject } from "../utils/work";

export default function SelectedWorkConceptA() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const titleRefs = useRef<Array<HTMLHeadingElement | null>>([]);
  const codeRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const visualRefs = useRef<Array<HTMLDivElement | null>>([]);
  const intentRefs = useRef<Array<HTMLDivElement | null>>([]);
  const benefitRefs = useRef<Array<HTMLDivElement | null>>([]);

  const hintRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const hint = hintRef.current;

    if (!section || !stage || !hint) return;

    gsap.registerPlugin(ScrollTrigger);

    const layers = layerRefs.current;
    const titles = titleRefs.current;
    const codes = codeRefs.current;
    const visuals = visualRefs.current;
    const intents = intentRefs.current;
    const benefits = benefitRefs.current;

    let refreshFrame = 0;

    const getFactor = () => {
      if (window.innerWidth < 480) {
        return {
          x: 0.38,
          y: 0.55,
        };
      }

      if (window.innerWidth < 768) {
        return {
          x: 0.48,
          y: 0.62,
        };
      }

      return {
        x: 1,
        y: 1,
      };
    };

    const context = gsap.context(() => {
      /*
       * ------------------------------------------------------------
       * INITIAL STATE
       * ------------------------------------------------------------
       */

      gsap.set(stage, {
        backgroundColor: WORK_PROJECTS[0].background,
        color: WORK_PROJECTS[0].foreground,
      });

      layers.forEach((layer, index) => {
        if (!layer) return;

        gsap.set(layer, {
          autoAlpha: index === 0 ? 1 : 0,
          pointerEvents: index === 0 ? "auto" : "none",
        });
      });

      titles.forEach((title) => {
        if (!title) return;

        gsap.set(title, {
          autoAlpha: 0,
          yPercent: 115,
          force3D: true,
        });
      });

      codes.forEach((code) => {
        if (!code) return;

        gsap.set(code, {
          autoAlpha: 0,
          y: 25,
        });
      });

      intents.forEach((story) => {
        if (!story) return;

        gsap.set(story, {
          autoAlpha: 0,
          y: 45,
        });
      });

      benefits.forEach((story) => {
        if (!story) return;

        gsap.set(story, {
          autoAlpha: 0,
          y: 45,
        });
      });

      visuals.forEach((visual) => {
        if (!visual) return;

        const core = visual.querySelector<HTMLElement>("[data-core]");

        const pieces = visual.querySelectorAll<HTMLElement>("[data-piece]");

        const lines = visual.querySelectorAll<SVGElement>("[data-line]");

        if (core) {
          gsap.set(core, {
            autoAlpha: 0,
            scale: 0.15,
            rotation: -8,
            force3D: true,
          });
        }

        gsap.set(pieces, {
          autoAlpha: 0,
          scale: 0.2,
          force3D: true,
        });

        gsap.set(lines, {
          opacity: 0,
        });
      });

      gsap.set(hint, {
        autoAlpha: 0,
        y: 10,
      });

      /*
       * ------------------------------------------------------------
       * MAIN SCROLL TIMELINE
       * ------------------------------------------------------------
       */

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",

          end: () => `+=${Math.round(window.innerHeight * 15)}`,

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

            delay: 0.08,
            ease: "power3.inOut",
          },
        },
      });

      WORK_PROJECTS.forEach((project, projectIndex) => {
        const layer = layers[projectIndex];
        const title = titles[projectIndex];
        const code = codes[projectIndex];
        const visual = visuals[projectIndex];
        const intent = intents[projectIndex];
        const benefit = benefits[projectIndex];

        if (!layer || !title || !code || !visual || !intent || !benefit) {
          return;
        }

        const core = visual.querySelector<HTMLElement>("[data-core]");

        const pieces = Array.from(
          visual.querySelectorAll<HTMLElement>("[data-piece]"),
        );

        const lines = Array.from(
          visual.querySelectorAll<SVGElement>("[data-line]"),
        );

        /*
         * ----------------------------------------------------------
         * TRANSITION FROM PREVIOUS PROJECT
         * ----------------------------------------------------------
         */

        if (projectIndex > 0) {
          const previousLayer = layers[projectIndex - 1];

          timeline.to(stage, {
            backgroundColor: project.background,
            color: project.foreground,

            duration: 0.75,
            ease: "power2.inOut",
          });

          timeline.set(
            layer,
            {
              autoAlpha: 1,
              pointerEvents: "auto",
            },
            "<0.35",
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

        /*
         * ----------------------------------------------------------
         * VISUAL FIRST
         * ----------------------------------------------------------
         */

        if (core) {
          timeline.to(core, {
            autoAlpha: 1,
            scale: 1,
            rotation: 0,

            duration: 0.6,
            ease: "back.out(1.4)",
          });
        }

        const factor = getFactor();

        pieces.forEach((piece, pieceIndex) => {
          const finalX = Number(piece.dataset.x ?? 0) * factor.x;

          const finalY = Number(piece.dataset.y ?? 0) * factor.y;

          const startX = Number(piece.dataset.sx ?? 0) * factor.x;

          const startY = Number(piece.dataset.sy ?? 0) * factor.y;

          const startRotation = Number(piece.dataset.sr ?? 0);

          const finalRotation = Number(piece.dataset.r ?? 0);

          timeline.fromTo(
            piece,
            {
              autoAlpha: 0,

              x: startX,
              y: startY,

              scale: 0.25,
              rotation: startRotation,
            },
            {
              autoAlpha: 1,

              x: finalX,
              y: finalY,

              scale: 1,
              rotation: finalRotation,

              duration: 0.75,
              ease: "back.out(1.3)",

              immediateRender: false,
              force3D: true,
            },

            pieceIndex === 0 ? "<0.15" : "<0.07",
          );
        });

        if (lines.length > 0) {
          timeline.to(
            lines,
            {
              opacity: 0.45,

              duration: 0.35,
              stagger: 0.035,
            },
            "<0.2",
          );
        }

        /*
         * ----------------------------------------------------------
         * PROJECT TITLE AFTER VISUAL
         * ----------------------------------------------------------
         */

        timeline.to(
          code,
          {
            autoAlpha: 1,
            y: 0,

            duration: 0.32,
            ease: "power2.out",
          },
          "<0.18",
        );

        timeline.to(
          title,
          {
            autoAlpha: 1,
            yPercent: 0,

            duration: 0.72,
            ease: "power4.out",
          },
          "<0.05",
        );

        if (projectIndex === 0) {
          timeline.to(
            hint,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.3,
            },
            "<0.35",
          );
        }

        timeline.addLabel(`project-${projectIndex}-intro`);

        /*
         * ----------------------------------------------------------
         * WHAT WE SHAPED
         * ----------------------------------------------------------
         */

        timeline.to(
          intent,
          {
            autoAlpha: 1,
            y: 0,

            duration: 0.55,
            ease: "power3.out",
          },
          "+=0.1",
        );

        /*
         * Subtle motion without permanent animation loops.
         */

        timeline.to(
          pieces,
          {
            scale: (index) => (index % 2 === 0 ? 1.035 : 0.98),

            duration: 0.45,
            stagger: 0.025,

            ease: "sine.inOut",
          },
          "<0.08",
        );

        timeline.to(
          pieces,
          {
            scale: 1,

            duration: 0.4,
            stagger: 0.02,

            ease: "sine.out",
          },
          "<0.22",
        );

        timeline.addLabel(`project-${projectIndex}-intent`);

        /*
         * ----------------------------------------------------------
         * BENEFIT
         * ----------------------------------------------------------
         */

        timeline.to(intent, {
          autoAlpha: 0,
          y: -30,

          duration: 0.32,
          ease: "power2.in",
        });

        timeline.fromTo(
          benefit,
          {
            autoAlpha: 0,
            y: 45,
          },
          {
            autoAlpha: 1,
            y: 0,

            duration: 0.55,
            ease: "power3.out",

            immediateRender: false,
          },
          "<0.12",
        );

        timeline.addLabel(`project-${projectIndex}-benefit`);

        /*
         * Last project stays visible.
         */

        if (projectIndex === WORK_PROJECTS.length - 1) {
          timeline.to({}, { duration: 0.6 });
          return;
        }

        /*
         * ----------------------------------------------------------
         * COLLAPSE INTO NEXT PROJECT
         * ----------------------------------------------------------
         */

        timeline.to(
          [benefit, code],
          {
            autoAlpha: 0,
            y: -20,

            duration: 0.3,
          },
          "+=0.3",
        );

        timeline.to(
          title,
          {
            autoAlpha: 0,
            yPercent: -55,

            duration: 0.42,
            ease: "power3.in",
          },
          "<",
        );

        timeline.to(
          pieces,
          {
            x: 0,
            y: 0,

            autoAlpha: 0,
            scale: 0.08,

            duration: 0.58,

            stagger: {
              each: 0.025,
              from: "edges",
            },

            ease: "power3.in",
          },
          "<0.03",
        );

        if (lines.length > 0) {
          timeline.to(
            lines,
            {
              opacity: 0,
              duration: 0.22,
            },
            "<",
          );
        }

        if (core) {
          timeline.to(
            core,
            {
              autoAlpha: 0,
              scale: 0.05,

              duration: 0.42,
              ease: "power3.in",
            },
            "<0.1",
          );
        }
      });

      refreshFrame = window.requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, section);

    return () => {
      window.cancelAnimationFrame(refreshFrame);

      context.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Selected work"
      className="relative isolate z-0 h-svh w-full"
    >
      <div
        ref={stageRef}
        className="
          relative
          h-svh
          w-full
          overflow-hidden
        "
      >
        {/* Permanent label */}

        <div
          className="
            pointer-events-none
            absolute
            left-5
            top-5
            z-50
            text-[10px]
            font-medium
            uppercase
            tracking-[0.3em]
            opacity-50
            md:left-10
            md:top-8
            md:text-xs
          "
        >
          Selected Work
        </div>

        {WORK_PROJECTS.map((project, index) => (
          <div
            key={project.code}
            ref={(element) => {
              layerRefs.current[index] = element;
            }}
            className="
                invisible
                absolute
                inset-0
                opacity-0
              "
          >
            <ProjectHeader
              project={project}
              codeRef={(element) => {
                codeRefs.current[index] = element;
              }}
              titleRef={(element) => {
                titleRefs.current[index] = element;
              }}
            />

            <div
              ref={(element) => {
                visualRefs.current[index] = element;
              }}
              className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-[52%]
                  z-20
                  h-0
                  w-0
                  md:left-[54%]
                  md:top-[49%]
                "
            >
              {index === 0 && <ElevroVisual />}

              {index === 1 && <WoodVisual />}

              {index === 2 && <ShuruupVisual />}

              {index === 3 && <AnmolVisual />}
            </div>

            <ProjectStory
              ref={(element) => {
                intentRefs.current[index] = element;
              }}
              label="What we shaped"
            >
              {project.intent}
            </ProjectStory>

            <ProjectStory
              ref={(element) => {
                benefitRefs.current[index] = element;
              }}
              label="Designed to help"
            >
              {project.benefit}
            </ProjectStory>

            {project.href !== "#" && (
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="
                    absolute
                    right-5
                    top-5
                    z-50
                    flex
                    h-12
                    items-center
                    gap-4
                    px-5
                    text-sm
                    transition-transform
                    duration-300
                    hover:scale-[1.04]
                    md:right-10
                    md:top-8
                  "
                style={{
                  backgroundColor: project.foreground,

                  color: project.background,
                }}
              >
                View project
                <span aria-hidden>↗</span>
              </a>
            )}
          </div>
        ))}

        <div
          ref={hintRef}
          className="
            pointer-events-none
            absolute
            bottom-6
            left-1/2
            z-50
            -translate-x-1/2
            whitespace-nowrap
            text-[10px]
            uppercase
            tracking-[0.27em]
            opacity-0
            mix-blend-difference
          "
        >
          Scroll to explore ↓
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   HEADER
   ========================================================================== */

function ProjectHeader({
  project,
  titleRef,
  codeRef,
}: {
  project: WorkProject;

  titleRef: (element: HTMLHeadingElement | null) => void;

  codeRef: (element: HTMLParagraphElement | null) => void;
}) {
  return (
    <>
      <p
        className="
          absolute
          left-5
          top-[17vh]
          z-30
          text-[10px]
          uppercase
          tracking-[0.22em]
          opacity-55
          md:left-10
          md:top-[24vh]
        "
      >
        {project.category}
      </p>

      <p
        ref={codeRef}
        className="
          absolute
          left-5
          top-[21vh]
          z-30
          text-sm
          md:left-10
          md:top-[28vh]
          md:text-lg
        "
      >
        {project.code}
      </p>

      <div
        className="
          pointer-events-none
          absolute
          left-0
          top-[26vh]
          z-10
          w-full
          overflow-hidden
          px-5
          md:top-[33vh]
          md:px-10
        "
      >
        <h2
          ref={titleRef}
          className="
            whitespace-nowrap
            text-[clamp(4rem,11.8vw,13.5rem)]
            font-light
            leading-[0.76]
            tracking-[-0.085em]
          "
        >
          {project.name}
        </h2>
      </div>
    </>
  );
}

/* ==========================================================================
   STORY
   ========================================================================== */

const ProjectStory = forwardRef<
  HTMLDivElement,
  {
    label: string;
    children: ReactNode;
  }
>(function ProjectStory({ label, children }, ref) {
  return (
    <div
      ref={ref}
      className="
        invisible
        absolute
        bottom-[7vh]
        left-5
        z-40
        max-w-[88vw]
        md:bottom-[8vh]
        md:left-auto
        md:right-[6vw]
        md:max-w-[34vw]
      "
    >
      <p
        className="
          mb-3
          text-[9px]
          font-medium
          uppercase
          tracking-[0.27em]
          opacity-45
        "
      >
        {label}
      </p>

      <p
        className="
          text-[clamp(1.5rem,2.7vw,3.05rem)]
          font-light
          leading-none
          tracking-tighter
        "
      >
        {children}
      </p>
    </div>
  );
});

/* ==========================================================================
   01 — ELEVRO
   ========================================================================== */

function ElevroVisual() {
  const nodes = [
    {
      title: "Quality",
      x: -290,
      y: -135,
      r: -5,
    },
    {
      title: "Product",
      x: 285,
      y: -130,
      r: 5,
    },
    {
      title: "AI",
      x: -320,
      y: 120,
      r: 4,
    },
    {
      title: "Cloud",
      x: 315,
      y: 115,
      r: -4,
    },
    {
      title: "Digital",
      x: 0,
      y: 220,
      r: 2,
    },
  ];

  return (
    <>
      <svg
        className="
          absolute
          left-1/2
          top-1/2
          hidden
          h-130
          w-180
          -translate-x-1/2
          -translate-y-1/2
          overflow-visible
          md:block
        "
        viewBox="-360 -260 720 520"
      >
        {nodes.map((node) => (
          <line
            data-line
            key={node.title}
            x1="0"
            y1="0"
            x2={node.x}
            y2={node.y}
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 8"
          />
        ))}
      </svg>

      <div
        data-core
        className="
          absolute
          left-0
          top-0
          flex
          h-28
          w-28
          -translate-x-1/2
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          bg-[#102A33]
          text-white
          shadow-[0_25px_70px_rgba(16,42,51,0.25)]
          md:h-36
          md:w-36
        "
      >
        <div className="text-center">
          <span className="block text-[9px] uppercase tracking-[0.28em] opacity-50">
            Connected
          </span>

          <span className="mt-1 block text-xl font-light">Elevro</span>
        </div>
      </div>

      {nodes.map((node) => (
        <div
          data-piece
          data-x={node.x}
          data-y={node.y}
          data-r={node.r}
          data-sx="0"
          data-sy="0"
          data-sr="0"
          key={node.title}
          className="
            absolute
            left-0
            top-0
            flex
            h-20
            w-28
            -translate-x-1/2
            -translate-y-1/2
            items-center
            justify-center
            rounded-2xl
            border
            border-[#102A33]/10
            bg-white/65
            px-3
            text-center
            shadow-[0_18px_45px_rgba(16,42,51,0.1)]
            backdrop-blur-sm
            md:h-24
            md:w-36
          "
        >
          <span className="text-[10px] uppercase tracking-[0.12em] text-[#102A33] md:text-xs">
            {node.title}
          </span>
        </div>
      ))}
    </>
  );
}

/* ==========================================================================
   02 — KP WOOD CRAFT
   ========================================================================== */

   function WoodVisual() {
     return (
       <div
         data-core
         className="
          absolute
          left-1/2
          top-1/2
          h-[390px]
          w-[330px]
          -translate-x-1/2
          -translate-y-1/2
          md:h-[520px]
          md:w-[450px]
        "
         style={{
           perspective: "1200px",
         }}
       >
         {/* ============================================================ */}
         {/* BACK FRAME                                                   */}
         {/* ============================================================ */}

         <RealWoodPiece
           x={0}
           y={0}
           sx={-420}
           sy={-250}
           sr={-28}
           className="
            left-[18%]
            top-[3%]
            h-[46%]
            w-[64%]
            rounded-[46%_46%_25%_25%/20%_20%_18%_18%]
          "
           style={{
             transform: "perspective(900px) rotateX(-4deg)",
           }}
         >
           {/* Inner darker edge */}

           <div
             className="
              absolute
              inset-[7%]
              rounded-[43%_43%_22%_22%/18%_18%_16%_16%]
              bg-[#4b2917]
            "
           />

           {/* Upholstered / inset back */}

           <div
             className="
              absolute
              inset-x-[12%]
              bottom-[12%]
              top-[10%]
              overflow-hidden
              rounded-[42%_42%_18%_18%/17%_17%_15%_15%]
              border
              border-white/10
            "
             style={{
               background: `
                radial-gradient(
                  circle at 35% 20%,
                  rgba(255,255,255,.16),
                  transparent 28%
                ),
                linear-gradient(
                  145deg,
                  #b77a4d 0%,
                  #93603d 45%,
                  #704329 100%
                )
              `,
             }}
           >
             {/* Subtle upholstered bands */}

             <div
               className="
                absolute
                left-[12%]
                right-[12%]
                top-[32%]
                h-px
                bg-black/10
              "
             />

             <div
               className="
                absolute
                left-[12%]
                right-[12%]
                top-[65%]
                h-px
                bg-black/10
              "
             />
           </div>
         </RealWoodPiece>

         {/* ============================================================ */}
         {/* BACK SUPPORTS                                                */}
         {/* ============================================================ */}

         <RealWoodPiece
           x={0}
           y={0}
           sx={-350}
           sy={-90}
           sr={-24}
           className="
            left-[13%]
            top-[20%]
            h-[48%]
            w-[7%]
            -rotate-[8deg]
            rounded-full
          "
         />

         <RealWoodPiece
           x={0}
           y={0}
           sx={360}
           sy={-90}
           sr={24}
           className="
            right-[13%]
            top-[20%]
            h-[48%]
            w-[7%]
            rotate-[8deg]
            rounded-full
          "
         />

         {/* ============================================================ */}
         {/* SEAT                                                        */}
         {/* ============================================================ */}

         <RealWoodPiece
           x={0}
           y={0}
           sx={390}
           sy={-120}
           sr={25}
           className="
            left-[11%]
            top-[46%]
            h-[18%]
            w-[78%]
            rounded-[20%_20%_30%_30%/30%_30%_22%_22%]
          "
           style={{
             transform: "perspective(900px) rotateX(58deg)",
           }}
         >
           {/* Seat cushion */}

           <div
             className="
              absolute
              inset-[7%]
              rounded-[18%_18%_27%_27%/27%_27%_20%_20%]
              border
              border-white/10
            "
             style={{
               background: `
                radial-gradient(
                  circle at 35% 25%,
                  rgba(255,255,255,.16),
                  transparent 30%
                ),
                linear-gradient(
                  145deg,
                  #c58a5b,
                  #96603d 52%,
                  #73452b
                )
              `,
             }}
           />
         </RealWoodPiece>

         {/* ============================================================ */}
         {/* LEFT ARMREST                                                 */}
         {/* ============================================================ */}

         <RealWoodPiece
           x={0}
           y={0}
           sx={-420}
           sy={-160}
           sr={-38}
           className="
            left-[1%]
            top-[40%]
            h-[6.5%]
            w-[42%]
            -rotate-[7deg]
            rounded-full
          "
         />

         {/* LEFT ARM SUPPORT */}

         <RealWoodPiece
           x={0}
           y={0}
           sx={-400}
           sy={150}
           sr={-20}
           className="
            left-[9%]
            top-[43%]
            h-[29%]
            w-[6%]
            -rotate-[5deg]
            rounded-full
          "
         />

         {/* ============================================================ */}
         {/* RIGHT ARMREST                                                */}
         {/* ============================================================ */}

         <RealWoodPiece
           x={0}
           y={0}
           sx={420}
           sy={-160}
           sr={38}
           className="
            right-[1%]
            top-[40%]
            h-[6.5%]
            w-[42%]
            rotate-[7deg]
            rounded-full
          "
         />

         {/* RIGHT ARM SUPPORT */}

         <RealWoodPiece
           x={0}
           y={0}
           sx={400}
           sy={150}
           sr={20}
           className="
            right-[9%]
            top-[43%]
            h-[29%]
            w-[6%]
            rotate-[5deg]
            rounded-full
          "
         />

         {/* ============================================================ */}
         {/* FRONT LEFT LEG                                               */}
         {/* ============================================================ */}

         <RealWoodPiece
           x={0}
           y={0}
           sx={-380}
           sy={350}
           sr={25}
           className="
            bottom-[3%]
            left-[20%]
            h-[43%]
            w-[8%]
            origin-top
            -rotate-[7deg]
            rounded-[0.4rem_0.4rem_1rem_1rem]
          "
           darker
         />

         {/* FRONT RIGHT LEG */}

         <RealWoodPiece
           x={0}
           y={0}
           sx={380}
           sy={350}
           sr={-25}
           className="
            bottom-[3%]
            right-[20%]
            h-[43%]
            w-[8%]
            origin-top
            rotate-[7deg]
            rounded-[0.4rem_0.4rem_1rem_1rem]
          "
           darker
         />

         {/* ============================================================ */}
         {/* REAR LEGS                                                    */}
         {/* ============================================================ */}

         <RealWoodPiece
           x={0}
           y={0}
           sx={-330}
           sy={380}
           sr={20}
           className="
            bottom-[7%]
            left-[31%]
            -z-10
            h-[36%]
            w-[6%]
            origin-top
            rotate-[5deg]
            rounded-b-xl
            opacity-80
          "
           darker
         />

         <RealWoodPiece
           x={0}
           y={0}
           sx={330}
           sy={380}
           sr={-20}
           className="
            bottom-[7%]
            right-[31%]
            -z-10
            h-[36%]
            w-[6%]
            origin-top
            -rotate-[5deg]
            rounded-b-xl
            opacity-80
          "
           darker
         />

         {/* ============================================================ */}
         {/* JOINERY DETAILS                                              */}
         {/* ============================================================ */}

         <div
           className="
            absolute
            left-[10%]
            top-[46%]
            z-20
            h-3
            w-3
            rounded-full
            bg-[#4c2917]
            shadow-[inset_1px_1px_2px_rgba(255,255,255,.15)]
          "
         />

         <div
           className="
            absolute
            right-[10%]
            top-[46%]
            z-20
            h-3
            w-3
            rounded-full
            bg-[#4c2917]
            shadow-[inset_1px_1px_2px_rgba(255,255,255,.15)]
          "
         />

         {/* ============================================================ */}
         {/* FLOOR SHADOW                                                 */}
         {/* ============================================================ */}

         <div
           className="
            absolute
            bottom-[-3%]
            left-1/2
            -z-20
            h-10
            w-[76%]
            -translate-x-1/2
            rounded-full
            bg-[#402414]/28
            blur-2xl
          "
         />

         <div
           className="
            absolute
            bottom-[1%]
            left-1/2
            -z-10
            h-3
            w-[55%]
            -translate-x-1/2
            rounded-full
            bg-[#3c2113]/22
            blur-lg
          "
         />
       </div>
     );
   }

   function RealWoodPiece({
     children,
     className,
     x,
     y,
     sx,
     sy,
     sr,
     darker = false,
     style,
   }: {
     children?: ReactNode;

     className: string;

     x: number;
     y: number;

     sx: number;
     sy: number;

     sr: number;

     darker?: boolean;

     style?: CSSProperties;
   }) {
     return (
       <div
         data-piece
         data-x={x}
         data-y={y}
         data-r="0"
         data-sx={sx}
         data-sy={sy}
         data-sr={sr}
         className={`
          absolute
          overflow-hidden
          shadow-[0_22px_38px_rgba(58,31,15,0.24)]
          ${className}
        `}
         style={{
           background: darker
             ? `
              radial-gradient(
                circle at 25% 15%,
                rgba(255,255,255,.11),
                transparent 32%
              ),
              repeating-linear-gradient(
                96deg,
                rgba(255,255,255,.025) 0px,
                rgba(255,255,255,.025) 1px,
                transparent 1px,
                transparent 7px
              ),
              linear-gradient(
                100deg,
                #4C2815 0%,
                #794220 28%,
                #9B5D31 52%,
                #653519 78%,
                #3F2112 100%
              )
            `
             : `
              radial-gradient(
                circle at 25% 12%,
                rgba(255,255,255,.18),
                transparent 32%
              ),
              repeating-linear-gradient(
                96deg,
                rgba(255,255,255,.035) 0px,
                rgba(255,255,255,.035) 1px,
                transparent 1px,
                transparent 8px
              ),
              linear-gradient(
                105deg,
                #653419 0%,
                #9A572C 26%,
                #C67C45 50%,
                #8A4925 76%,
                #552A15 100%
              )
            `,

           boxShadow: `
            inset 2px 1px 2px rgba(255,255,255,.12),
            inset -5px -6px 12px rgba(45,20,8,.20),
            0 20px 38px rgba(58,31,15,.20)
          `,

           ...style,
         }}
       >
         {/* Fine grain */}

         <div
           className="
            pointer-events-none
            absolute
            inset-0
            opacity-30
          "
           style={{
             background: `
              repeating-linear-gradient(
                2deg,
                transparent 0px,
                transparent 7px,
                rgba(55,25,10,.16) 8px,
                transparent 9px,
                transparent 14px
              )
            `,
           }}
         />

         {/* Top highlight */}

         <div
           className="
            pointer-events-none
            absolute
            inset-x-0
            top-0
            h-[22%]
            bg-linear-to-b
            from-white/10
            to-transparent
          "
         />

         <div className="relative h-full w-full">{children}</div>
       </div>
     );
   }
/* ==========================================================================
   03 — SHURUUP
   ========================================================================== */

function ShuruupVisual() {
  const opportunities = [
    {
      title: "Pre-IPO",
      x: -280,
      y: -145,
    },
    {
      title: "Startups",
      x: 275,
      y: -140,
    },
    {
      title: "Private Equity",
      x: -315,
      y: 115,
    },
    {
      title: "Institutional",
      x: 310,
      y: 110,
    },
    {
      title: "Curated Access",
      x: 0,
      y: 225,
    },
  ];

  return (
    <>
      <svg
        className="
          absolute
          left-1/2
          top-1/2
          hidden
          h-130
          w-180
          -translate-x-1/2
          -translate-y-1/2
          overflow-visible
          md:block
        "
        viewBox="-360 -260 720 520"
      >
        {opportunities.map((item) => (
          <line
            data-line
            key={item.title}
            x1="0"
            y1="0"
            x2={item.x}
            y2={item.y}
            stroke="#D8B35A"
            strokeWidth="1"
            strokeDasharray="3 8"
          />
        ))}
      </svg>

      <div
        data-core
        className="
          absolute
          left-0
          top-0
          flex
          h-28
          w-28
          -translate-x-1/2
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          border
          border-[#D8B35A]/40
          bg-[#101D2C]
          text-[#F4F1E8]
          shadow-[0_30px_80px_rgba(0,0,0,0.4)]
          md:h-36
          md:w-36
        "
      >
        <div className="text-center">
          <span className="block text-[9px] uppercase tracking-[0.25em] opacity-50">
            Private
          </span>

          <span className="mt-1 block text-xl font-light">Markets</span>
        </div>
      </div>

      {opportunities.map((item, index) => (
        <div
          data-piece
          data-x={item.x}
          data-y={item.y}
          data-r={[-5, 5, 4, -4, 2][index]}
          data-sx="0"
          data-sy="0"
          data-sr="0"
          key={item.title}
          className="
              absolute
              left-0
              top-0
              flex
              h-20
              w-28
              -translate-x-1/2
              -translate-y-1/2
              items-center
              justify-center
              rounded-2xl
              border
              border-[#D8B35A]/20
              bg-[#102033]/90
              px-3
              text-center
              shadow-[0_20px_55px_rgba(0,0,0,0.3)]
              backdrop-blur-sm
              md:h-24
              md:w-36
            "
        >
          <span className="text-[9px] uppercase tracking-[0.12em] text-[#F4F1E8] md:text-xs">
            {item.title}
          </span>
        </div>
      ))}
    </>
  );
}

/* ==========================================================================
   04 — ANMOL
   ========================================================================== */

function AnmolVisual() {
  const modules = [
    {
      title: "Lab Tests",
      x: -280,
      y: -145,
    },
    {
      title: "Bookings",
      x: 280,
      y: -145,
    },
    {
      title: "Reports",
      x: -300,
      y: 130,
    },
    {
      title: "Home Care",
      x: 300,
      y: 130,
    },
    {
      title: "Family",
      x: -130,
      y: 225,
    },
    {
      title: "Corporate",
      x: 135,
      y: 225,
    },
  ];

  return (
    <>
      <div
        data-core
        className="
          absolute
          left-0
          top-0
          h-77.5
          w-38.75
          -translate-x-1/2
          -translate-y-1/2
          rounded-[2.2rem]
          border-[5px]
          border-[#12352D]
          bg-white
          p-3
          shadow-[0_35px_90px_rgba(18,53,45,0.22)]
          md:h-97.5
          md:w-48.75
        "
      >
        <div className="mx-auto h-1.5 w-12 rounded-full bg-[#12352D]/20" />

        <p className="mt-10 text-[9px] uppercase tracking-[0.25em] text-[#12352D]/45">
          Healthcare
        </p>

        <p className="mt-2 text-2xl font-light tracking-[-0.06em] text-[#12352D]">
          Anmol
        </p>

        <div className="mt-8 grid grid-cols-2 gap-2">
          {["Tests", "Book", "Reports", "Care"].map((item) => (
            <div
              key={item}
              className="
                flex
                aspect-square
                items-center
                justify-center
                rounded-xl
                bg-[#DDF1EA]
                text-[8px]
                uppercase
                tracking-widest
                text-[#12352D]
              "
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {modules.map((module) => (
        <div
          data-piece
          data-x={module.x}
          data-y={module.y}
          data-sx="0"
          data-sy="0"
          data-r="0"
          data-sr="0"
          key={module.title}
          className="
            absolute
            left-0
            top-0
            flex
            h-16
            w-24
            -translate-x-1/2
            -translate-y-1/2
            items-center
            justify-center
            rounded-2xl
            border
            border-[#12352D]/10
            bg-white/80
            px-2
            text-center
            shadow-[0_18px_45px_rgba(18,53,45,0.12)]
            backdrop-blur-md
            md:h-20
            md:w-32
          "
        >
          <span className="text-[9px] uppercase tracking-[0.12em] text-[#12352D]">
            {module.title}
          </span>
        </div>
      ))}

      {/* Booking flow detail */}

      <div
        data-piece
        data-x="-175"
        data-y="310"
        data-sx="-300"
        data-sy="400"
        data-r="0"
        data-sr="-12"
        className="
          absolute
          left-0
          top-0
          hidden
          -translate-x-1/2
          -translate-y-1/2
          rounded-xl
          bg-white/80
          px-5
          py-3
          text-center
          shadow-lg
          md:block
        "
      >
        <span className="text-[9px] uppercase tracking-[0.16em] opacity-45">
          Flow A
        </span>

        <p className="mt-1 text-sm">Test → Slot → Lab</p>
      </div>

      <div
        data-piece
        data-x="175"
        data-y="310"
        data-sx="300"
        data-sy="400"
        data-r="0"
        data-sr="12"
        className="
          absolute
          left-0
          top-0
          hidden
          -translate-x-1/2
          -translate-y-1/2
          rounded-xl
          bg-white/80
          px-5
          py-3
          text-center
          shadow-lg
          md:block
        "
      >
        <span className="text-[9px] uppercase tracking-[0.16em] opacity-45">
          Flow B
        </span>

        <p className="mt-1 text-sm">Test → Lab → Slot</p>
      </div>
    </>
  );
}
