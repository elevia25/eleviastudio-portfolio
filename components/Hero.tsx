"use client";

import { motion } from "framer-motion";

export default function Hero({ visible }: { visible: boolean }) {
  return (
    <motion.section
      initial={{
        opacity: 0,
        scale: 0.96,
        filter: "blur(20px)",
      }}
      animate={
        visible
          ? {
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
            }
          : {
              opacity: 0,
              scale: 0.96,
              filter: "blur(20px)",
            }
      }
      transition={{
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative h-svh w-full overflow-hidden bg-[#faf7ef]"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/35" />
    </motion.section>
  );
}
