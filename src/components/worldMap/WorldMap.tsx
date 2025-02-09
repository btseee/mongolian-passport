import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import useDarkMode from "@/hooks/darkMode";
import passportData from "@/data/passport.json";

interface WorldMapProps {
  onCountryClick: (countryCode: string) => void;
}

interface WorldMapRef {
  showTooltip: (countryName: string) => void;
}

interface GeographyData {
  rsmKey: string;
  properties: {
    name: string;
    longitude: number;
    latitude: number;
  };
}

const WorldMap = forwardRef<WorldMapRef, WorldMapProps>(
  ({ onCountryClick }, ref) => {
    const geoUrl =
      "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
    const { theme } = useDarkMode();
    const containerRef = useRef<HTMLDivElement>(null);
    const [tooltip, setTooltip] = useState<{
      text: string;
      x: number;
      y: number;
    } | null>(null);

    const projectionRef = useRef<
      (coordinates: [number, number]) => [number, number]
    >(() => [0, 0]);
    const geographiesRef = useRef<GeographyData[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      showTooltip: (countryName: string) => {
        const country = passportData.find(
          (x) => x.country_name_en === countryName
        );
        if (country) {
          const geography = geographiesRef.current.find(
            (geo) => geo.properties.name === countryName
          );
          if (geography) {
            const [x, y] = projectionRef.current([
              geography.properties.longitude,
              geography.properties.latitude,
            ]);

            setTooltip({
              text: getTooltip(geography.properties.name) ?? "",
              x,
              y,
            });
          }
        }
      },
    }));

    useEffect(() => {
      const handleResize = () => {
        if (containerRef.current) {
          containerRef.current.style.height = `${containerRef.current.offsetWidth}px`;
        }
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const getFlagEmoji = (countryCode: string) =>
      countryCode
        .toUpperCase()
        .replace(/./g, (char) =>
          String.fromCodePoint(127397 + char.charCodeAt(0))
        );

    const getTooltip = (country: string) => {
      const foundCountry = passportData.find(
        (x) => x.country_name_en === country
      );
      if (!foundCountry) return;
      const { country_name_mn, effective_date, notes, visa_free_duration } =
        foundCountry;
      const formattedNotes = notes ? `Тэмдэглэл: ${notes}` : "";
      const formattedDate = effective_date
        ? `Хүчинтэй огноо: ${effective_date}`
        : "";
      return `${getFlagEmoji(foundCountry.country_code)} ${country_name_mn}: ${
        visa_free_duration || "N/A"
      } хоног хүртэл\n${formattedNotes}\n${formattedDate}`.trim();
    };

    return (
      <div
        ref={containerRef}
        className="relative w-full h-full flex justify-center items-center"
      >
        {tooltip && (
          <div
            className="absolute bg-gray-700 text-white text-sm px-2 py-1 rounded shadow-md pointer-events-none"
            style={{
              top: `${tooltip.y}px`,
              left: `${tooltip.x}px`,
              transform: "translate(-50%, -100%)",
              whiteSpace: "pre-line",
            }}
          >
            {tooltip.text}
          </div>
        )}
        <ComposableMap className="w-full h-full">
          <Geographies geography={geoUrl}>
            {({ geographies, projection }) => {
              if (projection) {
                projectionRef.current = (coordinates: [number, number]) => {
                  const result = projection(coordinates);
                  return result ?? [0, 0];
                };
              }

              geographiesRef.current = geographies;

              return geographies.map((geo) => {
                const isInPassportData = passportData.find(
                  (country) => country.country_name_en === geo.properties.name
                );
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      if (projection) {
                        const result = projection([
                          geo.properties.longitude,
                          geo.properties.latitude,
                        ]);
                        if (result) {
                          const [x, y] = result;
                          setTooltip({
                            text: getTooltip(geo.properties.name) ?? "",
                            x,
                            y,
                          });
                          setSelectedCountry(geo.properties.name);
                        }
                      }
                    }}
                    onMouseLeave={() => {
                      setTooltip(null);
                      setSelectedCountry(null);
                    }}
                    onClick={() => onCountryClick(geo.properties.name)}
                    style={{
                      default: {
                        fill:
                          geo.properties.name === selectedCountry
                            ? "#F53"
                            : isInPassportData
                            ? "#4CAF50"
                            : theme === "dark"
                            ? "#2D3748"
                            : "#CBD5E0",

                        stroke: theme === "dark" ? "#A0AEC0" : "#4A5568",
                        outline: "none",
                      },
                      hover: { fill: "#F53", stroke: "#FFFFFF" },
                    }}
                  />
                );
              });
            }}
          </Geographies>
        </ComposableMap>
      </div>
    );
  }
);

WorldMap.displayName = "WorldMap";

export default WorldMap;
