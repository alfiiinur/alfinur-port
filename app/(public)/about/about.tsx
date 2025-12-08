import { GithubProfile } from "@/components/public/shared/githubprofile/GithubProfile";
import { AboutHero } from "./sections_about/about/aboutHero";
import { DetailAboutMe } from "./sections_about/about/detailAboutMe";
import { ServicesSection } from "./sections_about/about/ServicesSection";

export default function AboutPageSection() {
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
