import {
  galleryItems,
  socialLinks,
  titleDesc,
} from "@/components/dataMock/galleryItems";
import AboutPageSection from "./about";
import SocialGallerySection from "./sections_about/gallery/gallery_section";
import { RichHeadingSection } from "./sections_about/rich_heading";
import MissionSection from "./sections_about/section_story";

import { awards, testimonials } from "@/components/dataMock/awardsItems";
import AchievementsSection from "./sections_about/achievements/AchievementsSection";
import ServicesSection from "../home/sections/services";

export default function AboutPage() {
  const sampleVideoUrl =
    "https://videos.pexels.com/video-files/5532772/5532772-uhd_2732_1440_25fps.mp4";
  return (
    <section className="min-h-screen bg-white dark:bg-black">
      <RichHeadingSection />

      <MissionSection
        labelLink={{
          text: "My Journey",
          href: "/about",
        }}
        badge="IT Developer"
        title="My Mission Is Simple: To Create Digital Solutions That Make a Real Impact and Drive Success"
        description="Explore my portfolio where creativity meets technology. Every project showcases my dedication to building innovative web applications that solve real problems and deliver exceptional user experiences."
        mediaItems={[
          {
            type: "video",
            src: sampleVideoUrl,
            alt: "Creative Process Video",
            className:
              "grayscale hover:grayscale-0 transition-all duration-500",
          },
          {
            type: "image",
            src: "/img/room.jpg",
            alt: "Workspace",
            className:
              "grayscale hover:grayscale-0 transition-all duration-500",
          },
        ]}
      />
      <AboutPageSection />
      <AchievementsSection
        label="Carrer"
        title="My Achievements"
        awards={awards}
        testimonials={testimonials}
      />
      <SocialGallerySection
        titleDescription={titleDesc}
        items={galleryItems}
        socialLinks={socialLinks}
      />
      <ServicesSection />
    </section>
  );
}
