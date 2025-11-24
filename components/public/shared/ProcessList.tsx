interface ProcessItem {
  id: string | number;
  label: string;
}

interface ProcessListProps {
  items: ProcessItem[];
}

export const ProcessList = ({ items }: ProcessListProps) => {
  return (
    <ul className="flex flex-col w-full mt-8">
      {items.map((item, index) => (
        <li
          key={index}
          className="flex items-center gap-4 border-t border-gray-200 py-3 text-sm font-medium text-black dark:text-white"
        >
          <span className="text-gray-500 font-normal">
            ({String(index + 1).padStart(2, "0")})
          </span>
          <span>{item.label}</span>
        </li>
      ))}
      {/* Border penutup bawah */}
      <li className="border-t border-gray-200 w-full"></li>
    </ul>
  );
};
