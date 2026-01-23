"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import type { CountryData } from "@/types";
import { loadVisaData, categoryColors } from "@/lib/visaData";
import { geoMercator, geoPath, geoCentroid, GeoPermissibleObjects } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";

const WORLD_ATLAS_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Country centroids [longitude, latitude] for quick zoom
const countryCentroids: Record<string, [number, number]> = {
  AF: [67, 33], AL: [20, 41], DZ: [3, 28], AD: [1.5, 42.5], AO: [18, -12],
  AG: [-61.8, 17], AR: [-64, -34], AM: [45, 40], AU: [134, -25], AT: [14, 47],
  AZ: [48, 40], BS: [-77, 24], BH: [50.5, 26], BD: [90, 24], BB: [-59.5, 13],
  BY: [28, 53], BE: [4, 51], BZ: [-88.5, 17], BJ: [2, 9.5], BT: [90, 27.5],
  BO: [-65, -17], BA: [18, 44], BW: [24, -22], BR: [-53, -10], BN: [115, 4.5],
  BG: [25, 43], BF: [-2, 13], BI: [30, -3.5], KH: [105, 13], CM: [12, 6],
  CA: [-106, 56], CV: [-24, 16], CF: [21, 7], TD: [19, 15], CL: [-71, -30],
  CN: [104, 35], CO: [-72, 4], KM: [44, -12], CG: [15, -1], CR: [-84, 10],
  HR: [16, 45], CU: [-79, 22], CY: [33, 35], CZ: [15, 50], DK: [10, 56],
  DJ: [43, 11.5], DM: [-61, 15.5], DO: [-70, 19], EC: [-78.5, -2], EG: [30, 27],
  SV: [-89, 14], GQ: [10, 2], ER: [39, 15], EE: [26, 59], ET: [40, 9],
  FJ: [178, -18], FI: [26, 64], FR: [2, 47], GA: [12, -1], GM: [-16.5, 13.5],
  GE: [43.5, 42], DE: [10, 51], GH: [-2, 8], GR: [22, 39], GD: [-62, 12],
  GT: [-90.5, 15.5], GN: [-10, 11], GW: [-15, 12], GY: [-59, 5], HT: [-72.5, 19],
  HN: [-86.5, 15], HU: [20, 47], IS: [-19, 65], IN: [79, 22], ID: [120, -5],
  IR: [53, 32], IQ: [44, 33], IE: [-8, 53], IL: [35, 31], IT: [12, 43],
  JM: [-77.5, 18], JP: [138, 36], JO: [36, 31], KZ: [67, 48], KE: [38, 0],
  KI: [-157, 1], KP: [127, 40], KR: [128, 36], KW: [48, 29], KG: [75, 41],
  LA: [103, 18], LV: [25, 57], LB: [36, 34], LS: [28.5, -29.5], LR: [-9.5, 6.5],
  LY: [17, 27], LI: [9.5, 47], LT: [24, 55], LU: [6, 50], MK: [22, 41.5],
  MG: [47, -20], MW: [34, -13.5], MY: [109, 4], MV: [73, 3], ML: [-4, 17],
  MT: [14.5, 36], MH: [168, 7], MR: [-11, 20], MU: [57.5, -20], MX: [-102, 24],
  FM: [158, 7], MD: [29, 47], MC: [7.4, 44], MN: [103, 46], ME: [19, 43],
  MA: [-6, 32], MZ: [35, -18], MM: [96, 22], NA: [17, -22], NR: [167, -0.5],
  NP: [84, 28], NL: [5, 52], NZ: [174, -41], NI: [-85, 13], NE: [8, 16],
  NG: [8, 10], NO: [9, 62], OM: [57, 21], PK: [69, 30], PW: [135, 7.5],
  PA: [-80, 9], PG: [147, -6], PY: [-58, -23], PE: [-76, -10], PH: [122, 13],
  PL: [20, 52], PT: [-8, 39.5], QA: [51.5, 25.5], RO: [25, 46], RU: [100, 60],
  RW: [30, -2], KN: [-63, 17], LC: [-61, 14], VC: [-61, 13], WS: [-172, -14],
  SM: [12.5, 44], ST: [7, 1], SA: [45, 24], SN: [-14, 14.5], RS: [21, 44],
  SC: [55.5, -4.5], SL: [-11.5, 8.5], SG: [104, 1], SK: [19.5, 48.5], SI: [15, 46],
  SB: [160, -9], SO: [46, 6], ZA: [24, -29], SS: [30, 7], ES: [-4, 40],
  LK: [81, 7], SD: [30, 16], SR: [-56, 4], SZ: [31.5, -26.5], SE: [16, 62],
  CH: [8, 47], SY: [39, 35], TW: [121, 24], TJ: [69, 39], TZ: [35, -6],
  TH: [101, 15], TL: [126, -9], TG: [1, 8], TO: [-175, -20], TT: [-61, 10.5],
  TN: [9, 34], TR: [35, 39], TM: [59, 39], TV: [179, -8], UG: [32, 1],
  UA: [32, 49], AE: [54, 24], GB: [-2, 54], US: [-98, 39], UY: [-56, -33],
  UZ: [64, 41], VU: [167, -16], VA: [12.5, 42], VE: [-66, 8], VN: [108, 16],
  YE: [48, 16], ZM: [28, -14], ZW: [30, -19], HK: [114, 22], MO: [113.5, 22],
  PS: [35, 32], CD: [24, -3], CI: [-5.5, 8], XK: [21, 42.5],
};

