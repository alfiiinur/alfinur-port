import { Design } from "@/components/dataMock/designs";
import Link from "next/link";

interface RelatedDesignsProps {
  designs: Design[];
}

export default function RelatedDesigns({ designs }: RelatedDesignsProps) {
  return (
    <section className="mt-16 pt-12 border-t border-border">
      <h2 className="text-3xl font-bold text-foreground mb-8">
        Related Projects
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {designs.map((design) => (
          <Link
            key={design.id}
            href={`/design/${design.slug}`}
            className="group"
          >
            <article className="h-full">
              {/* Image */}
              <div className="relative overflow-hidden rounded-xl mb-4 bg-linear-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 aspect-video">
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                    {design.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {design.year}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {design.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {design.description}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
