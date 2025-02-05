import Image from "next/image";
import passportData from "@/data/passport.json";
import { useRef, useEffect } from "react";

interface WorldSideListProps {
  selectedCountry: string | null;
}

export default function WorldSideList({ selectedCountry }: WorldSideListProps) {
  const countryRefs = useRef<Map<string, HTMLLIElement>>(new Map());

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
      <ul className="divide-y divide-gray-200 dark:divide-gray-700 h-[50vh] overflow-y-auto overflow-x-hidden">
        {passportData.map((item) => (
          <li key={item.number} className="py-3 sm:py-4" ref={(el) => el && countryRefs.current.set(item.country_code, el)}>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="shrink-0">
                <Image
                  className="w-8 h-8 rounded-full"
                  src={`https://flagcdn.com/40x30/${item.country_code.toLowerCase()}.png`}
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
                    {item.effective_date}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}