// ISO Alpha-3 to Alpha-2 mapping
const iso3ToIso2: Record<string, string> = {
  AFG: "AF", ALB: "AL", DZA: "DZ", AND: "AD", AGO: "AO", ATG: "AG", ARG: "AR",
  ARM: "AM", AUS: "AU", AUT: "AT", AZE: "AZ", BHS: "BS", BHR: "BH", BGD: "BD",
  BRB: "BB", BLR: "BY", BEL: "BE", BLZ: "BZ", BEN: "BJ", BTN: "BT", BOL: "BO",
  BIH: "BA", BWA: "BW", BRA: "BR", BRN: "BN", BGR: "BG", BFA: "BF", BDI: "BI",
  KHM: "KH", CMR: "CM", CAN: "CA", CPV: "CV", CAF: "CF", TCD: "TD", CHL: "CL",
  CHN: "CN", COL: "CO", COM: "KM", COG: "CG", CRI: "CR", HRV: "HR", CUB: "CU",
  CYP: "CY", CZE: "CZ", DNK: "DK", DJI: "DJ", DMA: "DM", DOM: "DO", ECU: "EC",
  EGY: "EG", SLV: "SV", GNQ: "GQ", ERI: "ER", EST: "EE", ETH: "ET", FJI: "FJ",
  FIN: "FI", FRA: "FR", GAB: "GA", GMB: "GM", GEO: "GE", DEU: "DE", GHA: "GH",
  GRC: "GR", GRD: "GD", GTM: "GT", GIN: "GN", GNB: "GW", GUY: "GY", HTI: "HT",
  HND: "HN", HUN: "HU", ISL: "IS", IND: "IN", IDN: "ID", IRN: "IR", IRQ: "IQ",
  IRL: "IE", ISR: "IL", ITA: "IT", JAM: "JM", JPN: "JP", JOR: "JO", KAZ: "KZ",
  KEN: "KE", KIR: "KI", PRK: "KP", KOR: "KR", KWT: "KW", KGZ: "KG", LAO: "LA",
  LVA: "LV", LBN: "LB", LSO: "LS", LBR: "LR", LBY: "LY", LIE: "LI", LTU: "LT",
  LUX: "LU", MKD: "MK", MDG: "MG", MWI: "MW", MYS: "MY", MDV: "MV", MLI: "ML",
  MLT: "MT", MHL: "MH", MRT: "MR", MUS: "MU", MEX: "MX", FSM: "FM", MDA: "MD",
  MCO: "MC", MNG: "MN", MNE: "ME", MAR: "MA", MOZ: "MZ", MMR: "MM", NAM: "NA",
  NRU: "NR", NPL: "NP", NLD: "NL", NZL: "NZ", NIC: "NI", NER: "NE", NGA: "NG",
  NOR: "NO", OMN: "OM", PAK: "PK", PLW: "PW", PAN: "PA", PNG: "PG", PRY: "PY",
  PER: "PE", PHL: "PH", POL: "PL", PRT: "PT", QAT: "QA", ROU: "RO", RUS: "RU",
  RWA: "RW", KNA: "KN", LCA: "LC", VCT: "VC", WSM: "WS", SMR: "SM", STP: "ST",
  SAU: "SA", SEN: "SN", SRB: "RS", SYC: "SC", SLE: "SL", SGP: "SG", SVK: "SK",
  SVN: "SI", SLB: "SB", SOM: "SO", ZAF: "ZA", SSD: "SS", ESP: "ES", LKA: "LK",
  SDN: "SD", SUR: "SR", SWZ: "SZ", SWE: "SE", CHE: "CH", SYR: "SY", TWN: "TW",
  TJK: "TJ", TZA: "TZ", THA: "TH", TLS: "TL", TGO: "TG", TON: "TO", TTO: "TT",
  TUN: "TN", TUR: "TR", TKM: "TM", TUV: "TV", UGA: "UG", UKR: "UA", ARE: "AE",
  GBR: "GB", USA: "US", URY: "UY", UZB: "UZ", VUT: "VU", VAT: "VA", VEN: "VE",
  VNM: "VN", YEM: "YE", ZMB: "ZM", ZWE: "ZW", HKG: "HK", MAC: "MO", PSE: "PS",
  COD: "CD", CIV: "CI", XKX: "XK",
};

