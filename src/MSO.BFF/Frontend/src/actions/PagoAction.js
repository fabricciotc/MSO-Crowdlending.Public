import HttpCliente from "../services/HttpCliente";
import axios from "axios";
// Instancia solo lo creamos y usamos para Registro y Login, ya que no tenemos TOKEN en esos eventos
const instancia = axios.create();
instancia.CancelToken = axios.CancelToken;
instancia.isCancel = axios.isCancel;

export const getPagos = () => {
  return new Promise((resolve, eject) => {
    HttpCliente.get("/pagos")
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        resolve(error.response);
      });
  });
};

export const getPago = (pagoId) => {
  return new Promise((resolve, eject) => {
    HttpCliente.get(`/pagos/${pagoId}`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        resolve(error.response);
      });
  });
};

export const eliminarPago = (pagoId) => {
  return new Promise((resolve, eject) => {
    HttpCliente.delete(`/pagos/${pagoId}`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        resolve(error.response);
      });
  });
};

export const editarPago = (id, newpago) => {
  return new Promise((resolve, eject) => {
    HttpCliente.put(`/pagos/${id}`, newpago)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        resolve(error.response);
      });
  });
};

export const addPago = (pago) => {
  return new Promise((resolve, eject) => {
    HttpCliente.post("/pagos", pago)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        resolve(error.response);
      });
  });
};
