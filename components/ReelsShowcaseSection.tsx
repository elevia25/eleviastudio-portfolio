"use client";

import { gsap } from "gsap";
import Link from "next/link";
import { type RefObject, useEffect, useLayoutEffect, useRef } from "react";

type Reel = {
  video: string;
  client: string;
  link?: string;
  category: string;
};

const REELS: Reel[] = [
  {
    video: "/reels/reel-01.mp4",
    link: "https://www.instagram.com/reel/DWbZx8sSiYh/?igsh=OGRjaGloem9sNmhy",
    client: "Social Campaign",
    category: "Brand Reel",
  },
  {
    video: "/reels/reel-02.mp4",
    link: "https://www.instagram.com/reel/DWBqNY2iRQE/?igsh=cnhid216bHBoMXpr",
    client: "Product Story",
    category: "Product Reel",
  },
  {
    video: "/reels/reel-03.mp4",
    client: "Social Identity",
    link: "https://www.instagram.com/reel/DUitDX5E_Pa/?igsh=MTJkYnJwaTNsajF1bA==",
    category: "Motion",
  },
  {
    video: "/reels/reel-04.mp4",
    link: "https://www.instagram.com/reel/DZsSyect2N7/?igsh=bWg2NWVnOGNoeWdr",
    client: "Campaign",
    category: "Short-form",
  },
  {
    video: "/reels/reel-05.mp4",
    link: "https://www.instagram.com/reel/DZCc-hPMpgk/?igsh=MWNoemJlZGNnM2g0bg==",
    client: "Content",
    category: "Social Media",
  },
  {
    video: "/reels/reel-06.mp4",
    link: "https://www.instagram.com/reel/Da8OR_YNgFr/?igsh=MTZyaXQ2aXVtencwcA==",
    client: "Creative",
    category: "Reel",
  },
  {
    video: "/reels/reel-09.mp4",
    client: "Creative",
    category: "Reel",
  },
];
export default function ReelsShowcaseSection() {
  const rootRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeTweenRef = useRef<gsap.core.Tween | null>(null);

  const videoMapRef = useRef<Map<string, HTMLVideoElement>>(new Map());

  const handleMarqueeHover = (isHovered: boolean) => {
    const marqueeTween = marqueeTweenRef.current;

    if (!marqueeTween) {
      return;
    }

    if (isHovered) {
      marqueeTween.pause();
      return;
    }

    marqueeTween.play();
  };

  useLayoutEffect(() => {
    const root = rootRef.current;
    const marquee = marqueeRef.current;

    if (!root || !marquee) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      gsap.set(marquee, {
        xPercent: 0,
      });

      return;
    }

    const duration = window.innerWidth < 768 ? 28 : 38;

    const context = gsap.context(() => {
      /*
       * The track contains:
       *
       * GROUP A
       * GROUP B
       *
       * Both groups are identical.
       *
       * Moving the entire track by exactly 50%
       * places B where A originally was.
       */
      const marqueeTween = gsap.fromTo(
        marquee,
        {
          xPercent: 0,
        },
        {
          xPercent: -50,
          duration,
          ease: "none",
          repeat: -1,
          force3D: true,
        },
      );

      marqueeTweenRef.current = marqueeTween;

      /*
       * Don't keep animating the marquee while this
       * section is far outside the viewport.
       */
      const sectionObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            marqueeTween.play();
          } else {
            marqueeTween.pause();
          }
        },
        {
          root: null,
          rootMargin: "300px 0px 300px 0px",
          threshold: 0,
        },
      );

      sectionObserver.observe(root);

      return () => {
        sectionObserver.disconnect();
        marqueeTween.kill();
      };
    }, root);

    return () => {
      context.revert();
    };
  }, []);

  /*
   * ------------------------------------------------------------------------
   * Video playback observer
   * ------------------------------------------------------------------------
   *
   * Only videos close to the viewport are allowed to play.
   */
  useEffect(() => {
    const videos = videoMapRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;

          if (entry.isIntersecting) {
            void video.play().catch(() => {
              /*
               * Muted autoplay normally works.
               * Ignore browser-specific rejection.
               */
            });
          } else {
            video.pause();
          }
        });
      },
      {
        root: null,
        rootMargin: "120px 280px 120px 280px",
        threshold: 0.05,
      },
    );

    videos.forEach((video) => {
      observer.observe(video);
    });

    return () => {
      observer.disconnect();

      videos.forEach((video) => {
        video.pause();
      });
    };
  }, []);

  return (
    <section
      ref={rootRef}
      aria-label="Social media reels"
      className="
        relative
        isolate
        z-1
        min-h-svh
        w-full
        overflow-hidden
        bg-[#f1eadf]
        py-20
        text-[#152d34]
        sm:py-24
        md:py-28
        lg:py-32
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[47%]
          z-0
          -translate-x-1/2
          -translate-y-1/2
          whitespace-nowrap
          text-[clamp(9rem,27vw,30rem)]
          font-light
          leading-none
          -tracking-widest
          text-[#152d34]/[0.035]
        "
      >
        SOCIAL
      </div>
      <div
        className="
          relative
          z-20
          mx-auto
          mb-14
          flex
          w-full
          max-w-375
          items-end
          justify-between
          gap-8
          px-5
          md:mb-20
          md:px-10
        "
      >
        <div>
          <p
            className="
              mb-5
              text-[10px]
              font-medium
              uppercase
              tracking-[0.3em]
              text-[#152d34]/50
            "
          >
            04 / Social Content
          </p>

          <h2
            className="
              max-w-4xl
              text-[clamp(3.5rem,8vw,8.5rem)]
              font-light
              leading-[0.78]
              tracking-[-0.075em]
            "
          >
            Reels that
            <br />
            keep moving.
          </h2>
        </div>

        <p
          className="
            hidden
            max-w-xs
            text-sm
            leading-relaxed
            text-[#152d34]/60
            md:block
          "
        >
          Short-form stories designed to hold attention, communicate faster and
          keep brands moving through social feeds.
        </p>
      </div>
      <div
        tabIndex={0}
        onMouseEnter={() => handleMarqueeHover(true)}
        onMouseLeave={() => handleMarqueeHover(false)}
        onFocus={() => handleMarqueeHover(true)}
        onBlur={() => handleMarqueeHover(false)}
        className="
          relative
          z-10
          w-full
          overflow-hidden
          py-5
          outline-none
          md:py-8
        "
      >
        {/* Left fade */}

        <div
          className="
            pointer-events-none
            absolute
            inset-y-0
            left-0
            z-30
            w-[7vw]
            bg-linear-to-r
            from-[#f1eadf]
            to-transparent
          "
        />

        {/* Right fade */}

        <div
          className="
            pointer-events-none
            absolute
            inset-y-0
            right-0
            z-30
            w-[7vw]
            bg-linear-to-l
            from-[#f1eadf]
            to-transparent
          "
        />

        <div
          ref={marqueeRef}
          className="
            flex
            w-max
            transform-gpu
            will-change-transform
          "
        >
          {/* First set */}

          <ReelGroup reels={REELS} videoRefs={videoMapRef} group="a" />

          {/* Duplicate set */}

          <ReelGroup
            reels={REELS}
            videoRefs={videoMapRef}
            group="b"
            ariaHidden
          />
        </div>
      </div>

      <div
        className="
          relative
          z-20
          mx-auto
          mt-12
          flex
          w-full
          max-w-375
          flex-col
          gap-5
          px-5
          md:mt-16
          md:flex-row
          md:items-center
          md:justify-between
          md:px-10
        "
      >
        <div
          className="
            flex
            flex-wrap
            gap-x-6
            gap-y-2
            text-[9px]
            font-medium
            uppercase
            tracking-[0.22em]
            text-[#152d34]/45
          "
        >
          <span>Concept</span>
          <span>Strategy</span>
          <span>Editing</span>
          <span>Motion</span>
          <span>Social</span>
        </div>

        <div
          className="
            flex
            items-center
            gap-3
            text-[10px]
            uppercase
            tracking-[0.22em]
            text-[#152d34]/45
          "
        >
          <span
            className="
              inline-block
              h-1.5
              w-1.5
              rounded-full
              bg-[#152d34]/45
            "
          />
          Always in motion
        </div>
      </div>
    </section>
  );
}

function ReelGroup({
  reels,
  videoRefs,
  group,
  ariaHidden = false,
}: {
  reels: Reel[];

  videoRefs: RefObject<Map<string, HTMLVideoElement>>;

  group: string;

  ariaHidden?: boolean;
}) {
  const setVideoRef = (el: HTMLVideoElement | null, key: string) => {
    if (el) {
      videoRefs.current.set(key, el);
    } else {
      videoRefs.current.delete(key);
    }
  };
  return (
    <div
      aria-hidden={ariaHidden ? true : undefined}
      className="
        flex
        shrink-0
        items-center
        gap-4
        pr-4
        sm:gap-5
        sm:pr-5
        md:gap-7
        md:pr-7
      "
    >
      {reels.map((reel, index) => (
        <ReelCard
          key={`${group}-${reel.video}`}
          reel={reel}
          index={index}
          group={group}
          setVideoRef={setVideoRef}
        />
      ))}
    </div>
  );
}

function ReelCard({
  reel,
  index,
  setVideoRef,
  group,
}: {
  reel: Reel;

  index: number;
  group: string;
  setVideoRef: (el: HTMLVideoElement | null, key: string) => void;
}) {
  const rotation = [-2.2, 1.1, -0.7, 2, -1.2, 0.8][index % 6];

  const verticalOffset = [14, -10, 6, -16, 10, -6][index % 6];
  const cardKey = `${group}-${index}`;
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isVideoInViewport = (video: HTMLVideoElement) => {
    const rect = video.getBoundingClientRect();

    return (
      rect.bottom > 0 &&
      rect.top < window.innerHeight &&
      rect.right > 0 &&
      rect.left < window.innerWidth
    );
  };

  const handleVideoHover = (isHovered: boolean) => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (isHovered) {
      video.pause();
      return;
    }

    if (isVideoInViewport(video)) {
      void video.play().catch(() => {
        /* Ignore browser-specific autoplay rejection. */
      });
    }
  };

  return (
    /*
     * Outer element owns layout offset/rotation.
     *
     * Inner element owns hover scale.
     *
     * This avoids two transforms fighting each other.
     */
    <article
      className="
        relative
        shrink-0
        transform-gpu
      "
      style={{
        transform: `
          translate3d(
            0,
            ${verticalOffset}px,
            0
          )
          rotate(${rotation}deg)
        `,
      }}
    >
      <div
        className="
          group
          relative
          aspect-9/16
          w-47.5
          transform-gpu
          overflow-hidden
          rounded-[1.8rem]
          bg-[#172f36]
          shadow-[0_24px_60px_rgba(21,45,52,0.16)]
          transition-transform
          duration-500
          ease-out
          hover:scale-[1.035]
          sm:w-55
          md:w-62.5
          lg:w-68.5
        "
      >
        <Link target={"_blank"} href={reel.link ?? ""}>
          <video
            ref={(el) => {
              videoRef.current = el;
              setVideoRef(el, cardKey);
            }}
            muted
            loop
            playsInline
            preload="metadata"
            onMouseEnter={() => handleVideoHover(true)}
            onMouseLeave={() => handleVideoHover(false)}
            onFocus={() => handleVideoHover(true)}
            onBlur={() => handleVideoHover(false)}
            className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            transition-transform
            duration-700
            ease-out
            group-hover:scale-[1.025]
          "
          >
            <source src={reel.video} type="video/mp4" />
          </video>
        </Link>

        {/* Readability layer */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-linear-to-t
            from-black/50
            via-transparent
            to-black/5
          "
        />

        {/* Number */}

        <div
          className="
            absolute
            left-4
            top-4
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            border
            border-white/20
            bg-black/10
            text-[9px]
            font-medium
            text-white
            backdrop-blur-md
          "
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Information */}

        <div
          className="
            absolute
            inset-x-0
            bottom-0
            p-4
            text-white
            sm:p-5
          "
        >
          <p
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-[0.2em]
              text-white/60
            "
          >
            {reel.category}
          </p>

          <p
            className="
              mt-1
              text-lg
              font-light
              tracking-[-0.04em]
              sm:text-xl
            "
          >
            {reel.client}
          </p>
        </div>
      </div>
    </article>
  );
}
