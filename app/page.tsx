"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

import Intro from "@/components/Intro";
import Hero from "@/components/Hero";

const LogoDiceSection = dynamic(() => import("../components/LogoDiceSection"), {
  ssr: false,
  loading: () => null,
});

export default function Home() {
  const [finished, setFinished] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setFinished(true);
  }, []);

  return (
    <main className="relative bg-[#faf7ef]">
      {!finished && <Intro onComplete={handleIntroComplete} />}

      <Hero visible={finished} />

      {finished && <LogoDiceSection />}
    </main>
  );
}
