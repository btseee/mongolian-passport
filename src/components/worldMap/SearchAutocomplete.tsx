"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

export interface SearchItem {
  iso3: string;
  iso2: string;
  nameEn: string;
  nameMn?: string;
  category: "diplomat" | "normal" | "special" | "other";
}

interface SearchAutocompleteProps {
  items: SearchItem[];
  onSelect: (item: SearchItem) => void;
}

const categoryColor: Record<SearchItem["category"], string> = {
  diplomat: "bg-blue-500",
  normal: "bg-green-500",
  special: "bg-yellow-400",
  other: "bg-gray-400",
};

export default function SearchAutocomplete({ items, onSelect }: SearchAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.filter((i) => i.category !== "other");
    return items
      .filter(
        (i) =>
          i.category !== "other" &&
          (i.nameEn.toLowerCase().includes(q) || (i.nameMn ?? "").toLowerCase().includes(q) || i.iso2.toLowerCase().includes(q) || i.iso3.toLowerCase().includes(q))
      )
      .slice(0, 12);
  }, [items, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      const item = filtered[activeIndex];
      if (item) {
        onSelect(item);
      }
    }
  };

  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.children[activeIndex] as HTMLElement | undefined;
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  return (
    <div className="relative w-full sm:w-96">
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
        <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-3.5-3.5M3.75 10.5a6.75 6.75 0 1113.5 0 6.75 6.75 0 01-13.5 0z" />
        </svg>
        <input
          type="text"
          placeholder="Улс хайх…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
        />
      </div>

      {filtered.length > 0 && (
        <ul
          ref={listRef}
          className="absolute mt-2 max-h-72 w-full overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 shadow-xl z-20"
        >
          {filtered.map((item, idx) => (
            <li
              key={item.iso3}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer ${
                idx === activeIndex ? "bg-gray-50 dark:bg-gray-800" : "hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
              onMouseEnter={() => setActiveIndex(idx)}
              onClick={() => onSelect(item)}
            >
              <span className={`inline-block h-2.5 w-2.5 rounded-full ${categoryColor[item.category]}`} />
              <span className="flex-1 text-sm text-gray-900 dark:text-gray-100 truncate">
                {item.nameMn ?? item.nameEn}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{item.iso3}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
