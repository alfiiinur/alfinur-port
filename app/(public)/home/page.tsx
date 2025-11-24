import { HeroGrids } from "./grids/heroGrids";
import { SectionHeader } from "./sections/headers";

export default function HomePage() {
  return (
    <>
      <section className="bg-white dark:bg-black min-h-screen pb-20">
        <div>
          <SectionHeader />
          <HeroGrids />
        </div>
      </section>
    </>
  );
}
