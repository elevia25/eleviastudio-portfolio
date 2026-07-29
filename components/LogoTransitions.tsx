"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";

// Sample icon data with target positions (X, Y in relative offset units)
const FLOATING_ICONS = [
  { id: 1, logo: "🐵", bg: "bg-yellow-400", x: -35, y: -30 },
  { id: 2, logo: "📺", bg: "bg-black text-white", x: -18, y: -25 },
  { id: 3, logo: "⚙️", bg: "bg-gray-200", x: 0, y: -32 },
  { id: 4, logo: "👾", bg: "bg-purple-600 text-white", x: 25, y: -35 },
  { id: 5, logo: "🟠", bg: "bg-orange-100", x: 38, y: -28 },
  { id: 6, logo: "🎨", bg: "bg-indigo-900 text-white", x: -28, y: -2 },
  { id: 7, logo: "🍦", bg: "bg-stone-900 text-white", x: 42, y: 5 },
  { id: 8, logo: "🤖", bg: "bg-emerald-100", x: -38, y: 32 },
  { id: 9, logo: "⚡", bg: "bg-lime-400", x: -20, y: 30 },
  { id: 10, logo: "📦", bg: "bg-blue-500 text-white", x: -2, y: 38 },
  { id: 11, logo: "🏠", bg: "bg-rose-500 text-white", x: 20, y: 30 },
  { id: 12, logo: "✔️", bg: "bg-gray-100", x: 40, y: 35 },
];

// Sub-component to prevent calling `useTransform` inside loops
function FloatingIcon({
  icon,
  scrollYProgress,
  iconScale,
  iconOpacity,
  multiplier,
}: {
  icon: (typeof FLOATING_ICONS)[0];
  scrollYProgress: MotionValue<number>;
  iconScale: MotionValue<number>;
  iconOpacity: MotionValue<number>;
  multiplier: number;
}) {
  // Translate icons using screen-size-aware multiplier
  const x = useTransform(scrollYProgress, [0, 0.25], [0, icon.x * multiplier]);
  const y = useTransform(scrollYProgress, [0, 0.25], [0, icon.y * multiplier]);

  // Unique bounce duration per icon for natural float dynamics
  const bounceDuration = 2.5 + (icon.id % 4) * 0.5;

  return (
    <motion.div
      style={{
        x,
        y,
        scale: iconScale,
        opacity: iconOpacity,
      }}
      className="absolute flex items-center justify-center pointer-events-auto"
    >
      {/* Continuous floating/bouncing wrapper */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: bounceDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl shadow-lg text-xl md:text-2xl font-bold transition-transform hover:scale-110 ${icon.bg}`}
      >
        {icon.logo}
      </motion.div>
    </motion.div>
  );
}

export default function FloatingLibrarySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [screenMultiplier, setScreenMultiplier] = useState(10);

  // Responsive adjustment: shrink travel distance on small screens
  useEffect(() => {
    const updateMultiplier = () => {
      setScreenMultiplier(window.innerWidth < 768 ? 4.5 : 10);
    };

    updateMultiplier();
    window.addEventListener("resize", updateMultiplier);
    return () => window.removeEventListener("resize", updateMultiplier);
  }, []);

  // Track scroll progress within tall container (400vh for expanded pacing)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // --- 1. ICON TRANSFORMATIONS ---
  // Icons expand and lock into position early (0% to 25% scroll)
  const iconScale = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const iconOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  // --- 2. SEQUENTIAL TEXT TRANSFORMATIONS ---
  // Step 1: Only floating icons are visible initially (0.00 - 0.25).

  // Step 2: Text 1 appears (0.25 -> 0.45)
  const text1Opacity = useTransform(
    scrollYProgress,
    [0.25, 0.3, 0.4, 0.48],
    [0, 1, 1, 0],
  );
  const text1Y = useTransform(scrollYProgress, [0.25, 0.3, 0.48], [40, 0, -40]);

  // Step 3: Text 2 appears (0.50 -> 0.70)
  const text2Opacity = useTransform(
    scrollYProgress,
    [0.5, 0.55, 0.65, 0.73],
    [0, 1, 1, 0],
  );
  const text2Scale = useTransform(scrollYProgress, [0.5, 0.58], [0.8, 1]);
  const text2Y = useTransform(scrollYProgress, [0.5, 0.55, 0.73], [40, 0, -40]);

  // Step 4: Text 3 appears and stays visible till end (0.75 -> 0.95)
  const text3Opacity = useTransform(
    scrollYProgress,
    [0.75, 0.82, 0.98],
    [0, 1, 1],
  );
  const text3Y = useTransform(scrollYProgress, [0.75, 0.82], [40, 0]);

  return (
    // Tall container creates vertical scroll space (400vh = 4 screen heights)
    <div ref={containerRef} className="relative h-[400vh] bg-white">
      {/* Sticky container stays fixed on screen while scrolling */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* --- FLOATING ICONS LAYER --- */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {FLOATING_ICONS.map((icon) => (
            <FloatingIcon
              key={icon.id}
              icon={icon}
              scrollYProgress={scrollYProgress}
              iconScale={iconScale}
              iconOpacity={iconOpacity}
              multiplier={screenMultiplier}
            />
          ))}
        </div>

        {/* --- SCROLLING TEXT LAYER --- */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
          {/* TEXT STEP 1 */}
          <motion.h3
            style={{ opacity: text1Opacity, y: text1Y }}
            className="absolute text-2xl md:text-3xl font-medium text-gray-800 tracking-tight"
          >
            180+ creatives Logos
          </motion.h3>

          {/* TEXT STEP 2 */}
          <motion.h1
            style={{ opacity: text2Opacity, y: text2Y, scale: text2Scale }}
            className="absolute text-4xl md:text-7xl font-extrabold text-gray-400 tracking-tight"
          >
            150+ reels edited and shot
          </motion.h1>

          {/* TEXT STEP 3 */}
          <motion.h2
            style={{ opacity: text3Opacity, y: text3Y }}
            className="absolute text-3xl md:text-6xl font-bold text-gray-900 tracking-tight"
          >
            5 + Websites
          </motion.h2>
        </div>
      </div>
    </div>
  );
}
