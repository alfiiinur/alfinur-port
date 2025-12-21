"use client";

import { workProcessSteps } from "@/components/dataMock/servicesShowcase";
import { AnimatedLines } from "@/components/public/shared/AnimatedText";
import { RoundedButton } from "@/components/public/shared/RoundedButton";
import { motion } from "motion/react";

const titleLines = ["The Best Work Happens When We", "Build It Together"];

export default function WorkProcess() {
  return (
    <section className="py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <AnimatedLines
          lines={titleLines}
          as="h2"
          className="text-3xl md:text-4xl font-bold text-foreground"
        />
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-right"
        >
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            OUR WORK PROCESS
          </p>
        </motion.div>
      </div>

      {/* Process Steps */}
      <div className="space-y-0">
        {workProcessSteps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group border-t border-border last:border-b hover:bg-muted/30 transition-all duration-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-8 md:py-12 items-center">
              <div className="md:col-span-3 flex items-center gap-6">
                <span className="text-5xl md:text-6xl font-bold text-muted-foreground/30 group-hover:text-primary transition-colors">
                  {step.number}
                </span>
              </div>
              <div className="md:col-span-3">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
              </div>
              <div className="md:col-span-6">
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-12 flex justify-center"
      >
        <RoundedButton href="/projects">View All Projects</RoundedButton>
      </motion.div>
    </section>
  );
}
