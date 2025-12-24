"use client";
import React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import { useRef } from "react";

export default function LampDemo() {
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
      >
        Build lamps <br /> the right way
      </motion.h1>
    </LampContainer>
  );
}

interface LampContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export const LampContainer = ({
  children,
  className,
  title,
  subtitle,
}: LampContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax transforms for heading
  const headingY = useTransform(scrollYProgress, [0, 0.5], [100, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const headingScale = useTransform(scrollYProgress, [0, 0.3], [0.8, 1]);

  // Subtitle transforms
  const subtitleY = useTransform(scrollYProgress, [0, 0.4], [50, 0]);
  const subtitleOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 w-full rounded-md z-0",
        className
      )}
    >
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0 ">
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-cyan-500 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute  w-[100%] left-0 bg-slate-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute  w-40 h-[100%] left-0 bg-slate-950  bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-cyan-500 text-white [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute  w-40 h-[100%] right-0 bg-slate-950  bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute  w-[100%] right-0 bg-slate-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-slate-950 blur-2xl"></div>
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
        <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-cyan-500 opacity-50 blur-3xl"></div>
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-cyan-400 blur-2xl"
        ></motion.div>
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-cyan-400 "
        ></motion.div>

        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-slate-950 "></div>
      </div>

      <div className="relative z-50 flex -translate-y-80 flex-col items-center px-5">
        {/* Animated Title with Scroll */}
        {title && (
          <motion.h2
            style={{
              y: headingY,
              opacity: headingOpacity,
              scale: headingScale,
            }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-center text-white uppercase tracking-tighter mb-4"
          >
            {title.split(" ").map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 50, rotateX: -90 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="inline-block mr-4"
              >
                {word}
              </motion.span>
            ))}
          </motion.h2>
        )}

        {/* Animated Subtitle */}
        {subtitle && (
          <motion.p
            style={{
              y: subtitleY,
              opacity: subtitleOpacity,
            }}
            className="text-lg md:text-xl text-gray-400 text-center max-w-2xl"
          >
            {subtitle}
          </motion.p>
        )}

        {children}
      </div>
    </div>
  );
};

// New component for Project Heading with Lamp effect
export const LampHeading = ({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);

  return (
    <div
      ref={containerRef}
      className={cn("relative py-20 overflow-hidden bg-slate-950", className)}
    >
      {/* Lamp glow effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 1 }}
          className="w-[40rem] h-36 rounded-full bg-cyan-500/30 blur-3xl"
        />
      </div>

      {/* Animated heading */}
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 text-center px-4"
      >
        <motion.h2
          className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {title.split(" ").map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 80, rotateX: -90 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: i * 0.15,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="inline-block mr-4 last:mr-0"
            >
              {word}
            </motion.span>
          ))}
        </motion.h2>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}
      </motion.div>

      {/* Bottom glow line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[30rem] h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
      />
    </div>
  );
};
