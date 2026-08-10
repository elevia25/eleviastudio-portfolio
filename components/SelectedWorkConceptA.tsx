"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  forwardRef,
  type CSSProperties,
  type ReactNode,
  useLayoutEffect,
  useRef,
} from "react";

/* ==========================================================================
   TYPES
   ========================================================================== */

type Point = {
  x: number;
  y: number;
};

type RouteLayout = {
  terminal: Point;

  label: Point;

  route: Point[];
};

type ProjectTheme = "engineering" | "craft" | "finance" | "health";

type Project = {
  code: string;

  name: string;

  category: string;

  coreSubtitle: string;

  background: string;
  foreground: string;
  accent: string;

  themeWord: string;

  theme: ProjectTheme;

  href?: string;

  services: string[];

  intent: string;

  benefit: string;

  ghostLabels: {
    text: string;
    x: number;
    y: number;
  }[];
};

/* ==========================================================================
   PROJECT DATA
   ========================================================================== */

const PROJECTS: Project[] = [
  {
    code: "W — 001",
    name: "Elevro",
    category: "Enterprise Engineering",
    coreSubtitle: "Engineering Partner",

    background: "#221129",
    foreground: "#F1E8F4",
    accent: "#B47AC6",

    themeWord: "SYSTEM",
    theme: "engineering",

    href: "https://elevro.com",

    services: [
      "Intelligent Quality Engineering",
      "Product Enablement",
      "Artificial Intelligence",
      "Cloud Engineering & CloudOps",
      "Digital Engineering",
    ],

    intent:
      "Five interconnected engineering capabilities brought together as one clear enterprise ecosystem.",

    benefit:
      "Designed to make complex capabilities easier to understand while creating a stronger and more coherent technology presence.",

    ghostLabels: [
      { text: "SYS / 01", x: 5, y: 14 },
      { text: "ENGINEERING", x: 79, y: 13 },
      { text: "INTELLIGENCE / 03", x: 7, y: 76 },
      { text: "CLOUD / 04", x: 81, y: 74 },
      { text: "DIGITAL / 05", x: 45, y: 91 },
    ],
  },

  {
    code: "W — 002",
    name: "KP Wood Craft",
    category: "Carpentry & Interiors",
    coreSubtitle: "Craftsmanship Since 1998",

    background: "#1C1007",
    foreground: "#F3E5D3",
    accent: "#C58A52",

    themeWord: "CRAFT",
    theme: "craft",

    href: "https://kpwoodcraft.in",

    services: [
      "Handcrafted Furniture",
      "Custom Carpentry",
      "Bespoke Woodwork",
      "Full Home Renovation",
      "Interior Woodwork",
    ],

    intent:
      "Furniture, carpentry, renovation and bespoke woodwork brought together as one connected craftsmanship system.",

    benefit:
      "Designed to make the breadth of craftsmanship easier to understand while creating a premium, trust-led digital identity.",

    ghostLabels: [
      { text: "JOINERY / 01", x: 6, y: 14 },
      { text: "CRAFT / MM", x: 80, y: 14 },
      { text: "120", x: 9, y: 75 },
      { text: "45°", x: 82, y: 73 },
      { text: "WOOD / DETAIL", x: 44, y: 91 },
    ],
  },

  {
    code: "W — 003",
    name: "Shuruup",
    category: "Private Markets",
    coreSubtitle: "Private Market Access",

    background: "#07111F",
    foreground: "#F4F1E8",
    accent: "#D3AE58",

    themeWord: "ACCESS",
    theme: "finance",

    href: "https://shuruup.com",

    services: [
      "Pre-IPO Opportunities",
      "High-Growth Startups",
      "Private Equity",
      "Institutional Opportunities",
      "Curated Private Markets",
    ],

    intent:
      "Private-market opportunities structured into one selective ecosystem built around discovery and access.",

    benefit:
      "Designed to make alternative investment opportunities easier to discover and understand while preserving a premium and exclusive experience.",

    ghostLabels: [
      { text: "PRIVATE / 03", x: 5, y: 14 },
      { text: "PRE-IPO", x: 82, y: 13 },
      { text: "ACCESS", x: 8, y: 75 },
      { text: "DEAL FLOW", x: 81, y: 73 },
      { text: "CURATED / 05", x: 44, y: 91 },
    ],
  },

  {
    code: "W — 004",
    name: "Anmol Medicare",
    category: "Flutter Healthcare Application",
    coreSubtitle: "Flutter · iOS + Android",

    background: "#071713",
    foreground: "#DDF0E7",
    accent: "#63B494",

    themeWord: "CARE",
    theme: "health",

    services: [
      "Tests & Packages",
      "Booking Flows",
      "Payments",
      "Reports",
      "Home Care & Consultation",
      "Profile & Family",
      "Corporate Module",
    ],

    intent:
      "An end-to-end healthcare ecosystem connecting discovery, booking, payments, reports and ongoing patient care.",

    benefit:
      "Designed to simplify complex healthcare journeys and create one consistent product experience across iOS and Android.",

    ghostLabels: [
      { text: "FLOW / 01", x: 5, y: 14 },
      { text: "IOS / ANDROID", x: 79, y: 14 },
      { text: "CARE +", x: 7, y: 75 },
      { text: "PATIENT FLOW", x: 79, y: 73 },
      { text: "MEDICAL / 07", x: 44, y: 91 },
    ],
  },
];

/* ==========================================================================
   NETWORK LAYOUTS
   ========================================================================== */

/*
 * Coordinates are percentages of the network canvas.
 *
 * Every route uses multiple orthogonal segments:
 *
 * core
 *   |
 *   +---------
 *             |
 *             +---- terminal
 *
 * That is intentionally different from a single SVG path.
 */

