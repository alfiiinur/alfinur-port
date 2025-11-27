import { cn } from "@/lib/utils";

type CardTempProps = { name: string; size: string };

export const CardTemp = ({ name, size }: CardTempProps) => {
  return (
    <figure
      className={cn(
        "relative h-full cursor-pointer overflow-hidden p-4",
        "flex justify-center items-center"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-col">
          <div className="flex justify-center items-center gap-4">
            <p className={`text-${size} font-medium dark:text-white rotate-0`}>
              {name}
            </p>
          </div>
        </div>
      </div>
    </figure>
  );
};
