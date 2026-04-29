import Calendar from "@/app/components/Calendar/Calendar";
import HourSelect from "@/app/components/HourSelect/HourSelect";
import ScrollAgenda from "@/app/components/ScrollAgenda/ScrollAgenda";
import Link from "next/link";
import PageTransition from "@/app/components/PageTransition/PageTransition"

export default function Reservaciones() {
  return (
    <div className="w-full min-h-full bg-background-page flex flex-col flex-1 px-12 py-8 gap-4">
      <PageTransition>
        <div className="flex">
          <span className="text-3xl">Ajusta tu reservación</span>
          <label className="flex gap-2 ml-auto bg-container px-4 py-2 rounded-lg">
            <span className="material-symbols-outlined">settings</span>
            Preconfiguración
          </label>
        </div>
        <ScrollAgenda />
        <div className="flex-1 flex flex-row gap-4">
          <Calendar />
          <HourSelect />
        </div>
        <Link href="/cubiculo" className="self-end">
          <button className="bg-primary-1 text-on-primary-1 px-4 py-2 rounded-lg">
            Completar reservación
          </button>
        </Link>
      </PageTransition>
    </div>
  );
}
