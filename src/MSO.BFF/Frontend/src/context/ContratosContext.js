import { createContext, useContext } from "react";
import { useStateValue } from "./storage";
import {
  addContratoEliminado,
  getContratosEliminados,
} from "../actions/ContratoAction";

const ContratosContext = createContext();

export const ContratosContextProvider = ({ children }) => {
  const [{ sesionUsuario }, dispatch] = useStateValue();

  const getEliminados = async () => {
    var contratos = await getContratosEliminados();
    return contratos;
  };

  const addEliminado = async (contratoId) => {
    var response = await addContratoEliminado(contratoId);
    if (response) {
      if (response.status === 200) {
        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje: "Se eliminado el contrato efectivamente",
            severity: "success",
          },
        });
      }
    }
  };

  return (
    <ContratosContext.Provider
      value={{
        getEliminados,
        addEliminado,
      }}
    >
      {children}
    </ContratosContext.Provider>
  );
};
export const useStateContratosContextProvider = () =>
  useContext(ContratosContext);
