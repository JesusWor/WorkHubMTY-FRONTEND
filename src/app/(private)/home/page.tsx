import Image from "next/image";
import AddFriend from "../../../../public/add_friend.png";

export default function Home() {
  return (
    <section className="flex h-[100svh] w-full overflow-hidden bg-gray-200">

  <div className="flex-1 px-30 py-8 pt-12">

    <h3 className="text-4xl font-semibold leading-tight">
      Bienvenido, Croissant
    </h3>

    <div className="flex gap-10 mx-[2svw] my-[3svh] h-full">
      <div className="flex w-[30%] h-[90%] flex-col rounded-[2rem] bg-white p-8">
        <div className="flex justify-start items-start px-2 ">
        <h3 className="text-xl font-bold">Red personal</h3>
        <Image
          src={AddFriend}
          alt="Add Friend"
          width={50}
          height={100}
          className="w-[3svw] select-none"
          priority
        />
        </div>
      </div>

      <div className="flex flex-1 flex-col rounded-[2rem] bg-white p-8">
  <h3 className="text-xl font-bold mb-4 jus">Agenda Rápida</h3>

  <div className="relative w-full h-full">
    
    <div className="absolute inset-0 grid grid-cols-8 grid-rows-6">
      {Array.from({ length: 48 }).map((_, i) => (
        <div key={i} className="border border-gray-200"></div>
      ))}
    </div>

    <div className="absolute left-0 top-0 flex flex-col justify-between h-full pr-2">
      {["LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"].map((day) => (
        <span key={day} className="text-sm text-gray-500">
          {day}
        </span>
      ))}
    </div>

    <div className="absolute inset-0">
      {/* Ejemplo evento */}
      <div className="absolute bg-purple-600 h-3 rounded-full"
        style={{
          top: "5%",     // posición vertical (día)
          left: "15%",   // hora inicio
          width: "30%"   // duración
        }}
      />

      <div className="absolute bg-purple-600 h-3 rounded-full"
        style={{
          top: "5%",
          left: "55%",
          width: "35%"
        }}
      />

      <div className="absolute bg-purple-600 h-3 rounded-full"
        style={{
          top: "25%",
          left: "15%",
          width: "20%"
        }}
      />
    </div>

    <div className="absolute bottom-0 w-full flex justify-between text-xs text-gray-400">
  {["6:00","8:00","10:00","12:00","14:00","16:00","18:00"].map(h => (
    <span key={h}>{h}</span>
  ))}
</div>

  </div>
      <div className="flex flex-1 rounded-[2rem] bg-white p-8 justify-center items-top">
        <h3 className="text-xl font-bold">Juntas y Eventos</h3>
      </div>
      </div>
    </div>
  </div>

</section>
  );
}


