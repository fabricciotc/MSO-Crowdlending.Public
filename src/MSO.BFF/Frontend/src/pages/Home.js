import React, { useState, useEffect } from "react";

import { DisplayCampaigns } from "../components";
import { useStateSmartContractContext } from "../context/SmartContractContext";
import { useStateValue } from "../context/storage";
import { search } from "../assets";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [{ sesionUsuario }, dispatch] = useStateValue();

  const { address, contract, getCampaigns } = useStateSmartContractContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPagos, setFilteredPagos] = useState([]);

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [contract]);

  useEffect(() => {
    if (campaigns && campaigns.length > 0) {
      const filtered = campaigns.filter(
        (campaign) =>
          campaign.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          `${new Date(campaign.fechaLimite)
            .getDate()
            .toString()
            .padStart(2, "0")}/${(new Date(campaign.fechaLimite).getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${new Date(
            campaign.fechaLimite
          ).getFullYear()}`.includes(searchTerm.toLowerCase()) ||
          campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (campaign.montoObtenido * 1000000.00).toString().includes(searchTerm)
      );
      setFilteredPagos(filtered);
    }
  }, [searchTerm, campaigns]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <div className="flex items-center justify-center w-full  mb-5">
        <div className="p-8 rounded-xl border-2 border-gray-1 bg-white shadow-lg w-full">
          <h1 className="text-2xl font-bold mb-4">
            ¡Bienvenido de Vuelta 🎉, {sesionUsuario.usuario.nombreCompleto}!
          </h1>
          <p className="text-gray-600">
            Gracias por unirte a nosotros. Estamos emocionados de tenerte a
            bordo. ¡Explora y disfruta de la plataforma! 😊
          </p>
        </div>
      </div>

      <div className="sm:flex hidden lg:flex-1 flex-row py-2 pl-4 pr-2 h-[52px] bg-white shadow-lg border-slate-100 border-2 rounded-[20px] hover:border-sky-100 active:border-sky-100  mb-10">
        <input
          type="text"
          placeholder="Buscar solicitudes"
          onChange={handleSearchChange}
          value={searchTerm}
          className="flex w-full text-[14px] placeholder:text-[#4b5264] text-gray-900 bg-transparent outline-none"
        />

        <div className="w-[52px] h-full rounded-[20px] bg-sky-500 flex justify-center items-center cursor-pointer">
          <img
            src={search}
            alt="search"
            className="w-[15px] h-[15px] object-contain"
          />
        </div>
      </div>

      <DisplayCampaigns
        title="Todas las Solicitudes"
        isLoading={isLoading}
        campaigns={filteredPagos}
      />
    </>
  );
};

export default Home;
