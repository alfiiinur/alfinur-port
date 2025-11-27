import { TextGenerateEffect } from "@/components/ui/text-generate-effect";



interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export function TextReveal({
  children,
  className,
  duration,
}: TextRevealProps) {
  return (
    <TextGenerateEffect
      words={children}
      className={className}
      duration={duration}
    />
  );
}
