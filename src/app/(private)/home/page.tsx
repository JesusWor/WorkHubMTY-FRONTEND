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
        <div className="flex justify-start items-start px-2 mt-4">
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

      <div className="flex w-[60%] h-[90%] flex-col gap-10">

        <div className="flex flex-1 rounded-[2rem] bg-white p-8 justify-center items-top">
          <h3 className="text-xl font-bold">Agenda Rápida</h3>
        </div>

        <div className="flex flex-1 flex-col rounded-[2rem] bg-white p-8 justify-between">
  
          <h3 className="text-xl font-bold">Juntas y Eventos</h3>

        <div className="flex justify-center items-center px-2 mt-4">
          <p className="text-sm text-gray-500">
          Próximas reuniones y eventos importantes
          </p>
        </div>

      </div>

      </div>

    </div>

  </div>

</section>
  );
}


