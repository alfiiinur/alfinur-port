export default function SectionLabel({ text }: { text: string }) {
  return (
    <div className="inline-flex items-start text-sm font-semibold tracking-wide text-gray-900 mb-2 relative dark:text-white">
      <span className="absolute -left-2 -top-1 w-2 h-2 border-l-2 border-t-2 border-red-500" />
      {text}
      <span className="absolute -right-2 -bottom-1 w-2 h-2 border-r-2 border-b-2 border-red-500" />
    </div>
  );
}
