import { Timeline } from "@/components/public/shared/Timeline";
import { AboutHero } from "./about/aboutHero";
import { PrincipalsSection } from "./about/principlasSection";
import { ServicesSection } from "./about/ServicesSection";
import { timelineData } from "@/components/dataMock/timelineWork";
import { DetailAboutMe } from "./about/detailAboutMe";
import { GithubProfile } from "@/components/public/shared/githubprofile/GithubProfile";

export default function AboutPage() {
  return (
    <main className="bg-white text-black max-w-7xl mx-auto py-12 px-4 dark:bg-black">
      <AboutHero />

      {/* <PrincipalsSection /> */}
      {/* <Timeline items={timelineData} /> */}
      <DetailAboutMe />
      <GithubProfile />
      <ServicesSection />
    </main>
  );
}
