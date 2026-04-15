"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AccentureLogo from "../../../public/accenture_logo_purple1.png";
import Image from "next/image";

const routes = [
  { name: "Inicio", icon: "home", href: "/home" },
  { name: "Tablero", icon: "dashboard", href: "/tablero" },
  { name: "Reservaciones", icon: "bookmark", href: "/reservaciones" },
  { name: "Calendario", icon: "calendar_month", href: "/calendario" },
];

export default function Navbar() {
  const pathname = usePathname();
  useEffect(() => {
    console.log(pathname);
  }, [pathname]);
  return (
    <header className="h-screen w-48 fixed top-0 left-0 z-40 bg-surface-lowest flex flex-col p-4 gap-8">
      {/* <div className="container mx-auto flex flex-col items-center justify-between"> */}
      <span className="text-2xl font-bold text-on-surface-container pl-2">
        <Image
          src={AccentureLogo}
          alt="accenture logo"
          width={40}
          height={40}
        />
      </span>
      {/* </div> */}
      <nav className="flex flex-col text-white gap-2  ml-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            className={`${pathname.startsWith(route.href) ? "bg-white text-surface-lowest p-2" : "text-on-surface-container"} flex flex-row items-center gap-4 mt-4`}
            href={route.href}
          >
            <span className="material-symbols-outlined select-none">
              {route.icon}
            </span>
            <span className="text-xs font-semibold select-none">
              {route.name}
            </span>
          </Link>
        ))}
      </nav>
      <button className="mt-auto rounded-lg p-2 flex flex-rows items-center justify-center gap-2 text-surface font-light text-sm bg-background">
        <span className="material-symbols-outlined">photo_camera</span>
        Check in
      </button>
      <div className="flex flex-col gap-4">
        <label className="flex items-center gap-4 ml-4 text-on-surface-container text-xs font-semibold">
          <span className="material-symbols-outlined">settings</span>
          Settings
        </label>
        <label className="flex items-center gap-4 ml-4 text-on-surface-container text-xs font-semibold">
          <span className="material-symbols-outlined">help</span>
          Support
        </label>
      </div>
    </header>
  );
}
