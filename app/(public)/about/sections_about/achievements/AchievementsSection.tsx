import SectionLabel from "@/components/public/shared/SectionLabel";
import AwardRow from "./awardRow";
import SimpleTestimonialCard from "./SimpleTestimonialCard";
import StatCard from "./StatCard";
import { AchievementsSectionProps } from "./types";

export default function AchievementsSection({
  label = "Achievements",
  title = "Awards",
  awards,
  testimonials,
}: AchievementsSectionProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-20 bg-white dark:bg-black">
      {/* Header */}
      <div className="mb-12">
        <SectionLabel text={label} />
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-6 tracking-tight">
          {title}
        </h2>
      </div>

      {/* Awards List */}
      <div className="mb-20">
        <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 text-sm font-medium text-gray-400">
          <div className="col-span-4">Name of the award</div>
          <div className="col-span-7">Description</div>
          <div className="col-span-1 text-right">Year</div>
        </div>

        <div className="flex flex-col">
          {awards.map((award) => (
            <AwardRow key={award.id} data={award} />
          ))}
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((item) => (
          <div key={item.id} className="h-full">
            {item.isHighlight ? (
              <StatCard data={item} />
            ) : (
              <SimpleTestimonialCard data={item} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
