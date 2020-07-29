import React from "react";
import Logo from "../assets/static/logo-platzi-video-BW2.png";
import Icon from "../assets/static/user-icon.png";
import "../assets/components/Header.scss";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { gravatar } from "../utils/gravatar";
import { logoutrequest } from "../actions/index";
import classNames from "classnames";

const Header = (props) => {
  const { user, isLogin, isRegister } = props;
  const hasUser = Object.keys(user).length > 0;

  const handleLogout = () => {
    props.logoutrequest({});
  };

  const headerClass = classNames("header", {
    isLogin,
    isRegister,
  });

  return (
    <div className={headerClass}>
      <Link to="/">
        <img className="header__img" src={Logo} alt="Platzi Video" />
      </Link>
      <div className="header__menu">
        <div className="header__menu--profile">
          {hasUser ? (
            <img src={gravatar(user.email)} alt={user.name} />
          ) : (
            <img src={Icon} alt="" />
          )}

          <p>Perfil</p>
        </div>
        <ul>
          {hasUser ? (
            <li>
              <a href="/">{user.email}</a>
            </li>
          ) : null}

          {hasUser ? (
            <li>
              <a href="#logout" onClick={handleLogout}>
                Cerrar Sesión
              </a>
            </li>
          ) : (
            <li>
              <Link to="/login">Iniciar Sesión</Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = {
  logoutrequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
