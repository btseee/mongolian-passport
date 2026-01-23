"use client";

import { useState, useCallback } from "react";
import type { CountryData } from "@/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WorldMapSVG from "@/components/WorldMapSVG";
import SearchBar from "@/components/SearchBar";
import CountrySidebar from "@/components/CountrySidebar";
import Legend from "@/components/Legend";

export default function Home() {
  // State
  const [language, setLanguage] = useState<"en" | "mn">("mn");
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [selectedIso2, setSelectedIso2] = useState<string | null>(null);
  const [selectionKey, setSelectionKey] = useState(0);

  // Handlers
  const handleSelectCountry = useCallback((iso2: string | null, data: CountryData | null) => {
    setSelectedIso2(iso2);
    setSelectedCountry(data);
    setSelectionKey((k) => k + 1); // Increment to force zoom even if same country
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setSelectedIso2(null);
    setSelectedCountry(null);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: 'var(--map-bg)' }}>
      {/* Header */}
      <Header language={language} onLanguageChange={setLanguage} />

      {/* Main Content */}
      <main className="absolute inset-0 pt-20 pb-16 pointer-events-none">
        {/* World Map */}
        <div className="w-full h-full pointer-events-auto">
          <WorldMapSVG
            selectedCountry={selectedIso2}
            onSelectCountry={handleSelectCountry}
            selectionKey={selectionKey}
          />
        </div>
      </main>

      {/* Search Bar - Top Left - positioned from screen top */}
      <div className="absolute top-28 left-4 z-50 w-72">
        <SearchBar
          onSelectCountry={handleSelectCountry}
          language={language}
        />
      </div>

      {/* Legend - Top Right - positioned from screen top */}
      <div className="absolute top-28 right-4 z-50">
        <Legend language={language} />
      </div>

      {/* Country Sidebar */}
      <CountrySidebar
        selectedCountry={selectedCountry}
        onClose={handleCloseSidebar}
        language={language}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}