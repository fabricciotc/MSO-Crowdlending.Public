import HttpCliente from "../services/HttpCliente";
import axios from "axios";
// Instancia solo lo creamos y usamos para Registro y Login, ya que no tenemos TOKEN en esos eventos
const instancia = axios.create();
instancia.CancelToken = axios.CancelToken;
instancia.isCancel = axios.isCancel;

export const registrarUsuario = (usuario, dispatch) => {
  return new Promise((resolve, eject) => {
    instancia
      .post("/usuario/registrar", usuario)
      .then((res) => {
        if (res.data && res.data.imagenPerfil) {
          let fotoPerfil = res.data.imagenPerfil;
          const nuevoFile =
            "data:image/" + fotoPerfil.extension + ";base64," + fotoPerfil.data;
          res.data.imagenPerfil = nuevoFile;
        }
        dispatch({
          type: "INICIAR_SESION",
          sesion: res.data,
          autenticado: true,
        });
        resolve(res);
      })
      .catch((error) => {
        resolve(error.response);
      });
  });
};
export const obtenerUsuarioActual = (dispatch) => {
  return new Promise((resolve, eject) => {
    HttpCliente.get("/usuario")
      .then((response) => {
        if (response.data && response.data.imagenPerfil) {
          let fotoPerfil = response.data.imagenPerfil;
          const nuevoFile =
            "data:image/" + fotoPerfil.extension + ";base64," + fotoPerfil.data;
          response.data.imagenPerfil = nuevoFile;
        }
        dispatch({
          type: "INICIAR_SESION",
          sesion: response.data,
          autenticado: true,
        });
        resolve(response);
      })
      .catch((error) => {
        resolve(error.response);
      });
  });
};

export const actualizarPassword = (passwords, dispatch) => {
  return new Promise((resolve, eject) => {
    HttpCliente.post("/usuario/password", passwords)
      .then((response) => {
        if (response.data && response.data.imagenPerfil) {
          let fotoPerfil = response.data.imagenPerfil;
          const nuevoFile =
            "data:image/" + fotoPerfil.extension + ";base64," + fotoPerfil.data;
          response.data.imagenPerfil = nuevoFile;
        }
        dispatch({
          type: "ACTUALIZAR_PASSWORD",
          nuevoUsuario: response.data,
          autenticado: true,
        });
        resolve(response);
      })
      .catch((error) => {
        resolve(error.response);
      });
  });
};

export const actulizarUsuario = (usuario, dispatch) => {
  return new Promise((resolve, eject) => {
    HttpCliente.put("/usuario", usuario)
      .then((res) => {
        if (res.data && res.data.imagenPerfil) {
          let fotoPerfil = res.data.imagenPerfil;
          const nuevoFile =
            "data:image/" + fotoPerfil.extension + ";base64," + fotoPerfil.data;
          res.data.imagenPerfil = nuevoFile;
        }
        dispatch({
          type: "ACTUALIZAR_USUARIO",
          nuevoUsuario: res.data,
          autenticado: true,
        });
        resolve(res);
      })
      .catch((error) => {
        resolve(error.response);
      });
  });
};

export const loginUsuario = (usuario, dispatch) => {
  return new Promise((resolve, eject) => {
    instancia
      .post("/usuario/login", usuario)
      .then((res) => {
        if (res.data && res.data.imagenPerfil) {
          let fotoPerfil = res.data.imagenPerfil;
          const nuevoFile =
            "data:image/" + fotoPerfil.extension + ";base64," + fotoPerfil.data;
          res.data.imagenPerfil = nuevoFile;
        }
        dispatch({
          type: "INICIAR_SESION",
          sesion: res.data,
          autenticado: true,
        });
        resolve(res);
      })
      .catch((error) => {
        resolve(error.response);
      });
  });
};
