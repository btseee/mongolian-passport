"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import type { CountryData, SearchResult } from "@/types";
import { loadVisaData, categoryColors, getAllCountries } from "@/lib/visaData";

interface SearchBarProps {
  onSelectCountry: (iso2: string, data: CountryData | null) => void;
  language: "en" | "mn";
}

export default function SearchBar({ onSelectCountry, language }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Load country data
  const countryMap = useMemo(() => loadVisaData(), []);
  const allCountries = useMemo(() => getAllCountries(countryMap), [countryMap]);

  // Create ISO2 to data map
  const iso2ToData = useMemo(() => {
    const map = new Map<string, CountryData>();
    countryMap.forEach((data) => {
      map.set(data.iso2, data);
    });
    return map;
  }, [countryMap]);

  // Filter countries based on query
  const filteredCountries = useMemo(() => {
    if (!query.trim()) return allCountries.slice(0, 8);

    const lowerQuery = query.toLowerCase();
    return allCountries
      .filter(
        (country) =>
          country.name_en.toLowerCase().includes(lowerQuery) ||
          country.name_mn.toLowerCase().includes(lowerQuery) ||
          country.iso2.toLowerCase().includes(lowerQuery) ||
          country.iso3.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 8);
  }, [query, allCountries]);

  // Handle selection
  const handleSelect = useCallback(
    (result: SearchResult) => {
      const data = iso2ToData.get(result.iso2) || null;
      onSelectCountry(result.iso2, data);
      setQuery("");
      setIsOpen(false);
      inputRef.current?.blur();
    },
    [iso2ToData, onSelectCountry]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            Math.min(prev + 1, filteredCountries.length - 1)
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (filteredCountries[highlightedIndex]) {
            handleSelect(filteredCountries[highlightedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          inputRef.current?.blur();
          break;
      }
    },
    [isOpen, filteredCountries, highlightedIndex, handleSelect]
  );

  // Reset highlighted index when filtered results change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredCountries]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (listRef.current && isOpen) {
      const highlightedItem = listRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      if (highlightedItem) {
        highlightedItem.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, isOpen]);

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-white/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={language === "en" ? "Search countries..." : "Улс хайх..."}
          className="w-full glass-panel pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all text-sm"
        />
      </div>

      {/* Dropdown */}
      {isOpen && filteredCountries.length > 0 && (
        <ul
          ref={listRef}
          className="absolute top-full left-0 right-0 mt-2 glass-panel-dark overflow-hidden z-50 max-h-80 overflow-y-auto"
        >
          {filteredCountries.map((country, index) => (
            <li key={country.iso3}>
              <button
                onClick={() => handleSelect(country)}
                className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                  index === highlightedIndex
                    ? "bg-white/20"
                    : "hover:bg-white/10"
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: categoryColors[country.category] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate text-sm">
                    {language === "en" ? country.name_en : country.name_mn}
                  </p>
                  <p className="text-white/50 text-xs truncate">
                    {language === "en" ? country.name_mn : country.name_en}
                  </p>
                </div>
                <span className="text-white/30 text-xs font-mono">
                  {country.iso2}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* No results */}
      {isOpen && query && filteredCountries.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-panel-dark p-4 text-center text-white/50 text-sm z-50">
          {language === "en" ? "No countries found" : "Улс олдсонгүй"}
        </div>
      )}
    </div>
  );
}
