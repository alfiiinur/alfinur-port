import { Button } from "@/components/ui/moving-border";

export const SectionHeader = () => {
  return (
    <div className="text-center max-w-7xl mx-auto py-12 px-4 mt-10">
      <div>
        <Button
          borderRadius="1.75rem"
          className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800 px-2 py-1 text-xs font-bold tracking-widest uppercase mb-6 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
        >
          HALLO EVERYONE
        </Button>
      </div>
      <h2 className="font-anton text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-balance text-black dark:text-white">
        I,m Alfi Nur Danialin <br /> a{" "}
        <span className="font-Libre_Baskerville italic">IT Developer</span>{" "}
        <br /> based on <span className="italic">Indonesia.</span>
      </h2>
      <p className="font-poppins text-black dark:text-white max-w-2xl mx-auto mb-8 text-sm md:text-base leading-relaxed">
        Welcome to my portfolio website! I,m passionate about crafting
        innovative and efficient IT solutions that drive success. Explore my
        projects, skills, and experiences as you get to know more about my
        journey in the tech world.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button className="bg-black text-white dark:bg-white dark:text-black px-8 py-3 rounded-full font-medium hover:scale-105 transition-transform">
          Get Started — For Free!
        </button>
        <button className="border border-gray-300 px-8 py-3 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
          Book A Demo
        </button>
      </div>
    </div>
  );
};
