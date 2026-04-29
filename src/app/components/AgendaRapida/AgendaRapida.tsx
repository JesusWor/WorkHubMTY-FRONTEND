import { useState, useMemo } from "react";
import {
  ChevronLeft, ChevronRight, Search, UserPlus,
  Bell, User, MessageSquare, Clock, MapPin, CalendarDays,
  X, Check,
} from "lucide-react";

interface AgendaEvent {
  day: number;   // 0=Mon … 6=Sun
  start: number; // decimal hour e.g. 9.5 = 09:30
  end: number;
  title: string;
  variant: "primary" | "secondary" | "light";
}

const AGENDA_EVENTS: AgendaEvent[] = [
  { day: 0, start: 8, end: 9.5, title: "Standup", variant: "primary" },
  { day: 0, start: 11, end: 12.5, title: "Design Review", variant: "secondary" },
  { day: 1, start: 9, end: 11, title: "Sprint Planning", variant: "primary" },
  { day: 1, start: 14, end: 15, title: "1:1 Manager", variant: "light" },
  { day: 2, start: 8, end: 9, title: "Standup", variant: "primary" },
  { day: 2, start: 10, end: 12, title: "Workshop UX", variant: "secondary" },
  { day: 2, start: 15, end: 16.5, title: "Demo día", variant: "light" },
  { day: 3, start: 9, end: 10, title: "Standup", variant: "primary" },
  { day: 3, start: 13, end: 14, title: "Revisión QA", variant: "secondary" },
  { day: 4, start: 8, end: 9, title: "Standup", variant: "primary" },
  { day: 4, start: 11, end: 13, title: "Retrospectiva", variant: "light" },
];

const VARIANT_CLASSES: Record<AgendaEvent["variant"], string> = {
  primary:   "bg-purple-600 text-white",
  secondary: "bg-purple-400 text-white",
  light:     "bg-purple-200 text-purple-800",
};

function getMonday(offset: number): Date {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff + offset * 7);
  d.setHours(0, 0, 0, 0);
  return d;
}

function fmtRange(mon: Date): string {
  const fri = new Date(mon);
  fri.setDate(mon.getDate() + 6);
  const opts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short" };
  return `${mon.toLocaleDateString("es-MX", opts)} – ${fri.toLocaleDateString("es-MX", opts)}`;
}

const HOURS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
// const DAYS_SHORT = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];
const DAYS_SHORT = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
const START_H = HOURS[0];
const TOTAL_H = HOURS.length;

export default function AgendaRapida() {
  const [weekOffset, setWeekOffset] = useState(0);

  const monday = useMemo(() => getMonday(weekOffset), [weekOffset]);
  const weekDates = useMemo(
    () => Array.from({ length: 6 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    }),
    [monday]
  );

  const todayIdx = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return weekDates.findIndex((d) => d.toDateString() === today.toDateString());
  }, [weekDates]);

  return (
    <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-5 items-center justify-center rounded-md bg-violet-600">
            <CalendarDays size={11} className="text-white" />
          </div>
          <span className="text-[0.85rem] font-bold text-gray-900">Agenda rápida</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setWeekOffset((o) => o - 1)}
            className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <ChevronLeft size={12} />
          </button>
          <span className="min-w-[118px] text-center text-[0.72rem] font-semibold text-gray-500">
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

      <div className="overflow-x-auto px-3 py-2">
        <div style={{ minWidth: 500 }}>
          <div
            className="mb-1"
            style={{ display: "grid", gridTemplateColumns: `40px repeat(${TOTAL_H}, 1fr)` }}
          >
            <div />
            {HOURS.map((h) => (
              <div key={h} className="text-center text-[0.6rem] font-semibold text-gray-400">
                {h}:00
              </div>
            ))}
          </div>

          {DAYS_SHORT.map((dayName, di) => {
            const date = weekDates[di];
            const isToday = di === todayIdx && weekOffset === 0;
            const dayEvents = AGENDA_EVENTS.filter((ev) => ev.day === di);

            return (
              <div
                key={di}
                className="mb-1"
                style={{ display: "grid", gridTemplateColumns: `40px repeat(${TOTAL_H}, 1fr)` }}
              >
                <div className="flex flex-col items-center justify-center gap-0.5 pr-1">
                  <span className="text-[0.55rem] font-bold uppercase tracking-wide text-gray-400">{dayName}</span>
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[0.65rem] font-bold ${
                      isToday ? "bg-violet-600 text-white" : "text-gray-700"
                    }`}
                  >
                    {date?.getDate()}
                  </span>
                </div>
                <div
                  className="relative col-span-full rounded-md bg-gray-50"
                  style={{
                    gridColumn: `2 / ${TOTAL_H + 2}`,
                    height: 40,
                  }}
                >
                  {HOURS.map((_, si) => (
                    <div
                      key={si}
                      className="absolut5e top-0 bottom-0 border-r border-gray-200"
                      style={{ left: `${(si / TOTAL_H) * 100}%` }}
                    />
                  ))}

                  {dayEvents.map((ev, ei) => {
                    const left = ((ev.start - START_H) / TOTAL_H) * 100;
                    const width = ((ev.end - ev.start) / TOTAL_H) * 100;
                    return (
                      <div
                        key={ei}
                        className={`absolute top-1 bottom-1 flex items-center overflow-hidden rounded px-1.5 text-[0.58rem] font-semibold cursor-pointer hover:brightness-90 transition-all ${VARIANT_CLASSES[ev.variant]}`}
                        style={{ left: `${left}%`, width: `${width}%` }}
                      >
                        <span className="truncate">{ev.title}</span>
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