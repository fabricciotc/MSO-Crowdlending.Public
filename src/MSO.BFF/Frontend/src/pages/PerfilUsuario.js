import React, { useEffect, useState } from "react";
import style from "../tools/Style";
import { useStateValue } from "../context/storage";
import { loginImagePerson } from "../assets/index";
import { v4 as uuidv4 } from "uuid";
import ImageUploader from "react-images-upload";
import { obtenerDataImagen } from "../actions/ImagenAction";
import { useNavigate } from "react-router-dom";
import { actulizarUsuario } from "../actions/UsuarioAction";

const PerfilUsuario = (props) => {
  const [{ sesionUsuario }, dispatch] = useStateValue();
  const [usuario, setUsuario] = useState({
    nombreCompleto: "",
    email: "",
    password: "",
    numeroDocumento: 0,
    imagenPerfil: null,
    tipo: null,
    fotoUrl: "",
  });

  const navigate = useNavigate();

  const ingresarValoresMemoria = (e) => {
    const { name, value } = e.target;
    setUsuario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (sesionUsuario) {
      console.log(sesionUsuario);
      setUsuario(sesionUsuario.usuario);
      setUsuario((anterior) => ({
        ...anterior,
        fotoUrl: sesionUsuario.usuario.imagenPerfil,
        imagenPerfil: null,
      }));
    }
  }, []);

  const guardarUsuario = (e) => {
    e.preventDefault();
    actulizarUsuario(usuario, dispatch).then((res) => {
      console.log(res);
      if (res.status === 200) {
        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje: "Se guardaron exitosamente los cambios en perfil usuario",
            severity: "success",
          },
        });
        window.localStorage.setItem("tokenSeguridad", res.data.token);
      } else if (res.status === 500) {
        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje: res.data,
            severity: "error",
          },
        });
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

  const subitFoto = (imagenes) => {
    const foto = imagenes[0];
    const fotoUrl = URL.createObjectURL(foto);

    obtenerDataImagen(foto).then((respuesta) => {
      setUsuario((anterior) => ({
        ...anterior,
        imagenPerfil: respuesta,
        fotoUrl: fotoUrl,
      }));
    });
  };

  const fotoKey = uuidv4();

  return (
    <div className="w-full rounded-[15px] bg-white p-9">
      <div style={style.paper}>
        <form style={style.form}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="col-span-1" style={{ justifySelf: "center" }}>
              <div className="w-[288px]">
                <img
                  className="w-full m-auto"
                  src={usuario ? usuario.fotoUrl || loginImagePerson : null}
                  alt="Avatar"
                />
              </div>

              <div className="mt-2">
                <ImageUploader
                  withIcon={false}
                  key={fotoKey}
                  singleImage={true}
                  buttonText="Seleccione una Imagen de Perfil"
                  onChange={subitFoto}
                  imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
                  maxFileSize={5242880}
                />
              </div>
            </div>

            <div className="col-span-1">
              <h4 className="text-2xl mb-4">Datos del Usuario</h4>
              <p className="mb-4">
                ¡Bienvenido a tu página de perfil de usuario! Aquí podrás ver y
                actualizar toda tu información personal. Toma el control y
                mantén tus datos actualizados para asegurarte de que siempre
                tengamos la información correcta.
              </p>
              <div className="mb-4">
                <b>
                  {" "}
                  {usuario.tipo === "Inversionista"
                    ? "Nombre Completo"
                    : "Razón Social"}
                </b>

                <input
                  type="text"
                  name="nombreCompleto"
                  value={usuario.nombreCompleto}
                  onChange={ingresarValoresMemoria}
                  placeholder="Fullname"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <b>Email</b>
                <input
                  type="email"
                  name="email"
                  value={usuario.email}
                  onChange={ingresarValoresMemoria}
                  placeholder="Email"
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <b>
                  {usuario.tipo}{" "}
                  {usuario.tipo === "Inversionista" ? "(DNI)" : "(RUC)"}
                </b>
                <input
                  type="number"
                  name="numeroDocumento"
                  value={usuario.numeroDocumento}
                  onChange={ingresarValoresMemoria}
                  placeholder={`Numero de Documento ${
                    usuario.tipo === "Inversionista" ? "(DNI)" : "(RUC)"
                  }`}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <b>Contraseña</b>
                <input
                  type="password"
                  name="password"
                  value={usuario.password}
                  onChange={ingresarValoresMemoria}
                  autoComplete="new-password"
                  placeholder="Password"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <b>
                  * Ingresar la contraseña actual es obligatorio para guardar
                  los cambios
                </b>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button
              className="w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={guardarUsuario}
              type="submit"
            >
              Guardar Cambios
            </button>
            <button
              className="w-full md:w-auto px-4 py-2 bg-yellow-500 text-white rounded-md"
              onClick={() => navigate("/perfil/password")}
            >
              Cambiar Contraseña
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PerfilUsuario;