const FIVE_NODE_LAYOUT: RouteLayout[] = [
  // TOP
  {
    terminal: { x: 50, y: 13 },
    label: { x: 50, y: 7 },

    route: [
      { x: 50, y: 40 },
      { x: 50, y: 29 },
      { x: 58, y: 29 },
      { x: 58, y: 20 },
      { x: 50, y: 20 },
      { x: 50, y: 13 },
    ],
  },

  // LEFT UPPER
  {
    terminal: { x: 14, y: 34 },
    label: { x: 12, y: 28 },

    route: [
      { x: 39, y: 46 },
      { x: 31, y: 46 },
      { x: 31, y: 38 },
      { x: 20, y: 38 },
      { x: 20, y: 34 },
      { x: 14, y: 34 },
    ],
  },

  // RIGHT UPPER
  {
    terminal: { x: 86, y: 34 },
    label: { x: 88, y: 28 },

    route: [
      { x: 61, y: 46 },
      { x: 69, y: 46 },
      { x: 69, y: 38 },
      { x: 80, y: 38 },
      { x: 80, y: 34 },
      { x: 86, y: 34 },
    ],
  },

  // LEFT LOWER
  {
    terminal: { x: 20, y: 78 },
    label: { x: 18, y: 85 },

    route: [
      { x: 42, y: 57 },
      { x: 42, y: 66 },
      { x: 32, y: 66 },
      { x: 32, y: 73 },
      { x: 20, y: 73 },
      { x: 20, y: 78 },
    ],
  },

  // RIGHT LOWER
  {
    terminal: { x: 80, y: 78 },
    label: { x: 82, y: 85 },

    route: [
      { x: 58, y: 57 },
      { x: 58, y: 66 },
      { x: 68, y: 66 },
      { x: 68, y: 73 },
      { x: 80, y: 73 },
      { x: 80, y: 78 },
    ],
  },
];

const SEVEN_NODE_LAYOUT: RouteLayout[] = [
  // TOP
  {
    terminal: { x: 50, y: 11 },
    label: { x: 50, y: 5 },

    route: [
      { x: 50, y: 39 },
      { x: 50, y: 28 },
      { x: 58, y: 28 },
      { x: 58, y: 19 },
      { x: 50, y: 19 },
      { x: 50, y: 11 },
    ],
  },

  // LEFT TOP
  {
    terminal: { x: 13, y: 28 },
    label: { x: 11, y: 23 },

    route: [
      { x: 39, y: 44 },
      { x: 31, y: 44 },
      { x: 31, y: 35 },
      { x: 21, y: 35 },
      { x: 21, y: 28 },
      { x: 13, y: 28 },
    ],
  },

  // RIGHT TOP
  {
    terminal: { x: 87, y: 28 },
    label: { x: 89, y: 23 },

    route: [
      { x: 61, y: 44 },
      { x: 69, y: 44 },
      { x: 69, y: 35 },
      { x: 79, y: 35 },
      { x: 79, y: 28 },
      { x: 87, y: 28 },
    ],
  },

  // LEFT MID
  {
    terminal: { x: 10, y: 55 },
    label: { x: 10, y: 50 },

    route: [
      { x: 39, y: 50 },
      { x: 29, y: 50 },
      { x: 29, y: 57 },
      { x: 18, y: 57 },
      { x: 18, y: 55 },
      { x: 10, y: 55 },
    ],
  },

  // RIGHT MID
  {
    terminal: { x: 90, y: 55 },
    label: { x: 90, y: 50 },

    route: [
      { x: 61, y: 50 },
      { x: 71, y: 50 },
      { x: 71, y: 57 },
      { x: 82, y: 57 },
      { x: 82, y: 55 },
      { x: 90, y: 55 },
    ],
  },

  // LEFT BOTTOM
  {
    terminal: { x: 24, y: 83 },
    label: { x: 21, y: 89 },

    route: [
      { x: 43, y: 59 },
      { x: 43, y: 68 },
      { x: 34, y: 68 },
      { x: 34, y: 76 },
      { x: 24, y: 76 },
      { x: 24, y: 83 },
    ],
  },

  // RIGHT BOTTOM
  {
    terminal: { x: 76, y: 83 },
    label: { x: 79, y: 89 },

    route: [
      { x: 57, y: 59 },
      { x: 57, y: 68 },
      { x: 66, y: 68 },
      { x: 66, y: 76 },
      { x: 76, y: 76 },
      { x: 76, y: 83 },
    ],
  },
];

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */

