interface SidebarNavProps {
  topics: { id: string; title: string }[];
}

export const SidebarNav = ({ topics }: SidebarNavProps) => {
  return (
    <nav className="hidden md:block sticky top-24 h-fit">
      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-6">
        Topics
      </h3>
      <ul className="flex flex-col gap-3">
        {topics.map((topic) => (
          <li key={topic.id}>
            {/* Menggunakan tag <a> biasa dengan scroll-behavior: smooth di CSS global, 
                atau library react-scroll */}
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