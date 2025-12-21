import { GithubProfile } from "@/components/public/shared/githubprofile/GithubProfile";
import { AboutHero } from "./sections_about/about/aboutHero";
import { DetailAboutMe } from "./sections_about/about/detailAboutMe";
import TechnicalExpertise from "./sections_about/skills/TechnicalExpertise";

export default function AboutPageSection() {
  return (
    <main className="bg-white text-black max-w-7xl mx-auto py-12 px-4 dark:bg-black">
      <AboutHero />

      {/* <PrincipalsSection /> */}
      {/* <Timeline items={timelineData} /> */}
      <DetailAboutMe />
      <TechnicalExpertise />
      <GithubProfile />
    </main>
  );
}
