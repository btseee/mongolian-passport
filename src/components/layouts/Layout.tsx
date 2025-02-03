import Header from "./Header";
import Footer from "./Footer";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-white dark:bg-gray-900">{children}</main>
      <Footer />
    </div>
  );
}
