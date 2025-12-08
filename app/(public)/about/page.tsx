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

export default function AboutPage() {
  const sampleVideoUrl =
    "https://videos.pexels.com/video-files/5532772/5532772-uhd_2732_1440_25fps.mp4";
  return (
    <section className="min-h-screen bg-white dark:bg-black">
      <RichHeadingSection />
      <MissionSection
        // 1. Label Link di kiri (Sticky)
        labelLink={{
          text: "Our Story",
          href: "/about",
        }}
        // 2. Badge kecil di atas judul
        badge="Award Winning Agency"
        // 3. Judul Utama (Bisa pakai HTML tag untuk styling spesifik seperti bold/light)
        title={
          <>
            <span className="font-semibold">Our Mission Is Simple</span>{" "}
            <span className="text-gray-400 font-normal">Yet Powerful: To</span>{" "}
            <span className="text-gray-400 font-normal">
              Deliver Work That Inspires, Connects, and Leaves a Lasting Impact!
            </span>
          </>
        }
        // 4. Deskripsi
        description={
          <p>
            Explore a collection where art and design merge to shape what's
            next.{" "}
            <strong className="text-gray-900">
              This gallery isn't just about visuals
            </strong>
            , it's about experiencing the future of creativity in motion.
          </p>
        }
        // 5. Media (Campuran Video & Image)
        mediaItems={[
          {
            type: "video",
            src: sampleVideoUrl,
            alt: "Creative Process Video",
            // Anda bisa tambah custom class jika perlu
            className:
              "grayscale hover:grayscale-0 transition-all duration-500",
          },
          {
            type: "image",
            // Ganti dengan import gambar atau URL
            src: "/img/room.jpg",
            alt: "Team Portrait",
            className:
              "grayscale hover:grayscale-0 transition-all duration-500",
          },
        ]}
      />
      <AboutPageSection />
      <SocialGallerySection
        titleDescription={titleDesc}
        items={galleryItems}
        socialLinks={socialLinks}
      />
      <AchievementsSection
        label="Our Achievements"
        title="Awards & Recognition"
        awards={awards}
        testimonials={testimonials}
      />
    </section>
  );
}
