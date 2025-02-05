"use client";

import WorldMap from "react-svg-worldmap";
import useDarkMode from "@/hooks/darkMode";
import passportData from "@/data/passport.json";
import type { CountryContext } from "react-svg-worldmap";
import { useMemo, useEffect, useState, useRef } from "react";

interface WorldMapsProps {
  size?: number;
  onCountryClick: (countryCode: string) => void;
}

export default function WorldMaps({ size = 400, onCountryClick }: WorldMapsProps) {
  const { theme } = useDarkMode();
  const [containerWidth, setContainerWidth] = useState(size);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const mappedData = useMemo(
    () =>
      passportData.reduce<{ country: string; value: number }[]>((acc, item) => {
        if (item.passport_type === "Бүх төрлийн паспорт") {
          acc.push({
            country: item.country_code,
            value: item.visa_free_duration || 0,
          });
        }
        return acc;
      }, []),
    []
  );

  const getFlagEmoji = (countryCode: string) => {
    return countryCode
      .toUpperCase()
      .replace(/./g, (char) =>
        String.fromCodePoint(127397 + char.charCodeAt(0))
      );
  };

  const getTooltip = (country: CountryContext) => {
    const foundCountry = passportData.find(
      (x) => x.country_code === country.countryCode
    );

    if (!foundCountry) return "Мэдээлэл байхгүй";

    const { country_name_mn, effective_date, notes } = foundCountry;
    const visaDuration = country.countryValue || "N/A";
    const formattedNotes = notes ? `Тэмдэглэл: ${notes}` : "";
    const formattedDate = effective_date
      ? `Хүчинтэй огноо: ${effective_date}`
      : "";

    return `${getFlagEmoji(
      foundCountry.country_code.toUpperCase()
    )} ${country_name_mn}: ${visaDuration} хоног хүртэл\n${formattedNotes}\n${formattedDate}`.trim();
  };

  return (
    <div ref={containerRef} className="w-full h-full">
      <WorldMap
        color={theme === "dark" ? "white" : "gray"}
        backgroundColor="transparent"
        tooltipBgColor={theme === "dark" ? "gray-800" : "white"}
        tooltipTextColor={theme === "dark" ? "white" : "gray-800"}
        size={containerWidth}
        data={mappedData}
        tooltipTextFunction={getTooltip}
        borderColor={theme === "dark" ? "gray" : "black"}
        strokeOpacity={0.3}
        richInteraction={true}
        onClickFunction={(event) => onCountryClick(event.countryCode)}
      />
    </div>
  );
}
