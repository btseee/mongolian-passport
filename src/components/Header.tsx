import React from "react"

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center p-4">
        {/* Logo or Title */}
        <h1 className="text-2xl font-bold mb-4 md:mb-0">World Map</h1>

        {/* Navigation */}
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a
                href="/"
                className="hover:underline transition duration-300 ease-in-out"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/about"
                className="hover:underline transition duration-300 ease-in-out"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="hover:underline transition duration-300 ease-in-out"
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header