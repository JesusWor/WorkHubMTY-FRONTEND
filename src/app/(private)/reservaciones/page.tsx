"use client";

import { useEffect, useState } from "react";
import { Search, Trash2, ChevronRight, Users, ChevronUp, ChevronDown } from "lucide-react";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
type SpaceStatus = "ocupado" | "por-comenzar-orange" | "por-comenzar-green";

interface Space {
  id: string;
  name: string;
  capacity: number;
  status: SpaceStatus;
  featured?: boolean;
}

const SPACES: Space[] = [
  { id: "SM1", name: "#SM1 Sierra Madre",     capacity: 6, status: "ocupado",             featured: true },
  { id: "SJ1", name: "#SJ1 Sala de juntas 1", capacity: 6, status: "ocupado" },
  { id: "SJ3", name: "#SJ3 Sala de juntas 3", capacity: 6, status: "por-comenzar-orange" },
  { id: "SJ4", name: "#SJ4 Sala de juntas 4", capacity: 6, status: "por-comenzar-green" },
];

const FILTERS = ["Horario", "Capacidad", "Periodo"] as const;
type Filter = (typeof FILTERS)[number];

// ─────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────
export default function ReservacionScreen() {
  const [activeFilter, setActiveFilter] = useState<Filter>("Horario");
  const [showPopup, setShowPopup] = useState(true);
  const [floor, setFloor] = useState(2);
  const [search, setSearch] = useState("");

  const filtered = SPACES.filter(
    (s) => search === "" || s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="min-h-screen px-9 py-8"
      style={{ background: "#EBEBEB", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Title */}
      <h1 className="text-[32px] font-light tracking-tight text-gray-900 mb-5">
        Realiza una reservación
      </h1>

      {/* Filter bar (relative para anclar el popup de Periodo) */}
      <div className="relative flex items-center gap-[10px] mb-5 flex-wrap">
        <div className="flex items-center gap-[10px] bg-white border border-gray-200 rounded-full px-5 py-[9px] min-w-[230px] focus-within:border-purple-400 transition-colors">
          <Search size={16} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Buscar por identificador"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none outline-none text-sm text-gray-500 bg-transparent w-full placeholder:text-gray-400"
          />
        </div>

        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => {
              setActiveFilter(f);
              setShowPopup(true);
            }}
            className={`text-sm font-medium px-6 py-[9px] rounded-full border transition-all ${
              activeFilter === f
                ? "text-white border-transparent"
                : "bg-white border-gray-200 text-gray-600 hover:border-purple-300"
            }`}
            style={activeFilter === f ? { background: "#7B2FBE" } : undefined}
          >
            {f}
          </button>
        ))}

        {/* Periodo popup anclado a la barra de filtros */}
        {showPopup && activeFilter === "Periodo" && (
          <PeriodoPopup onClose={() => setShowPopup(false)} />
        )}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-[1fr_340px] gap-5 items-start">
        {/* MAP PANEL — placeholder */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden relative min-h-[540px]">
          {showPopup && activeFilter === "Horario" && (
            <HorarioPopup onClose={() => setShowPopup(false)} />
          )}

          {/* 👉 Aquí va tu mapa */}
          <div className="w-full h-full min-h-[540px] flex items-center justify-center text-gray-400 text-sm">
            {/* Mapa pendiente */}
          </div>

          {/* Footer: thumbnail + pagination */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none">
            <div className="w-[90px] h-[66px] rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100 pointer-events-auto" />

            <div className="flex flex-col items-center gap-1 pointer-events-auto">
              <button
                onClick={() => setFloor((f) => Math.max(1, f - 1))}
                className="text-gray-500 hover:text-purple-700 transition-colors p-1"
              >
                <ChevronUp size={18} />
              </button>
              <div className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center font-semibold text-sm text-gray-700 bg-white">
                {floor}
              </div>
              <button
                onClick={() => setFloor((f) => f + 1)}
                className="text-gray-500 hover:text-purple-700 transition-colors p-1"
              >
                <ChevronDown size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div>
          <h2 className="text-[18px] font-bold text-gray-900 mb-4">
            Espacios encontrados
          </h2>
          {filtered.map((s) => (
            <SpaceCard key={s.id} space={s} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SPACE CARD
// ─────────────────────────────────────────────
function SpaceCard({ space }: { space: Space }) {
  const cfg = {
    "ocupado":              { label: "Ocupado",      color: "#EF4444", dot: "#EF4444" },
    "por-comenzar-orange":  { label: "Por comenzar", color: "#F97316", dot: "#F97316" },
    "por-comenzar-green":   { label: "Por comenzar", color: "#22C55E", dot: "#22C55E" },
  }[space.status];

  if (space.featured) {
    return (
      <div
        className="rounded-2xl p-[18px] mb-3 cursor-pointer"
        style={{ background: "#7B2FBE", boxShadow: "0 4px 24px rgba(123,47,190,0.18)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-bold text-[15px]">{space.name}</span>
          <div className="w-[30px] h-[30px] rounded-full border-2 border-white/40 flex items-center justify-center">
            <ChevronRight size={16} color="white" />
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center gap-1 text-white/80 text-[12.5px]">
            <Users size={13} />
            {space.capacity}
          </span>
          <span className="flex items-center gap-[5px] text-[12.5px] font-medium" style={{ color: "#FCA5A5" }}>
            <span className="w-[9px] h-[9px] rounded-full" style={{ background: "#FCA5A5" }} />
            {cfg.label}
          </span>
        </div>

        <div className="bg-white/10 rounded-xl p-3">
          <div className="h-9 rounded-md mb-2" style={{ background: "rgba(192,132,252,0.85)" }} />
          <div className="space-y-[5px]">
            <div className="h-[1px] bg-white/20" />
            <div className="h-[1px] bg-white/20" />
            <div className="h-[1px] bg-white/20" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-4 mb-3 cursor-pointer bg-white border border-gray-200 hover:border-purple-200 hover:shadow-md transition-all hover:-translate-y-[1px]">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-[14.5px] text-gray-900">{space.name}</span>
        <div className="w-[28px] h-[28px] rounded-full border border-gray-200 flex items-center justify-center text-gray-500">
          <ChevronRight size={15} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1 text-gray-500 text-[12.5px]">
          <Users size={13} />
          {space.capacity}
        </span>
        <span className="flex items-center gap-[5px] text-[12.5px] font-medium" style={{ color: cfg.color }}>
          <span className="w-[9px] h-[9px] rounded-full" style={{ background: cfg.dot }} />
          {cfg.label}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// HORARIO POPUP
// ─────────────────────────────────────────────
function HorarioPopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute top-10 left-1/2 -translate-x-[38%] z-30 bg-white rounded-2xl shadow-2xl px-6 py-5 flex items-center gap-6 min-w-[300px]">
      <div className="flex flex-col gap-3">
        <span className="text-sm font-semibold text-gray-800">Horario</span>
        <div className="grid grid-cols-2 gap-[6px]">
          <div className="w-[52px] h-[13px] rounded" style={{ background: "#E9D5FF" }} />
          <div className="w-[52px] h-[13px] rounded bg-gray-200" />
          <div className="w-[52px] h-[13px] rounded" style={{ background: "#E9D5FF" }} />
          <div className="w-[52px] h-[13px] rounded bg-gray-200" />
        </div>
      </div>

      <AnalogClock />

      <button
        onClick={onClose}
        className="absolute bottom-3 right-4 text-red-500 hover:bg-red-50 p-1 rounded-md transition-colors"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// ANALOG CLOCK (live)
// ─────────────────────────────────────────────
function AnalogClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const h = time.getHours() % 12;
  const m = time.getMinutes();
  const s = time.getSeconds();
  const hourDeg = h * 30 + m * 0.5;
  const minuteDeg = m * 6 + s * 0.1;

  return (
    <div className="relative w-[72px] h-[72px] rounded-full border-2 border-gray-300 flex-shrink-0">
      {Array.from({ length: 12 }, (_, i) => i * 30).map((angle) => {
        const rad = ((angle - 90) * Math.PI) / 180;
        const r = 28;
        const cx = 36 + r * Math.cos(rad);
        const cy = 36 + r * Math.sin(rad);
        return (
          <div
            key={angle}
            className="absolute w-[1.5px] h-[6px] bg-gray-300 rounded-sm"
            style={{ left: cx, top: cy - 6, transform: `rotate(${angle}deg)` }}
          />
        );
      })}

      <div
        className="absolute bg-gray-800 rounded-sm"
        style={{
          width: "2.5px", height: "20px",
          left: "50%", bottom: "50%",
          marginLeft: "-1.25px",
          transform: `rotate(${hourDeg}deg)`,
          transformOrigin: "bottom center",
        }}
      />
      <div
        className="absolute bg-gray-800 rounded-sm"
        style={{
          width: "1.8px", height: "26px",
          left: "50%", bottom: "50%",
          marginLeft: "-0.9px",
          transform: `rotate(${minuteDeg}deg)`,
          transformOrigin: "bottom center",
        }}
      />
      <div className="absolute w-[6px] h-[6px] bg-gray-800 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10" />
    </div>
  );
}

// ─────────────────────────────────────────────
// PERIODO POPUP (calendario mensual)
// ─────────────────────────────────────────────
function PeriodoPopup({ onClose }: { onClose: () => void }) {
  // Días seleccionados (en morado)
  const [selected, setSelected] = useState<number[]>([6, 13, 18, 19, 20]);
  // Días deshabilitados (en gris oscuro)
  const disabled = [7, 8, 14, 15, 21, 22];

  const dayLabels = ["D", "L", "M", "M", "J", "V", "S"];

  // Cuadrícula del mes: null = celda vacía
  // Empieza en martes con día 4, días 1-25
  const grid: (number | null)[] = [
    null, null, null, null, 4, 5, 6,
    7, 8, 9, 10, 11, 12, 13,
    14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, null, null,
  ];

  const toggleDay = (day: number) => {
    if (disabled.includes(day)) return;
    setSelected((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <div
      className="absolute top-[58px] right-0 z-30 bg-white rounded-2xl px-6 py-5"
      style={{
        boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
        minWidth: "440px",
      }}
    >
      {/* Encabezados de días */}
      <div className="grid grid-cols-7 gap-x-2 mb-3">
        {dayLabels.map((d, i) => (
          <div
            key={i}
            className="text-center text-[15px] font-bold text-gray-800"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Cuadrícula de días */}
      <div className="grid grid-cols-7 gap-x-2 gap-y-2">
        {grid.map((day, i) => {
          if (day === null) return <div key={i} />;

          const isSelected = selected.includes(day);
          const isDisabled = disabled.includes(day);

          let bg = "transparent";
          let color = "#1A1A1A";
          let cursor = "pointer";

          if (isSelected) {
            bg = "#7B2FBE";
            color = "#FFFFFF";
          } else if (isDisabled) {
            bg = "#9CA3AF";
            color = "#FFFFFF";
            cursor = "not-allowed";
          }

          return (
            <button
              key={i}
              onClick={() => toggleDay(day)}
              disabled={isDisabled}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-medium mx-auto transition-transform hover:scale-110"
              style={{
                background: bg,
                color: color,
                cursor: cursor,
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
