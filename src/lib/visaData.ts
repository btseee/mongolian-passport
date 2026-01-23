import type { VisaEntry, CountryData, PassportCategory, SearchResult } from "@/types";

// ISO 2 to ISO 3 mapping
const iso2ToIso3: Record<string, string> = {
  CN: "CHN", PH: "PHL", MY: "MYS", KZ: "KAZ", IL: "ISR",
  HK: "HKG", KG: "KGZ", CU: "CUB", MO: "MAC", LA: "LAO",
  TH: "THA", BY: "BLR", TR: "TUR", RU: "RUS", BR: "BRA",
  SG: "SGP", UA: "UKR", AR: "ARG", UY: "URY", CL: "CHL",
  EC: "ECU", PE: "PER", UZ: "UZB", BB: "BRB", AE: "ARE",
  MV: "MDV", PY: "PRY", VN: "VNM", TJ: "TJK", RO: "ROU",
  KP: "PRK", SK: "SVK", CZ: "CZE", MX: "MEX", IN: "IND",
  BG: "BGR", CY: "CYP", PL: "POL", KR: "KOR", KH: "KHM",
  KW: "KWT", DE: "DEU", BN: "BRN", CO: "COL", FR: "FRA",
  MM: "MMR", EE: "EST", LV: "LVA", IT: "ITA", TM: "TKM",
  HU: "HUN", JP: "JPN", NP: "NPL", AL: "ALB", HR: "HRV",
  MT: "MLT", LT: "LTU", CH: "CHE", AZ: "AZE", AM: "ARM",
  GR: "GRC", SI: "SVN", ID: "IDN", OM: "OMN", AT: "AUT",
  US: "USA", GB: "GBR", CA: "CAN", EG: "EGY", KE: "KEN",
};

// Category colors
export const categoryColors: Record<PassportCategory, string> = {
  normal: "#16a34a",   // green-600
  diplomat: "#2563eb", // blue-600
  special: "#eab308",  // yellow-500
  none: "#64748b",     // slate-500
};

// Category labels
export const categoryLabels: Record<PassportCategory, { en: string; mn: string }> = {
  normal: { en: "Visa-free (All Passports)", mn: "Визгүй (Бүх паспорт)" },
  diplomat: { en: "Diplomatic/Official Passport", mn: "Дипломат/Албан паспорт" },
  special: { en: "Special Arrangements", mn: "Тусгай нөхцөл" },
  none: { en: "Visa Required", mn: "Виз шаардлагатай" },
};

// Load and merge all visa data
export function loadVisaData(): Map<string, CountryData> {
  // Import data directly (Next.js handles JSON imports)
  const passportData: VisaEntry[] = require("@/data/passport.json");
  const diplomatData: VisaEntry[] = require("@/data/diplomat.json");
  const specialData: VisaEntry[] = require("@/data/special.json");

  const countryMap = new Map<string, CountryData>();

  // Process normal passport entries
  passportData.forEach((entry) => {
    const iso3 = iso2ToIso3[entry.country_code] || entry.country_code;
    countryMap.set(iso3, {
      iso2: entry.country_code,
      iso3,
      name_en: entry.country_name_en,
      name_mn: entry.country_name_mn,
      category: "normal",
      visa_free_duration: entry.visa_free_duration,
      passport_type: entry.passport_type,
      effective_date: entry.effective_date,
      notes: entry.notes,
      number: entry.number,
    });
  });

  // Process diplomat entries (only add if not already in normal)
  diplomatData.forEach((entry) => {
    const iso3 = iso2ToIso3[entry.country_code] || entry.country_code;
    if (!countryMap.has(iso3)) {
      countryMap.set(iso3, {
        iso2: entry.country_code,
        iso3,
        name_en: entry.country_name_en,
        name_mn: entry.country_name_mn,
        category: "diplomat",
        visa_free_duration: entry.visa_free_duration,
        passport_type: entry.passport_type,
        effective_date: entry.effective_date,
        notes: entry.notes,
        number: entry.number,
      });
    }
  });

  // Process special entries (only add if not already present)
  specialData.forEach((entry) => {
    const iso3 = iso2ToIso3[entry.country_code] || entry.country_code;
    if (!countryMap.has(iso3)) {
      countryMap.set(iso3, {
        iso2: entry.country_code,
        iso3,
        name_en: entry.country_name_en,
        name_mn: entry.country_name_mn,
        category: "special",
        visa_free_duration: entry.visa_free_duration,
        passport_type: entry.passport_type,
        effective_date: entry.effective_date,
        notes: entry.notes,
        number: entry.number,
      });
    }
  });

  return countryMap;
}

