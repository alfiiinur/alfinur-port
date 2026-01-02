"use client";

interface SidebarNavProps {
  topics: { id: string; title: string }[];
  language: "en" | "id";
}

export const SidebarNav = ({ topics, language }: SidebarNavProps) => {
  const topicsLabel = language === "id" ? "Topik" : "Topics";

  return (
    <nav className="hidden md:block sticky top-24 h-fit">
      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-6">
        {topicsLabel}
      </h3>
      <ul className="flex flex-col gap-3">
        {topics.map((topic) => (
          <li key={topic.id}>
            <a
              href={`#${topic.id}`}
              className="text-sm text-gray-400 hover:text-gray-900 hover:underline transition-colors block"
            >
              {topic.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
