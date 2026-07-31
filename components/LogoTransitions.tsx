"use client";

import { useRef, useState, useEffect } from "react";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const FLOATING_ITEMS = [
  // --- PORTFOLIO POSTERS ---
  {
    id: 1,
    type: "poster",
    image: "/holi-poster.png",
    x: -30,
    y: -20,
    rotate: -4,
  },
  {
    id: 2,
    type: "poster",
    image: "/rath-yatra.png",
    x: 30,
    y: -18,
    rotate: 5,
  },
  {
    id: 3,
    type: "poster",
    image: "/republic-day.png",
    x: -26,
    y: 22,
    rotate: -6,
  },
  {
    id: 4,
    type: "poster",
    image: "/holi.png",
    x: 28,
    y: 20,
    rotate: 3,
  },

  // --- BRAND LOGOS (Transparent / Standalone) ---
  {
    id: 5,
    type: "logo",
    logo: "/designer-point.png",
    x: -20,
    y: -22,
    rotate: -2,
  },
  {
    id: 6,
    type: "logo",
    logo: "/dreams-archery.png",
    x: 20,
    y: -24,
    rotate: 3,
  },
  {
    id: 7,
    type: "logo",
    logo: "/the-sea.png",
    x: -14,
    y: 26,
    rotate: 2,
  },
  {
    id: 8,
    type: "logo",
    logo: "/mighty-digital.png",
    x: 16,
    y: 22,
    rotate: -3,
  },
  {
    id: 9,
    type: "logo",
    logo: "/designing.png",
    x: 24,
    y: 0,
    rotate: -3,
  },
  {
    id: 10,
    type: "logo",
    logo: "/kailash.png",
    x: -24,
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
  const x = useTransform(scrollYProgress, [0, 0.25], [0, item.x * multiplier]);
  const y = useTransform(scrollYProgress, [0, 0.25], [0, item.y * multiplier]);

  const baseScale = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const baseOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  // Logos hit absolute opacity 0 at scroll offset 0.34
  const logoOpacity = useTransform(
    scrollYProgress,
    [0.05, 0.12, 0.26, 0.32],
    [0, 1, 1, 0],
  );
  const logoScale = useTransform(scrollYProgress, [0.28, 0.34], [1, 0.5]);

  // Posters start fading in at 0.36 AFTER logos are 100% gone
  const posterOpacity = useTransform(
    scrollYProgress,
    [0.37, 0.44, 0.58, 0.65],
    [0, 1, 1, 0],
  );
  const posterScale = useTransform(
    scrollYProgress,
    [0.36, 0.44, 0.58, 0.65],
    [0.7, 1, 0.3, 0],
  );

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
          /* --- STANDALONE BRAND LOGO --- */
          <motion.div
            style={{
              opacity: logoOpacity,
              scale: logoScale,
            }}
            whileHover={{ scale: 1.15, rotate: item.rotate }}
            className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-36 lg:h-36 p-2 transition-all duration-300 drop-shadow-md hover:drop-shadow-xl"
          >
            <Image
              src={item.logo ?? ""}
              alt="Brand Logo"
              fill
              className="object-contain"
              sizes="(max-width: 640px) 64px, (max-width: 768px) 96px, (max-width: 1024px) 112px, 144px"
            />
          </motion.div>
        ) : (
          /* --- OPTIMIZED RESPONSIVE POSTER --- */
          <motion.div
            style={{
              opacity: posterOpacity,
              scale: posterScale,
              rotate: item.rotate,
            }}
            whileHover={{ scale: 1.08, rotate: 0, zIndex: 50 }}
            className="relative w-20 h-32 sm:w-28 sm:h-44 md:w-36 md:h-56 lg:w-40 lg:h-60 rounded-lg md:rounded-xl overflow-hidden shadow-xl border border-white/80 bg-neutral-100 group transition-all duration-300"
          >
            <Image
              src={item.image ?? ""}
              alt="Agency Portfolio Poster"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 80px, (max-width: 768px) 112px, (max-width: 1024px) 144px, 160px"
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
  const [screenMultiplier, setScreenMultiplier] = useState(8);

  useEffect(() => {
    const updateMultiplier = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenMultiplier(3.2); // Mobile
      } else if (width < 1024) {
        setScreenMultiplier(5.5); // Tablet
      } else {
        setScreenMultiplier(8.5); // Desktop fit
      }
    };

    updateMultiplier();
    window.addEventListener("resize", updateMultiplier);
    return () => window.removeEventListener("resize", updateMultiplier);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // --- STAGE TRANSITIONS ---

  // STAGE 1 (0.00 – 0.33): Logos Headline
  const text1Opacity = useTransform(
    scrollYProgress,
    [0.05, 0.12, 0.26, 0.32],
    [0, 1, 1, 0],
  );
  const text1Scale = useTransform(
    scrollYProgress,
    [0.05, 0.12, 0.26, 0.32],
    [0.35, 0.5, 0.75, 1],
  );

  const text1Y = useTransform(
    scrollYProgress,
    [0.05, 0.12, 0.26, 0.32],
    [20, 0, 0, -40],
  );

  // STAGE 2 (0.37 – 0.65): Reels/Posters Headline
  const text2Opacity = useTransform(
    scrollYProgress,
    [0.37, 0.44, 0.58, 0.65],
    [0, 1, 1, 0],
  );
  const text2Scale = useTransform(scrollYProgress, [0.37, 0.44], [0.85, 1]);
  const text2Y = useTransform(
    scrollYProgress,
    [0.37, 0.44, 0.58, 0.65],
    [20, 0, 0, -40],
  );

  // STAGE 3 (0.69 – 1.00): Websites Headline
  const text3Opacity = useTransform(
    scrollYProgress,
    [0.69, 0.76, 1.0],
    [0, 1, 1],
  );
  const text3Y = useTransform(scrollYProgress, [0.69, 0.76], [40, 0]);

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

        {/* --- RESPONSIVE HEADLINES LAYER --- */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none w-full max-w-5xl">
          {/* STEP 1: Matches LOGOS */}
          <motion.h3
            style={{ opacity: text1Opacity, y: text1Y, scale: text1Scale }}
            className="absolute text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight drop-shadow-md px-2"
          >
            20+ Creative Logos
          </motion.h3>

          {/* STEP 2: Matches POSTERS */}
          <motion.h1
            style={{ opacity: text2Opacity, y: text2Y, scale: text2Scale }}
            className="absolute text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-500 tracking-tight drop-shadow-md px-2"
          >
            10+ Story Poster
          </motion.h1>

          {/* STEP 3: Final Callout */}
          <motion.h2
            style={{ opacity: text3Opacity, y: text3Y }}
            className="absolute text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight drop-shadow-md px-2"
          >
            10+ Complete Websites
          </motion.h2>
        </div>
      </div>
    </div>
  );
}
