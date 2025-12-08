import { cn } from "@/lib/utils";
import { Badge } from "./badge";

interface RichHeadingProps {
  badge?: string;
  description?: string;
  children: React.ReactNode; // Ini untuk Title utama
  className?: string;
}

export default function RichHeading({
  badge,
  description,
  children,
  className,
}: RichHeadingProps) {
  return (
    <div
      className={cn(
        "w-full max-w-7xl mx-auto text-center px-4 py-12",
        className
      )}
    >
      {/* 1. Badge Section */}
      {badge && (
        <div className="flex justify-center">
          <Badge>{badge}</Badge>
        </div>
      )}

      {/* 2. Main Title Section */}
      <h2 className="text-3xl md:text-5xl lg:text-[4.5rem] font-bold leading-[1.2] md:leading-[1.15] tracking-tight text-black dark:text-white text-left">
        {children}
      </h2>

      {/* 3. Description Section */}
      {description && (
        <p className="mt-6 text-lg text-black max-w-2xl mx-auto leading-relaxed dark:text-white">
          {description}
        </p>
      )}
    </div>
  );
}
