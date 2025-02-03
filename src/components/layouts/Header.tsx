"use client";
import Image from "next/image";
import useDarkMode from "@/hooks/darkMode";
import packageJson from "../../../package.json";
import Link from "next/link";

export default function Header() {
  const { theme, toggleTheme } = useDarkMode();

  return (
    <>
      <header>
        <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <Link href="/" className="flex items-center">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Mongolia_Passport_2023.svg"
                className="mr-3 h-6 sm:h-9 rounded"
                alt="Flowbite Logo"
                width={24}
                height={64}
              />
              <span className="self-center text-lg font-semibold whitespace-nowrap text-gray-700 dark:text-white">
                {packageJson.displayName}
              </span>
            </Link>

            <div className="flex items-center lg:order-2">
              <button
                className="bg-white text-black dark:bg-gray-800 dark:text-white px-4 py-2 rounded"
                onClick={toggleTheme}
              >
                {theme}
              </button>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
