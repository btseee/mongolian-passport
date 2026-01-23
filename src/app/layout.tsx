import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mongolian Passport | Visa-Free Access Map",
  description:
    "Interactive world map showing visa-free travel destinations for Mongolian passport holders",
  icons: {
    icon: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Mongolia_Passport_2023.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