// ISO numeric to Alpha-2 mapping (for world-atlas which uses numeric IDs)
const isoNumericToIso2: Record<string, string> = {
  "4": "AF", "8": "AL", "12": "DZ", "20": "AD", "24": "AO", "28": "AG", "32": "AR",
  "51": "AM", "36": "AU", "40": "AT", "31": "AZ", "44": "BS", "48": "BH", "50": "BD",
  "52": "BB", "112": "BY", "56": "BE", "84": "BZ", "204": "BJ", "64": "BT", "68": "BO",
  "70": "BA", "72": "BW", "76": "BR", "96": "BN", "100": "BG", "854": "BF", "108": "BI",
  "116": "KH", "120": "CM", "124": "CA", "132": "CV", "140": "CF", "148": "TD", "152": "CL",
  "156": "CN", "170": "CO", "174": "KM", "178": "CG", "188": "CR", "191": "HR", "192": "CU",
  "196": "CY", "203": "CZ", "208": "DK", "262": "DJ", "212": "DM", "214": "DO", "218": "EC",
  "818": "EG", "222": "SV", "226": "GQ", "232": "ER", "233": "EE", "231": "ET", "242": "FJ",
  "246": "FI", "250": "FR", "266": "GA", "270": "GM", "268": "GE", "276": "DE", "288": "GH",
  "300": "GR", "308": "GD", "320": "GT", "324": "GN", "624": "GW", "328": "GY", "332": "HT",
  "340": "HN", "348": "HU", "352": "IS", "356": "IN", "360": "ID", "364": "IR", "368": "IQ",
  "372": "IE", "376": "IL", "380": "IT", "388": "JM", "392": "JP", "400": "JO", "398": "KZ",
  "404": "KE", "296": "KI", "408": "KP", "410": "KR", "414": "KW", "417": "KG", "418": "LA",
  "428": "LV", "422": "LB", "426": "LS", "430": "LR", "434": "LY", "438": "LI", "440": "LT",
  "442": "LU", "807": "MK", "450": "MG", "454": "MW", "458": "MY", "462": "MV", "466": "ML",
  "470": "MT", "584": "MH", "478": "MR", "480": "MU", "484": "MX", "583": "FM", "498": "MD",
  "492": "MC", "496": "MN", "499": "ME", "504": "MA", "508": "MZ", "104": "MM", "516": "NA",
  "520": "NR", "524": "NP", "528": "NL", "554": "NZ", "558": "NI", "562": "NE", "566": "NG",
  "578": "NO", "512": "OM", "586": "PK", "585": "PW", "591": "PA", "598": "PG", "600": "PY",
  "604": "PE", "608": "PH", "616": "PL", "620": "PT", "634": "QA", "642": "RO", "643": "RU",
  "646": "RW", "659": "KN", "662": "LC", "670": "VC", "882": "WS", "674": "SM", "678": "ST",
  "682": "SA", "686": "SN", "688": "RS", "690": "SC", "694": "SL", "702": "SG", "703": "SK",
  "705": "SI", "90": "SB", "706": "SO", "710": "ZA", "728": "SS", "724": "ES", "144": "LK",
  "729": "SD", "740": "SR", "748": "SZ", "752": "SE", "756": "CH", "760": "SY", "158": "TW",
  "762": "TJ", "834": "TZ", "764": "TH", "626": "TL", "768": "TG", "776": "TO", "780": "TT",
  "788": "TN", "792": "TR", "795": "TM", "798": "TV", "800": "UG", "804": "UA", "784": "AE",
  "826": "GB", "840": "US", "858": "UY", "860": "UZ", "548": "VU", "336": "VA", "862": "VE",
  "704": "VN", "887": "YE", "894": "ZM", "716": "ZW", "344": "HK", "446": "MO", "275": "PS",
  "180": "CD", "384": "CI", "-99": "XK",
};

interface CountryFeature {
  type: "Feature";
  id: string;
  properties: { name: string };
  geometry: GeoPermissibleObjects;
}

