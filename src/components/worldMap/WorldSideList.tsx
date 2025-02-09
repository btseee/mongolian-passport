import Image from "next/image";
import passportData from "@/data/passport.json";
import { useRef, useEffect, useState } from "react";

interface WorldSideListProps {
  selectedCountry: string | null;
  onCountryClick: (countryName: string) => void;
}

export default function WorldSideList({ selectedCountry, onCountryClick }: WorldSideListProps) {
  const countryRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const [filter, setFilter] = useState("");

  const filteredData = passportData.filter((item) =>
    item.country_name_en.toLowerCase().includes(filter.toLowerCase()) ||
    item.country_name_mn.toLowerCase().includes(filter.toLowerCase())
  );

  useEffect(() => {
    if (selectedCountry && countryRefs.current.has(selectedCountry)) {
      countryRefs.current.get(selectedCountry)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedCountry]);

  return (
    <aside className="w-full h-full p-4">
      {/* Filter Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Хайлт..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </div>

      {/* Country List */}
      <ul className="divide-y divide-gray-200 dark:divide-gray-700 h-[50vh] overflow-y-auto overflow-x-hidden">
        {filteredData.map((item) => (
          <li
            key={item.number}
            className={`py-3 px-6 sm:py-4 cursor-pointer ${
              selectedCountry === item.country_name_en
                ? "bg-gray-100 dark:bg-gray-800"
                : "hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
            ref={(el) => {
              if (el) countryRefs.current.set(item.country_name_en, el);
            }}
            onClick={() => onCountryClick(item.country_name_en)} // Trigger tooltip on click
          >
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="shrink-0">
                <Image
                  className="w-8 h-8 rounded"
                  src={`https://flagcdn.com/${item.country_code.toLowerCase()}.svg`}
                  alt="Country Passport"
                  width={32}
                  height={32}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                  {item.country_name_mn}
                </p>
                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                  {item.country_code} - {item.country_name_en}
                </p>
              </div>
              <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                <div className="flex-1 min-w-0 text-right">
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    {item.visa_free_duration} хоног
                  </p>
                  <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                    {item.passport_type}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm text-right text-pretty text-gray-500 dark:text-gray-400">{item.notes}</p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}