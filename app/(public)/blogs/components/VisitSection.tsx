import { offices } from "@/components/dataMock/blogs";

export default function VisitSection() {
  return (
    <section className="py-16 border-t border-border">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
          Come to visit <span className="italic font-light">us</span>
        </h2>
      </div>

      {/* Office Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offices.map((office) => (
          <div
            key={office.id}
            className="group relative overflow-hidden rounded-2xl bg-muted aspect-4/3 cursor-pointer"
          >
            {/* Image Placeholder */}
            <div className="absolute inset-0 bg-linear-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800" />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/60 to-transparent">
              <p className="text-white/80 text-sm mb-1">{office.location}</p>
              <h3 className="text-white text-xl font-bold mb-2">
                {office.name}
              </h3>
              <p className="text-white/70 text-sm">{office.address}</p>
            </div>

            {/* Arrow Button */}
            <button className="absolute top-4 right-4 w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <svg
                className="w-5 h-5 text-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
