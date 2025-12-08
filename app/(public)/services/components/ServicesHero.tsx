import SectionLabel from "@/components/public/shared/SectionLabel";

export default function ServicesHero() {
  return (
    <div className="text-center mb-16">
      <div className="flex justify-center mb-4">
        <SectionLabel text="SERVICES" />
      </div>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
        What I Can Do For You
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
        Professional IT services tailored to your needs. From web design to
        consulting, I deliver quality solutions with a proven process.
      </p>
    </div>
  );
}
