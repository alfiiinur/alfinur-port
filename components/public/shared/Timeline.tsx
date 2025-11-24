import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type TimelineItem = {
  title: string;
  company: string;
  role: string;
  period: string;
  description: string;
};

type TimelineProps = {
  items: TimelineItem[];
  className?: string;
};

export const Timeline = ({ items, className = "" }: TimelineProps) => {
  return (
    <div className={`relative ${className}`}>
      {/* Garis vertikal — mobile di kiri, desktop di tengah */}
      <div className="absolute top-0 bottom-0 left-6 md:left-1/2 w-0.5 -translate-x-1/2 bg-border" />

      {items.map((item, index) => {
        const isEven = index % 2 === 0;

        return (
          <div
            key={index}
            className="relative flex items-start mb-12 last:mb-0"
          >
            {/* Timeline Dot */}
            <div
              className={`
                absolute top-7 left-6 md:left-1/2 
                w-4 h-4 bg-primary rounded-full ring-4 ring-background 
                -translate-x-1/2 z-10
              `}
            />

            {/* Card Content */}
            <div
              className={`
                w-full pl-16 md:pl-0 
                md:w-1/2 
                ${isEven ? "md:pr-12" : "md:pl-12 md:text-right"}
              `}
            >
              <Card className="p-5 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg md:text-xl font-bold italic text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1 text-base md:text-lg font-semibold text-primary">
                  {item.company}
                </p>

                <div
                  className={`
                    flex flex-wrap gap-2 mt-3 
                    ${!isEven && "md:justify-end"}
                  `}
                >
                  <Badge variant="secondary" className="text-xs md:text-sm">
                    {item.role}
                  </Badge>
                  <Badge variant="outline" className="text-xs md:text-sm">
                    {item.period}
                  </Badge>
                </div>

                <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </Card>
            </div>

            {/* Spacer kosong di sisi berlawanan (hanya desktop) */}
            <div className="hidden md:block md:w-1/2" />
          </div>
        );
      })}
    </div>
  );
};
