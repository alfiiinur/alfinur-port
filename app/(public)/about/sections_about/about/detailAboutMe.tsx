import { techstack } from "@/components/dataMock/techstack";

import { MarqueTemp } from "@/components/public/shared/MarqueTemp";
import { RoundedButton } from "@/components/public/shared/RoundedButton";
import { TextReveal } from "@/components/public/shared/TextGenerateEffect";

import Image from "next/image";

export const DetailAboutMe = () => {
  return (
    <section className="max-w-7xl mx-auto py-12 px-4">
      <div className="space-y-6 max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-black dark:text-white">
          ALFI NUR DANIALIN
        </h2>
        <TextReveal className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
          I,m Alfi Nur Danialin, a passionate Full-Stack Developer with over 8
          years of experience in crafting dynamic web applications. My journey
          began with a fascination for coding, which has since evolved into a
          career dedicated to building seamless digital experiences. I thrive on
          turning complex problems into elegant solutions, leveraging the latest
          technologies to deliver high-quality results. Let,s connect and create
          something amazing together!
        </TextReveal>
        <RoundedButton href="/contact">Get in Touch</RoundedButton>
      </div>

      <section className="py-20 px-6 md:py-32 bg-white dark:bg-black transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Image */}
            <div className="order-2 md:order-1">
              <div className="relative group">
                <Image
                  src="/frontend/designGraphic/cover.png"
                  alt="Our workspace / team room"
                  width={800}
                  height={600}
                  className="rounded-2xl shadow-2xl object-cover w-full h-auto
                       transition-transform duration-700 group-hover:scale-[1.02]"
                  priority
                />
                {/* Optional subtle overlay gradient */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>

            {/* Right: Stats Grid */}
            <div className="order-1 md:order-2 space-y-10 md:space-y-16">
              <div className="grid grid-cols-3 gap-6 md:gap-8">
                {[
                  { number: "15+", label: "Clients" },
                  { number: "2+", label: "Years Experience" },
                  { number: "5+", label: "Problems Solved" },
                  { number: "98%", label: "Client Satisfaction" },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="text-center group/stat hover:scale-105 transition-all duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Number */}
                    <h3
                      className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter
                             bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400
                             bg-clip-text text-transparent cursor-pointer"
                    >
                      {stat.number}
                    </h3>
                    {/* Label */}
                    <p
                      className="mt-3 text-sm md:text-base font-medium text-gray-600 dark:text-gray-400
                             tracking-wide uppercase"
                    >
                      {stat.label}
                    </p>

                    {/* Subtle underline on hover */}
                    <span
                      className="block mx-auto mt-3 w-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 
                                group-hover/stat:w-full transition-all duration-500 rounded-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="">
        <div className="flex justify-between">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-black dark:text-white mb-8 italic">
            Technical Expertise{" "}
          </h1>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-black dark:text-white mb-8 italic">
            Skills{" "}
          </h1>
        </div>

        <MarqueTemp reviews={techstack} size="md" />
      </div>
    </section>
  );
};
