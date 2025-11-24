import { ThreeDMarqueeDemo } from "@/components/public/shared/3dMarque";

export default function PortfolioSection() {
  return (
    <section className="w-full bg-white text-black py-20 px-6 dark:bg-black dark:text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between">
          <h1 className="font-anton font-bold text-5xl md:text-7xl">
            My <span className="text-[#C4F135] italic">Portfolio</span>
          </h1>
          <span className="font-anton font-medium self-end text-sm md:text-base  text-gray-600 underline-offset-2 underline italic ">
            Scroll to explore
          </span>
        </div>
        <div>
          <p className="max-w-3xl text-lg md:text-xl font-medium leading-relaxed mt-6">
            We take pride in our diverse portfolio that showcases our expertise
            across various industries. From innovative startups to established
            enterprises, our work reflects our commitment to delivering
            exceptional design solutions that drive results.
          </p>
        </div>
        <ThreeDMarqueeDemo />
      </div>
    </section>
  );
}
