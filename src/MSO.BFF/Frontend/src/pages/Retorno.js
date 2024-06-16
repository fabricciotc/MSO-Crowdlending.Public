import React, { useState, useEffect } from "react";
import { eliminarPago, getPagos } from "../actions/PagoAction";
import { useNavigate } from "react-router-dom";

function Retorno() {
  const [pagos, setPagos] = useState([]);
  const [filteredPagos, setFilteredPagos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 15;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPagos = async () => {
      setIsLoading(true);
      // Simulate fetching data from an API
      await getPagos().then((x) => {
        setPagos(x.data);
        setIsLoading(false);
      });
    };
    fetchPagos();
  }, []);

  useEffect(() => {
    if (pagos && pagos.length > 0) {
      const filtered = pagos.filter(
        (pago) =>
          pago.pagador.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pago.beneficiario.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pago.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pago.monto.toString().includes(searchTerm)
      );
      setFilteredPagos(filtered);
      setCurrentPage(1); // Reset to first page when search changes
    }
  }, [searchTerm, pagos]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Get current pagos
  const indexOfLastPago = currentPage * itemsPerPage;
  const indexOfFirstPago = indexOfLastPago - itemsPerPage;

  const currentPagos = filteredPagos.slice(indexOfFirstPago, indexOfLastPago);

  const handleNext = () => {
    if (indexOfLastPago < filteredPagos.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleEdit = (id) => {
    navigate(`/editar-retorno/${id}`, { state: id });
  };

  const handleDelete = (id) => {
    eliminarPago(id).then((_) => {
      window.location.reload();
    });
    // Additional logic for deletion
  };

  const handleCreate = () => {
    navigate("/crear-retorno");
    // Logic to add a new pago
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  } else {
    return (
      <div className="container mx-auto">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search retornos..."
          className="mb-4 p-2 border border-slate-300 rounded"
        />
        <button
          onClick={handleCreate}
          className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create New Retorno
        </button>
        <table className="min-w-full table-auto border-collapse border border-slate-400">
          <thead>
            <tr className="bg-slate-200">
              <th className="border border-slate-300 p-2">ID</th>
              <th className="border border-slate-300 p-2">Recibido Por:</th>
              <th className="border border-slate-300 p-2">
                Última Actualización
              </th>
              <th className="border border-slate-300 p-2">Pagado por:</th>
              <th className="border border-slate-300 p-2">Descripción</th>
              <th className="border border-slate-300 p-2">Fecha del Retorno</th>
              <th className="border border-slate-300 p-2">Monto</th>
              <th className="border border-slate-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPagos.map((pago) => (
              <tr key={pago.Id}>
                <td className="border border-slate-300 p-2">{pago.id}</td>
                <td className="border border-slate-300 p-2">{pago.pagador}</td>
                <td className="border border-slate-300 p-2">{pago.dateTime}</td>
                <td className="border border-slate-300 p-2">
                  {pago.beneficiario}
                </td>
                <td className="border border-slate-300 p-2">
                  {pago.descripcion}
                </td>
                <td className="border border-slate-300 p-2">
                  {pago.fechaPago}
                </td>
                <td className="border border-slate-300 p-2">
                  {pago.monto.toFixed(2)}
                </td>
                <td className="border border-slate-300 p-2">
                  <button
                    onClick={() => handleEdit(pago.id)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2  mt-2 mb-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pago.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded  mt-2 mb-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrevious}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Next
          </button>
        </div>
      </div>
    );
  }
}

export default Retorno;
