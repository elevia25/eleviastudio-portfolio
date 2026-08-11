"use client";

import {
  forwardRef,
  type HTMLAttributes,
} from "react";

type SectionHeadingProps = {
  number: string;
  title: string;
  subtitle?: string;

  align?: "left" | "center" | "right";

  /*
   * Useful when one specific section
   * needs a slight adjustment without
   * changing the global component.
   */
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
} & Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
>;

const SectionHeading = forwardRef<
  HTMLDivElement,
  SectionHeadingProps
>(function SectionHeading(
  {
    number,
    title,
    subtitle,

    align = "center",

    className = "",
    titleClassName = "",
    subtitleClassName = "",

    ...props
  },
  ref,
) {
  const alignment = {
    left: `
      items-start
      text-left
    `,

    center: `
      items-center
      text-center
    `,

    right: `
      items-end
      text-right
    `,
  };

  const titleAlignment = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  return (
    <div
      ref={ref}
      {...props}
      className={`
        pointer-events-none

        flex
        flex-col

        ${alignment[align]}

        ${className}
      `}
    >
      {/* ====================================================== */}
      {/* MAIN HEADING                                           */}
      {/* ====================================================== */}

      <div
        className={`
          flex
          w-full

          items-start

          ${titleAlignment[align]}

          text-[clamp(2.7rem,8vw,7.2rem)]

          font-light
          leading-[0.78]

          tracking-[-0.08em]

          ${titleClassName}
        `}
      >
        <span
          className="
            mr-[0.45em]
            inline-block

            pt-[0.1em]

            text-[0.3em]
            font-medium

            tracking-normal

            opacity-45
          "
        >
          {number}
        </span>

        <span>
          {title}
        </span>
      </div>

      {/* ====================================================== */}
      {/* SUBHEADING                                             */}
      {/* ====================================================== */}

      {subtitle && (
        <p
          className={`
            mt-3

            max-w-[620px]

            text-[16px]
            font-light
            leading-[1.5]

            tracking-[0.02em]

            opacity-45

            sm:text-xs
            md:mt-4
            md:text-sm

            ${subtitleClassName}
          `}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
});

export default SectionHeading;