import Intro from "@/components/Intro";
import Hero from "@/components/Hero";
import LogoDiceSection from "@/components/LogoDiceSection";
import SocialMediaManagementSection from "@/components/SocialMediaManagementSection";
import SelectedWorkConceptA from "@/components/SelectedWorkConceptA";
import ReelsShowcaseSection from "@/components/ReelsShowcaseSection";
import AboutUsSection from "@/components/AboutUsSection";
import PackagingShowcaseSection from "@/components/PackagingShowcaseSection";
import FeaturedReelSection from "@/components/FeaturedReelSection";

export default function Home() {
  return (
    <Intro>
      <main className="relative bg-[#faf7ef]">
        <Hero />

        <LogoDiceSection />
        <FeaturedReelSection />
        <PackagingShowcaseSection />
        <SelectedWorkConceptA />
        <SocialMediaManagementSection />
        <ReelsShowcaseSection />
        <AboutUsSection />
      </main>
    </Intro>
  );
}
