"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { forwardRef, type ReactNode, useLayoutEffect, useRef } from "react";

import { WORK_PROJECTS, type WorkProject } from "../utils/work";

export default function SelectedWorkConceptB() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);

  const titleRefs = useRef<Array<HTMLHeadingElement | null>>([]);

  const rowsRefs = useRef<Array<HTMLDivElement | null>>([]);

  const intentRefs = useRef<Array<HTMLDivElement | null>>([]);

  const benefitRefs = useRef<Array<HTMLDivElement | null>>([]);

  const themeRefs = useRef<Array<HTMLDivElement | null>>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;

    if (!section || !stage) return;

    gsap.registerPlugin(ScrollTrigger);

    const layers = layerRefs.current;
    const titles = titleRefs.current;
    const rowContainers = rowsRefs.current;
    const intents = intentRefs.current;
    const benefits = benefitRefs.current;
    const themes = themeRefs.current;

    let refreshFrame = 0;

    const context = gsap.context(() => {
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
          yPercent: 110,
          force3D: true,
        });
      });

      themes.forEach((theme) => {
        if (!theme) return;

        gsap.set(theme, {
          autoAlpha: 0,
          scale: 0.9,
        });
      });

      rowContainers.forEach((container) => {
        if (!container) return;

        const rows = container.querySelectorAll("[data-row]");

        gsap.set(rows, {
          autoAlpha: 0,
          y: 70,
          force3D: true,
        });
      });

      gsap.set([...intents.filter(Boolean), ...benefits.filter(Boolean)], {
        autoAlpha: 0,
        y: 40,
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",

          end: () => `+=${Math.round(window.innerHeight * 13)}`,

          pin: section,
          pinSpacing: true,

          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,

          snap: {
            snapTo: "labelsDirectional",

            duration: {
              min: 0.25,
              max: 0.6,
            },

            delay: 0.08,
            ease: "power3.inOut",
          },
        },
      });

      WORK_PROJECTS.forEach((project, index) => {
        const layer = layers[index];
        const title = titles[index];
        const rowsContainer = rowContainers[index];
        const intent = intents[index];
        const benefit = benefits[index];
        const theme = themes[index];

        if (
          !layer ||
          !title ||
          !rowsContainer ||
          !intent ||
          !benefit ||
          !theme
        ) {
          return;
        }

        const rows = Array.from(rowsContainer.querySelectorAll("[data-row]"));

        if (index > 0) {
          const previous = layers[index - 1];

          timeline.to(stage, {
            backgroundColor: project.background,

            color: project.foreground,

            duration: 0.7,

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

          if (previous) {
            timeline.set(
              previous,
              {
                autoAlpha: 0,
                pointerEvents: "none",
              },
              "<",
            );
          }
        }

        /*
         * Product structure arrives first.
         */

        timeline.to(rows, {
          autoAlpha: 1,
          y: 0,

          duration: 0.65,

          stagger: {
            each: 0.06,
            from: "start",
          },

          ease: "power3.out",
        });

        /*
         * Big theme word appears behind.
         */

        timeline.to(
          theme,
          {
            autoAlpha: 0.075,
            scale: 1,

            duration: 0.6,
            ease: "power3.out",
          },
          "<0.15",
        );

        /*
         * Project title rises.
         */

        timeline.to(
          title,
          {
            autoAlpha: 1,
            yPercent: 0,

            duration: 0.75,
            ease: "power4.out",
          },
          "<0.25",
        );

        timeline.addLabel(`editorial-${index}-intro`);

        /*
         * Rows reorganize slightly.
         */

        timeline.to(rows, {
          x: (_, element) => {
            const row = element as HTMLElement;

            const rowIndex = Number(row.dataset.index ?? 0);

            return rowIndex % 2 ? 18 : -10;
          },

          duration: 0.5,
          ease: "power2.inOut",
        });

        timeline.to(
          intent,
          {
            autoAlpha: 1,
            y: 0,

            duration: 0.55,
            ease: "power3.out",
          },
          "<0.1",
        );

        timeline.addLabel(`editorial-${index}-intent`);

        /*
         * Story changes.
         */

        timeline.to(
          intent,
          {
            autoAlpha: 0,
            y: -25,

            duration: 0.32,
          },
          "+=0.3",
        );

        /*
         * Focus the system.
         */

        timeline.to(
          rows,
          {
            opacity: (rowIndex) =>
              rowIndex === 1 || rowIndex === 2 ? 1 : 0.32,

            x: 0,

            duration: 0.45,

            ease: "power2.inOut",
          },
          "<",
        );

        timeline.fromTo(
          benefit,
          {
            autoAlpha: 0,
            y: 40,
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

        timeline.addLabel(`editorial-${index}-benefit`);

        if (index === WORK_PROJECTS.length - 1) {
          timeline.to(
            {},
            {
              duration: 0.65,
            },
          );

          return;
        }

        /*
         * Exit.
         */

        timeline.to(
          [benefit, title, theme],
          {
            autoAlpha: 0,
            y: -25,

            duration: 0.4,

            ease: "power3.in",
          },
          "+=0.25",
        );

        timeline.to(
          rows,
          {
            autoAlpha: 0,
            y: -65,

            duration: 0.5,

            stagger: 0.035,

            ease: "power3.in",
          },
          "<",
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
        <div
          className="
            absolute
            left-5
            top-5
            z-50
            text-[10px]
            font-medium
            uppercase
            tracking-[0.3em]
            opacity-45
            md:left-10
            md:top-8
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
            {/* GIANT THEME */}

            <div
              ref={(element) => {
                themeRefs.current[index] = element;
              }}
              className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-1/2
                  z-0
                  -translate-x-1/2
                  -translate-y-1/2
                  whitespace-nowrap
                  text-[clamp(8rem,23vw,27rem)]
                  font-medium
                  leading-none
                  tracking-[-0.09em]
                  opacity-0
                "
            >
              {project.themeWord}
            </div>

            {/* TITLE */}

            <p
              className="
                  absolute
                  left-5
                  top-[17vh]
                  z-30
                  text-[10px]
                  uppercase
                  tracking-[0.24em]
                  opacity-50
                  md:left-10
                  md:top-[23vh]
                "
            >
              {project.code}
              {" · "}
              {project.category}
            </p>

            <div
              className="
                  absolute
                  left-0
                  top-[22vh]
                  z-10
                  w-full
                  overflow-hidden
                  px-5
                  md:top-[28vh]
                  md:px-10
                "
            >
              <h2
                ref={(element) => {
                  titleRefs.current[index] = element;
                }}
                className="
                    whitespace-nowrap
                    text-[clamp(4rem,11vw,13rem)]
                    font-light
                    leading-[0.76]
                    tracking-[-0.085em]
                  "
              >
                {project.name}
              </h2>
            </div>

            {/* PRODUCT SYSTEM */}

            <div
              ref={(element) => {
                rowsRefs.current[index] = element;
              }}
              className="
                  absolute
                  left-5
                  top-[43%]
                  z-20
                  w-[90vw]
                  -translate-y-1/2
                  md:left-auto
                  md:right-[6vw]
                  md:top-[50%]
                  md:w-[45vw]
                "
            >
              {project.items.map((item, itemIndex) => (
                <div
                  data-row
                  data-index={itemIndex}
                  key={item.number}
                  className="
                        flex
                        items-center
                        border-b
                        border-current/15
                        py-3
                        md:py-4
                      "
                >
                  <span
                    className="
                          w-10
                          text-[9px]
                          tracking-[0.15em]
                          opacity-35
                          md:w-12
                        "
                  >
                    {item.number}
                  </span>

                  <span
                    className="
                          flex-1
                          text-sm
                          font-medium
                          tracking-tight
                          md:text-lg
                        "
                  >
                    {item.title}
                  </span>

                  {item.subtitle && (
                    <span
                      className="
                            hidden
                            text-right
                            text-xs
                            opacity-45
                            md:block
                            md:max-w-44
                            md:text-sm
                          "
                    >
                      {item.subtitle}
                    </span>
                  )}

                  <span
                    className="
                          ml-4
                          text-lg
                          font-light
                          opacity-30
                        "
                  >
                    ↗
                  </span>
                </div>
              ))}
            </div>

            <EditorialStory
              ref={(element) => {
                intentRefs.current[index] = element;
              }}
              label="What we shaped"
            >
              {project.intent}
            </EditorialStory>

            <EditorialStory
              ref={(element) => {
                benefitRefs.current[index] = element;
              }}
              label="Designed to help"
            >
              {project.benefit}
            </EditorialStory>

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
                    gap-3
                    border
                    border-current/20
                    px-5
                    text-xs
                    uppercase
                    tracking-[0.15em]
                    backdrop-blur-sm
                    transition-transform
                    duration-300
                    hover:scale-[1.04]
                    md:right-10
                    md:top-8
                  "
              >
                View
                <span>↗</span>
              </a>
            )}
          </div>
        ))}

        <div
          className="
            pointer-events-none
            absolute
            bottom-6
            left-5
            z-50
            hidden
            text-[9px]
            uppercase
            tracking-[0.25em]
            opacity-40
            md:left-10
            md:block
          "
        >
          Complexity → Clarity
        </div>
      </div>
    </section>
  );
}

const EditorialStory = forwardRef<
  HTMLDivElement,
  {
    label: string;
    children: ReactNode;
  }
>(function EditorialStory({ label, children }, ref) {
  return (
    <div
      ref={ref}
      className="
        invisible
        absolute
        bottom-[6vh]
        left-5
        z-40
        max-w-[88vw]
        md:bottom-[7vh]
        md:left-10
        md:max-w-[31vw]
      "
    >
      <p
        className="
          mb-3
          text-[9px]
          uppercase
          tracking-[0.27em]
          opacity-45
        "
      >
        {label}
      </p>

      <p
        className="
          text-[clamp(1.4rem,2.45vw,2.8rem)]
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
