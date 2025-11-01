export const metadata = {
  title: "Mongolian Passport",
  description: "Visa-free and special travel information for Mongolian passports",
  icons: {
    icon: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Mongolia_Passport_2023.svg",
    shortcut: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Mongolia_Passport_2023.svg",
    apple: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Mongolia_Passport_2023.svg",
  },
} as const;

import "./globals.css";
import Layout from "@/components/layouts/Layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script lang="typescript"
          dangerouslySetInnerHTML={{
            __html: `
      if (localStorage.theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    `,
          }}
        />
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
