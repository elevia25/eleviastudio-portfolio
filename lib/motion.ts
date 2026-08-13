/**
 * Shared motion tokens.
 *
 * Every section on the site was hand-built with its own GSAP timelines,
 * which meant near-identical animations (a heading blurring up into view,
 * a pinned section snapping between states, a card fading in on scroll)
 * ended up with slightly different durations, eases, blur amounts and
 * trigger thresholds. None of it was "wrong" — it just meant the site
 * didn't move with one consistent hand.
 *
 * Import from here instead of hardcoding numbers so that every section
 * shares the same rhythm. If you need to change how "fast" or "soft"
 * the site feels globally, change it here once.
 */

/* ==========================================================================
   EASING
   ========================================================================== */

export const EASE = {
  /** Default entrance for anything appearing on scroll (fade/rise/blur in). */
  entrance: "power3.out",
  /** Larger, more dramatic entrances — hero-scale headings, pinned reveals. */
  entranceStrong: "power4.out",
  /** Small UI chrome appearing (hints, badges, chips). */
  entranceSoft: "power2.out",
  /** Default exit for anything leaving on scroll. */
  exit: "power2.in",
  /** Faster/harder exit for elements that need to get out of the way. */
  exitStrong: "power3.in",
  /** Color/background/property crossfades (not position). */
  crossfade: "power2.inOut",
  /** Pinned-timeline internal transitions (poster swaps, stage color etc). */
  timeline: "power3.inOut",
  /** Playful overshoot, used sparingly (e.g. a badge popping in). */
  pop: "back.out(1.6)",
  /** Continuous/looping motion (marquees, floating idle animation). */
  loop: "sine.inOut",
  /** Scrub-driven motion with no easing curve of its own. */
  linear: "none",
} as const;

/* ==========================================================================
   DURATION (seconds)
   ========================================================================== */

export const DURATION = {
  /** Chips, hints, tiny badges. */
  xs: 0.28,
  /** Small card / row entrances. */
  sm: 0.42,
  /** Standard heading / content block entrance. */
  md: 0.65,
  /** Large hero-scale entrance. */
  lg: 0.8,
  /** Big, cinematic reveals (pinned-section identity blocks). */
  xl: 1.15,
} as const;

/* ==========================================================================
   BLUR (px) — used with filter: blur(...)
   ========================================================================== */

export const BLUR = {
  /** Small elements: cards, chips, rows. */
  sm: 8,
  /** Section headings and medium content blocks. */
  md: 12,
  /** Hero-scale / pinned-section identity blocks. */
  lg: 14,
} as const;

/* ==========================================================================
   DISTANCE (px) — vertical/horizontal travel for fade+move entrances
   ========================================================================== */

export const DISTANCE = {
  xs: 12,
  sm: 24,
  md: 40,
  lg: 55,
} as const;

/* ==========================================================================
   SCROLLTRIGGER — reveal-on-scroll (non-pinned) sections
   ========================================================================== */

export const REVEAL_TRIGGER = {
  /** Standard point at which a fade/rise reveal should begin. */
  start: "top 85%",
} as const;

/* ==========================================================================
   SCROLLTRIGGER — pinned, scrubbed sections (dice, showcase, social, etc)
   ========================================================================== */

export const PINNED_SCRUB = {
  /** Smoothing applied to the scrub — how much the animation "lags" scroll. */
  desktop: 1.1,
  mobile: 0.95,
} as const;

export const PINNED_SNAP = {
  snapTo: "labelsDirectional" as const,
  duration: { min: 0.3, max: 0.75 },
  delay: 0.12,
  ease: EASE.timeline,
};

/** Lighter parallax-style scrub for non-pinned depth/drift effects. */
export const PARALLAX_SCRUB = 0.85;

/* ==========================================================================
   HELPERS
   ========================================================================== */

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
