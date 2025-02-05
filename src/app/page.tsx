"use client";

import WorldMap from "@/components/worldMap/WorldMap";
import WorldSideList from "@/components/worldMap/WorldSideList";
import { useState } from "react";

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const handleCountryClick = (countryCode: string) => {
    setSelectedCountry(countryCode); // Update the selected country
  };

  return (
    <section className="min-h-screen p-4 flex justify-center items-center">
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-screen-xl h-full">
        {/* World Map */}
        <div className="w-full md:w-1/2 ">
          <WorldMap onCountryClick={handleCountryClick} />
        </div>

        {/* World Side List */}
        <div className="w-full md:w-1/2 ">
          <WorldSideList selectedCountry={selectedCountry} />
        </div>
      </div>
    </section>
  );
}
