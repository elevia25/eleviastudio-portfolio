"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import React, { useLayoutEffect, useRef } from "react";

import SectionHeading from "./SectionHeading";

/* ==========================================================================
   DATA
   ========================================================================== */

const FOUNDERS = [
  {
    number: "01",

    name: "RAVI PRAJAPATI",

    label: "THE BUILDER",

    intro: "From engineering logic to creative thinking.",

    statement: (
      <>
        I used to build systems.
        <br />
        Now, I build brands.
      </>
    ),

    journey: ["ENGINEER", "PROBLEM SOLVER", "BUILDER", "ELEVIA"],

    image: "/about/Ravi.jpeg",

    imagePosition: "center center",
  },

  {
    number: "02",

    name: "KHUSHI PRAJAPATI",

    label: "THE CREATIVE MIND",

    intro: "Ideas before execution.",

    statement: (
      <>
        From marketing to making — I build brands through ideas, content and
        creative direction.
      </>
    ),

    journey: ["IDEAS", "WORDS", "VISUALS", "BRANDS"],

    image: "/about/Khushi.jpeg",

    imagePosition: "center center",
  },
] as const;

/* ==========================================================================
   MAIN
   ========================================================================== */

export default function AboutUsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const headingRef = useRef<HTMLDivElement>(null);

  const founderRefs = useRef<Array<HTMLDivElement | null>>([]);

  const contactRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    const heading = headingRef.current;

    const founders = founderRefs.current.filter(
      (element): element is HTMLDivElement => Boolean(element),
    );

    const contact = contactRef.current;

    if (!section || !heading || founders.length !== FOUNDERS.length) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      /* ================================================================
         SECTION HEADING
         ================================================================ */

      gsap.fromTo(
        heading,
        {
          autoAlpha: 0,
          y: 18,
        },
        {
          autoAlpha: 1,
          y: 0,

          duration: 0.65,

          ease: "power3.out",

          scrollTrigger: {
            trigger: section,

            start: "top 84%",

            once: true,
          },
        },
      );

      /* ================================================================
         FOUNDER ROWS
         ================================================================ */

      founders.forEach((founder, index) => {
        gsap.fromTo(
          founder,
          {
            autoAlpha: 0,

            y: 24,

            x: index === 0 ? -18 : 18,

            scale: 0.985,

            filter: "blur(6px)",
          },
          {
            autoAlpha: 1,

            y: 0,
            x: 0,

            scale: 1,

            filter: "blur(0px)",

            duration: 0.72,

            delay: index * 0.08,

            ease: "power3.out",

            scrollTrigger: {
              trigger: section,

              start: "top 78%",

              once: true,
            },
          },
        );
      });

      /* ================================================================
         CONTACT
         ================================================================ */

      if (contact) {
        gsap.fromTo(
          contact,
          {
            autoAlpha: 0,
            y: 35,
          },
          {
            autoAlpha: 1,
            y: 0,

            duration: 0.8,

            ease: "power3.out",

            scrollTrigger: {
              trigger: contact,

              start: "top 88%",

              once: true,
            },
          },
        );
      }
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="About Elevia Studio"
      className="
        relative
        w-full
        bg-[#E9E4DA]
        text-[#213943]
      "
    >
      {/* ==========================================================
          ABOUT — ONE SCREEN
          ========================================================== */}

      <div
        className="
          relative

          h-svh
          min-h-[620px]

          w-full

          overflow-hidden
        "
      >
        {/* ========================================================
            BACKGROUND
            ======================================================== */}

        <div
          aria-hidden
          className="
            pointer-events-none
            absolute
            inset-0
          "
          style={{
            background: `
              radial-gradient(
                circle at 10% 14%,
                rgba(245,74,0,.045),
                transparent 27%
              ),

              radial-gradient(
                circle at 90% 85%,
                rgba(33,57,67,.055),
                transparent 32%
              )
            `,
          }}
        />

        {/* center guide */}

        <div
          aria-hidden
          className="
            pointer-events-none

            absolute
            bottom-0
            left-1/2
            top-0

            hidden
            w-px

            bg-[#213943]/[0.045]

            lg:block
          "
        />

        {/* ========================================================
            HEADER
            ======================================================== */}

        <SectionHeading
          ref={headingRef}
          number="08"
          title="About Us"
          subtitle="Two people. Different strengths. One studio."
          className="opacity-0"
        />

        {/* ========================================================
            TWO FOUNDER ROWS
            ======================================================== */}

        <div
          className="
            relative
            z-10

            mx-auto

            grid
            h-full
            w-full

            max-w-[1500px]

            grid-rows-2

            gap-2

            px-3

            pb-3
            pt-[8.8rem]

            sm:gap-3
            sm:px-5
            sm:pb-4
            sm:pt-[9.3rem]

            md:gap-4
            md:px-8
            md:pb-6
            md:pt-[10rem]

            lg:gap-5
            lg:px-10
            lg:pb-8
            lg:pt-[10.5rem]
          "
        >
          {FOUNDERS.map((founder, index) => (
            <FounderRow
              key={founder.number}
              founder={founder}
              index={index}
              reverse={index === 1}
              rowRef={(element) => {
                founderRefs.current[index] = element;
              }}
            />
          ))}
        </div>
      </div>

      {/* ==========================================================
          CONTACT / FOOTER
          ========================================================== */}

      <ContactSection contactRef={contactRef} />
    </section>
  );
}

/* ==========================================================================
   FOUNDER ROW
   ========================================================================== */

   function FounderRow({
     founder,
     index,
     reverse,
     rowRef,
   }: {
     founder: (typeof FOUNDERS)[number];
     index: number;
     reverse: boolean;
     rowRef: (element: HTMLDivElement | null) => void;
   }) {
     return (
       <article
         ref={rowRef}
         className={`
          relative
  
          grid
          min-h-0
          w-full
  
          items-center
  
          opacity-0
  
          ${
            reverse
              ? `
                grid-cols-[minmax(0,1fr)_88px]
  
                sm:grid-cols-[minmax(0,1fr)_110px]
  
                md:grid-cols-[minmax(0,1fr)_180px]
  
                lg:grid-cols-[minmax(0,1fr)_210px]
  
                xl:grid-cols-[minmax(0,1fr)_230px]
              `
              : `
                grid-cols-[88px_minmax(0,1fr)]
  
                sm:grid-cols-[110px_minmax(0,1fr)]
  
                md:grid-cols-[180px_minmax(0,1fr)]
  
                lg:grid-cols-[210px_minmax(0,1fr)]
  
                xl:grid-cols-[230px_minmax(0,1fr)]
              `
          }
  
          gap-4
  
          sm:gap-5
  
          md:gap-8
  
          lg:gap-10
  
          xl:gap-12
  
          will-change-[transform,opacity,filter]
        `}
       >
         {/* ========================================================
            IMAGE
            ======================================================== */}

         <div
           className={`
            relative
  
            flex
            h-full
  
            items-center
  
            ${
              reverse
                ? "col-start-2 row-start-1 justify-end"
                : "col-start-1 row-start-1 justify-start"
            }
          `}
         >
           <FounderImage founder={founder} />
         </div>

         {/* ========================================================
            CONTENT
            ======================================================== */}

         <div
           className={`
            relative
            z-10
  
            flex
            min-w-0
  
            flex-col
  
            items-start
            justify-center
  
            text-left
  
            ${reverse ? "col-start-1 row-start-1" : "col-start-2 row-start-1"}
          `}
         >
           {/* META */}

           <div
             className="
              flex
              items-center
  
              gap-2
  
              text-[6px]
              font-medium
              uppercase
  
              tracking-[0.18em]
  
              text-[#213943]/40
  
              sm:text-[7px]
  
              md:text-[8px]
              md:tracking-[0.22em]
            "
           >
             <span>{founder.number}</span>

             <span
               className="
                h-px
                w-4
  
                bg-[#213943]/20
  
                md:w-6
              "
             />

             <span>Founder</span>
           </div>

           {/* NAME */}

           <h3
             className="
              mt-1
  
              max-w-full
  
              text-[clamp(1.05rem,4vw,1.5rem)]
  
              font-light
              leading-[0.9]
  
              tracking-[-0.055em]
  
              sm:text-[clamp(1.2rem,4vw,1.7rem)]
  
              md:mt-2
  
              md:text-[clamp(1.7rem,3vw,3rem)]
  
              lg:text-[clamp(2rem,2.8vw,3.4rem)]
            "
           >
             {founder.name}
           </h3>

           {/* ROLE */}

           <p
             className="
              mt-1
  
              text-[6px]
              font-semibold
              uppercase
  
              tracking-[0.2em]
  
              text-[#F54A00]
  
              sm:text-[7px]
  
              md:mt-2
              md:text-[9px]
  
              lg:text-[10px]
            "
           >
             {founder.label}
           </p>

           {/* INTRO */}

           <p
             className="
              mt-1
  
              max-w-[650px]
  
              text-[7px]
              font-light
  
              leading-[1.35]
  
              text-[#213943]/55
  
              sm:text-[8px]
  
              md:mt-2
              md:text-[11px]
  
              lg:text-xs
            "
           >
             {founder.intro}
           </p>

           {/* STATEMENT */}

           <div
             className="
              mt-1
  
              max-w-[720px]
  
              text-[9px]
              font-light
  
              leading-[1.15]
  
              tracking-[-0.025em]
  
              sm:text-[10px]
  
              md:mt-2
  
              md:text-[clamp(1rem,1.4vw,1.4rem)]
  
              md:leading-[1.1]
  
              lg:mt-3
            "
           >
             {founder.statement}
           </div>

           {/* JOURNEY */}

           <div
             className="
              mt-2
  
              flex
              max-w-[720px]
  
              flex-wrap
              items-center
  
              justify-start
  
              gap-x-1
              gap-y-1
  
              border-t
              border-[#213943]/10
  
              pt-2
  
              md:mt-3
              md:gap-x-1.5
              md:pt-3
            "
           >
             {founder.journey.map((step, stepIndex) => (
               <React.Fragment key={step}>
                 <span
                   className="
                    text-[5px]
                    font-medium
                    uppercase
  
                    tracking-[0.1em]
  
                    text-[#213943]
  
                    sm:text-[6px]
  
                    md:text-[7px]
  
                    lg:text-[8px]
                  "
                 >
                   {step}
                 </span>

                 {stepIndex !== founder.journey.length - 1 && (
                   <span
                     className="
                      mx-0.5
  
                      text-[7px]
  
                      text-[#F54A00]/75
  
                      md:text-[9px]
                    "
                   >
                     →
                   </span>
                 )}
               </React.Fragment>
             ))}
           </div>
         </div>

         {/* ========================================================
            VERY SUBTLE ROW DIVIDER
            ======================================================== */}

         {index === 0 && (
           <div
             aria-hidden
             className="
              pointer-events-none
  
              absolute
  
              bottom-[-0.55rem]
              left-0
              right-0
  
              h-px
  
              bg-[#213943]/10
  
              sm:bottom-[-0.75rem]
  
              md:bottom-[-1rem]
            "
           />
         )}
       </article>
     );
   }
/* ==========================================================================
   FOUNDER IMAGE
   ========================================================================== */

   function FounderImage({ founder }: { founder: (typeof FOUNDERS)[number] }) {
     return (
       <div
         className="
          relative
  
          aspect-[4/5]
  
          w-full
  
          max-w-[88px]
  
          overflow-hidden
  
          rounded-[0.8rem]
  
          bg-[#213943]
  
          shadow-[0_14px_36px_rgba(33,57,67,.14)]
  
          sm:max-w-[110px]
  
          md:max-w-[180px]
  
          md:rounded-[1.15rem]
  
          lg:max-w-[210px]
  
          xl:max-w-[230px]
        "
       >
         <Image
           src={founder.image}
           alt={founder.name}
           fill
           sizes="
            (max-width: 639px) 88px,
            (max-width: 767px) 110px,
            (max-width: 1023px) 180px,
            (max-width: 1279px) 210px,
            230px
          "
           className="
            select-none
            object-cover
          "
           style={{
             objectPosition: founder.imagePosition,
           }}
           draggable={false}
         />

         {/* subtle image depth */}

         <div
           aria-hidden
           className="
            pointer-events-none
  
            absolute
            inset-0
  
            bg-linear-to-t
  
            from-[#152B34]/20
            via-transparent
            to-transparent
          "
         />

         {/* INDEX */}

         <span
           className="
            absolute
  
            left-2
            top-2
  
            grid
  
            h-6
            w-6
  
            place-items-center
  
            rounded-full
  
            border
            border-white/25
  
            bg-black/15
  
            text-[7px]
            font-medium
  
            text-white
  
            backdrop-blur-md
  
            md:left-3
            md:top-3
  
            md:h-8
            md:w-8
  
            md:text-[8px]
          "
         >
           {founder.number}
         </span>
       </div>
     );
   }

/* ==========================================================================
   CONTACT / FOOTER
   ========================================================================== */

function ContactSection({
  contactRef,
}: {
  contactRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <footer
      ref={contactRef}
      className="
        relative

        min-h-[72svh]

        overflow-hidden

        bg-[#213943]

        text-[#F5F0E8]

        md:min-h-[68svh]
      "
    >
      {/* background */}

      <div
        aria-hidden
        className="
          pointer-events-none
          absolute
          inset-0
        "
        style={{
          background: `
            radial-gradient(
              circle at 82% 12%,
              rgba(245,74,0,.13),
              transparent 28%
            ),

            radial-gradient(
              circle at 12% 90%,
              rgba(255,255,255,.035),
              transparent 30%
            )
          `,
        }}
      />

      {/* giant word */}

      <div
        aria-hidden
        className="
          pointer-events-none

          absolute

          bottom-[-5%]
          left-1/2

          -translate-x-1/2

          whitespace-nowrap

          text-[clamp(8rem,24vw,25rem)]

          font-light
          leading-none

          tracking-[-0.1em]

          text-black/10
        "
      >
        HELLO
      </div>

      <div
        className="
          relative
          z-10

          mx-auto

          flex

          min-h-[72svh]

          w-full
          max-w-[1500px]

          flex-col
          justify-between

          px-5
          py-10

          md:min-h-[68svh]

          md:px-10
          md:py-14
        "
      >
        {/* ======================================================
            CTA / CONTACT
            ====================================================== */}

        <div
          className="
            grid
            gap-10

            md:grid-cols-[1.2fr_0.8fr]

            md:gap-16
          "
        >
          <div>
            <p
              className="
                text-[8px]
                font-medium
                uppercase

                tracking-[0.28em]

                text-[#F54A00]

                md:text-[9px]
              "
            >
              Contact us
            </p>

            <h2
              className="
                mt-4

                max-w-[850px]

                text-[clamp(3rem,8vw,8rem)]

                font-light
                leading-[0.82]

                tracking-[-0.075em]
              "
            >
              Have an idea?
              <br />
              Let&apos;s build it.
            </h2>

            <a
              href="mailto:eleviastudio25@gmail.com"
              className="
                mt-7

                inline-flex

                items-center
                gap-3

                border-b
                border-white/25

                pb-2

                text-sm
                font-light

                transition-colors

                hover:border-[#F54A00]
                hover:text-[#F54A00]

                md:mt-10
                md:text-base
              "
            >
              Start a conversation
              <ArrowUpRight
                className="
                  h-4
                  w-4
                "
              />
            </a>
          </div>

          {/* INFO */}

          <div
            className="
              flex
              flex-col

              justify-end

              gap-5

              border-t
              border-white/10

              pt-6

              md:border-l
              md:border-t-0

              md:pl-10
              md:pt-0
            "
          >
            <ContactLink
              icon={<Mail />}
              label="Email"
              value="eleviastudio25@gmail.com"
              href="mailto:eleviastudio25@gmail.com"
            />

            <ContactLink
              icon={<Phone />}
              label="Phone"
              value="+91 79907 50320"
              href="tel:+917990750320"
            />

            <ContactLink
              icon={<MapPin />}
              label="Studio"
              value="A-808, PNTC, Satellite, Ahmedabad-380015"
            />
          </div>
        </div>

        {/* ======================================================
            FOOTER BOTTOM
            ====================================================== */}

        <div
          className="
            mt-16

            flex
            flex-col

            gap-5

            border-t
            border-white/10

            pt-5

            text-[8px]
            uppercase

            tracking-[0.2em]

            text-white/40

            md:mt-20

            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          <div>
            <p
              className="
                text-[10px]
                font-medium

                tracking-[0.18em]

                text-white/80
              "
            >
              Elevia Studio
            </p>

            <p
              className="
                mt-1

                normal-case
                tracking-normal

                text-white/35
              "
            >
              Engineering meets creative direction.
            </p>
          </div>

          {/* Instagram only */}

          <SocialLink
            href="https://www.instagram.com/eleviastudio_?igsh=MW5qeTFtaWp2OTByNw=="
            label="Instagram"
          />

          <div
            className="
              flex
              items-center
              justify-between

              gap-8

              md:justify-end
            "
          >
            <span>© {new Date().getFullYear()} Elevia Studio</span>

            <span>All rights reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ==========================================================================
   CONTACT ITEM
   ========================================================================== */

function ContactLink({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;

  label: string;

  value: string;

  href?: string;
}) {
  const content = (
    <>
      <span
        className="
          grid

          h-9
          w-9

          shrink-0

          place-items-center

          rounded-full

          border
          border-white/10

          text-[#F54A00]

          [&>svg]:h-4
          [&>svg]:w-4
        "
      >
        {icon}
      </span>

      <span>
        <span
          className="
            block

            text-[7px]
            uppercase

            tracking-[0.22em]

            text-white/35
          "
        >
          {label}
        </span>

        <span
          className="
            mt-1

            block

            text-sm
            font-light

            text-white/80
          "
        >
          {value}
        </span>
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="
          flex
          items-center
          gap-3

          transition-opacity

          hover:opacity-70
        "
      >
        {content}
      </a>
    );
  }

  return (
    <div
      className="
        flex
        items-center
        gap-3
      "
    >
      {content}
    </div>
  );
}

/* ==========================================================================
   SOCIAL
   ========================================================================== */

function SocialLink({
  href,
  label,
}: {
  href: string;

  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="
        relative

        grid

        h-9
        w-9

        place-items-center

        overflow-hidden

        rounded-full

        border
        border-white/10

        transition-all

        hover:border-[#F54A00]
        hover:bg-[#F54A00]
      "
    >
      <Image
        src="/social/instagram.svg"
        alt=""
        fill
        aria-hidden="true"
        draggable={false}
        className="
          select-none
          object-contain

          p-2
        "
      />
    </a>
  );
}
