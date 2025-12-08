import { showcaseItems } from "@/components/dataMock/servicesShowcase";
import { marqueeItems } from "@/components/dataMock/marqueeItems";
import { Marquee } from "@/components/ui/marquee";

export default function ServicesShowcase() {
  return (
    <section className="py-16">
      {/* Header */}
      <div className="mb-12 mx-10">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          OUR BEST WORK
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Explore a Collection of Our Selected
        </h2>
        <p className="text-lg text-muted-foreground">
          Projects where creativity meets purpose
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mx-10">
        {showcaseItems.map((item) => {
          const gridClass =
            item.size === "large"
              ? "col-span-2 row-span-2"
              : item.size === "medium"
              ? "col-span-2 md:col-span-1 row-span-2"
              : "col-span-1";

          return (
            <div
              key={item.id}
              className={`${gridClass} ${item.bgColor} rounded-2xl p-6 relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl min-h-[200px] md:min-h-[250px]`}
            >
              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
                <div>
                  <h3
                    className={`font-bold text-white ${
                      item.size === "large"
                        ? "text-2xl md:text-3xl"
                        : "text-lg md:text-xl"
                    }`}
                  >
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Decorative Element */}
              {item.size === "large" && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
              )}
            </div>
          );
        })}
      </div>

      {/* Marquee */}
      <div className="mt-12 bg-primary dark:bg-primary/90 py-4 rotate-3">
        <Marquee pauseOnHover className="[--duration:20s] [--gap:2rem]">
          {marqueeItems.map((item) => (
            <span
              key={item.id}
              className="text-primary-foreground font-bold text-xl whitespace-nowrap"
            >
              {item.icon} {item.text}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
