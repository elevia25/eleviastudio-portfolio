"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const FLOATING_ITEMS = [
  // --- PORTFOLIO POSTERS ---
  {
    id: 1,
    type: "poster",
    image: "/holi-poster.png",
    x: -35,
    y: -25,
    rotate: -4,
  },
  {
    id: 2,
    type: "poster",
    image: "/rath-yatra.png",
    x: 35,
    y: -22,
    rotate: 5,
  },
  {
    id: 3,
    type: "poster",
    image: "/republic-day.png",
    x: -30,
    y: 28,
    rotate: -6,
  },
  {
    id: 4,
    type: "poster",
    image: "/holi.png",
    x: 32,
    y: 25,
    rotate: 3,
  },

  // --- BRAND LOGOS ---
  {
    id: 5,
    type: "logo",
    logo: "/designer-point.png",
    bg: "bg-white",
    x: -22,
    y: -28,
    rotate: -2,
  },
  {
    id: 6,
    type: "logo",
    logo: "/dreams-archery.png",
    bg: "bg-white",
    x: 22,
    y: -30,
    rotate: 3,
  },
  {
    id: 7,
    type: "logo",
    logo: "/the-sea.png",
    bg: "bg-white",
    x: -15,
    y: 32,
    rotate: 2,
  },
  {
    id: 8,
    type: "logo",
    logo: "/mighty-digital.png",
    bg: "bg-white",
    x: 18,
    y: 28,
    rotate: -3,
  },
  {
    id: 9,
    type: "logo",
    logo: "/designing.png",
    bg: "bg-white",
    x: 28,
    y: 0,
    rotate: -3,
  },
  {
    id: 10,
    type: "logo",
    logo: "/kailash.png",
    bg: "bg-white",
    x: -28,
    y: 0,
    rotate: -3,
  },
];

function FloatingCard({
  item,
  scrollYProgress,
  multiplier,
}: {
  item: (typeof FLOATING_ITEMS)[0];
  scrollYProgress: MotionValue<number>;
  multiplier: number;
}) {
  // Movement occurs early during initial scroll (0.0 to 0.25)
  const x = useTransform(scrollYProgress, [0, 0.25], [0, item.x * multiplier]);
  const y = useTransform(scrollYProgress, [0, 0.25], [0, item.y * multiplier]);

  const baseScale = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const baseOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  // --- STRICT SYNCHRONIZATION ---
  // Logos stay visible from start (0.0) through Text Step 1, then fade out (0.30 -> 0.38)
  const logoOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.3, 0.38],
    [1, 1, 0],
  );
  const logoScale = useTransform(scrollYProgress, [0.3, 0.38], [1, 0.6]);

  // Posters fade in right as Text Step 2 starts (0.35 -> 0.42)
  const posterOpacity = useTransform(scrollYProgress, [0.32, 0.42], [0, 1]);
  const posterScale = useTransform(scrollYProgress, [0.32, 0.42], [0.7, 1]);

  const bounceDuration = 3 + (item.id % 3) * 0.5;

  return (
    <motion.div
      style={{
        x,
        y,
        scale: baseScale,
        opacity: baseOpacity,
      }}
      className="absolute flex items-center justify-center pointer-events-auto"
    >
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{
          duration: bounceDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {item.type === "logo" ? (
          /* --- LOGO ITEM --- */
          <motion.div
            style={{ opacity: logoOpacity, scale: logoScale }}
            whileHover={{ scale: 1.1 }}
            className={`relative flex items-center justify-center w-16 h-16 md:w-24 md:h-24 p-3 rounded-2xl shadow-xl border border-slate-200/80 bg-white/90 backdrop-blur-md transition-shadow hover:shadow-2xl ${item.bg}`}
          >
            <div className="relative w-full h-full">
              <Image
                src={item.logo ?? ""}
                alt="Brand Logo"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 64px, 96px"
              />
            </div>
          </motion.div>
        ) : (
          /* --- POSTER ITEM --- */
          <motion.div
            style={{
              opacity: posterOpacity,
              scale: posterScale,
              rotate: item.rotate,
            }}
            whileHover={{ scale: 1.08, rotate: 0, zIndex: 50 }}
            className="relative w-28 h-48 md:w-44 md:h-72 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/80 bg-neutral-100 group transition-all duration-300"
          >
            <Image
              src={item.image ?? ""}
              alt="Agency Portfolio Poster"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 112px, 176px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function FloatingLibrarySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [screenMultiplier, setScreenMultiplier] = useState(10);

  useEffect(() => {
    const updateMultiplier = () => {
      setScreenMultiplier(window.innerWidth < 768 ? 4.2 : 10);
    };

    updateMultiplier();
    window.addEventListener("resize", updateMultiplier);
    return () => window.removeEventListener("resize", updateMultiplier);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // --- PERFECTLY TIMED TEXT TRANSFORMATIONS ---

  // STEP 1: LOGOS STAGE (0.05 -> 0.30 scroll)
  // Shows "180+ Creative Logos" while LOGOS are displayed
  const text1Opacity = useTransform(
    scrollYProgress,
    [0.08, 0.15, 0.28, 0.35, 0.43, 0.51],
    [0, 1, 1, 1, 1, 0],
  );
  const text1Y = useTransform(
    scrollYProgress,
    [0.08, 0.15, 0.35],
    [40, 0, -40],
  );

  // STEP 2: POSTERS STAGE (0.38 -> 0.65 scroll)
  // Shows "150+ Reels Edited & Shot" while POSTERS are displayed
  const text2Opacity = useTransform(
    scrollYProgress,
    [0.38, 0.45, 0.58, 0.65],
    [0, 1, 1, 0],
  );
  const text2Scale = useTransform(scrollYProgress, [0.38, 0.45], [0.85, 1]);
  const text2Y = useTransform(
    scrollYProgress,
    [0.38, 0.45, 0.65],
    [40, 0, -40],
  );

  // STEP 3: FINAL STAGE (0.68 -> 1.0 scroll)
  // Shows "5+ Complete Websites"
  const text3Opacity = useTransform(
    scrollYProgress,
    [0.68, 0.75, 1.0],
    [0, 1, 1],
  );
  const text3Y = useTransform(scrollYProgress, [0.68, 0.75], [40, 0]);

  return (
    <div ref={containerRef} className="relative h-[450vh] bg-slate-50">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* --- FLOATING MEDIA LAYER --- */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {FLOATING_ITEMS.map((item) => (
            <FloatingCard
              key={item.id}
              item={item}
              scrollYProgress={scrollYProgress}
              multiplier={screenMultiplier}
            />
          ))}
        </div>

        {/* --- SCROLLING HEADLINES LAYER --- */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
          {/* STEP 1: Matches LOGOS */}
          <motion.h3
            style={{ opacity: text1Opacity, y: text1Y }}
            className="absolute text-3xl md:text-5xl font-bold text-slate-900 tracking-tight drop-shadow-md"
          >
            20+ Creative Logos
          </motion.h3>

          {/* STEP 2: Matches POSTERS */}
          <motion.h1
            style={{ opacity: text2Opacity, y: text2Y, scale: text2Scale }}
            className="absolute text-4xl md:text-7xl font-extrabold text-slate-400 tracking-tight drop-shadow-md"
          >
            10+ Reels Edited & Shot
          </motion.h1>

          {/* STEP 3: Final Callout */}
          <motion.h2
            style={{ opacity: text3Opacity, y: text3Y }}
            className="absolute text-4xl md:text-6xl font-bold text-slate-900 tracking-tight drop-shadow-md"
          >
            10+ Complete Websites
          </motion.h2>
        </div>
      </div>
    </div>
  );
}
