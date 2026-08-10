import Intro from "@/components/Intro";
import Hero from "@/components/Hero";
import LogoDiceSection from "@/components/LogoDiceSection";
import SocialMediaManagementSection from "@/components/SocialMediaManagementSection";
import SelectedWorkConceptA from "@/components/SelectedWorkConceptA";
import ReelsShowcaseSection from "@/components/ReelsShowcaseSection";
import AboutUsSection from "@/components/AboutUsSection";
import PackagingShowcaseSection from "@/components/PackagingShowcaseSection";

export default function Home() {
  return (
    <Intro>
      <main className="relative bg-[#faf7ef]">
        <Hero visible />

        <LogoDiceSection />

        <SocialMediaManagementSection />
        <PackagingShowcaseSection />

        <SelectedWorkConceptA />

        <ReelsShowcaseSection />

        <AboutUsSection />
      </main>
    </Intro>
  );
}
