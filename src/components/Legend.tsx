"use client";

import { useMemo } from "react";
import { loadVisaData, categoryColors, categoryLabels } from "@/lib/visaData";
import type { PassportCategory } from "@/types";

interface LegendProps {
  language: "en" | "mn";
}

// Mongolia flag colors for legend
const mongoliaColors = {
  red: "#c4272f",
  blue: "#015197",
  gold: "#f9cf02",
};

export default function Legend({ language }: LegendProps) {
  const countryMap = useMemo(() => loadVisaData(), []);

  // Count countries by category
  const stats = useMemo(() => {
    const counts: Record<PassportCategory, number> = {
      normal: 0,
      diplomat: 0,
      special: 0,
      none: 0,
    };

    countryMap.forEach((data) => {
      counts[data.category]++;
    });

    return counts;
  }, [countryMap]);

  const legendItems: { category: PassportCategory; show: boolean }[] = [
    { category: "normal", show: true },
    { category: "diplomat", show: true },
    { category: "special", show: true },
  ];

  return (
    <div className="glass-panel p-4 min-w-[200px]">
      <h3 className="text-white/60 text-xs uppercase tracking-wider mb-3 font-medium">
        {language === "en" ? "Passport Types" : "Паспортын төрөл"}
      </h3>
      <div className="space-y-2.5">
        {/* Mongolia special entry */}
        <div className="flex items-center gap-3">
          <div 
            className="w-4 h-4 rounded flex-shrink-0"
            style={{ backgroundColor: mongoliaColors.red }}
          />
          <span className="text-white/80 text-sm flex-1">
            {language === "en" ? "Mongolia (Home)" : "Монгол (Эх орон)"}
          </span>
        </div>
        
        {legendItems
          .filter((item) => item.show)
          .map(({ category }) => (
            <div key={category} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded flex-shrink-0"
                style={{ backgroundColor: categoryColors[category] }}
              />
              <span className="text-white/80 text-sm flex-1">
                {language === "en" 
                  ? categoryLabels[category].en 
                  : categoryLabels[category].mn}
              </span>
              <span className="text-white/40 text-xs font-mono bg-white/5 px-1.5 py-0.5 rounded">
                {stats[category]}
              </span>
            </div>
          ))}
      </div>
      <div className="mt-4 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between text-white/50 text-xs">
          <span>{language === "en" ? "Total Visa-Free" : "Нийт визгүй"}</span>
          <span className="font-mono font-medium text-white/70">{countryMap.size}</span>
        </div>
      </div>
    </div>
  );
}
