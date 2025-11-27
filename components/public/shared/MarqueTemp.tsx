import { Marquee } from "@/components/ui/marquee";
import { CardTemp } from "./CardTemp";

type Review = {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
};

type MarqueProps = {
  reviews: Review[];
  size?: "sm" | "md" | "lg" | "6xl";
};

export const MarqueTemp = ({ reviews, size = "md" }: MarqueProps) => {
  const firstRow = reviews.slice(0, Math.floor(reviews.length / 2) + 3);

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <div className="w-fit">
        <Marquee pauseOnHover className="[--duration:20s]">
          {firstRow.map((review) => (
            <CardTemp
              key={review.name}
              name={review.name}
              size={review.size || size}
            />
          ))}
        </Marquee>
      </div>
    </div>
  );
};
