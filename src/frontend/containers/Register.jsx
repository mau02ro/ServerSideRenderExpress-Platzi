import React, { useState } from "react";
import "../assets/styles/Register.scss";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { registerRequest } from "../actions/index";
import Header from "../components/Header";

const Register = (props) => {
  const [form, setValues] = useState({ email: "", password: "", name: "" });

  const handleInput = (event) => {
    setValues({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = () => {
    props.registerRequest(form);
    props.history.push("/");
  };

  return (
    <>
      <Header isRegister />
      <section className="register">
        <section className="register__container">
          <h2>Regístrate</h2>
          <form className="register__container--form" onSubmit={handleSubmit}>
            <input
              className="input"
              type="text"
              placeholder="Nombre"
              name="name"
              onChange={handleInput}
              value={form.name}
            />
            <input
              className="input"
              type="text"
              placeholder="Correo"
              name="email"
              onChange={handleInput}
              value={form.email}
            />
            <input
              className="input"
              type="password"
              placeholder="Contraseña"
              name="password"
              onChange={handleInput}
              value={form.password}
            />
            <button className="button">Registrarme</button>
          </form>
          <Link to="/login">Iniciar sesión</Link>
        </section>
      </section>
    </>
  );
};

const mapDispatchToProps = {
  registerRequest,
};

export default connect(null, mapDispatchToProps)(Register);
