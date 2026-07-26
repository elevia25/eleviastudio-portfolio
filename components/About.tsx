import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section
      id="about"
      className="py-32 bg-background relative overflow-hidden"
      ref={ref}
    >
      <div className="container mx-auto px-6">
        <motion.div
          className="flex items-center gap-4 mb-16"
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-primary font-mono text-sm tracking-widest">
            01
          </span>
          <div className="h-px w-12 bg-primary"></div>
          <h2 className="text-sm font-light tracking-[0.3em] uppercase">
            About Us
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <p className="text-2xl md:text-4xl lg:text-5xl font-serif leading-tight text-secondary max-w-4xl">
              <span className="text-primary italic">Elevia Studio</span> is a
              creative-led digital studio helping brands grow through clear
              thinking, purposeful creativity, and consistent digital presence.
              <br />
              <br />
              Our difference lies in simplifying complexity and turning ideas
              into structured, actionable solutions that are not only visually
              appealing, but{" "}
              <span className="text-primary italic">
                effective and sustainable.
              </span>
            </p>
          </motion.div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <motion.div
              className="relative aspect-3/4 group overflow-hidden bg-card"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <Image
                src="/founder-1.jpg"
                alt="Aryan Shah - Founder"
                width={100}
                height={100}
                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-display text-lg mb-1 group-hover:text-primary transition-colors">
                  Aryan Shah
                </p>
                <p className="text-xs tracking-widest text-muted-foreground uppercase">
                  Co-Founder & Creative Director
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative aspect-3/4 group overflow-hidden bg-card mt-12"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <Image
                src="/founder-2.jpg"
                alt="Priya Mehta - Founder"
                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-display text-lg mb-1 group-hover:text-primary transition-colors">
                  Priya Mehta
                </p>
                <p className="text-xs tracking-widest text-muted-foreground uppercase">
                  Co-Founder & Strategy Lead
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
