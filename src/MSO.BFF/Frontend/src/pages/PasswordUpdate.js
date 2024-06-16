import React, { useState } from "react";
import style from "../tools/Style";
import { useStateValue } from "../context/storage";
import { actualizarPassword } from "../actions/UsuarioAction";
import { useNavigate } from "react-router-dom";

const PasswordUpdate = (props) => {
  const navigate = useNavigate();
  const [{ sesionUsuario }, dispatch] = useStateValue();
  const [passwords, setPasswords] = useState({
    password: "",
    newPassword: "",
  });

  const ingresarValoresMemoria = (e) => {
    const { name, value } = e.target;
    setPasswords((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  const guardarUsuario = (e) => {
    e.preventDefault();
    actualizarPassword(passwords, dispatch).then((res) => {
      console.log(res);
      if (res.status === 200) {
        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje: "Se actualizo la contraseña exitosamente",
            severity: "success",
          },
        });
        window.localStorage.setItem("tokenSeguridad", res.data.token);
        navigate("/perfil");
      } else if (res.status === 500) {
        if (res.data === "Incorrect password.") {
          dispatch({
            type: "OPEN_SNACKBAR",
            openMensaje: {
              open: true,
              mensaje: "La clave ingresada no concuerda con la del usuario.",
              severity: "error",
            },
          });
        } else {
          dispatch({
            type: "OPEN_SNACKBAR",
            openMensaje: {
              open: true,
              mensaje:
                "La clave ingresada no cumple los requisitos: " + res.data,
              severity: "error",
            },
          });
        }
      } else {
        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje:
              "No se pudieron guardar los cambios en: " +
              Object.keys(res.data.errors),
            severity: "error",
          },
        });
      }
    });
  };

  return (
    <div className="w-full rounded-[15px] bg-white p-9">
      <div style={style.paper}>
        <form style={style.form}>
          <div>
            <div className="col-span-1">
              <h4 className="text-2xl mb-4">Cambio de Contraseña</h4>
              <p className="mb-4">
                ¡Bienvenido a tu página de perfil de usuario! Aquí podrás ver y
                actualizar toda tu información personal. Toma el control y
                mantén tus datos actualizados para asegurarte de que siempre
                tengamos la información correcta.
              </p>

              <div className="mb-4">
                <b>Contraseña</b>
                <input
                  type="password"
                  name="password"
                  value={passwords.password}
                  onChange={ingresarValoresMemoria}
                  autoComplete="new-password"
                  placeholder="Contraseña Actual"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <b>Nueva Contraseña</b>
                <input
                  type="password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={ingresarValoresMemoria}
                  autoComplete="new-password"
                  placeholder="Nueva Contraseña"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <button
              className="w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={guardarUsuario}
              type="submit"
            >
              Guardar Datos
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordUpdate;
