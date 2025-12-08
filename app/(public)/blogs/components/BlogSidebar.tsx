"use client";

interface BlogSidebarProps {
  categories: string[];
}

export default function BlogSidebar({ categories }: BlogSidebarProps) {
  return (
    <aside className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Categories
        </h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div
              key={category}
              className="px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              <span className="font-medium">{category}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