interface WorldMapSVGProps {
  selectedCountry: string | null;
  onSelectCountry: (iso2: string | null, data: CountryData | null) => void;
  onHoverCountry?: (iso2: string | null) => void;
  selectionKey?: number;
}

export default function WorldMapSVG({
  selectedCountry,
  onSelectCountry,
  onHoverCountry,
  selectionKey,
}: WorldMapSVGProps) {
  const [countries, setCountries] = useState<CountryFeature[]>([]);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 960, height: 500 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Load visa data
  const countryMap = useMemo(() => loadVisaData(), []);

  // Create ISO2 to CountryData map
  const iso2ToData = useMemo(() => {
    const map = new Map<string, CountryData>();
    countryMap.forEach((data) => {
      map.set(data.iso2, data);
    });
    return map;
  }, [countryMap]);

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Fetch world map data
  useEffect(() => {
    fetch(WORLD_ATLAS_URL)
      .then((res) => res.json())
      .then((topology: Topology<{ countries: GeometryCollection }>) => {
        const geojson = feature(topology, topology.objects.countries);
        if (geojson.type === "FeatureCollection") {
          setCountries(geojson.features as CountryFeature[]);
        }
      })
      .catch((err) => console.error("Failed to load map:", err));
  }, []);

  // Create projection and path generator
  const { projection, pathGenerator } = useMemo(() => {
    // Calculate scale to fit the world map horizontally
    // Mercator: full world width = 2 * PI * scale
    const scale = dimensions.width / (2 * Math.PI) * 1.0;
    const proj = geoMercator()
      .scale(scale)
      .center([0, 35]) // Center higher to show more land mass
      .translate([dimensions.width / 2, dimensions.height / 2]);
    
    const path = geoPath().projection(proj);
    return { projection: proj, pathGenerator: path };
  }, [dimensions]);

  // Zoom to country when selected
  useEffect(() => {
    if (!selectedCountry) return;
    
    // Get centroid from predefined coordinates
    const centroidCoords = countryCentroids[selectedCountry];
    if (!centroidCoords) {
      console.log("No centroid found for:", selectedCountry);
      return;
    }
    
    // Create a fresh projection for calculation (must match the main projection)
    const scale = dimensions.width / (2 * Math.PI) * 1.0;
    const proj = geoMercator()
      .scale(scale)
      .center([0, 35])
      .translate([dimensions.width / 2, dimensions.height / 2]);
    
    // Project the centroid coordinates
    const projected = proj(centroidCoords);
    
    if (!projected) return;
    
    const [cx, cy] = projected;
    const targetZoom = 4; // Zoom level when focusing on country
    
    // Calculate pan to center the country
    const newPanX = dimensions.width / 2 - cx * targetZoom;
    const newPanY = dimensions.height / 2 - cy * targetZoom;
    
    setIsAnimating(true);
    setZoom(targetZoom);
    setPan({ x: newPanX, y: newPanY });
    
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [selectedCountry, selectionKey, dimensions.width, dimensions.height]);

  // Get ISO2 from feature ID
  const getIso2 = useCallback((featureId: string): string => {
    // Normalize numeric IDs by removing leading zeros
    const normalizedId = /^\d+$/.test(featureId) ? String(parseInt(featureId, 10)) : featureId;
    return isoNumericToIso2[normalizedId] || iso3ToIso2[featureId] || "";
  }, []);

  // Get fill color for country
  const getFillColor = useCallback(
    (featureId: string): string => {
      const iso2 = getIso2(featureId);
      // Only match if iso2 is valid (not empty) - prevents Antarctica and unmapped countries from highlighting
      if (iso2 && selectedCountry === iso2) {
        return "#f97316"; // orange-500 selected
      }
      if (iso2 && hoveredCountry === iso2) {
        return "#fb923c"; // orange-400 hover
      }
      if (iso2) {
        const data = iso2ToData.get(iso2);
        if (data) {
          return categoryColors[data.category];
        }
      }
      return "#475569"; // slate-600 default (no visa data or unmapped territory)
    },
    [iso2ToData, selectedCountry, hoveredCountry, getIso2]
  );

  // Handle country click
  const handleCountryClick = useCallback(
    (featureId: string) => {
      const iso2 = getIso2(featureId);
      if (iso2) {
        const data = iso2ToData.get(iso2) || null;
        onSelectCountry(iso2, data);
      }
    },
    [iso2ToData, onSelectCountry, getIso2]
  );

  // Handle hover - only set for valid iso2 codes
  const handleHover = useCallback(
    (featureId: string | null) => {
      const iso2 = featureId ? getIso2(featureId) : null;
      // Only set hover if iso2 is valid (not empty) to prevent Antarctica highlight issues
      const validIso2 = iso2 || null;
      setHoveredCountry(validIso2);
      onHoverCountry?.(validIso2);
    },
    [onHoverCountry, getIso2]
  );

  // Track if mouse actually moved during drag
  const hasDraggedRef = useRef(false);

  // Mouse handlers for pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      hasDraggedRef.current = false;
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      hasDraggedRef.current = true;
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Wheel handler for zoom - attached via useEffect for proper passive handling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Determine zoom direction
      const zoomIn = e.deltaY < 0;
      const factor = zoomIn ? 1.15 : 0.85;
      
      setZoom((prevZoom) => {
        const newZoom = Math.min(Math.max(prevZoom * factor, 0.5), 8);
        const scale = newZoom / prevZoom;
        
        // Adjust pan to zoom toward mouse position
        setPan((prevPan) => ({
          x: mouseX - (mouseX - prevPan.x) * scale,
          y: mouseY - (mouseY - prevPan.y) * scale,
        }));
        
        return newZoom;
      });
    };

    container.addEventListener("wheel", handleWheelEvent, { passive: false });
    return () => container.removeEventListener("wheel", handleWheelEvent);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="w-full h-full"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
          transition: isAnimating ? "transform 0.5s ease-out" : isDragging ? "none" : "transform 0.1s ease-out",
        }}
      >
        {/* Background rect to capture clicks on empty areas */}
        <rect
          x="0"
          y="0"
          width={dimensions.width}
          height={dimensions.height}
          fill="transparent"
          onClick={(e) => {
            // Only reset if this was a click, not a drag
            if (!hasDraggedRef.current) {
              e.stopPropagation();
              // Reset map and deselect
              onSelectCountry(null, null);
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }
          }}
        />
        {/* Mongolia flag - proper 3 vertical stripes */}
        <defs>
          <pattern id="mongoliaFlag" patternUnits="userSpaceOnUse" width="30" height="20">
            {/* Three vertical stripes: red-blue-red */}
            <rect x="0" y="0" width="10" height="20" fill="#c4272f" />
            <rect x="10" y="0" width="10" height="20" fill="#015197" />
            <rect x="20" y="0" width="10" height="20" fill="#c4272f" />
            {/* Soyombo symbol on left red stripe (simplified golden) */}
            <g transform="translate(2, 2) scale(0.08)">
              {/* Fire (3 flames) */}
              <path d="M30,5 L35,0 L40,5 L45,0 L50,5 L45,12 L35,12 Z" fill="#f9cf02" />
              {/* Sun */}
              <circle cx="40" cy="22" r="8" fill="#f9cf02" />
              {/* Moon */}
              <path d="M30,32 Q40,25 50,32 Q40,38 30,32" fill="#f9cf02" />
              {/* Triangles */}
              <path d="M30,45 L40,38 L50,45 L40,42 Z" fill="#f9cf02" />
              <path d="M30,145 L40,152 L50,145 L40,148 Z" fill="#f9cf02" transform="rotate(180 40 95)" />
              {/* Rectangles */}
              <rect x="32" y="48" width="16" height="40" fill="#f9cf02" />
              {/* Yin-yang */}
              <circle cx="40" cy="110" r="12" fill="#f9cf02" />
            </g>
          </pattern>
        </defs>
        {/* Country paths */}
        <g>
          {countries.map((country, index) => {
            const pathD = pathGenerator(country.geometry);
            if (!pathD) return null;
            
            const iso2 = getIso2(country.id);
            const isMongolia = iso2 === "MN";
            
            return (
              <path
                key={country.id || `country-${index}`}
                d={pathD}
                fill={isMongolia ? "#c4272f" : getFillColor(country.id)}
                stroke={isMongolia ? "#f9cf02" : "var(--map-stroke, #64748b)"}
                strokeWidth={(isMongolia ? 2 : 0.5) / zoom}
                className="transition-colors duration-150 cursor-pointer hover:brightness-110"
                onClick={() => handleCountryClick(country.id)}
                onMouseEnter={() => handleHover(country.id)}
                onMouseLeave={() => handleHover(null)}
              />
            );
          })}
        </g>
      </svg>
      
      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setZoom((z) => Math.min(z * 1.3, 8))}
          className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors flex items-center justify-center text-xl font-bold"
        >
          +
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z / 1.3, 0.5))}
          className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors flex items-center justify-center text-xl font-bold"
        >
          −
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors flex items-center justify-center text-sm"
          title="Reset view"
        >
          ⟲
        </button>
      </div>
    </div>
  );
}
