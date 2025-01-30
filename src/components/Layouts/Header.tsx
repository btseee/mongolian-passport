import React from "react";
import { StaticImage } from "gatsby-plugin-image";
import * as pack from "../../../package.json";

class Header extends React.Component {
  render() {
    return (
      <div className="bg-white lg:pb-12">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <header className="flex items-center justify-between py-4 md:py-8">
            <a
              href="/"
              className="inline-flex items-center gap-2.5 text-2xl font-bold text-black md:text-3xl"
              aria-label="logo"
            >
              <StaticImage
                src="../../images/128px-Mongolia_Passport_2023.png"
                alt="Mongolian Passport Logo"
                className="h-auto w-12 text-indigo-500 rounded-md"
              />
              {pack.displayName}
            </a>

            {/* <nav className="hidden gap-12 lg:flex">
              <a
                href="#"
                className="text-lg font-semibold text-gray-600 transition duration-100 hover:text-indigo-500 active:text-indigo-700"
              >
                Home
              </a>
              <a
                href="#"
                className="text-lg font-semibold text-gray-600 transition duration-100 hover:text-indigo-500 active:text-indigo-700"
              >
                About
              </a>
            </nav> */}

            <div className="-ml-8 hidden flex-col gap-2.5 sm:flex-row sm:justify-center lg:flex lg:justify-start">
              <a
                href="#"
                className="inline-block rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base"
              >
                Sign up
              </a>
            </div>
          </header>
        </div>
      </div>
    );
  }
}

export default Header;
