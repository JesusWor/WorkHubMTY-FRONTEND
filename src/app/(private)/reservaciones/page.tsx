import Calendar from "@/app/components/Calendar/Calendar";
import HourSelect from "@/app/components/HourSelect/HourSelect";
import Agenda from "@/app/components/Agenda/Agenda";
import Link from "next/link";
import DailyEventCard from "@/app/components/DailyEventCard/DailyEventCard";
import agendaEvents from "./events.json";

export default function Reservaciones() {
  return (
    <div className="w-full min-h-full bg-background-page flex flex-col flex-1 px-12 py-8 gap-4">
      <div className="flex">
        <span className="text-3xl">Ajusta tu reservación</span>
        <label className="flex gap-2 ml-auto bg-container px-4 py-2 rounded-lg items-center">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-sm">Preconfiguración</span>
        </label>
      </div>
      <div className="flex flex-row gap-10 ">
        <div className="flex flex-col gap-4">
          <Agenda
            events={agendaEvents}
            day={new Date(new Date().setHours(0, 0, 0, 0))}
          />
          <DailyEventCard events={[...agendaEvents.espacioReservado]} />
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <Calendar />
          <HourSelect />
        </div>
      </div>
      <Link href="/cubiculo" className="self-end">
        <button className="bg-primary-1 text-on-primary-1 px-4 py-2 rounded-lg">
          Completar reservación
        </button>
      </Link>
    </div>
  );
}
