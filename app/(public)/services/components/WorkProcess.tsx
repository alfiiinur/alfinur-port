import { workProcessSteps } from "@/components/dataMock/servicesShowcase";

export default function WorkProcess() {
  return (
    <section className="py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            The Best Work Happens When We
          </h2>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Build It Together
          </h2>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            OUR WORK PROCESS
          </p>
        </div>
      </div>

      {/* Process Steps */}
      <div className="space-y-0">
        {workProcessSteps.map((step, index) => (
          <div
            key={step.number}
            className="group border-t border-border last:border-b hover:bg-muted/30 transition-all duration-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-8 md:py-12 items-center">
              {/* Number & Image Column */}
              <div className="md:col-span-3 flex items-center gap-6">
                <span className="text-5xl md:text-6xl font-bold text-muted-foreground/30 group-hover:text-primary transition-colors">
                  {step.number}
                </span>
                {index === 0 && (
                  <div className="hidden md:block w-24 h-24 rounded-lg bg-linear-to-br from-blue-400 to-cyan-300 overflow-hidden">
                    <div className="w-full h-full bg-[url('/api/placeholder/96/96')] bg-cover" />
                  </div>
                )}
              </div>

              {/* Title Column */}
              <div className="md:col-span-3">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
              </div>

              {/* Description Column */}
              <div className="md:col-span-6">
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 flex justify-center">
        <button className="group relative px-8 py-4 bg-foreground text-background rounded-full font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <span className="relative z-10">View All Projects</span>
          <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>
    </section>
  );
}
