import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface SocialLinkProps {
  label: string;
  href: string;
}

export const SocialLink = ({ label, href }: SocialLinkProps) => {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between py-3 border-b border-gray-300 hover:border-black transition-colors"
    >
      <span className="font-medium text-sm text-gray-700 group-hover:text-black">
        {label}
      </span>
      <ArrowUpRight
        size={16}
        className="text-gray-400 group-hover:text-black transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
      />
    </Link>
  );
};
