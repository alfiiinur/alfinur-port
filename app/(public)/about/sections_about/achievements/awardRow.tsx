import { AwardData } from "./types";

export default function AwardRow({ data }: { data: AwardData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-8 border-b border-gray-100 group hover:bg-gray-50/50 transition-colors px-2 rounded-lg">
      <div className="md:col-span-4">
        <h3 className="text-lg font-bold text-gray-900">{data.name}</h3>
      </div>
      <div className="md:col-span-7">
        <p className="text-gray-500 leading-relaxed">{data.description}</p>
      </div>
      <div className="md:col-span-1 text-right">
        <span className="text-gray-900 font-medium">{data.year}</span>
      </div>
    </div>
  );
}
