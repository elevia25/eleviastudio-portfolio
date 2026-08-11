"use client";

import {
  forwardRef,
  type HTMLAttributes,
} from "react";

export const SECTION_SHELL_CLASS =
  "relative isolate w-full overflow-hidden";

export const SECTION_VIEWPORT_CLASS =
  "relative h-svh w-full overflow-hidden";

export const SECTION_FLOW_CONTENT_OFFSET_CLASS =
  "pt-[10rem] sm:pt-[11rem] md:pt-[12rem]";

type SectionHeadingProps = {
  number: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "children">;

const SectionHeading = forwardRef<HTMLDivElement, SectionHeadingProps>(
  function SectionHeading(
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
      left: "items-start text-left",
      center: "items-center text-center",
      right: "items-end text-right",
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
          absolute
          left-1/2
          top-5
          z-[100]
          flex
          w-[92vw]
          max-w-[1500px]
          -translate-x-1/2
          flex-col
          md:top-7
          ${alignment[align]}
          ${className}
        `}
      >
        <div
          className={`
            flex
            w-full
            items-start
            ${titleAlignment[align]}
            text-[clamp(2.6rem,7.6vw,7rem)]
            font-light
            leading-[0.8]
            tracking-[-0.075em]
            ${titleClassName}
          `}
        >
          <span
            className="
              mr-[0.48em]
              inline-block
              pt-[0.08em]
              text-[0.24em]
              font-medium
              tracking-normal
              opacity-45
            "
          >
            {number}
          </span>

          <span className="text-balance">{title}</span>
        </div>

        {subtitle && (
          <p
            className={`
              mt-2.5
              max-w-[620px]
              text-[11px]
              font-light
              leading-[1.5]
              tracking-[0.02em]
              opacity-45
              sm:text-xs
              md:mt-3
              md:text-sm
              ${subtitleClassName}
            `}
          >
            {subtitle}
          </p>
        )}
      </div>
    );
  },
);

export default SectionHeading;
