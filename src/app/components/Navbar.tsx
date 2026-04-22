"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import AccentureLogo from "../../../public/accenture_logo_purple1.png";
import Image from "next/image";
import './navbar.css';

const routes = [
  { name: "Inicio", href: "/home" },
  { name: "Cubículo", href: "/cubiculo"},
  { name: "Tablero",href: "/tablero" },
  { name: "Reservaciones", href: "/reservaciones" },
  { name: "Calendario", href: "/calendario" },
];

export default function Navbar() {
  const pathname = usePathname();
  useEffect(() => {
    console.log(pathname);
  }, [pathname]);
  return (
    <header className="w-full fixed z-40 bg-background-page flex items-center flex-row p-4 gap-4">
      {/* <div className="container mx-auto flex flex-col items-center justify-between"> */}
      <span className="text-2xl font-bold text-on-surface-container pl-2">
        <Link href="/home">
          <Image
            src={AccentureLogo}
            alt="accenture logo"
            width={40}
            height={40}
          />
        </Link>
      </span>
      {/* </div> */}
      <nav className="flex flex-row text-white gap-4 ml-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            className={`${pathname.startsWith(route.href) ? "tab-active self-end -mb-4 rounded-t-xl" : "rounded-full"} text-on-background px-4 bg-background  flex flex-row items-center gap-4 `}
            href={route.href}
          >
            <span className="text-xs font-light select-none">
              {route.name}
            </span>
          </Link>
        ))}
      </nav>
        <label className="bg-background p-2 select-none rounded-full text-on-background-2 font-semibold material-symbols-outlined ">
          notifications
        </label>
        <label className="bg-background p-2 select-none rounded-full text-on-background-2 font-semibold material-symbols-outlined">
          person
        </label>
    </header>
  );
}
