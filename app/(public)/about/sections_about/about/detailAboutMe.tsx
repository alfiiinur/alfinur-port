import { techstack } from "@/components/dataMock/techstack";

import { MarqueTemp } from "@/components/public/shared/MarqueTemp";
import SectionLabel from "@/components/public/shared/SectionLabel";

import StatsGrid from "../achievements/StatsGrid";

export const DetailAboutMe = () => {
  return (
    <section className="max-w-7xl mx-auto py-12 px-4">
      <section className="py-20 px-6 md:py-32 bg-white dark:bg-black transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-1 gap-12 lg:gap-20 items-center">
            {/* Stats Section with side-by-side layout */}
            <div className="mb-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Left side - Title & Description */}
                <div>
                  <SectionLabel text="Statistics" />
                  <h2 className="text-4xl md:text-5xl font-bold dark:text-white mt-6 tracking-tight leading-tight text-black">
                    Numbers that
                    <br />
                    speak for itself
                  </h2>
                  <p className="dark:text-gray-400 mt-6 text-sm md:text-base leading-relaxed max-w-md text-black">
                    These statistics reflect my dedication to delivering quality
                    work and building lasting relationships with clients across
                    various projects.
                  </p>
                </div>

                {/* Right side - Stats Grid */}
                <div>
                  <StatsGrid />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="">
        <div className="flex justify-between">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-black dark:text-white mb-8 italic">
            Technical Expertise{" "}
          </h1>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-black dark:text-white mb-8 italic">
            Skills{" "}
          </h1>
        </div>

        <MarqueTemp reviews={techstack} size="md" />
      </div>
    </section>
  );
};
