import WorldMap from "@/components/worldMap/WorldMap";

export default function Home() {
  return (
    <section>
      <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
        <WorldMap/>
      </div>
    </section>
  );
}
