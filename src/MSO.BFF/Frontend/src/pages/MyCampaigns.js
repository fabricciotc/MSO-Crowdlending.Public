import React, { useState, useEffect } from "react";

import { DisplayCampaigns } from "../components";
import { useStateSmartContractContext } from "../context/SmartContractContext";
import { useStateValue } from "../context/storage";

const MyCampaigns = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [division, setDivision] = useState(null);
  const [sumaMontoObtenido, setSumaMontoObtenido] = useState(null);
  const [sumaMontoDeseado, setSumaMontoDeseado] = useState(null);
  const [{ sesionUsuario }] = useStateValue();
  const { address, contract, getUserCampaigns } =
    useStateSmartContractContext();
  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      const data = await getUserCampaigns();
      setCampaigns(data);
      setIsLoading(false);
    };

    if (contract) fetchCampaigns();
  }, [contract, getUserCampaigns]);

  useEffect(() => {
    if (campaigns) {
      // Calcula la suma de todos los montoObtenido
      setSumaMontoObtenido(
        campaigns.reduce(
          (total, transaccion) =>
            total + parseFloat(transaccion.montoObtenido) * 1000000.00,
          0
        )
      );

      // Calcula la suma de todos los montoDeseado
      setSumaMontoDeseado(
        campaigns.reduce(
          (total, transaccion) =>
            total + parseFloat(transaccion.montoDeseado) * 1000000.00,
          0
        )
      );
      setDivision((sumaMontoObtenido / sumaMontoDeseado) * 100);
    }
  }, [
    campaigns,
    setDivision,
    setSumaMontoDeseado,
    setSumaMontoObtenido,
    sumaMontoObtenido,
    sumaMontoDeseado,
  ]);

  return address ? (
    <>
      {division && sumaMontoObtenido && sumaMontoDeseado ? (
        <>
          <div className="flex items-center justify-center w-full mb-10">
            <div className="p-8 rounded-xl border-2 border-gray-1 bg-white shadow-lg w-full">
              <h1 className="text-2xl font-bold mb-4">
                ¡Bienvenido {sesionUsuario.usuario.nombreCompleto} 👋🏻!
              </h1>
              <p className="text-gray-600">
                Las solicitudes bajo tu wallet <b>{address}</b> han tenido un
                rendimiento del <b>{division.toFixed(2)}%</b> sobre el monto
                deseado, recaudando un total de{" "}
                <b>
                  S/
                  {sumaMontoObtenido.toFixed(2)}
                </b>{" "}
                hasta la fecha. 😊 De un total buscado de{" "}
                <b>
                  S/
                  {sumaMontoDeseado.toFixed(2)}
                </b>
              </p>
            </div>
          </div>

          <div className="bg-green-200 shadow-md rounded-[20px] mt-3 mb-7  text-white text-center">
            <div
              className="h-[30px] rounded-[20px] bg-green-500"
              style={{
                width: `${division}%`,
                maxWidth: "100%",
                transition: "width 2s ease-out",
                alignContent: "center", // Add a smooth transition for the width change
              }}
            >
              <b>{division.toFixed(2)}%</b>
            </div>
          </div>
        </>
      ) : null}
      <DisplayCampaigns
        title={`Solicitudes de mi Wallet: ${address}`}
        isLoading={isLoading}
        campaigns={campaigns}
      />
    </>
  ) : (
    <div className="flex flex-col p-4 bg-red-600 rounded-[10px] h-auto">
      <p
        className="font-epilogue font-semibold text-[18px] text-white mt-6 text-center"
        style={{ margin: "auto", height: "min" }}
      >
        🚫 Conecte su wallet para solicitar un prestamo mediante contratos
        digitales
      </p>
    </div>
  );
};

export default MyCampaigns;
