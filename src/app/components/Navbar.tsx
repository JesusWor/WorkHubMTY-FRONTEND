"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import AccentureLogo from "../../../public/accenture_logo_purple1.png";
import Image from "next/image";
import "./navbar.css";

const routes = [
  { name: "Inicio", href: "/home" },
  { name: "Tablero", href: "/tablero" },
  { name: "Cubículos", href: "/reservaciones" },
  { name: "Calendario", href: "/calendario" },
];

export default function Navbar() {
  const pathname = usePathname();
  useEffect(() => {
    console.log(pathname);
  }, [pathname]);
  return (
    <header className="w-full fixed h-16 z-40 bg-background flex flex-row gap-4 px-4">
      {/* <div className="container mx-auto flex flex-col items-center justify-between"> */}
      <span className="text-2xl self-center font-bold text-on-surface-container pl-2">
        <Image
          src={AccentureLogo}
          alt="accenture logo"
          width={40}
          height={40}
        />
      </span>
      {/* </div> */}
      <nav className="flex flex-row text-white gap-4 ml-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            className={`${pathname.startsWith(route.href) ? "tab-active self-end rounded-t-xl" : "self-center rounded-full"} text-on-background px-4 py-2 bg-background-page flex flex-row items-center gap-4 `}
            href={route.href}
          >
            <span className="text-xs font-light select-none">{route.name}</span>
          </Link>
        ))}
      </nav>
      <div className="spacer flex-1" />
      <label className="flex gap-2 bg-background-page self-center px-4 py-2 rounded-full text-xs text-on-background-2">
        <span className="material-symbols-outlined">chat_bubble</span>
        <button>Pide al chatbot</button>
      </label>
      <label className="bg-background-page self-center p-2 select-none rounded-full text-on-background-2 font-semibold material-symbols-outlined ">
        notifications
      </label>
      <label className="bg-background-page self-center p-2 select-none rounded-full text-on-background-2 font-semibold material-symbols-outlined">
        person
      </label>
    </header>
  );
}
