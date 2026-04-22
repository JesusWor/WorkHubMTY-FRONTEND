"use client";

import React, { useState } from "react";
import AccentureLogo from "../../../../public/accenture_logo_purple1.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

/*
faltante ---------
overflow
margins
input : {
  focus
  align
}
validacion. hay algun formato que siempre sigan los EID?
*/

interface User {
  eId: string;
  password: string;
}

function Login() {
  const [user, setUser] = useState<User>({ eId: "", password: "" });
  // const { login: loginFetch, isAuthenticated } = useAuth();
  const [error, setError] = useState<string>("");
  const router = useRouter();

  function onChangeUser(e: React.ChangeEvent<HTMLInputElement>) {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  }

  async function onSubmitLogin(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    try {
      // await loginFetch(user);
      router.push("/home");
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al iniciar sesión");
    }
  }

  // if (isAuthenticated) {
  //   router.push("/home");
  //   return null;
  // }

  return (
    <section className="flex h-[100svh] w-full overflow-hidden bg-black">
      <div className="ml-[3svw] mr-auto grid w-full grid-rows-1 text-left text-white">
        <div className="px-8 py-8 pt-12 rounded-full">
          <h3 className="text-5xl font-semibold tracking-tight">Workhub MTY</h3>
          <hr className="border-white/40" />
        </div>
        <div className="flex justify-between items-center px-10">
        <Image
          src={AccentureLogo}
          alt="Accenture Logo"
          width={200}
          height={100}
          className="w-[10svw] select-none"
          priority
        />
        </div>
        <div className="px-8 py-6 pb-14">
          <h2 className="text-5xl font-semibold tracking-tight">Bienvenido</h2>
        </div>
         
        
      </div>

      <div className="mx-[2svw] my-[3svh] flex w-[40%] flex-col justify-center rounded-[4rem] bg-white p-8 text-left">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-3xl  font-bold">Iniciar sesión</h3>
        </div>

        <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmitLogin}>
          <label className="flex items-center gap-2 rounded-[1.5rem] bg-[#d1d1d1] p-3 transition-colors duration-500 hover:bg-[#c7c7c7]">
            <span className="material-symbols-outlined pointer-events-none select-none text-base text-gray-600">
              person
            </span>
            <input
              className="w-full border-0 bg-transparent text-[#8f8f8f] outline-none placeholder:text-[#8f8f8f]"
              type="text"
              name="eId"
              value={user.eId}
              onChange={onChangeUser}
              placeholder="Enterprise ID"
            />
          </label>

          <label className="flex items-center gap-2 rounded-[1.5rem] bg-[#d1d1d1] p-3 transition-colors duration-500 hover:bg-[#c7c7c7]">
            <span className="material-symbols-outlined pointer-events-none select-none text-base text-gray-600">
              lock
            </span>

            <input
              className="w-full border-0 bg-transparent text-[#8f8f8f] outline-none placeholder:text-[#8f8f8f]"
              name="password"
              type="password"
              value={user.password}
              onChange={onChangeUser}
              placeholder="Contraseña"
            />
          </label>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <input
            className="cursor-pointer rounded-[5rem] border-0 bg-black p-3 text-base text-white transition-colors hover:bg-[rgb(42,40,40)]"
            type="submit"
            value="Iniciar sesión"
          />
        </form>
      </div>
    </section>
  );
}

export default Login;
