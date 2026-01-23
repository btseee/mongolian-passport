"use client";

import { useMemo } from "react";
import type { CountryData } from "@/types";
import { categoryColors, categoryLabels } from "@/lib/visaData";

interface CountrySidebarProps {
  selectedCountry: CountryData | null;
  onClose: () => void;
  language: "en" | "mn";
}

export default function CountrySidebar({
  selectedCountry,
  onClose,
  language,
}: CountrySidebarProps) {
  const categoryColor = useMemo(() => {
    if (!selectedCountry) return categoryColors.none;
    return categoryColors[selectedCountry.category];
  }, [selectedCountry]);

  const categoryLabel = useMemo(() => {
    if (!selectedCountry) return categoryLabels.none;
    return categoryLabels[selectedCountry.category];
  }, [selectedCountry]);

  const formatDuration = (duration: number | string): string => {
    if (typeof duration === "number") {
      return language === "en" ? `${duration} days` : `${duration} хоног`;
    }
    return String(duration);
  };

  const labels = {
    duration: language === "en" ? "Duration" : "Хугацаа",
    passportType: language === "en" ? "Passport Type" : "Паспортын төрөл",
    effectiveDate: language === "en" ? "Effective Date" : "Хүчинтэй огноо",
    notes: language === "en" ? "Notes" : "Тэмдэглэл",
    countryCode: language === "en" ? "Country Code" : "Улсын код",
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-[400px] glass-panel-dark transform transition-transform duration-500 ease-out z-50 ${
        selectedCountry ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {selectedCountry && (
        <div className="h-full flex flex-col p-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: categoryColor }}
            />
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Country Name */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">
              {language === "en" ? selectedCountry.name_en : selectedCountry.name_mn}
            </h2>
            <p className="text-lg text-white/60">
              {language === "en" ? selectedCountry.name_mn : selectedCountry.name_en}
            </p>
          </div>

          {/* Category Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 w-fit"
            style={{ backgroundColor: `${categoryColor}20` }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: categoryColor }}
            />
            <span className="text-sm font-medium" style={{ color: categoryColor }}>
              {language === "en" ? categoryLabel.en : categoryLabel.mn}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-4 flex-1">
            {/* Visa Duration */}
            <div className="glass-panel p-4">
              <div className="flex items-center gap-3 mb-2">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm text-white/50">{labels.duration}</span>
              </div>
              <p className="text-xl font-semibold text-white">
                {formatDuration(selectedCountry.visa_free_duration)}
              </p>
            </div>

            {/* Passport Type */}
            <div className="glass-panel p-4">
              <div className="flex items-center gap-3 mb-2">
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
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                  />
                </svg>
                <span className="text-sm text-white/50">{labels.passportType}</span>
              </div>
              <p className="text-lg font-medium text-white">
                {selectedCountry.passport_type}
              </p>
            </div>

            {/* Effective Date */}
            {selectedCountry.effective_date && (
              <div className="glass-panel p-4">
                <div className="flex items-center gap-3 mb-2">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm text-white/50">{labels.effectiveDate}</span>
                </div>
                <p className="text-lg font-medium text-white">
                  {selectedCountry.effective_date}
                </p>
              </div>
            )}

            {/* Notes */}
            {selectedCountry.notes && (
              <div className="glass-panel p-4">
                <div className="flex items-center gap-3 mb-2">
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm text-white/50">{labels.notes}</span>
                </div>
                <p className="text-sm text-white/80 leading-relaxed">{selectedCountry.notes}</p>
              </div>
            )}
          </div>

          {/* Country Code */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between text-white/40 text-sm">
              <span>{labels.countryCode}</span>
              <span className="font-mono text-white/60">
                {selectedCountry.iso2} / {selectedCountry.iso3}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
