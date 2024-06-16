import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useStateSmartContractContext } from "../context/SmartContractContext";
import { CustomButton } from ".";
import { logo, menu, search, userLogin, logoMisio, logoSolo } from "../assets";
import { navlinksEmpresa, navlinksInversionista } from "../constants";
import { useStateValue } from "../context/storage";

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (
  <div
    className={`w-[88px] h-[48px] rounded-[10px] ${
      isActive && isActive === name && "bg-green-200"
    } flex justify-center items-center ${
      !disabled && "cursor-pointer"
    } ${styles}`}
    onClick={handleClick}
  >
    {!isActive ? (
      <img src={imgUrl} alt="fund_logo" className="w-4/5 h-4/5" />
    ) : (
      <img
        src={imgUrl}
        alt="fund_logo"
        className={` ${isActive === name ? "hue-rotate-170" : "grayscale"}`}
      />
    )}
  </div>
);

const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [{ sesionUsuario }, dispatch] = useStateValue();
  const { connect, address, disconnect } = useStateSmartContractContext();
  const [usuario, setUsuario] = useState({});

  useEffect(() => {
    if (sesionUsuario && sesionUsuario.autenticado) {
      setUsuario(sesionUsuario.usuario);
      setUsuario((anterior) => ({
        ...anterior,
        fotoUrl: sesionUsuario.usuario.imagenPerfil,
        imagenPerfil: null,
      }));
    }
  }, [sesionUsuario]);

  const salirSesionApp = () => {
    dispatch({
      type: "CERRAR_SESION",
    });
    dispatch({
      type: "OPEN_SNACKBAR",
      openMensaje: {
        open: true,
        mensaje: "Sesion cerrada de manera exitosa",
        severity: "success",
      },
    });
    disconnect();
    localStorage.removeItem("tokenSeguridad");
    navigate("/auth/login");
  };
  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6  max-w-[1260px] mx-auto  bg-white border-slate-100 border-1 rounded-[20px] shadow-md p-2">
      <img
        src={logoMisio}
        alt="search"
        className=" sm:flex hidden  h-10 my-auto object-contain mx-5"
      />

      <div className="sm:flex hidden flex-row justify-end gap-4">
        <>
          <CustomButton
            btnType="button"
            title="Orientacion 📚"
            styles={
              address
                ? "bg-yellow-500 whitespace-nowrap"
                : "bg-[#8c6dfd] whitespace-nowrap"
            }
            handleClick={() => {
              navigate("/orientacion");
            }}
          />
        </>
        <CustomButton
          btnType="button"
          title={
            address
              ? sesionUsuario.usuario.tipo === "Inversionista"
                ? "Ver Solicitudes 💹"
                : "💸 Solicitar un Prestamo"
              : "Conectar Wallet"
          }
          styles={
            address
              ? "bg-green-500 whitespace-nowrap"
              : "bg-[#8c6dfd] whitespace-nowrap"
          }
          handleClick={() => {
            if (address)
              sesionUsuario.usuario.tipo === "Inversionista"
                ? navigate("/")
                : navigate("/solicitar-prestamo");
            else connect();
          }}
        />
        <button
          type="button"
          className={`font-semibold text-[16px] leading-[26px] text-white py-2 px-4 rounded-[20px] w-full bg-red-700  whitespace-nowrap`}
          onClick={salirSesionApp}
        >
          Cerrar Session
        </button>
        <Link to="/perfil">
          <div className="w-[52px] h-[52px] rounded-full bg-green-200 font-bold flex justify-center items-center cursor-pointer text-green-500 ">
            {usuario.fotoUrl ? (
              <img
                src={usuario.fotoUrl}
                alt="search"
                className="w-full object-contain rounded-full"
              />
            ) : (
              sesionUsuario.usuario.nombreCompleto
                .split(" ")
                .slice(0, 2)
                .map((name) => name[0])
                .join("")
                .toUpperCase()
            )}
          </div>
        </Link>
      </div>

      {/* Small screen navigation */}
      <div className="sm:hidden flex justify-between items-center relative">
        <div className="w-[40px] h-[40px] rounded-[10px] bg-whitesmoke flex justify-center items-center cursor-pointer">
          <img
            src={logoSolo}
            alt="user"
            className="w-[90%] h-[90%] object-contain"
          />
        </div>
        <span className="px-4 py-2 rounded-full bg-green-200 font-bold flex justify-center items-center cursor-pointer text-green-500">
          {sesionUsuario.usuario.nombreCompleto}
        </span>
        <img
          src={menu}
          alt="menu"
          className="w-[34px] h-[34px] object-contain cursor-pointer px-1 mr-1"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />

        <div
          className={`absolute top-[60px] right-0 left-0 bg-slate-50 rounded-[20px] z-10 shadow-secondary p-4 ${
            !toggleDrawer ? "-translate-y-[100vh]" : "translate-y-0"
          } transition-all duration-700`}
        >
          <ul className="mb-4">
            {(sesionUsuario.usuario.Tipo === "Inversionista"
              ? navlinksInversionista
              : navlinksEmpresa
            ).map((link) => (
              <>
                <li
                  key={link.name}
                  className={`flex p-4 rounded-lg ${
                    isActive === link.name && "bg-green-200"
                  }`}
                  onClick={() => {
                    if (link.name !== "Logout") {
                      setIsActive(link.name);
                      setToggleDrawer(false);
                      navigate(link.link);
                    } else {
                      salirSesionApp();
                    }
                  }}
                >
                  <img
                    src={link.imgUrl}
                    alt={link.name}
                    className={`w-[24px] h-[24px] object-contain ${
                      isActive === link.name ? "grayscale-0" : "grayscale"
                    }`}
                  />
                  <p
                    className={`ml-[20px] font-semibold text-[14px] ${
                      isActive === link.name
                        ? "text-[#1dc071]"
                        : "text-[#808191]"
                    }`}
                  >
                    {link.name}
                  </p>
                </li>
                {link.name !== "Logout" ? null : <hr></hr>}
              </>
            ))}
          </ul>
          <div className="flex mx-4">
            <CustomButton
              btnType="button"
              title={address ? "💸 Solicitar un Prestamo" : "Conectar Wallet"}
              styles={address ? "bg-green-500" : "bg-[#8c6dfd]"}
              handleClick={() => {
                if (address) navigate("/solicitar-prestamo");
                else connect();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
