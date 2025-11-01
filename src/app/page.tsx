"use client";

import { useMemo, useState } from "react";
import WorldMap, { MapSelection, MapCategory } from "@/components/worldMap/WorldMap";
import CountrySidebar, { CountryInfo } from "@/components/worldMap/CountrySidebar";
import SearchAutocomplete, { SearchItem } from "@/components/worldMap/SearchAutocomplete";
import normalData from "@/data/passport.json";
import diplomatData from "@/data/diplomat.json";
import specialData from "@/data/special.json";
import iso2to3 from "country-iso-2-to-3";

interface RawCountry {
  country_code: string;
  country_name_en: string;
  country_name_mn?: string;
  visa_free_duration?: string | number | null;
  effective_date?: string | null;
  notes?: string | null;
  passport_type?: string | null;
}

export default function Home() {
  const colorByIso3 = useMemo(() => {
    const map: Record<string, MapCategory> = {};

    // helper to set with precedence: diplomat > normal > special > other
    const setWithPriority = (iso3: string, category: MapCategory) => {
      const current = map[iso3];
      const rank: Record<MapCategory, number> = { diplomat: 3, normal: 2, special: 1, other: 0 };
      if (current === undefined || rank[category] > rank[current]) map[iso3] = category;
    };

    diplomatData.forEach((c) => {
      const iso3 = iso2to3(c.country_code) as string | undefined;
      if (iso3) setWithPriority(iso3, "diplomat");
    });
    (normalData as RawCountry[]).forEach((c) => {
      const iso3 = iso2to3(c.country_code) as string | undefined;
      if (iso3) setWithPriority(iso3, "normal");
    });
    specialData.forEach((c) => {
      const iso3 = iso2to3(c.country_code) as string | undefined;
      if (iso3) setWithPriority(iso3, "special");
    });

    return map;
  }, []);

  const infoByIso3 = useMemo(() => {
    const map = new Map<string, CountryInfo>();
    // Build info maps from each dataset (use same precedence as colors)
    const apply = (arr: RawCountry[], category: CountryInfo["category"]) => {
      arr.forEach((c) => {
        const iso2 = c.country_code as string;
        const iso3 = (iso2to3(iso2) as string | undefined) ?? "";
        if (!iso3) return;
        const existing = map.get(iso3);
        const rank: Record<CountryInfo["category"], number> = { diplomat: 3, normal: 2, special: 1 };
        if (!existing || rank[category] > rank[existing.category]) {
          map.set(iso3, {
            iso2,
            iso3,
            nameEn: c.country_name_en,
            nameMn: c.country_name_mn,
            visaFreeDuration: c.visa_free_duration ?? null,
            effectiveDate: c.effective_date ?? null,
            notes: c.notes ?? null,
            passportType: c.passport_type ?? null,
            category,
          });
        }
      });
    };

    apply(diplomatData as RawCountry[], "diplomat");
    apply(normalData as RawCountry[], "normal");
    apply(specialData as RawCountry[], "special");

    return map;
  }, []);

  const searchItems: SearchItem[] = useMemo(() => {
    const items: SearchItem[] = [];
    for (const [iso3, category] of Object.entries(colorByIso3)) {
      const info = infoByIso3.get(iso3);
      if (!info) continue;
      items.push({ iso3, iso2: info.iso2, nameEn: info.nameEn, nameMn: info.nameMn, category });
    }
    return items.sort((a, b) => (a.nameMn ?? a.nameEn).localeCompare(b.nameMn ?? b.nameEn));
  }, [colorByIso3, infoByIso3]);

  const [selected, setSelected] = useState<MapSelection | null>(null);
  const selectedInfo: CountryInfo | null = selected ? infoByIso3.get(selected.iso3) ?? null : null;

  const handleSelectIso3 = (iso3: string) => setSelected({ iso3 });

  return (
    <section className="relative h-full">
      {/* Overlays */}
      {!selected && (
        <div className="pointer-events-none fixed left-4 top-20 z-50 flex flex-col gap-3">
          <div className="pointer-events-auto">
            <SearchAutocomplete
              items={searchItems}
              onSelect={(item) => handleSelectIso3(item.iso3)}
            />
          </div>
          <div className="pointer-events-none flex items-center gap-3 text-xs text-gray-600 dark:text-gray-300 bg-white/70 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 w-fit backdrop-blur">
            <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-blue-600"/> Дипломат</span>
            <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-green-600"/> Энгийн</span>
            <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-yellow-500"/> Тусгай</span>
            <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-gray-300"/> Бусад</span>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <CountrySidebar
        country={selectedInfo}
        isOpen={!!selected}
        onClose={() => setSelected(null)}
      />

      {/* World Map Fullscreen */}
      <div className="absolute inset-0">
        <WorldMap
          selected={selected}
          onSelect={handleSelectIso3}
          colorByIso3={colorByIso3}
        />
      </div>
    </section>
  );
}