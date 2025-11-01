import Header from "./Header";
import Footer from "./Footer";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <main
        className="relative"
        style={{
          height: "100vh",
          paddingTop: "56px", // header approx height
          paddingBottom: "88px", // footer approx height
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
