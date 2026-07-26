import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const eliviaLetters = "ELEVIA".split("");
  const studioLetters = "STUDIO".split("");

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Background with parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
        <Image
          src="/hero-bg.jpg"
          alt=""
          className="w-full h-[110%] object-cover opacity-25 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/10" />
      </motion.div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern z-0 opacity-10" />

      {/* Animated gold lines */}
      <motion.div
        className="absolute left-0 right-0 top-[38%] h-px bg-primary/15 origin-left z-0"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className="absolute left-0 right-0 top-[62%] h-px bg-primary/15 origin-right z-0"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-4"
        style={{ opacity: fadeOut }}
      >
        {/* Est. badge */}
        <motion.div
          className="flex items-center gap-3 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="h-px w-6 bg-primary/50" />
          <span className="text-[9px] tracking-[0.6em] uppercase text-primary/70 font-light">
            Est. 2023
          </span>
          <div className="h-px w-6 bg-primary/50" />
        </motion.div>

        {/* ELEVIA — letter by letter, white */}
        <div className="flex justify-center">
          {eliviaLetters.map((char, i) => (
            <motion.span
              key={i}
              className="font-display font-light leading-none text-foreground"
              style={{
                fontSize: "clamp(3.5rem, 9vw, 8rem)",
                letterSpacing: "0.2em",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.35 + i * 0.06,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* STUDIO — letter by letter, gold */}
        <div className="flex justify-center">
          {studioLetters.map((char, i) => (
            <motion.span
              key={i}
              className="font-display font-light leading-none text-primary"
              style={{
                fontSize: "clamp(3.5rem, 9vw, 8rem)",
                letterSpacing: "0.2em",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.55 + i * 0.06,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* Divider */}
        <motion.div
          className="w-12 h-px bg-primary/50 my-8"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
        />

        {/* Tagline */}
        <motion.p
          className="text-[9px] md:text-[11px] tracking-[0.45em] text-secondary/70 font-light uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 1 }}
        >
          Creative Branding &nbsp;&amp;&nbsp; Marketing Agency
        </motion.p>

        {/* CTA button */}
        <motion.button
          onClick={() =>
            document
              .getElementById("about")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="mt-12 text-[9px] tracking-[0.4em] uppercase border border-primary/40 text-primary/90 px-10 py-4 hover:bg-primary hover:text-primary-foreground transition-all duration-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          Discover Our Work
        </motion.button>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
      >
        <span className="text-[8px] uppercase tracking-[0.5em] text-muted-foreground">
          Scroll
        </span>
        <div className="w-px h-14 bg-muted-foreground/20 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full h-1/2 bg-primary"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
