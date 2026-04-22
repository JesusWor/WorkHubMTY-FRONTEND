import "../globals.css";
import Navbar from "../components/Navbar";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="flex flex-col min-h-screen  w-screen"
      style={{ fontFamily: "var(--font-manrope)" }}
    >
      <Navbar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
