import "./ScrollAgenda.css";

interface ScrollAgendaProps {
  pxPerMinute: number;
  zoom: number;
}

interface Day {
  date: Date;
  events: Reservation[];
}
interface Reservation {
  id: string;
  start: Date;
  end: Date;
}
function minutesWithin(now: Date) {}

export default function ScrollAgenda({
  pxPerMinute = 2,
  zoom = 2.5,
}: ScrollAgendaProps) {
  //   const minutesGap = 60 * 24 * days;
  //   const lineGap = minutesGap * pxPerMinute * zoom;
  const minutesGap = zoom * pxPerMinute;
  const hourGap = minutesGap * 60;
  return (
    <div className="bg-container py-4">
      <div
        style={
          {
            "--hour-gap": `${hourGap}px`,
            "--minutes-gap": `${minutesGap}px`,
          } as React.CSSProperties
        }
        className="w-[full] h-32 overflow-x-auto  overflow-y-hidden days-container p-4 flex"
      >
        {zoom > 2 && (
          <div
            style={
              {
                "--hour-gap": `${hourGap}px`,
                "--minutes-gap": `${minutesGap}px`,
              } as React.CSSProperties
            }
            className="w-[full] flex-1 overflow-x-auto hours-container"
          ></div>
        )}
      </div>
    </div>
  );
}
