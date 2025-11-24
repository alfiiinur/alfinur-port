import Link from "next/link";

interface SocialStickerProps {
  href: string;
  label: string;
  rotate?: string;
}

export default function SocialSticker({
  href,
  label,
  rotate = "rotate-0",
}: SocialStickerProps) {
  return (
    <Link
      href={href}
      className={`bg-black text-white px-6 py-2 text-sm font-medium shadow-lg transform transition-transform hover:scale-105 hover:z-10 ${rotate} border border-gray-200 inline-block dark:bg-white dark:text-black rounded-lg`}
    >
      {label}
    </Link>
  );
}
