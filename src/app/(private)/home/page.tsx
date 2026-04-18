import Image from "next/image";
import AddFriend from "../../../../public/add_friend.png";
import RightArrow from "../../../../public/right_arrow.png";

export default function Home() {
  return (
    <section className="flex h-[100svh] w-full overflow-hidden bg-gray-200">

      <div className="flex-1 px-[4rem] py-8 pt-12">

        <h3 className="text-4xl font-semibold leading-tight">
          Bienvenido, Croissant
        </h3>

        <div className="flex gap-10 mx-[2svw] my-[3svh] h-[85%]">
          <div className="flex w-[30%] flex-col rounded-[2rem] bg-white p-6">

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Red personal</h3>
              <Image
                src={AddFriend}
                alt="Add Friend"
                className="w-6 cursor-pointer select-none"
                priority
              />
            </div>

            <div className="flex-1 flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300" />
                  <div>
                    <p className="font-medium text-sm">Cristina Gonzalez</p>
                    <p className="text-xs text-gray-400">Senior Developer</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-xl">
                <span className="text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Buscar"
                  className="bg-transparent outline-none w-full text-sm"
                />
              </div>
            </div>

          </div>

          <div className="flex w-[60%] flex-col gap-6">

            <div className="flex flex-1 flex-col rounded-[2rem] bg-white p-6">
              <h3 className="text-xl font-bold mb-4">Agenda rápida</h3>

              <div className="relative w-full h-full pl-16 pb-6">

                <div className="absolute inset-0 grid grid-cols-8 grid-rows-6">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div key={i} className="border border-gray-200" />
                  ))}
                </div>

                <div className="absolute left-0 top-0 h-full flex flex-col justify-between pr-2">
                  {["LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"].map((day) => (
                    <span key={day} className="text-xs text-gray-400">
                      {day}
                    </span>
                  ))}
                </div>

                <div className="absolute inset-0">
                  <div
                    className="absolute bg-purple-600 h-2 rounded-full"
                    style={{ top: "5%", left: "10%", width: "35%" }}
                  />
                  <div
                    className="absolute bg-purple-600 h-2 rounded-full"
                    style={{ top: "5%", left: "55%", width: "35%" }}
                  />
                  <div
                    className="absolute bg-purple-600 h-2 rounded-full"
                    style={{ top: "25%", left: "10%", width: "25%" }}
                  />
                </div>

               
                <div className="absolute bottom-0 left-16 right-0 flex justify-between text-xs text-gray-400">
                  {["6:00","8:00","10:00","12:00","14:00","16:00","18:00"].map(h => (
                    <span key={h}>{h}</span>
                  ))}
                </div>

              </div>
            </div>

           
            <div className="flex flex-1 rounded-[2rem] bg-white p-6">
              <h3 className="text-xl font-bold">Juntas y Eventos</h3>
              <Image
                src={RightArrow}
                alt="Right Arrow"
                className="w-6 cursor-pointer select-none"
                priority
              />
            </div>
            </div>

        </div>
      </div>
    </section>
  );
}