// Passport category types
export type PassportCategory = "normal" | "diplomat" | "special" | "none";

// Base country visa entry
export interface VisaEntry {
  number: number;
  country_name_mn: string;
  country_name_en: string;
  country_code: string; // ISO 2-letter code
  visa_free_duration: number | string;
  effective_date: string | null;
  passport_type: string;
  notes?: string;
}

// Merged country data for the map
export interface CountryData {
  iso2: string;
  iso3: string;
  name_en: string;
  name_mn: string;
  category: PassportCategory;
  visa_free_duration: number | string;
  passport_type: string;
  effective_date: string | null;
  notes?: string;
  number: number;
}

// Map position state
export interface MapPosition {
  coordinates: [number, number];
  zoom: number;
}

// Selected country state
export interface MapSelection {
  iso3: string;
  iso2: string;
  data: CountryData | null;
}

// Color theme for categories
export interface CategoryColors {
  normal: string;
  diplomat: string;
  special: string;
  none: string;
}

// Search result item
export interface SearchResult {
  iso2: string;
  iso3: string;
  name_en: string;
  name_mn: string;
  category: PassportCategory;
}

// Geography feature from TopoJSON
export interface GeoFeature {
  rsmKey: string;
  properties: {
    name?: string;
    NAME?: string;
    ISO_A2?: string;
    ISO_A3?: string;
    [key: string]: unknown;
  };
  geometry: {
    type: string;
    coordinates: number[] | number[][] | number[][][];
  };
}
