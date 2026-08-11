import Intro from "@/components/Intro";
import Hero from "@/components/Hero";
import LogoDiceSection from "@/components/ui/LogoDiceSection";
import SocialMediaManagementSection from "@/components/ui/SocialMediaManagementSection";
import SelectedWorkConceptA from "@/components/ui/SelectedWorkConceptA";
import ReelsShowcaseSection from "@/components/ui/ReelsShowcaseSection";
import AboutUsSection from "@/components/ui/AboutUsSection";
import PackagingShowcaseSection from "@/components/ui/PackagingShowcaseSection";
import FeaturedReelSection from "@/components/ui/FeaturedReelSection";

export default function Home() {
  return (
    <Intro>
      <main className="relative bg-[#faf7ef]">
        <Hero visible />

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
