import React from "react";

import { tagType, thirdweb } from "../assets";
import { daysLeft } from "../utils";

const FundCard = ({
  owner,
  title,
  description,
  montoDeseado,
  fechaLimite,
  montoObtenido,
  image,
  handleClick,
  categoria,
}) => {
  const remainingDays = daysLeft(fechaLimite);

  return (
    <div
      className="sm:w-[288px] w-full rounded-[15px] bg-white cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={image}
        alt="fund"
        className="w-full h-[158px] object-cover rounded-[15px]"
      />

      <div className="flex flex-col p-4">
        <div className="block">
          <h3 className="font-epilogue font-semibold text-[16px] text-gray-900 text-left leading-[26px] truncate">
            {title}
          </h3>
          <p className="mt-[5px] font-epilogue font-normal text-[#808191] text-left leading-[18px] truncate">
            {description}
          </p>
        </div>

        <div className="flex justify-between flex-wrap mt-[15px] gap-2">
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
              S/{montoObtenido * 1000000.00}
            </h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">
              Colectado de S/{montoDeseado * 1000000.00}
            </p>
          </div>
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
              {remainingDays}
            </h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">
              Dias Restantes
            </p>
          </div>
        </div>

        <div className="flex items-center mt-[20px] gap-[12px]">
          <p className="flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate">
            Solicitado por: <span className="text-[#b2b3bd]">{owner}</span>
          </p>
        </div>
      </div>
      {montoObtenido === montoDeseado && (
        <div className="flex flex-col p-4 bg-green-500 rounded-b-[20px]">
                  <p className="font-epilogue font-semibold text-[12px] text-white text-center">
            Solicitud 100% Financiada 🥳
          </p>
        </div>
      )}
      {montoObtenido !== montoDeseado && (
              <div className="flex flex-col p-4 bg-blue-500 rounded-b-[20px]">
                  <p className="font-epilogue font-semibold text-[12px] text-white text-center">
            Financiar Solicitud 💵
          </p>
        </div>
      )}
    </div>
  );
};

export default FundCard;
