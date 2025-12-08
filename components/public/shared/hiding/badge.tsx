import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const Badge = ({ children, className }: BadgeProps) => {
  return (
    <div className={cn(
      "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-50 text-orange-600 border border-orange-100 mb-6",
      className
    )}>
      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-2" />
      {children}
    </div>
  );
};