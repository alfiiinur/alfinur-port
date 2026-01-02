"use client";

import { workProcessSteps } from "@/components/dataMock/servicesShowcase";
import { AnimatedLines } from "@/components/public/shared/AnimatedText";
import { RoundedButton } from "@/components/public/shared/RoundedButton";
import { useLanguage } from "@/lib/hooks/useLanguage";
import { motion } from "motion/react";

const titleLinesEn = ["The Best Work Happens When We", "Build It Together"];
const titleLinesId = [
  "Karya Terbaik Terjadi Ketika Kita",
  "Membangunnya Bersama",
];

const workProcessStepsId = [
  {
    number: "01",
    title: "Penemuan",
    description:
      "Kami mulai dengan memahami visi, tujuan, dan tantangan Anda. Melalui riset dan kolaborasi, kami mendefinisikan ruang lingkup proyek dan menetapkan fondasi yang kuat untuk sukses.",
  },
  {
    number: "02",
    title: "Strategi",
    description:
      "Berdasarkan temuan kami, kami mengembangkan strategi komprehensif yang menyelaraskan tujuan bisnis Anda dengan kebutuhan pengguna. Ini termasuk wireframe, arsitektur informasi, dan perencanaan teknis.",
  },
  {
    number: "03",
    title: "Desain",
    description:
      "Tim desain kami menghidupkan strategi dengan visual yang menarik dan antarmuka yang intuitif. Kami fokus pada menciptakan pengalaman yang beresonansi dengan audiens Anda.",
  },
  {
    number: "04",
    title: "Pengembangan",
    description:
      "Menggunakan teknologi modern dan praktik terbaik, kami membangun solusi yang skalabel dan berkinerja tinggi. Kode yang bersih dan arsitektur yang kuat memastikan kesuksesan jangka panjang.",
  },
  {
    number: "05",
    title: "Peluncuran",
    description:
      "Kami memastikan peluncuran yang mulus dengan pengujian menyeluruh, optimasi, dan dukungan. Proyek Anda ditayangkan dengan percaya diri, siap memberikan dampak.",
  },
];

export default function WorkProcess() {
  const { language, t } = useLanguage();

  const titleLines = language === "id" ? titleLinesId : titleLinesEn;
  const steps = language === "id" ? workProcessStepsId : workProcessSteps;

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
            {language === "id" ? "PROSES KERJA KAMI" : "OUR WORK PROCESS"}
          </p>
        </motion.div>
      </div>

      {/* Process Steps */}
      <div className="space-y-0">
        {steps.map((step, index) => (
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
        <RoundedButton href="/projects">
          {language === "id" ? "Lihat Semua Proyek" : "View All Projects"}
        </RoundedButton>
      </motion.div>
    </section>
  );
}
