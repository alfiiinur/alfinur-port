import { Design } from "@/components/dataMock/designs";
import Link from "next/link";

interface DesignDetailHeroProps {
  design: Design;
}

export default function DesignDetailHero({ design }: DesignDetailHeroProps) {
  return (
    <div className="max-w-5xl mx-auto mb-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link
          href="/design"
          className="hover:text-foreground transition-colors"
        >
          Design
        </Link>
        <span>/</span>
        <span className="text-foreground">{design.title}</span>
      </nav>

      {/* Category & Year */}
      <div className="flex items-center gap-4 mb-4">
        <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
          {design.category}
        </span>
        <span className="text-muted-foreground">{design.year}</span>
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
        {design.title}
      </h1>

      {/* Description */}
      <p className="text-xl text-muted-foreground mb-8">{design.description}</p>

      {/* Meta Information */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {design.client && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">Client</p>
            <p className="font-semibold text-foreground">{design.client}</p>
          </div>
        )}
        <div>
          <p className="text-sm text-muted-foreground mb-1">Year</p>
          <p className="font-semibold text-foreground">{design.year}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Category</p>
          <p className="font-semibold text-foreground">{design.category}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Tags</p>
          <p className="font-semibold text-foreground">{design.tags.length}</p>
        </div>
      </div>

      {/* Featured Image */}
      <div className="rounded-2xl overflow-hidden bg-linear-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 aspect-video" />
    </div>
  );
}
