"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

import Intro from "@/components/Intro";
import Hero from "@/components/Hero";

const LogoDiceSection = dynamic(() => import("../components/LogoDiceSection"), {
  ssr: false,
  loading: () => null,
});

const SocialMediaManagementSection = dynamic(
  () => import("../components/SocialMediaManagementSection"),
  {
    ssr: false,
    loading: () => null,
  },
);

const SelectedWorkConceptA = dynamic(
  () => import("../components/SelectedWorkConceptA"),
  {
    ssr: false,
    loading: () => null,
  },
);

const SelectedWorkConceptB = dynamic(
  () => import("../components/SelectedWorkConceptB"),
  {
    ssr: false,
    loading: () => null,
  },
);

const ReelsShowcaseSection = dynamic(
  () => import("../components/ReelsShowcaseSection"),
  {
    ssr: false,
    loading: () => null,
  },
);

const AboutUsSection = dynamic(() => import("../components/AboutUsSection"), {
  ssr: false,
  loading: () => null,
});

/*
 * Change only this:
 *
 * "A" = animated visual metaphor version
 * "B" = editorial version
 */
const ACTIVE_WORK_CONCEPT: "A" | "B" = "B";

export default function Home() {
  const [finished, setFinished] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setFinished(true);
  }, []);

  return (
    <main className="relative bg-[#faf7ef]">
      {/* Keep Hero rendered below Intro */}
      <Hero visible />

      {!finished && <Intro onComplete={handleIntroComplete} />}

      {finished && (
        <>
          {/* 01 */}
          <LogoDiceSection />

          {/* 02 */}
          <SocialMediaManagementSection />

          {/* 03 - Selected Work */}
          {ACTIVE_WORK_CONCEPT === "A" ? (
            <SelectedWorkConceptA />
          ) : (
            <SelectedWorkConceptB />
          )}

          {/* 04 - Reels */}
          <ReelsShowcaseSection />

          {/* 05 */}
          <AboutUsSection />
        </>
      )}
    </main>
  );
}
