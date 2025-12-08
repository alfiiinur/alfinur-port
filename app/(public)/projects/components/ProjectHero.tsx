import SectionLabel from "@/components/public/shared/SectionLabel";

export default function ProjectHero() {
  return (
    <section className="pt-32 pb-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <SectionLabel text="Our Work" />
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
          Creative{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
            Projects
          </span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Explore our portfolio of innovative designs and digital solutions that
          help brands stand out and connect with their audience.
        </p>
      </div>
    </section>
  );
}
