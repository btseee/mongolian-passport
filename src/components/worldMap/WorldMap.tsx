"use client";
import WorldMap from "react-svg-worldmap";
import useDarkMode from "@/hooks/darkMode";
import passport from "@/data/passport.json";
import type { CountryContext } from "react-svg-worldmap";

export default function WorldMaps() {
  const { theme } = useDarkMode();

  const getTooltip = (country: CountryContext) => {
    const foundedCountry = passport.find(
      (x) => x.country_code === country.countryCode
    );
    return `
    ${foundedCountry?.country_name_mn} :\n
    ${country.countryValue} хоног хүртэл
    `;
  };

  const mappedData = passport.filter(x=> x.passport_type === "Бүх төрлийн паспорт").map((item) => ({
    country: item.country_code,
    value: item.visa_free_duration,
  }));

  return (
    <WorldMap
      color="lime-400"
      backgroundColor="lime-400"
      tooltipBgColor={theme === "dark" ? "gray-800" : "white"}
      tooltipTextColor={theme === "dark" ? "white" : "gray-800"}
      size="responsive"
      data={mappedData}
      tooltipTextFunction={getTooltip}
    />
  );
}
