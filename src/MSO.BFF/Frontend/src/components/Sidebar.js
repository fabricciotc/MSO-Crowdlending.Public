import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { navlinksEmpresa, navlinksInversionista } from "../constants";
import { useStateValue } from "../context/storage";
import { useStateSmartContractContext } from "../context/SmartContractContext";

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (
  <div
    className={`w-[48px] h-[48px] rounded-[10px] ${
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
        className={`w-1/2 h-1/2 ${
          isActive === name ? "hue-rotate-170" : "grayscale"
        }`}
      />
    )}
  </div>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");
  const [{ sesionUsuario }, dispatch] = useStateValue();
  const { disconnect } = useStateSmartContractContext();
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
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh]">
      <div className="flex-1 flex flex-col justify-between items-center bg-white border-slate-100 border-1 rounded-[20px] w-[76px] py-4 mt-24 shadow-lg">
        <div className="flex flex-col justify-center items-center gap-3">
          {(sesionUsuario.usuario.tipo === "Inversionista"
            ? navlinksInversionista
            : navlinksEmpresa
          ).map((link) => (
            <>
              {link.name !== "Whatsapp" &&
              link.name !== "Recursos" &&
              link.name !== "FAQ" ? (
                <Icon
                  key={link.name}
                  {...link}
                  isActive={isActive}
                  handleClick={() => {
                    if (!link.disabled) {
                      if (link.name !== "Logout") {
                        setIsActive(link.name);
                        navigate(link.link);
                      } else {
                        salirSesionApp();
                      }
                    }
                  }}
                />
              ) : null}
              {link.name !== "Logout" ? null : <hr></hr>}
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
