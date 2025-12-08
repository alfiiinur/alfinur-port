import { Quote } from "lucide-react";
import Image from "next/image";
import { TestimonialData } from "./types";

export default function SimpleTestimonialCard({
  data,
}: {
  data: TestimonialData;
}) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-between">
      <div>
        <Quote className="text-red-500 w-5 h-5 mb-4 fill-red-500 rotate-180" />
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          {data.quote}
        </p>
      </div>

      <div className="flex items-center gap-3 mt-auto">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
          <Image
            src={data.authorImage}
            alt={data.authorName}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">{data.authorName}</p>
          <p className="text-xs text-gray-500">{data.authorRole}</p>
        </div>
      </div>
    </div>
  );
}
