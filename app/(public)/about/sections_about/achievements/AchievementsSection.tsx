import SectionLabel from "@/components/public/shared/SectionLabel";
import AwardRow from "./awardRow";
import StatsGrid from "./StatsGrid";
import { AchievementsSectionProps } from "./types";

export default function AchievementsSection({
  label = "Achievements",
  title = "Awards",
  awards,
}: AchievementsSectionProps) {
  return (
    <section className="w-full bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Awards Section */}
        <div>
          <div className="mb-12">
            <SectionLabel text={label} />
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-6 tracking-tight">
              {title}
            </h2>
          </div>

          {/* Awards List */}
          <div>
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-800 text-sm font-medium text-gray-500">
              <div className="col-span-4">Name of the award</div>
              <div className="col-span-6">Description</div>
              <div className="col-span-1 text-right">Year</div>
              <div className="col-span-1 text-right">Cert</div>
            </div>

            <div className="flex flex-col">
              {awards.map((award) => (
                <AwardRow key={award.id} data={award} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
