import HttpCliente from "../services/HttpCliente";
import axios from "axios";
// Instancia solo lo creamos y usamos para Registro y Login, ya que no tenemos TOKEN en esos eventos
const instancia = axios.create();
instancia.CancelToken = axios.CancelToken;
instancia.isCancel = axios.isCancel;

export const getContratosEliminados = () => {
  return new Promise((resolve, eject) => {
    HttpCliente.get("/contratos")
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        resolve(error.response);
      });
  });
};

export const addContratoEliminado = (contratoId) => {
  return new Promise((resolve, eject) => {
    HttpCliente.post("/contratos", contratoId)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        resolve(error.response);
      });
  });
};