// Get country category by ISO3 code
export function getCountryCategory(
  iso3: string,
  countryMap: Map<string, CountryData>
): PassportCategory {
  return countryMap.get(iso3)?.category || "none";
}

// Get fill color for a country
export function getCountryFill(
  iso3: string,
  countryMap: Map<string, CountryData>,
  isSelected: boolean,
  isHovered: boolean
): string {
  const category = getCountryCategory(iso3, countryMap);
  const baseColor = categoryColors[category];

  if (isSelected) {
    return "#f97316"; // orange-500 for selected
  }
  if (isHovered) {
    return "#fb923c"; // orange-400 for hover
  }
  return baseColor;
}

// Search countries
export function searchCountries(
  query: string,
  countryMap: Map<string, CountryData>
): SearchResult[] {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  const results: SearchResult[] = [];

  countryMap.forEach((data) => {
    if (
      data.name_en.toLowerCase().includes(lowerQuery) ||
      data.name_mn.toLowerCase().includes(lowerQuery) ||
      data.iso2.toLowerCase().includes(lowerQuery) ||
      data.iso3.toLowerCase().includes(lowerQuery)
    ) {
      results.push({
        iso2: data.iso2,
        iso3: data.iso3,
        name_en: data.name_en,
        name_mn: data.name_mn,
        category: data.category,
      });
    }
  });

  return results.slice(0, 10);
}

// Get all countries for search
export function getAllCountries(countryMap: Map<string, CountryData>): SearchResult[] {
  const results: SearchResult[] = [];
  countryMap.forEach((data) => {
    results.push({
      iso2: data.iso2,
      iso3: data.iso3,
      name_en: data.name_en,
      name_mn: data.name_mn,
      category: data.category,
    });
  });
  return results.sort((a, b) => a.name_en.localeCompare(b.name_en));
}

// Get country centroid coordinates (approximate)
export const countryCentroids: Record<string, [number, number]> = {
  CHN: [104, 35], PHL: [122, 13], MYS: [109, 4], KAZ: [67, 48], ISR: [35, 31],
  HKG: [114, 22], KGZ: [75, 41], CUB: [-79, 22], MAC: [113, 22], LAO: [103, 18],
  THA: [101, 15], BLR: [28, 53], TUR: [35, 39], RUS: [100, 60], BRA: [-53, -10],
  SGP: [104, 1], UKR: [32, 49], ARG: [-64, -34], URY: [-56, -33], CHL: [-71, -30],
  ECU: [-78, -2], PER: [-76, -10], UZB: [64, 41], BRB: [-59, 13], ARE: [54, 24],
  MDV: [73, 3], PRY: [-58, -23], VNM: [108, 16], TJK: [69, 39], ROU: [25, 46],
  PRK: [127, 40], SVK: [19, 49], CZE: [15, 50], MEX: [-102, 24], IND: [79, 22],
  BGR: [25, 43], CYP: [33, 35], POL: [20, 52], KOR: [128, 36], KHM: [105, 13],
  KWT: [48, 29], DEU: [10, 51], BRN: [115, 4], COL: [-72, 4], FRA: [2, 47],
  MMR: [96, 22], EST: [26, 59], LVA: [25, 57], ITA: [12, 43], TKM: [59, 39],
  HUN: [20, 47], JPN: [138, 36], NPL: [84, 28], ALB: [20, 41], HRV: [16, 45],
  MLT: [14, 36], LTU: [24, 55], CHE: [8, 47], AZE: [48, 40], ARM: [45, 40],
  GRC: [22, 39], SVN: [15, 46], IDN: [120, -5], OMN: [57, 21], AUT: [14, 47],
  USA: [-98, 39], GBR: [-2, 54], CAN: [-106, 56], EGY: [30, 27], KEN: [38, 0],
};
