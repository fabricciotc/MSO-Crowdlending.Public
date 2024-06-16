import React, { useState, useEffect } from "react";
import { useStateValue } from "../context/storage";
import { loginUsuario, obtenerUsuarioActual } from "../actions/UsuarioAction";
import { CustomButton, FormField } from "../components";
import style from "../tools/Style";
import { loginImagePerson, logoMisio } from "../assets";
import { Navigate } from "react-router-dom";
import AuthLeft from "./AuthLeft";
import { useNavigate } from "react-router";
import LoadingSpinner from "../components/LoadingSpinner";

const Login = () => {
  const [usuario, setUsuario] = useState({
    Email: "",
    Password: "",
  });
  const [loading, setLoading] = useState(true); // Added state to track loading status

  let navigate = useNavigate();

  const [{ sesionUsuario }, dispatch] = useStateValue();
  const handleSubmit = (e) => {
    e.preventDefault();
    loginUsuario(usuario, dispatch).then((res) => {
      if (res.status === 200) {
        window.localStorage.setItem("tokenSeguridad", res.data.token);
        navigate("/");
      } else if (res.status === 401) {
        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje: "(LGE401) " + res.data.mensaje,
            severity: "error",
          },
        });
      } else {
        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje: `(LGE${res.status}): ${res.statusText}`,
            severity: "error",
          },
        });
      }
    });
  };

  useEffect(() => {
    const verifyUser = async () => {
      if (!sesionUsuario) {
        const response = await obtenerUsuarioActual(dispatch);
        if (response) {
          if (response.status === 200) {
            window.localStorage.removeItem("tokenSeguridad");
            window.localStorage.setItem("tokenSeguridad", response.data.token);
          }
        }
      }
      setLoading(false); // Set loading to false after the checks are complete
    };
    verifyUser();
  }, [sesionUsuario, dispatch]);

  const handleFormFieldChange = (fieldName, e) => {
    setUsuario({ ...usuario, [fieldName]: e.target.value });
  };

  if (loading) {
    return <LoadingSpinner></LoadingSpinner>;
  } else {
    if (sesionUsuario && sesionUsuario.autenticado) {
      return <Navigate to="/" replace />;
    } else {
      return (
        <div className="w-full" style={style.authBackground}>
          <AuthLeft />
          <div className="w-full flex flex-row h-[100%]">
            <div className="w-full sm:w-1/2 bg-sky-400 hidden sm:flex flex-col gap-12 items-center p-8 content-center justify-center">
              <div className="flex w-full items-center p-8 gap-8 border-2 rounded-lg border-sky-300">
                <img
                  src={loginImagePerson}
                  className="w-[40%]"
                  alt="imageperson"
                ></img>
                <div className="text-white mt-3 text-xl">
                  <strong>Con MISIO </strong> podras adquirir prestamos 100%
                  online de manera directa y sin intermediarios, de manera
                  rapida, sencilla y segura
                </div>
              </div>

              <div className="rounded-lg p-5 bg-sky-300 h-fit ">
                <div className="flex items-end">
                  <svg
                    className="w-7 mr-2 fill-white text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    {" "}
                    <g>
                      {" "}
                      <path fill="none" d="M0 0h24v24H0z" />{" "}
                      <path d="M6 8V7a6 6 0 1 1 12 0v1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h2zm13 2H5v10h14V10zm-8 5.732a2 2 0 1 1 2 0V18h-2v-2.268zM8 8h8V7a4 4 0 1 0-8 0v1z" />{" "}
                    </g>{" "}
                  </svg>
                  <h2 className="font-bold text-white text-xl">
                    Centro de Seguridad
                  </h2>
                </div>
                <div className="text-white mt-3">
                  <strong>Tip: </strong> Nunca compartas tu clave personal con
                  nadie y asegúrate que tenga el candadito a lado de la URL.
                </div>
              </div>
            </div>
            <div className="w-full sm:w-1/2 m-auto">
              <div className="flex justify-center items-center flex-col rounded-lg sm:p-10 p-4 max-w-sm m-auto bg-white border-slate-100 border-2 shadow-lg mx-4 px-6 sm:mx-auto">
                <form
                  onSubmit={handleSubmit}
                  className="w-full flex flex-col gap-6"
                >
                  <img
                    src={logoMisio}
                    alt="logo"
                    className="h-32 my-auto object-contain mx-5 "
                  />

                  <div className="flex flex-wrap gap-4">
                    <FormField
                      labelName="Correo Electronico"
                      placeholder="Colocar tu Correo Electronico"
                      inputType="email"
                      value={usuario.Email}
                      handleChange={(e) => handleFormFieldChange("Email", e)}
                    />
                    <FormField
                      labelName="Contraseña"
                      placeholder="Colocar su Contraseña"
                      inputType="password"
                      value={usuario.Password}
                      handleChange={(e) => handleFormFieldChange("Password", e)}
                    />
                  </div>

                  <div className="justify-center items-center mt-5 text-center mb-2 sm:mb-0">
                    <CustomButton
                      btnType="submit"
                      title="INGRESAR"
                      styles="bg-sky-400 hover:bg-sky-600 text-white mb-4"
                    />
                    <a
                      className="font-normal hover:text-sky-600 text-sky-500 hover:cursor-pointer text-sm leading-[8px] text-center"
                      onClick={() => {
                        navigate("/auth/registro");
                      }}
                    >
                      ¿Eres nuevo en la plataforma? Registrate
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
};

export default Login;
