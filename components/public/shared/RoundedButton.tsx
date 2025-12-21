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
  | { href: string; onClick?: never }
  | { href?: never; onClick?: () => void }
);

export const RoundedButton = ({
  children,
  href,
  onClick,
  className,
  ...rest
}: RoundedButtonProps) => {
  const textContent = (
    <span className="relative overflow-hidden h-4 inline-flex items-center">
      {/* Original text - slides up on hover */}
      <span className="inline-block transition-transform duration-300 ease-out group-hover:-translate-y-full">
        {children}
      </span>
      {/* Duplicate text - slides in from bottom */}
      <span className="absolute left-0 inline-block translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
        {children}
      </span>
    </span>
  );

  const content = (
    <>
      {textContent}
      <ArrowUpRight
        size={16}
        className="transition-transform duration-300 group-hover:rotate-45"
      />
    </>
  );

  const buttonProps: ComponentPropsWithoutRef<typeof Button> = {
    variant: "default",
    size: "lg",
    className: cn(
      "gap-2 rounded-full bg-black px-8 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200",
      "group inline-flex items-center transition-all duration-300 overflow-hidden",
      className
    ),
    children: content,
    ...rest,
  };

  if (href) {
    return (
      <Button asChild {...buttonProps}>
        <Link href={href}>{content}</Link>
      </Button>
    );
  }

  return <Button onClick={onClick} {...buttonProps} />;
};
