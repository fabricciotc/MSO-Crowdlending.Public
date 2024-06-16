import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStateValue } from "../context/storage";
import { addPago, editarPago, getPago } from "../actions/PagoAction";

const UpdatePago = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const { state } = useLocation();
  const [{ sesionUsuario }, dispatch] = useStateValue();
  const [pago, setPago] = useState({
    Beneficiario: "",
    Descripcion: "",
    FechaPago: "",
    Monto: "",
  });

  useEffect(() => {
    const fetchPago = async () => {
      await getPago(state).then((x) => {
        setPago(x.data);
        setIsLoading(false);
      });
    };

    fetchPago();
  }, [state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPago((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const guardarPago = (e) => {
    e.preventDefault();
    editarPago(state, pago).then((res) => {
      if (res.status === 200) {
        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje: "Pago editado exitosamente",
            severity: "success",
          },
        });
        navigate("/mis-pagos");
      } else {
        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje: "Error al editar el pago",
            severity: "error",
          },
        });
      }
    });
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="w-full rounded-[15px] bg-white p-9">
      <form>
        <h4 className="text-2xl mb-4">Editar Pago</h4>
        <div className="mb-4">
          <b>Beneficiario</b>
          <input
            type="text"
            name="beneficiario"
            value={pago.beneficiario}
            onChange={handleInputChange}
            placeholder="Nombre del Beneficiario"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <b>Descripción</b>
          <input
            type="text"
            name="descripcion"
            value={pago.descripcion}
            onChange={handleInputChange}
            placeholder="Descripción del Pago"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <b>Fecha de Pago</b>
          <input
            type="date"
            name="fechaPago"
            value={new Date(pago.fechaPago).toISOString().split("T")[0]}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <b>Monto</b>
          <input
            type="number"
            name="monto"
            value={pago.monto}
            onChange={handleInputChange}
            placeholder="Monto del Pago"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => navigate("/mis-pagos")}
            className="w-full md:w-auto px-4 py-2 bg-gray-500 text-white rounded-md mr-4"
          >
            Volver
          </button>
          <button
            onClick={guardarPago}
            type="submit"
            className="w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Actualizar Pago
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePago;
