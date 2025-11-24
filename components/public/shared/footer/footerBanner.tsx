import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function FooterBanner() {
  return (
    <div className="bg-white text-black pt-20 pb-10 px-6 relative overflow-hidden  dark:bg-black">
      <Separator className="mb-10 border-black dark:border-white" />
      <div className="max-w-7xl mx-auto relative">
        {/* Contact Link di kanan */}
        <div className="absolute right-0 top-0 md:top-10 z-10">
          <Link
            href="/contact"
            className="text-black text-sm font-medium hover:underline flex items-center gap-1 dark:text-white"
          >
            Contact
          </Link>
        </div>
        <h1 className="text-black font-anton text-[5rem] md:text-[12rem] leading-[0.8] tracking-tight mt-10 dark:text-white">
          Let’s Talk
        </h1>
      </div>
    </div>
  );
}
