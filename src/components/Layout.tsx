import React from "react"
import Header from "./Header"

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        {children}
      </div>
      <footer className="bg-gray-800 text-white p-4 text-center">
        © {new Date().getFullYear()} Your Company
      </footer>
    </div>
  )
}

export default Layout