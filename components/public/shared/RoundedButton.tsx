"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import React, { ComponentPropsWithoutRef } from "react";

type RoundedButtonProps = {
  children: React.ReactNode;
  href?: string;
  className?: string;
} & (
  | { href: string; onClick?: never } // kalau ada href, onClick tidak boleh ada
  | { href?: never; onClick?: () => void }
); // kalau tidak ada href, boleh ada onClick

/**
 * RoundedButton – pakai shadcn/ui Button
 * Otomatis jadi <a> (Link) kalau ada href, jadi <button> kalau ada onClick
 */
export const RoundedButton = ({
  children,
  href,
  onClick,
  className,
  ...rest
}: RoundedButtonProps) => {
  const content = (
    <>
      <span>{children}</span>
      <ArrowUpRight
        size={16}
        className="transition-transform group-hover:rotate-45"
      />
    </>
  );

  // Common button props untuk styling yang sama
  const buttonProps: ComponentPropsWithoutRef<typeof Button> = {
    variant: "default", // bg-black text-white di shadcn default adalah primary (biru), jadi kita pakai custom variant atau override
    size: "lg",
    className: cn(
      // Override styling supaya mirip seperti sebelumnya
      "gap-2 rounded-full bg-black px-8 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200",
      "group inline-flex items-center transition-all duration-300",
      className
    ),
    children: content,
    ...rest,
  };

  // Jika ada href → render sebagai Link yang memakai Button sebagai child
  if (href) {
    return (
      <Button asChild {...buttonProps}>
        <Link href={href}>{content}</Link>
      </Button>
    );
  }

  // Jika tidak ada href → render sebagai button biasa
  return <Button onClick={onClick} {...buttonProps} />;
};
