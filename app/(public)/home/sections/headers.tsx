export const SectionHeader = () => {
  return (
    <div className="text-center max-w-7xl mx-auto py-16 px-4">
      <div className="inline-block border border-gray-300 rounded-full px-4 py-1 text-xs font-bold tracking-widest uppercase mb-6">
        About Us
      </div>
      <h2 className="font-anton text-6xl md:text-8xl font-extrabold mb-6 tracking-tight text-balance text-black dark:text-white">
        Most Powerful Way To <br /> Connect Every Audience
      </h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8 text-sm md:text-base leading-relaxed">
        Since 2004, our technology has helped customers all over the world
        harness the incredible power of video – we even won two Technology.
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
