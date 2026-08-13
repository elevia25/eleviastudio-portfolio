"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

import { useHeroRevealed } from "@/context/HeroRevealContext";
import { BLUR, DURATION } from "@/lib/motion";

/*
 * Framer Motion can't use GSAP's named eases, but [0.16, 1, 0.3, 1] is the
 * same expo/power4-out curve used for large entrances elsewhere on the
 * site (see EASE.entranceStrong in lib/motion.ts) — keep them in sync if
 * that curve ever changes.
 */
const HERO_ENTRANCE_EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const visible = useHeroRevealed();
  const videoRef = useRef<HTMLVideoElement>(null);

  /*
   * The video intentionally has no `autoPlay` attribute. It starts
   * playing exactly when `visible` becomes true — which Intro sets via
   * context the moment its doors begin unzipping — so the video and
   * the doors open together instead of the video having already been
   * running, unseen, since the page first mounted.
   */
  useEffect(() => {
    const video = videoRef.current;

    if (!video || !visible) {
      return;
    }

    video.play().catch(() => {
      // Autoplay may still be blocked by the browser; muted playback
      // almost always succeeds, but fail silently either way.
    });
  }, [visible]);

  return (
    <motion.section
      initial={{
        opacity: 0,
        scale: 0.96,
        filter: `blur(${BLUR.lg}px)`,
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
              filter: `blur(${BLUR.lg}px)`,
            }
      }
      transition={{
        duration: DURATION.xl,
        ease: HERO_ENTRANCE_EASE,
      }}
      className="relative h-svh w-full overflow-hidden bg-[#faf7ef]"
    >
      <video
        ref={videoRef}
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
