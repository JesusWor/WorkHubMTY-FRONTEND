import React, { useState, useRef } from "react";
import UserIcon from "../../assets/user.svg";
import LockIcon from "../../assets/lock.svg";
import AccentureLogo from "../../assets/Accenture.png";

import "./Login.css";
import { useAuth } from "../../modules/auth/useAuth";

/*
faltante ---------
overflow 
margins
input : {
  focus
  align
}
*/
interface User {
  e_id: string;
  password: string;
}

function Login() {
  const [user, setUser] = useState<User>({ e_id: "", password: "" });
  const { login: loginFetch } = useAuth();

  function onChangeUser(e: React.ChangeEvent<HTMLInputElement>) {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  }

  function onSubmitLogin(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    //validacion de entradas dependiendo del formato de los eid
    loginFetch(user);
  }

  return (
    <section className="login">
      <div className="login-hero">
        <div>
          <h3>Workhub MTY</h3>
          <hr />
        </div>
        <img className="accenture-logo" src={AccentureLogo} />
        <h2>Bienvenido</h2>
      </div>
      <div className="login-card">
        <h3 className="login-card-title">Iniciar sesión</h3>
        <form className="login-form" onSubmit={onSubmitLogin}>
          <div className="login-form-group">
            <img className="login-form-user-icon" src={UserIcon} />
            <input
              className="login-form-group-input"
              type="text"
              name="enterprise id"
              onChange={onChangeUser}
              placeholder="Enterprise ID"
              tabIndex={0}
            />
          </div>
          <div className="login-form-group">
            <img className="login-form-lock-icon" src={LockIcon} />

            <input
              className="login-form-group-input"
              name="password"
              type="password"
              onChange={onChangeUser}
              placeholder="Contraseña"
            />
          </div>

          <input
            className="login-form-button"
            type="submit"
            value="Iniciar sesión"
          />
        </form>
      </div>
    </section>
  );
}

export default Login;