export default function SelectedWorkConceptA() {
  const sectionRef = useRef<HTMLElement>(null);

  const stageRef = useRef<HTMLDivElement>(null);

  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);

  const titleRefs = useRef<Array<HTMLHeadingElement | null>>([]);

  const codeRefs = useRef<Array<HTMLParagraphElement | null>>([]);

  const networkRefs = useRef<Array<HTMLDivElement | null>>([]);

  const intentRefs = useRef<Array<HTMLDivElement | null>>([]);

  const benefitRefs = useRef<Array<HTMLDivElement | null>>([]);

  const hintRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    const stage = stageRef.current;

    const hint = hintRef.current;

    if (!section || !stage || !hint) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const layers = layerRefs.current;

    const titles = titleRefs.current;

    const codes = codeRefs.current;

    const networks = networkRefs.current;

    const intents = intentRefs.current;

    const benefits = benefitRefs.current;

    let refreshFrame = 0;

    const context = gsap.context(() => {
      /* ==================================================================== */
      /* INITIAL PROJECT STATE                                                */
      /* ==================================================================== */

      gsap.set(stage, {
        backgroundColor: PROJECTS[0].background,

        color: PROJECTS[0].foreground,
      });

      layers.forEach((layer, index) => {
        if (!layer) {
          return;
        }

        gsap.set(layer, {
          autoAlpha: index === 0 ? 1 : 0,

          pointerEvents: index === 0 ? "auto" : "none",
        });
      });

      titles.forEach((title) => {
        if (!title) {
          return;
        }

        gsap.set(title, {
          autoAlpha: 0,

          yPercent: 115,

          force3D: true,
        });
      });

      codes.forEach((code) => {
        if (!code) {
          return;
        }

        gsap.set(code, {
          autoAlpha: 0,

          y: 20,
        });
      });

      intents.forEach((story) => {
        if (!story) {
          return;
        }

        gsap.set(story, {
          autoAlpha: 0,

          y: 45,
        });
      });

      benefits.forEach((story) => {
        if (!story) {
          return;
        }

        gsap.set(story, {
          autoAlpha: 0,

          y: 45,
        });
      });

      /*
       * Prepare each ecosystem.
       */

      networks.forEach((network) => {
        if (!network) {
          return;
        }

        const backdrop = network.querySelector<HTMLElement>("[data-backdrop]");

        const themeWord =
          network.querySelector<HTMLElement>("[data-theme-word]");

        const coreHalo = network.querySelector<HTMLElement>("[data-core-halo]");

        const coreEdges = Array.from(
          network.querySelectorAll<HTMLElement>("[data-core-edge]"),
        );

        const coreName = network.querySelector<HTMLElement>("[data-core-name]");

        const coreMeta = network.querySelector<HTMLElement>("[data-core-meta]");

        const activeSegments = Array.from(
          network.querySelectorAll<HTMLElement>("[data-route-segment]"),
        );

        const terminals = Array.from(
          network.querySelectorAll<HTMLElement>("[data-terminal]"),
        );

        const nodes = Array.from(
          network.querySelectorAll<HTMLElement>("[data-service-node]"),
        );

        const signalDots = Array.from(
          network.querySelectorAll<HTMLElement>("[data-signal]"),
        );

        if (backdrop) {
          gsap.set(backdrop, {
            autoAlpha: 0,
          });
        }

        if (themeWord) {
          gsap.set(themeWord, {
            autoAlpha: 0,

            scale: 0.94,
          });
        }

        if (coreHalo) {
          gsap.set(coreHalo, {
            autoAlpha: 0,

            scale: 0.7,
          });
        }

        coreEdges.forEach((edge) => {
          const axis = edge.dataset.axis ?? "x";

          gsap.set(edge, {
            scaleX: axis === "x" ? 0 : 1,

            scaleY: axis === "y" ? 0 : 1,

            autoAlpha: 0,

            transformOrigin: edge.dataset.origin ?? "center center",
          });
        });

        if (coreName) {
          gsap.set(coreName, {
            autoAlpha: 0,

            y: 12,
          });
        }

        if (coreMeta) {
          gsap.set(coreMeta, {
            autoAlpha: 0,

            y: 8,
          });
        }

        activeSegments.forEach((segment) => {
          const axis = segment.dataset.axis ?? "x";

          gsap.set(segment, {
            scaleX: axis === "x" ? 0 : 1,

            scaleY: axis === "y" ? 0 : 1,

            autoAlpha: 0,

            transformOrigin: segment.dataset.origin ?? "center center",
          });
        });

        gsap.set(terminals, {
          autoAlpha: 0,

          scale: 0,
        });

        gsap.set(nodes, {
          autoAlpha: 0,

          y: 12,

          scale: 0.94,
        });

        gsap.set(signalDots, {
          autoAlpha: 0,

          scale: 0,
        });
      });

      gsap.set(hint, {
        autoAlpha: 0,

        y: 10,
      });

      /* ==================================================================== */
      /* MASTER SCROLL TIMELINE                                               */
      /* ==================================================================== */

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,

          start: "top top",

          end: () => `+=${Math.round(window.innerHeight * 16)}`,

          /*
           * Keep this.
           *
           * Pin the section inside the stable
           * wrapper from page.tsx.
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

              max: 0.7,
            },

            delay: 0.08,

            ease: "power3.inOut",
          },
        },
      });

      /* ==================================================================== */
      /* BUILD EACH PROJECT                                                   */
      /* ==================================================================== */

      PROJECTS.forEach((project, projectIndex) => {
        const layer = layers[projectIndex];

        const title = titles[projectIndex];

        const code = codes[projectIndex];

        const network = networks[projectIndex];

        const intent = intents[projectIndex];

        const benefit = benefits[projectIndex];

        if (!layer || !title || !code || !network || !intent || !benefit) {
          return;
        }

        const backdrop = network.querySelector<HTMLElement>("[data-backdrop]");

        const themeWord =
          network.querySelector<HTMLElement>("[data-theme-word]");

        const coreHalo = network.querySelector<HTMLElement>("[data-core-halo]");

        const coreEdges = Array.from(
          network.querySelectorAll<HTMLElement>("[data-core-edge]"),
        );

        const coreName = network.querySelector<HTMLElement>("[data-core-name]");

        const coreMeta = network.querySelector<HTMLElement>("[data-core-meta]");

        const serviceNodes = Array.from(
          network.querySelectorAll<HTMLElement>("[data-service-node]"),
        );

        const terminals = Array.from(
          network.querySelectorAll<HTMLElement>("[data-terminal]"),
        );

        const signalDots = Array.from(
          network.querySelectorAll<HTMLElement>("[data-signal]"),
        );

        /* ================================================================ */
        /* TRANSITION INTO PROJECT                                          */
        /* ================================================================ */

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
            "<0.28",
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

        /* ================================================================ */
        /* 1. BACKGROUND SYSTEM APPEARS                                     */
        /* ================================================================ */

        if (backdrop) {
          timeline.to(backdrop, {
            autoAlpha: 1,

            duration: 0.42,

            ease: "power2.out",
          });
        }

        if (themeWord) {
          timeline.to(
            themeWord,
            {
              autoAlpha: 0.045,

              scale: 1,

              duration: 0.65,

              ease: "power3.out",
            },
            "<0.08",
          );
        }

        /* ================================================================ */
        /* 2. CENTRAL SYSTEM CORE CONSTRUCTS                                */
        /* ================================================================ */

        if (coreHalo) {
          timeline.to(
            coreHalo,
            {
              autoAlpha: 1,

              scale: 1,

              duration: 0.42,

              ease: "power3.out",
            },
            "<0.08",
          );
        }

        timeline.to(
          coreEdges,
          {
            scaleX: 1,

            scaleY: 1,

            autoAlpha: 1,

            duration: 0.24,

            stagger: 0.055,

            ease: "power2.out",
          },
          "<0.08",
        );

        if (coreName) {
          timeline.to(
            coreName,
            {
              autoAlpha: 1,

              y: 0,

              duration: 0.4,

              ease: "power3.out",
            },
            "<0.12",
          );
        }

        if (coreMeta) {
          timeline.to(
            coreMeta,
            {
              autoAlpha: 1,

              y: 0,

              duration: 0.3,

              ease: "power2.out",
            },
            "<0.08",
          );
        }

        /* ================================================================ */
        /* 3. ROUTES FORM OUT OF BACKGROUND                                 */
        /* ================================================================ */

        serviceNodes.forEach((node, nodeIndex) => {
          const routeSegments = Array.from(
            network.querySelectorAll<HTMLElement>(
              `[data-route="${nodeIndex}"]`,
            ),
          );

          const terminal = terminals[nodeIndex];

          timeline.to(
            routeSegments,
            {
              scaleX: 1,

              scaleY: 1,

              autoAlpha: 1,

              duration: 0.22,

              stagger: 0.055,

              ease: "power2.out",
            },
            nodeIndex === 0 ? "<0.15" : "<0.04",
          );

          if (terminal) {
            timeline.to(
              terminal,
              {
                autoAlpha: 1,

                scale: 1,

                duration: 0.18,

                ease: "back.out(2)",
              },
              "<0.05",
            );
          }

          timeline.to(
            node,
            {
              autoAlpha: 1,

              y: 0,

              scale: 1,

              duration: 0.34,

              ease: "power3.out",
            },
            "<0.04",
          );
        });

        /* ================================================================ */
        /* FINANCE SIGNAL DETAIL                                            */
        /* ================================================================ */

        if (project.theme === "finance" && signalDots.length > 0) {
          timeline.to(
            signalDots,
            {
              autoAlpha: 1,

              scale: 1,

              duration: 0.25,

              stagger: 0.08,

              ease: "back.out(2)",
            },
            "<0.15",
          );
        }

        /* ================================================================ */
        /* 4. LARGE PROJECT TITLE RISES BEHIND                              */
        /* ================================================================ */

        timeline.to(
          code,
          {
            autoAlpha: 1,

            y: 0,

            duration: 0.3,

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
          "<0.04",
        );

        if (projectIndex === 0) {
          timeline.to(
            hint,
            {
              autoAlpha: 1,

              y: 0,

              duration: 0.3,
            },
            "<0.28",
          );
        }

        timeline.addLabel(`project-${projectIndex}-ecosystem`);

        /* ================================================================ */
        /* 5. WHAT WE SHAPED                                                */
        /* ================================================================ */

        timeline.to(
          intent,
          {
            autoAlpha: 1,

            y: 0,

            duration: 0.55,

            ease: "power3.out",
          },
          "+=0.16",
        );

        /*
         * Small system response.
         */

        timeline.to(
          serviceNodes,
          {
            x: (index) => (index % 2 === 0 ? 3 : -3),

            duration: 0.4,

            stagger: 0.025,

            ease: "sine.inOut",
          },
          "<0.1",
        );

        timeline.to(
          serviceNodes,
          {
            x: 0,

            duration: 0.35,

            stagger: 0.02,

            ease: "sine.out",
          },
          "<0.18",
        );

        timeline.addLabel(`project-${projectIndex}-intent`);

        /* ================================================================ */
        /* 6. DESIGNED TO HELP                                              */
        /* ================================================================ */

        timeline.to(
          intent,
          {
            autoAlpha: 0,

            y: -28,

            duration: 0.32,

            ease: "power2.in",
          },
          "+=0.25",
        );

        timeline.fromTo(
          benefit,
          {
            autoAlpha: 0,

            y: 42,
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

        /* ================================================================ */
        /* LAST PROJECT                                                     */
        /* ================================================================ */

        if (projectIndex === PROJECTS.length - 1) {
          timeline.to(
            {},
            {
              duration: 0.8,
            },
          );

          return;
        }

        /* ================================================================ */
        /* 7. SYSTEM DISSOLVES BACK INTO BACKGROUND                         */
        /* ================================================================ */

        timeline.to(
          [benefit, code],
          {
            autoAlpha: 0,

            y: -18,

            duration: 0.3,
          },
          "+=0.3",
        );

        timeline.to(
          title,
          {
            autoAlpha: 0,

            yPercent: -50,

            duration: 0.4,

            ease: "power3.in",
          },
          "<",
        );

        /*
         * Service labels disappear first.
         */

        timeline.to(
          serviceNodes,
          {
            autoAlpha: 0,

            y: -8,

            duration: 0.3,

            stagger: {
              each: 0.025,

              from: "edges",
            },

            ease: "power2.in",
          },
          "<0.04",
        );

        timeline.to(
          terminals,
          {
            autoAlpha: 0,

            scale: 0,

            duration: 0.22,

            stagger: 0.02,
          },
          "<0.06",
        );

        /*
         * Active route doesn't retract toward
         * the center.
         *
         * It simply loses contrast until it is
         * visually absorbed into the background
         * ghost system.
         */

        const allActiveSegments = Array.from(
          network.querySelectorAll<HTMLElement>("[data-route-segment]"),
        );

        timeline.to(
          allActiveSegments,
          {
            autoAlpha: 0,

            duration: 0.42,

            stagger: 0.01,

            ease: "power2.in",
          },
          "<0.06",
        );

        timeline.to(
          signalDots,
          {
            autoAlpha: 0,

            scale: 0,

            duration: 0.2,
          },
          "<",
        );

        if (coreName) {
          timeline.to(
            coreName,
            {
              autoAlpha: 0,

              y: -8,

              duration: 0.3,
            },
            "<0.08",
          );
        }

        if (coreMeta) {
          timeline.to(
            coreMeta,
            {
              autoAlpha: 0,

              duration: 0.22,
            },
            "<",
          );
        }

        timeline.to(
          coreEdges,
          {
            autoAlpha: 0,

            duration: 0.3,

            stagger: 0.025,
          },
          "<",
        );

        if (coreHalo) {
          timeline.to(
            coreHalo,
            {
              autoAlpha: 0,

              scale: 0.92,

              duration: 0.35,
            },
            "<",
          );
        }

        if (backdrop) {
          timeline.to(
            backdrop,
            {
              autoAlpha: 0,

              duration: 0.35,
            },
            "<0.12",
          );
        }
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
      className="
        relative
        isolate
        z-0
        h-svh
        w-full
      "
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
            pointer-events-none
            absolute
            left-5
            top-5
            z-[70]
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
                opacity-0
              "
          >
            {/* ================================================== */}
            {/* PROJECT META                                       */}


            <p
              className="
                  absolute
                  left-5
                  top-[15vh]
                  z-40
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.24em]
                  opacity-45
                  md:left-10
                  md:top-[19vh]
                "
            >
              {project.category}
            </p>

            <p
              ref={(element) => {
                codeRefs.current[projectIndex] = element;
              }}
              className="
                  absolute
                  left-5
                  top-[19vh]
                  z-40
                  text-sm
                  md:left-10
                  md:top-[23vh]
                  md:text-lg
                "
            >
              {project.code}
            </p>

            {/* ================================================== */}
            {/* BIG PROJECT NAME                                   */}
            {/* ================================================== */}

            <div
              className="
                  pointer-events-none
                  absolute
                  left-0
                  top-[17vh]
                  md:top-[18vh]
                  z-10
                  w-full
                  overflow-hidden
                  px-5
                  md:px-10
                "
            >
              <h2
                ref={(element) => {
                  titleRefs.current[projectIndex] = element;
                }}
                className="
    whitespace-nowrap

    text-[clamp(4.5rem,12vw,14rem)]

    font-light
    leading-[0.74]
    tracking-[-0.09em]
  "
                style={{
                  color: "rgba(0,0,0,.18)",

                  textShadow: `
      0 1px 0 rgba(255,255,255,.035),
      0 -1px 1px rgba(0,0,0,.45)
    `,
                }}
              >
                {project.name}
              </h2>
            </div>

            {/* ================================================== */}
            {/* ECOSYSTEM                                          */}
            {/* ================================================== */}

            <div
              ref={(element) => {
                networkRefs.current[projectIndex] = element;
              }}
              className="
              pointer-events-none
              absolute
              left-1/2
              top-[50%]
              z-20

              h-[64vh]
              min-h-[500px]
              max-h-[760px]

              w-[99vw]
              max-w-[1500px]

              -translate-x-1/2
              -translate-y-1/2

              md:top-[51%]
              md:h-[72vh]
              md:w-[96vw]

              xl:max-w-[1580px]
            "
            >
              <ProjectNetwork project={project} />
            </div>

            {/* ================================================== */}
            {/* STORY                                              */}
            {/* ================================================== */}

            <ProjectStory
              ref={(element) => {
                intentRefs.current[projectIndex] = element;
              }}
              label="What we shaped"
            >
              {project.intent}
            </ProjectStory>

            <ProjectStory
              ref={(element) => {
                benefitRefs.current[projectIndex] = element;
              }}
              label="Designed to help"
            >
              {project.benefit}
            </ProjectStory>

            {/* ================================================== */}
            {/* PROJECT LINK                                       */}
            {/* ================================================== */}

            {project.href && (
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="
                    absolute
                    right-5
                    top-5
                    z-[80]
                    flex
                    h-11
                    items-center
                    gap-3
                    border
                    border-current/15
                    px-4
                    text-[10px]
                    uppercase
                    tracking-[0.14em]
                    transition-transform
                    duration-300
                    hover:scale-[1.04]
                    md:right-10
                    md:top-8
                  "
              >
                View Project
                <span>↗</span>
              </a>
            )}
          </div>
        ))}

        {/* ======================================================== */}
        {/* SCROLL HINT                                              */}
        {/* ======================================================== */}

        <div
          ref={hintRef}
          className="
            pointer-events-none
            absolute
            bottom-6
            left-1/2
            z-[90]
            -translate-x-1/2
            whitespace-nowrap
            text-[9px]
            uppercase
            tracking-[0.25em]
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
   PROJECT NETWORK
   ========================================================================== */

function ProjectNetwork({ project }: { project: Project }) {
  const layout =
    project.services.length > 5 ? SEVEN_NODE_LAYOUT : FIVE_NODE_LAYOUT;

  return (
    <div className="absolute inset-0">

      <ProjectBackdrop project={project} />

      {/* ========================================================== */}
      {/* ACTIVE ROUTES                                              */}
      {/* ========================================================== */}

      <div
        className="
          absolute
          inset-0
          z-20
        "
      >
        {layout.slice(0, project.services.length).map((item, routeIndex) => (
          <Route
            key={`active-${routeIndex}`}
            points={item.route}
            color={project.accent}
            routeIndex={routeIndex}
          />
        ))}
      </div>

      {/* ========================================================== */}
      {/* CORE                                                       */}
      {/* ========================================================== */}

      <Core project={project} />

      {/* ========================================================== */}
      {/* SERVICES                                                   */}
      {/* ========================================================== */}

      {project.services.map((service, serviceIndex) => {
        const item = layout[serviceIndex];

        return (
          <ServiceNode
            key={service}
            service={service}
            index={serviceIndex}
            layout={item}
            project={project}
          />
        );
      })}

      {/* ========================================================== */}
      {/* SHURUUP SIGNALS                                            */}
      {/* ========================================================== */}

      {project.theme === "finance" && (
        <>
          <Signal x={52} y={34} color={project.accent} />

          <Signal x={66} y={47} color={project.accent} />

          <Signal x={56} y={68} color={project.accent} />
        </>
      )}
    </div>
  );
}

/* ==========================================================================
   BACKDROP
   ========================================================================== */

function ProjectBackdrop({ project }: { project: Project }) {
  const pattern = getBackdropPattern(project.theme, project.foreground);

  return (
    <div
      data-backdrop
      className="
        absolute
        -inset-[12%]
        z-0
        overflow-hidden
        opacity-0
      "
    >
      {/* ======================================================== */}
      {/* BASE STONE SURFACE                                      */}
      {/* ======================================================== */}

      <div
        className="
          absolute
          inset-0
        "
        style={{
          background: `
            radial-gradient(
              circle at 20% 12%,
              rgba(255,255,255,.045),
              transparent 27%
            ),

            radial-gradient(
              circle at 76% 84%,
              rgba(0,0,0,.25),
              transparent 34%
            ),

            radial-gradient(
              circle at 62% 22%,
              ${hexToRgba(project.accent, 0.045)},
              transparent 29%
            ),

            linear-gradient(
              135deg,
              rgba(255,255,255,.015),
              transparent 37%,
              rgba(0,0,0,.14)
            )
          `,
        }}
      />

      {/* ======================================================== */}
      {/* LARGE PRESSED-IN PANEL                                  */}
      {/* ======================================================== */}

      <div
        className="
          absolute
          left-[7%]
          top-[7%]
          h-[86%]
          w-[86%]
          rounded-[3rem]
        "
        style={{
          boxShadow: `
            inset 22px 22px 42px rgba(0,0,0,.20),
            inset -18px -18px 38px rgba(255,255,255,.018)
          `,
        }}
      />

      {/* ======================================================== */}
      {/* MICRO SCRATCHES                                         */}
      {/* ======================================================== */}

      <div
        className="
          absolute
          inset-0
          opacity-20
        "
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              7deg,
              transparent 0,
              transparent 31px,
              rgba(255,255,255,.015) 32px,
              transparent 33px
            ),

            repeating-linear-gradient(
              96deg,
              transparent 0,
              transparent 83px,
              rgba(0,0,0,.08) 84px,
              transparent 85px
            )
          `,
        }}
      />

      {/* ======================================================== */}
      {/* GIANT WORD ENGRAVED INTO BACKGROUND                     */}
      {/* ======================================================== */}

      <div
        data-theme-word
        className="
          absolute
          left-1/2
          top-1/2
          -translate-x-1/2
          -translate-y-1/2

          whitespace-nowrap

          text-[clamp(11rem,26vw,28rem)]
          font-medium
          leading-none
          tracking-[-0.09em]

          opacity-0
        "
        style={{
          color: "rgba(0,0,0,.10)",

          textShadow: `
            0 1px 0 rgba(255,255,255,.025),
            0 -1px 1px rgba(0,0,0,.35)
          `,
        }}
      >
        {project.themeWord}
      </div>

      {/* ======================================================== */}
      {/* TINY ENGRAVED MARKINGS                                  */}
      {/* ======================================================== */}

      {project.ghostLabels.map((marker, index) => (
        <span
          key={`${marker.text}-${index}`}
          className="
            absolute
            text-[8px]
            font-medium
            uppercase
            tracking-[0.25em]
            md:text-[10px]
          "
          style={{
            left: `${marker.x}%`,
            top: `${marker.y}%`,

            color: "rgba(0,0,0,.30)",

            textShadow: "0 1px 0 rgba(255,255,255,.05)",
          }}
        >
          {marker.text}
        </span>
      ))}
    </div>
  );
}

/* ==========================================================================
   BACKGROUND ARCHITECTURE
   ========================================================================== */

function BackgroundArchitecture({ project }: { project: Project }) {
  const lineColor = hexToRgba(project.foreground, 0.055);

  return (
    <>
      <div
        className="
          absolute
          left-[7%]
          top-[24%]
          h-px
          w-[18%]
        "
        style={{
          backgroundColor: lineColor,
        }}
      />

      <div
        className="
          absolute
          left-[25%]
          top-[24%]
          h-[12%]
          w-px
        "
        style={{
          backgroundColor: lineColor,
        }}
      />

      <div
        className="
          absolute
          right-[8%]
          top-[20%]
          h-[18%]
          w-px
        "
        style={{
          backgroundColor: lineColor,
        }}
      />

      <div
        className="
          absolute
          right-[8%]
          top-[38%]
          h-px
          w-[13%]
        "
        style={{
          backgroundColor: lineColor,
        }}
      />

      <div
        className="
          absolute
          bottom-[17%]
          left-[10%]
          h-px
          w-[17%]
        "
        style={{
          backgroundColor: lineColor,
        }}
      />

      <div
        className="
          absolute
          bottom-[17%]
          left-[27%]
          h-[10%]
          w-px
        "
        style={{
          backgroundColor: lineColor,
        }}
      />

      <div
        className="
          absolute
          bottom-[12%]
          right-[10%]
          h-px
          w-[21%]
        "
        style={{
          backgroundColor: lineColor,
        }}
      />

      {/* Craft measurement marks */}

      {project.theme === "craft" && (
        <>
          <div
            className="
              absolute
              left-[6%]
              top-[45%]
              flex
              items-center
              gap-2
              opacity-10
            "
          >
            <div
              className="
                h-px
                w-16
              "
              style={{
                backgroundColor: project.foreground,
              }}
            />

            <span className="text-[8px]">120</span>
          </div>

          <div
            className="
              absolute
              right-[10%]
              bottom-[28%]
              text-[9px]
              opacity-10
            "
          >
            45°
          </div>
        </>
      )}

      {/* Healthcare plus symbols */}

      {project.theme === "health" && (
        <>
          <span
            className="
              absolute
              left-[18%]
              top-[17%]
              text-2xl
              font-light
              opacity-[0.06]
            "
          >
            +
          </span>

          <span
            className="
              absolute
              right-[18%]
              bottom-[17%]
              text-xl
              font-light
              opacity-[0.06]
            "
          >
            +
          </span>
        </>
      )}

      {/* Finance points */}

      {project.theme === "finance" && (
        <>
          <TinyPoint left="15%" top="23%" color={project.accent} />

          <TinyPoint left="82%" top="18%" color={project.accent} />

          <TinyPoint left="11%" top="72%" color={project.accent} />

          <TinyPoint left="86%" top="68%" color={project.accent} />
        </>
      )}
    </>
  );
}

function TinyPoint({
  left,
  top,
  color,
}: {
  left: string;
  top: string;
  color: string;
}) {
  return (
    <span
      className="
        absolute
        h-1
        w-1
        rounded-full
        opacity-20
      "
      style={{
        left,

        top,

        backgroundColor: color,
      }}
    />
  );
}
function StoneCorner({
  position,
  color,
}: {
  position: "tl" | "tr" | "bl" | "br";
  color: string;
}) {
  const classes = {
    tl: "left-3 top-3 border-l border-t",

    tr: "right-3 top-3 border-r border-t",

    bl: "bottom-3 left-3 border-b border-l",

    br: "bottom-3 right-3 border-b border-r",
  };

  return (
    <span
      className={`
        absolute
        h-4
        w-4
        opacity-40
        ${classes[position]}
      `}
      style={{
        borderColor: color,

        filter: "drop-shadow(0 1px 0 rgba(255,255,255,.10))",
      }}
    />
  );
}
/* ==========================================================================
   CORE
   ========================================================================== */

function Core({ project }: { project: Project }) {
  return (
    <div
      className="
          absolute
          left-1/2
          top-1/2
          z-40
  
          h-[118px]
          w-[210px]
  
          -translate-x-1/2
          -translate-y-1/2
  
          sm:h-[135px]
          sm:w-[245px]
  
          md:h-[168px]
          md:w-[310px]
        "
    >
      {/* ======================================================== */}
      {/* OUTER CUT                                                */}
      {/* ======================================================== */}

      <div
        data-core-halo
        className="
            absolute
            -inset-5
            rounded-[2.2rem]
            opacity-0
            md:-inset-8
          "
        style={{
          boxShadow: `
              inset 10px 10px 22px rgba(0,0,0,.33),
              inset -8px -8px 18px rgba(255,255,255,.025),
  
              0 1px 0 rgba(255,255,255,.035)
            `,
        }}
      />

      {/* ======================================================== */}
      {/* RECESSED CORE                                            */}
      {/* ======================================================== */}

      <div
        className="
            absolute
            inset-0
            rounded-[1.6rem]
          "
        style={{
          backgroundColor: project.background,

          boxShadow: `
              inset 12px 12px 24px rgba(0,0,0,.34),
              inset -10px -10px 22px rgba(255,255,255,.025),
  
              0 1px 0 rgba(255,255,255,.05)
            `,
        }}
      />

      {/* ======================================================== */}
      {/* CARVED CORNERS                                           */}
      {/* ======================================================== */}

      <StoneCorner position="tl" color={project.accent} />

      <StoneCorner position="tr" color={project.accent} />

      <StoneCorner position="bl" color={project.accent} />

      <StoneCorner position="br" color={project.accent} />

      {/* ======================================================== */}
      {/* CENTER CONTENT                                           */}
      {/* ======================================================== */}

      <div
        className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            px-5
            text-center
          "
      >
        <div>
          <p
            data-core-meta
            className="
                mb-3
                text-[7px]
                uppercase
                tracking-[0.29em]
                opacity-40
                md:text-[9px]
              "
          >
            {project.coreSubtitle}
          </p>

          <h3
            data-core-name
            className="
                text-[1.55rem]
                font-light
                leading-[0.86]
                tracking-[-0.055em]
  
                sm:text-[1.8rem]
                md:text-[2.5rem]
              "
            style={{
              textShadow: `
                  0 1px 0 rgba(255,255,255,.06),
                  0 -1px 0 rgba(0,0,0,.5)
                `,
            }}
          >
            {project.name}
          </h3>

          <div
            className="
                mt-4
                flex
                items-center
                justify-center
                gap-2
              "
          >
            <span
              className="
                  h-1.5
                  w-1.5
                  rounded-full
                "
              style={{
                backgroundColor: project.accent,

                boxShadow: `
                    0 0 12px
                    ${hexToRgba(project.accent, 0.35)}
                  `,
              }}
            />

            <span
              className="
                  text-[6px]
                  uppercase
                  tracking-[0.26em]
                  opacity-35
                  md:text-[8px]
                "
            >
              SYSTEM ACTIVE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CoreEdge({
  className,
  axis,
  origin,
  color,
}: {
  className: string;

  axis: "x" | "y";

  origin: string;

  color: string;
}) {
  return (
    <div
      data-core-edge
      data-axis={axis}
      data-origin={origin}
      className={`
        absolute
        ${className}
      `}
      style={{
        backgroundColor: color,
      }}
    />
  );
}

/* ==========================================================================
   ROUTES
   ========================================================================== */

function Route({
  points,
  color,
  ghost = false,
  routeIndex,
}: {
  points: Point[];

  color: string;

  ghost?: boolean;

  routeIndex?: number;
}) {
  return (
    <>
      {points.slice(0, -1).map((point, index) => {
        const next = points[index + 1];

        return (
          <RouteSegment
            key={`${index}-${point.x}-${point.y}`}
            from={point}
            to={next}
            color={color}
            ghost={ghost}
            routeIndex={routeIndex}
          />
        );
      })}
    </>
  );
}
function RouteSegment({
  from,
  to,
  color,
  ghost,
  routeIndex,
}: {
  from: Point;
  to: Point;

  color: string;

  ghost: boolean;

  routeIndex?: number;
}) {
  const horizontal = from.y === to.y;

  const left = Math.min(from.x, to.x);
  const top = Math.min(from.y, to.y);

  const width = Math.abs(to.x - from.x);
  const height = Math.abs(to.y - from.y);

  const positive = horizontal ? to.x > from.x : to.y > from.y;

  const origin = horizontal
    ? positive
      ? "left center"
      : "right center"
    : positive
      ? "center top"
      : "center bottom";

  const wrapperStyle: CSSProperties = horizontal
    ? {
        left: `${left}%`,
        top: `${top}%`,

        width: `${width}%`,
        height: "7px",

        transform: "translateY(-50%)",
      }
    : {
        left: `${left}%`,
        top: `${top}%`,

        width: "7px",
        height: `${height}%`,

        transform: "translateX(-50%)",
      };

  /*
   * This creates the "cut into stone" illusion:
   *
   * highlight on one edge
   * dark shadow inside opposite edge
   *
   * NOT a normal colored line.
   */
  const grooveStyle: CSSProperties = horizontal
    ? {
        position: "absolute",

        left: 0,
        right: 0,

        top: "50%",

        height: ghost ? "2px" : "3px",

        transform: "translateY(-50%)",

        background: ghost
          ? "rgba(0,0,0,.18)"
          : `linear-gradient(
              to bottom,
              rgba(0,0,0,.58),
              rgba(0,0,0,.34)
            )`,

        boxShadow: ghost
          ? `
            0 1px 0 rgba(255,255,255,.025)
          `
          : `
            inset 0 1px 1px rgba(0,0,0,.78),
            0 1px 0 rgba(255,255,255,.10),
            0 -1px 0 rgba(0,0,0,.55)
          `,
      }
    : {
        position: "absolute",

        top: 0,
        bottom: 0,

        left: "50%",

        width: ghost ? "2px" : "3px",

        transform: "translateX(-50%)",

        background: ghost
          ? "rgba(0,0,0,.18)"
          : `linear-gradient(
              to right,
              rgba(0,0,0,.58),
              rgba(0,0,0,.34)
            )`,

        boxShadow: ghost
          ? `
            1px 0 0 rgba(255,255,255,.025)
          `
          : `
            inset 1px 0 1px rgba(0,0,0,.78),
            1px 0 0 rgba(255,255,255,.10),
            -1px 0 0 rgba(0,0,0,.55)
          `,
      };

  if (ghost) {
    return (
      <div
        className="
          absolute
          opacity-50
        "
        style={wrapperStyle}
      >
        <div style={grooveStyle} />
      </div>
    );
  }

  return (
    <div
      data-route-segment
      data-route={routeIndex}
      data-axis={horizontal ? "x" : "y"}
      data-origin={origin}
      className="
        absolute
        opacity-0
      "
      style={wrapperStyle}
    >
      <div className="absolute inset-0" style={grooveStyle} />
      {/* <div
        className="
          absolute
          opacity-20
        "
        style={
          horizontal
            ? {
                left: "8%",
                right: "8%",
                top: "50%",

                height: "1px",

                transform: "translateY(-50%)",

                backgroundColor: color,
              }
            : {
                top: "8%",
                bottom: "8%",
                left: "50%",

                width: "1px",

                transform: "translateX(-50%)",

                backgroundColor: color,
              }
        }
      /> */}
    </div>
  );
}

/* ==========================================================================
   SERVICE NODE
   ========================================================================== */

function ServiceNode({
  service,
  index,
  layout,
  project,
}: {
  service: string;
  index: number;
  layout: RouteLayout;
  project: Project;
}) {
  return (
    <>
      {/* ======================================================== */}
      {/* CARVED TERMINAL                                         */}
      {/* ======================================================== */}

      <div
        data-terminal
        className="
            absolute
            z-30
  
            h-3
            w-3
  
            -translate-x-1/2
            -translate-y-1/2
  
            rounded-[3px]
            opacity-0
          "
        style={{
          left: `${layout.terminal.x}%`,
          top: `${layout.terminal.y}%`,

          backgroundColor: project.background,

          boxShadow: `
              inset 2px 2px 4px rgba(0,0,0,.65),
              inset -1px -1px 2px rgba(255,255,255,.06),
  
              0 1px 0 rgba(255,255,255,.05)
            `,
        }}
      >
        <span
          className="
              absolute
              left-1/2
              top-1/2
              h-1
              w-1
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
            "
          style={{
            backgroundColor: project.accent,
          }}
        />
      </div>

      {/* ======================================================== */}
      {/* SERVICE PLATE                                           */}
      {/* ======================================================== */}

      <div
        data-service-node
        className="
            absolute
            z-40
  
            w-[118px]
  
            -translate-x-1/2
            -translate-y-1/2
  
            opacity-0
  
            sm:w-[150px]
            md:w-[210px]
          "
        style={{
          left: `${layout.label.x}%`,
          top: `${layout.label.y}%`,
        }}
      >
        <div
          className="
              relative
              rounded-[0.8rem]
              px-3
              py-3
  
              md:px-4
              md:py-4
            "
          style={{
            backgroundColor: project.background,

            boxShadow: `
                inset 5px 5px 10px rgba(0,0,0,.28),
                inset -4px -4px 8px rgba(255,255,255,.02),
  
                0 1px 0 rgba(255,255,255,.025)
              `,
          }}
        >
          {/* engraved index */}

          <p
            className="
                mb-2
                text-[7px]
                font-medium
                uppercase
                tracking-[0.24em]
                opacity-30
                md:text-[8px]
              "
            style={{
              textShadow: "0 1px 0 rgba(255,255,255,.05)",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </p>

          <p
            className="
                text-[8px]
                font-medium
                uppercase
                leading-[1.3]
                tracking-[0.1em]
  
                sm:text-[9px]
                md:text-[11px]
              "
          >
            {service}
          </p>

          {/* carved little slot */}

          <div
            className="
                mt-3
                h-[2px]
                w-8
              "
            style={{
              backgroundColor: "rgba(0,0,0,.45)",

              boxShadow: "0 1px 0 rgba(255,255,255,.06)",
            }}
          />
        </div>
      </div>
    </>
  );
}

/* ==========================================================================
   SIGNAL
   ========================================================================== */

function Signal({
  x,
  y,
  color,
}: {
  x: number;

  y: number;

  color: string;
}) {
  return (
    <span
      data-signal
      className="
        absolute
        z-30
        h-1.5
        w-1.5
        -translate-x-1/2
        -translate-y-1/2
        rounded-full
        opacity-0
      "
      style={{
        left: `${x}%`,

        top: `${y}%`,

        backgroundColor: color,

        boxShadow: `0 0 0 4px ${hexToRgba(color, 0.08)}`,
      }}
    />
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
 
         bottom-[4vh]
         right-5
         z-[65]
 
         max-w-[88vw]
 
         rounded-[1.4rem]
 
         px-5
         py-5
 
         opacity-0
 
         md:bottom-[5vh]
         md:right-[4vw]
 
         md:max-w-[31vw]
 
         md:px-7
         md:py-6
       "
      style={{
        background: "rgba(0,0,0,.10)",

        boxShadow: `
           inset 8px 8px 18px rgba(0,0,0,.22),
           inset -7px -7px 15px rgba(255,255,255,.018),
 
           0 1px 0 rgba(255,255,255,.025)
         `,
      }}
    >
      <p
        className="
           mb-3
           text-[8px]
           font-medium
           uppercase
           tracking-[0.27em]
           opacity-40
           md:text-[9px]
         "
      >
        {label}
      </p>

      <p
        className="
           text-[clamp(1.2rem,2vw,2.25rem)]
           font-light
           leading-[1.04]
           tracking-[-0.045em]
         "
      >
        {children}
      </p>
    </div>
  );
});

/* ==========================================================================
   BACKGROUND HELPERS
   ========================================================================== */

function getBackdropPattern(
  theme: ProjectTheme,

  foreground: string,
): CSSProperties {
  const subtle = hexToRgba(foreground, 0.035);

  const lighter = hexToRgba(foreground, 0.018);

  if (theme === "engineering") {
    return {
      backgroundImage: `
        linear-gradient(
          ${subtle} 1px,
          transparent 1px
        ),
        linear-gradient(
          90deg,
          ${subtle} 1px,
          transparent 1px
        ),
        linear-gradient(
          ${lighter} 1px,
          transparent 1px
        ),
        linear-gradient(
          90deg,
          ${lighter} 1px,
          transparent 1px
        )
      `,

      backgroundSize: "80px 80px, 80px 80px, 20px 20px, 20px 20px",
    };
  }

  if (theme === "craft") {
    return {
      backgroundImage: `
        repeating-linear-gradient(
          2deg,
          transparent 0px,
          transparent 23px,
          ${subtle} 24px,
          transparent 25px
        ),
        linear-gradient(
          90deg,
          ${lighter} 1px,
          transparent 1px
        )
      `,

      backgroundSize: "100% 100%, 90px 90px",
    };
  }

  if (theme === "finance") {
    return {
      backgroundImage: `
        radial-gradient(
          circle,
          ${hexToRgba(foreground, 0.09)} 1px,
          transparent 1px
        ),
        linear-gradient(
          90deg,
          ${lighter} 1px,
          transparent 1px
        ),
        linear-gradient(
          ${lighter} 1px,
          transparent 1px
        )
      `,

      backgroundSize: "34px 34px, 110px 110px, 110px 110px",
    };
  }

  return {
    backgroundImage: `
      linear-gradient(
        90deg,
        ${lighter} 1px,
        transparent 1px
      ),
      linear-gradient(
        ${lighter} 1px,
        transparent 1px
      ),
      radial-gradient(
        circle,
        ${hexToRgba(foreground, 0.055)} 1px,
        transparent 1px
      )
    `,

    backgroundSize: "90px 90px, 90px 90px, 36px 36px",
  };
}

/* ==========================================================================
   COLOR HELPER
   ========================================================================== */

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace("#", "");

  const normalized =
    clean.length === 3
      ? clean
          .split("")
          .map((character) => character + character)
          .join("")
      : clean;

  const number = Number.parseInt(normalized, 16);

  const red = (number >> 16) & 255;

  const green = (number >> 8) & 255;

  const blue = number & 255;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
