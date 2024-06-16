import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateValue } from "../context/storage";
import { addPago } from "../actions/PagoAction";

const CreateRetorno = () => {
  const navigate = useNavigate();
  const [{ sesionUsuario }, dispatch] = useStateValue();
  const [pago, setPago] = useState({
    Pagador: "",
    Beneficiario: "",
    Descripcion: "",
    FechaPago: "",
    Monto: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPago((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const guardarPago = (e) => {
    e.preventDefault();
    addPago(pago).then((res) => {
      if (res.status === 200) {
        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje: "Retorno creado exitosamente",
            severity: "success",
          },
        });
        navigate("/mis-retornos");
      } else {
        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje: "Error al crear el retorno",
            severity: "error",
          },
        });
      }
    });
  };

  return (
    <div className="w-full rounded-[15px] bg-white p-9">
      <form>
        <h4 className="text-2xl mb-4">Crear Retorno</h4>
        <div className="mb-4">
          <b>Pagado por:</b>
          <input
            type="text"
            name="Beneficiario"
            value={pago.Beneficiario}
            onChange={handleInputChange}
            placeholder="Nombre del Pagador"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <b>Descripción</b>
          <input
            type="text"
            name="Descripcion"
            value={pago.Descripcion}
            onChange={handleInputChange}
            placeholder="Descripción del Retorno"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <b>Fecha de Retorno</b>
          <input
            type="date"
            name="FechaPago"
            value={pago.FechaPago}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <b>Monto</b>
          <input
            type="number"
            name="Monto"
            value={pago.Monto}
            onChange={handleInputChange}
            placeholder="Monto del Retorno"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => navigate("/mis-retornos")}
            className="w-full md:w-auto px-4 py-2 bg-gray-500 text-white rounded-md mr-4"
          >
            Volver
          </button>
          <button
            onClick={guardarPago}
            type="submit"
            className="w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Crear Retorno
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRetorno;
