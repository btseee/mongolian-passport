"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

export type PassportCategory = "diplomat" | "normal" | "special";

export interface CountryInfo {
  iso2: string;
  iso3: string;
  nameEn: string;
  nameMn?: string;
  flagUrl?: string;
  visaFreeDuration?: string | number | null;
  effectiveDate?: string | null;
  notes?: string | null;
  passportType?: string | null;
  category: PassportCategory;
}

interface CountrySidebarProps {
  country: CountryInfo | null;
  isOpen: boolean;
  onClose: () => void;
}

const categoryStyles: Record<PassportCategory, { label: string; color: string }> = {
  diplomat: { label: "Дипломат/Албан", color: "bg-blue-600" },
  normal: { label: "Энгийн", color: "bg-green-600" },
  special: { label: "Тусгай", color: "bg-yellow-500 text-black" },
};

export default function CountrySidebar({ country, isOpen, onClose }: CountrySidebarProps) {
  const [extra, setExtra] = useState<{
    capital?: string;
    region?: string;
    subregion?: string;
    population?: number;
    area?: number;
    currencies?: string;
    languages?: string;
    timezones?: string[];
    mapUrl?: string;
    coat?: string; // coat of arms svg
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchRest = async (iso3: string) => {
      try {
        setLoading(true);
        setError(null);
        setExtra(null);
        const res = await fetch(
          `https://restcountries.com/v3.1/alpha/${encodeURIComponent(iso3)}?fields=name,capital,region,subregion,population,area,languages,currencies,timezones,maps,coatOfArms`
        );
        if (!res.ok) throw new Error(`REST Countries ${res.status}`);
        type RestCurrency = { name: string; symbol?: string };
        type RestCountry = {
          capital?: string[];
          region?: string;
          subregion?: string;
          population?: number;
          area?: number;
          languages?: Record<string, string>;
          currencies?: Record<string, RestCurrency>;
          timezones?: string[];
          maps?: { googleMaps?: string };
          coatOfArms?: { svg?: string };
        };
        const data: RestCountry[] | RestCountry = await res.json();
        const item: RestCountry | undefined = Array.isArray(data) ? data[0] : data;
        if (!item) return;
        const currencies = item.currencies
          ? Object.values(item.currencies)
              .map((c: RestCurrency) => (c && c.name ? c.name : ""))
              .filter(Boolean)
              .join(", ")
          : undefined;
        const languages = item.languages ? Object.values(item.languages).join(", ") : undefined;
        const capital = Array.isArray(item.capital) ? item.capital[0] : item.capital;
        if (!cancelled) {
          setExtra({
            capital,
            region: item.region,
            subregion: item.subregion,
            population: item.population,
            area: item.area,
            currencies,
            languages,
            timezones: item.timezones,
            mapUrl: item.maps?.googleMaps,
            coat: item.coatOfArms?.svg,
          });
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load";
        if (!cancelled) setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    if (country?.iso3) fetchRest(country.iso3);
    return () => {
      cancelled = true;
    };
  }, [country?.iso3]);

  return (
    <aside
      aria-label="Country details"
      className={`fixed top-0 left-0 h-full w-full sm:w-[380px] md:w-[420px] lg:w-[480px] z-[60] transform transition-transform duration-300 ease-out backdrop-blur-sm ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="h-full overflow-y-auto bg-white/90 dark:bg-gray-900/90 shadow-xl border-r border-gray-200/60 dark:border-gray-800/60">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200/60 dark:border-gray-800/60">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Мэдээлэл</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition text-black dark:text-black"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {country ? (
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src={`https://flagcdn.com/${country.iso2.toLowerCase()}.svg`}
                alt={`${country.nameEn} flag`}
                width={32}
                height={24}
                className="rounded-sm border border-gray-200 dark:border-gray-800"
              />
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-gray-900 dark:text-white truncate">
                  {country.nameMn ?? country.nameEn}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {country.iso3} • {country.nameEn}
                </p>
              </div>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryStyles[country.category].color}`}>
                {categoryStyles[country.category].label}
              </span>
            </div>

            <dl className="grid grid-cols-1 gap-3 text-sm">
              {country.passportType && (
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Паспортын төрөл</dt>
                  <dd className="text-gray-900 dark:text-gray-100">{country.passportType}</dd>
                </div>
              )}

              {country.visaFreeDuration != null && (
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Визгүй хугацаа</dt>
                  <dd className="text-gray-900 dark:text-gray-100">{String(country.visaFreeDuration)}</dd>
                </div>
              )}

              {country.effectiveDate && (
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Хүчинтэй огноо</dt>
                  <dd className="text-gray-900 dark:text-gray-100">{country.effectiveDate}</dd>
                </div>
              )}

              {country.notes && (
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Тэмдэглэл</dt>
                  <dd className="text-gray-900 dark:text-gray-100 whitespace-pre-line">{country.notes}</dd>
                </div>
              )}
            </dl>

            {/* Extra info from public APIs */}
            <div className="pt-2 border-t border-gray-200/60 dark:border-gray-800/60">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Нэмэлт мэдээлэл</h3>
              {loading && (
                <p className="text-sm text-gray-500 dark:text-gray-400">Ачаалж байна…</p>
              )}
              {error && (
                <p className="text-sm text-red-600">Алдаа: {error}</p>
              )}
              {extra && (
                <div className="space-y-2 text-sm">
                  <dl className="grid grid-cols-1 gap-2">
                    {extra.capital && (
                      <div><dt className="text-gray-500 dark:text-gray-400">Нийслэл</dt><dd className="text-gray-900 dark:text-gray-100">{extra.capital}</dd></div>
                    )}
                    {extra.region && (
                      <div><dt className="text-gray-500 dark:text-gray-400">Бүс нутаг</dt><dd className="text-gray-900 dark:text-gray-100">{extra.region}{extra.subregion ? ` • ${extra.subregion}` : ""}</dd></div>
                    )}
                    {typeof extra.population === 'number' && (
                      <div><dt className="text-gray-500 dark:text-gray-400">Хүн ам</dt><dd className="text-gray-900 dark:text-gray-100">{extra.population.toLocaleString()}</dd></div>
                    )}
                    {typeof extra.area === 'number' && (
                      <div><dt className="text-gray-500 dark:text-gray-400">Талбай</dt><dd className="text-gray-900 dark:text-gray-100">{extra.area.toLocaleString()} км²</dd></div>
                    )}
                    {extra.languages && (
                      <div><dt className="text-gray-500 dark:text-gray-400">Хэл</dt><dd className="text-gray-900 dark:text-gray-100">{extra.languages}</dd></div>
                    )}
                    {extra.currencies && (
                      <div><dt className="text-gray-500 dark:text-gray-400">Валют</dt><dd className="text-gray-900 dark:text-gray-100">{extra.currencies}</dd></div>
                    )}
                    {extra.timezones && extra.timezones.length > 0 && (
                      <div><dt className="text-gray-500 dark:text-gray-400">Цагийн бүс</dt><dd className="text-gray-900 dark:text-gray-100">{extra.timezones.join(", ")}</dd></div>
                    )}
                    {extra.mapUrl && (
                      <div><dt className="text-gray-500 dark:text-gray-400">Газрын зураг</dt><dd><a href={extra.mapUrl} target="_blank" className="text-indigo-600 hover:underline">Google Maps</a></dd></div>
                    )}
                  </dl>
                  {extra.coat && (
                    <div className="mt-2">
                      <Image src={extra.coat} alt="Coat of arms" width={80} height={80} className="mx-auto" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 text-sm text-gray-500 dark:text-gray-400">Улс сонгоно уу…</div>
        )}
      </div>
    </aside>
  );
}
