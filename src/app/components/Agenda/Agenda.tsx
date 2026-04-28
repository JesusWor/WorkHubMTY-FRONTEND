interface Event {
  id: number;
  startDate: string;
  endDate: string;
}

interface AgendaProps {
  espacioReservado: Event[];
  eventosAgenda: Event[];
  seleccionActual: Event[];
}
interface Row {
  label: string;
  key: keyof AgendaProps;
}

const rows: Row[] = [
  { label: "Espacio reservado", key: "espacioReservado" },
  { label: "Selección actual", key: "seleccionActual" },
  { label: "Eventos de tu agenda", key: "eventosAgenda" },
];

function intervalToPercentage(start: Date, end: Date, day: Date) {
  const totalMinutesMs = 24 * 60 * 60 * 1000;
  return {
    left: `${((start.getTime() - day.getTime()) / totalMinutesMs) * 100}%`,
    width: `${((end.getTime() - start.getTime()) / totalMinutesMs) * 100}%`,
  };
}

export default function Agenda({
  events,
  day,
}: {
  events: AgendaProps;
  day: Date;
}) {
  return (
    <div
      className={`bg-container p-4 grid grid-cols-[100px_1fr] rounded`}
      style={{
        gridTemplateRows: `repeat(${rows.length + 1}, minmax(48px, auto))`,
      }}
    >
      {rows.map((row, index) => (
        <span
          key={index}
          style={{
            gridRow: index + 2,
          }}
          className="col-start-1 px-2 py-2 text-center text-xs flex items-center font-bold border-r border-t border-grid-lines select-none"
        >
          {row.label}
        </span>
      ))}
      <div className="text-grid-lines col-start-2 row-start-1 grid grid-cols-[repeat(24, minmax(0, 1fr))]">
        {Array.from(
          { length: 24 },
          (_, i) => `${String(i).padStart(2, "0")}:00`,
        ).map((hour, index) => (
          <span
            key={hour}
            className="text-xs text-center -rotate-90 origin-center select-none"
            style={{ gridColumn: index + 1 }}
          >
            {hour}
          </span>
        ))}
      </div>
      <div
        className={`col-start-2`}
        style={{
          gridRow: `2 / span ${rows.length + 1}`, // No poner tailwind en runtime, no se calcula ahi
          backgroundImage: `
            repeating-linear-gradient(
              to right,
              var(--color-grid-lines) 0px,
              var(--color-grid-lines) 1px,
              transparent 1px,
              transparent calc(100% / 24)
            ) 
          `,
        }}
      ></div>
      {Object.entries(events).map(([key, value], index) => {
        return (
          <div
            key={index}
            style={{ gridRow: index + 2 }}
            className={`col-start-2 flex items-center px-2 relative border-t border-b border-r border-grid-lines`}
          >
            {events[key as keyof AgendaProps].map((event: Event) => (
              <div
                key={event.id}
                className={`${key === "seleccionActual" ? "bg-purple-600" : "bg-grid-lines"} h-4 rounded-full absolute`}
                style={{
                  ...intervalToPercentage(
                    new Date(event.startDate),
                    new Date(event.endDate),
                    day,
                  ),
                }}
              ></div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
