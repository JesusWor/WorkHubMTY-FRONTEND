"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { CalEvent, EventColorKey, EVENT_COLORS, CAL_EVENTS } from "../../types/Agenda";

// ── Constants ──────────────────────────────────────────────────────────────
const HOURS      = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
const DAYS_SHORT = ["Lu", "Ma", "Mi", "Ju", "Vi"];
const START_H    = HOURS[0];
const TOTAL_H    = HOURS.length;

// ── Helpers ────────────────────────────────────────────────────────────────
function getMonday(offset: number): Date {
  const now  = new Date();
  const day  = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const mon  = new Date(now);
  mon.setDate(now.getDate() + diff + offset * 7);
  mon.setHours(0, 0, 0, 0);
  return mon;
}

function toHHMM(h: number): string {
  const hh = Math.floor(h);
  const mm  = Math.round((h - hh) * 60);
  return `${hh}:${mm === 0 ? "00" : String(mm).padStart(2, "0")}`;
}

function fmtRange(mon: Date): string {
  const fri = new Date(mon);
  fri.setDate(mon.getDate() + 4);
  const fmt  = (d: Date) =>
    d.toLocaleDateString("es-MX", { day: "2-digit", month: "short" });
  const fmtY = (d: Date) =>
    d.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
  return `${fmt(mon)} – ${fmtY(fri)}`;
}

function isToday(d: Date): boolean {
  const t = new Date();
  return (
    d.getDate()     === t.getDate()  &&
    d.getMonth()    === t.getMonth() &&
    d.getFullYear() === t.getFullYear()
  );
}

// ── Props ──────────────────────────────────────────────────────────────────
interface AgendaRapidaProps {
  onEventClick?: (ev: CalEvent) => void;
}

// ── Component ──────────────────────────────────────────────────────────────
export default function AgendaRapida({ onEventClick }: AgendaRapidaProps) {
  const [weekOffset, setWeekOffset] = useState(0);

  const monday = useMemo(() => getMonday(weekOffset), [weekOffset]);

  const weekDates = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return d;
      }),
    [monday]
  );

  // Grid template: columna de día (40px) + 1 columna por hora (igual ancho)
  const gridCols = `40px repeat(${TOTAL_H}, 1fr)`;

  return (
    /*
      h-full + flex flex-col → hereda el alto que le asigna el padre (flex-1 min-h-0).
      overflow-hidden en el wrapper para que el scroll quede solo en el interior.
    */
    <div className="flex h-full flex-col rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">

      {/* ── Header ── */}
      <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-[22px] w-[22px] items-center justify-center rounded-md bg-violet-700">
            <CalendarDays size={12} className="text-white" />
          </div>
          <span className="text-[0.85rem] font-semibold text-gray-900">Agenda rápida</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setWeekOffset((o) => o - 1)}
            className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <ChevronLeft size={12} />
          </button>
          <span className="min-w-[148px] text-center text-[0.72rem] font-semibold text-gray-500">
            {fmtRange(monday)}
          </span>
          <button
            onClick={() => setWeekOffset((o) => o + 1)}
            className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* ── Body — flex-1 para llenar el resto del alto ── */}
      <div className="flex flex-1 flex-col min-h-0 overflow-y-auto px-3 py-2 gap-0">

        {/* Fila de horas */}
        <div
          className="grid shrink-0 mb-1"
          style={{ gridTemplateColumns: gridCols }}
        >
          <div /> {/* esquina vacía */}
          {HOURS.map((h) => (
            <div
              key={h}
              className="text-center text-[0.6rem] font-semibold text-gray-400"
            >
              {h}:00
            </div>
          ))}
        </div>

        {/* Filas de días — flex-1 para que se distribuyan uniformemente */}
        <div className="flex flex-1 flex-col gap-1 min-h-0">
          {DAYS_SHORT.map((dayName, di) => {
            const date    = weekDates[di];
            const today   = isToday(date);
            const dayEvts = CAL_EVENTS.filter((ev) => ev.day === di);

            return (
              /*
                flex-1 en cada fila → las 5 filas se reparten el alto disponible
                de forma equitativa, sin altura fija en px.
              */
              <div
                key={di}
                className="flex-1 min-h-0 grid"
                style={{ gridTemplateColumns: gridCols }}
              >
                {/* Etiqueta día + número */}
                <div className="flex flex-col items-center justify-center gap-0.5 pr-1">
                  <span className="text-[0.55rem] font-bold uppercase tracking-wide text-gray-400">
                    {dayName}
                  </span>
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-full text-[0.65rem] font-bold"
                    style={
                      today
                        ? { background: "#6d28d9", color: "#fff" }
                        : { color: "#374151" }
                    }
                  >
                    {date?.getDate()}
                  </span>
                </div>

                {/* Barra horizontal con eventos posicionados en % */}
                <div
                  className="relative rounded-md bg-gray-50"
                  style={{ gridColumn: `2 / ${TOTAL_H + 2}` }}
                >
                  {/* Líneas divisoras de hora */}
                  {HOURS.map((_, si) => (
                    <div
                      key={si}
                      className="absolute top-0 bottom-0 border-r border-gray-200"
                      style={{ left: `${(si / TOTAL_H) * 100}%` }}
                    />
                  ))}

                  {/* Bloques de eventos */}
                  {dayEvts.map((ev, ei) => {
                    const c     = EVENT_COLORS[ev.color as EventColorKey];
                    const left  = `${((ev.start - START_H) / TOTAL_H) * 100}%`;
                    const width = `${((ev.end - ev.start) / TOTAL_H) * 100}%`;

                    return (
                      <div
                        key={ei}
                        className="absolute inset-y-1 overflow-hidden rounded cursor-pointer hover:brightness-95 transition-all flex flex-col justify-center"
                        style={{
                          left,
                          width,
                          background:   c.bg,
                          borderLeft:  `3px solid ${c.border}`,
                          paddingLeft:  "5px",
                          paddingRight: "4px",
                        }}
                        onClick={() => onEventClick?.(ev)}
                      >
                        <p
                          className="text-[0.58rem] font-semibold leading-tight truncate"
                          style={{ color: c.text }}
                        >
                          {ev.title}
                        </p>
                        <p
                          className="text-[0.52rem] leading-tight truncate"
                          style={{ color: c.sub }}
                        >
                          {toHHMM(ev.start)}–{toHHMM(ev.end)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}