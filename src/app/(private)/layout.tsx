import "../globals.css";
import NavbarWrapper from "../components/Navbar/NavbarWrappe";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <div
      className="flex flex-col min-h-screen  w-screen overflow-hidden"
      style={{ fontFamily: "var(--font-manrope)" }}
    >
      <NavbarWrapper />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
