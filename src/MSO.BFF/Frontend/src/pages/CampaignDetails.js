import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useStateSmartContractContext } from "../context/SmartContractContext";
import { CountBox, CustomButton, Loader } from "../components";
import { calculateBarPercentage, daysLeft } from "../utils";
import { useStateValue } from "../context/storage";
import { useStateContratosContextProvider } from "../context/ContratosContext";
import { jsPDF } from "jspdf";

const CampaignDetails = () => {
  const {
    donate,
    getDonations,
    contract,
    getOwnerCampaigns,
    address,
    connect,
    getCampaign,
  } = useStateSmartContractContext();

  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(true);
  const [amount, setAmount] = useState("");
  const [donators, setDonators] = useState([]);
  const [campaign, setCampaign] = useState();
  const [ownerCampaigns, setOwnerCampaigns] = useState([]);
  const [{ sesionUsuario }, dispatch] = useStateValue();
  const { addEliminado } = useStateContratosContextProvider();
  const [remainingDays, setRemainingDays] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaign = async () => {
      getCampaign(id).then((data) => {
        setCampaign(data);
        setRemainingDays(daysLeft(data.fechaLimite));
        setIsLoading1(false);
      });
    };
    const fetchDonators = async () => {
      const data = await getDonations(campaign.pId);
      const ownerCamapigns = await getOwnerCampaigns(campaign.owner);
      setOwnerCampaigns(ownerCamapigns);
      setDonators(data);
    };

    if (contract && !campaign && id) fetchCampaign();
    if (contract && campaign) fetchDonators();
  }, [
    contract,
    getDonations,
    getOwnerCampaigns,
    id,
    campaign,
    setRemainingDays,
    getCampaign,
  ]);

  const handleDonate = async () => {
    let amount2 = Number(amount);
    if (amount2 && amount2 !== 0) {
      if (
        amount2 + campaign.montoObtenido * 1000000.00 >
        campaign.montoDeseado * 1000000.00
      ) {
        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje:
              "(LGE401) " +
              "El monto ha invertir no puede ser mayor al solicitado",
            severity: "error",
          },
        });
      } else {
        setIsLoading(true);

        await donate(campaign.pId, (amount2 / 1000000.00).toString());
        {
          const data = await getDonations(campaign.pId);
          const ownerCamapigns = await getOwnerCampaigns(campaign.owner);
          setOwnerCampaigns(ownerCamapigns);
          setDonators(data);
        }
        setIsLoading(false);
      }
    } else {
      dispatch({
        type: "OPEN_SNACKBAR",
        openMensaje: {
          open: true,
          mensaje: "(LGE401) " + "El monto ha invertir no puede ser 0 o vacio",
          severity: "error",
        },
      });
    }
  };

  const generatePDF = (campaign) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");

    // Título del contrato con subrayado
    const title = "CONTRATO DE PRÉSTAMO DE DINERO";
    doc.text(title, pageWidth / 2, 20, { align: "center" });
    doc.line(20, 22, pageWidth - 20, 22); // Subrayado

    doc.setFont("helvetica", "normal");

    // Introducción y partes
    let yOffset = 40;
    const introText = `Este documento representa un contrato privado de préstamo de dinero entre las partes: ${campaign.owner}, en adelante denominado EL PRESTATARIO, y LOS INVERSORES del proyecto titulado "${campaign.title}", cuyos detalles se describen a continuación: "${campaign.description}". Este acuerdo asegura la participación y cumplimiento de las condiciones acordadas por ambas partes.`;

    let lines = doc.splitTextToSize(introText, pageWidth - 40);
    lines.forEach((line, index) => {
      doc.text(line, 20, yOffset + index * 7);
    });
    yOffset += lines.length * 7 + 10;

    // Cláusulas del contrato
    const clauses = [
      `PRIMERO: EL PRESTATARIO busca un préstamo por el monto de S/${(
        campaign.montoDeseado * 1000000.00
      ).toFixed(2)} con una tasa de interés anual del ${
        campaign.tea
      }%, proporcionada por LOS INVERSORES del proyecto.`,
      `SEGUNDO: El PRESTATARIO se compromete a devolver el monto total junto con los intereses generados dentro de los ${campaign.meses} meses pactados desde la obtencion total del monto deseado.`,
      "TERCERO: En caso de incumplimiento por parte del PRESTATARIO, LOS INVERSORES tendrán pleno derecho a recurrir a las autoridades competentes para hacer valer sus derechos bajo este contrato.",
      "CUARTO: Ambas partes declaran que este contrato se realiza sin coacciones, errores, o cualquier otro vicio del consentimiento que pudiera dar lugar a su nulidad.",
    ];
    clauses.forEach((clause) => {
      lines = doc.splitTextToSize(clause, pageWidth - 40);
      lines.forEach((line, index) => {
        doc.text(line, 20, yOffset + index * 7);
      });
      yOffset += lines.length * 7;
    });

    yOffset += 10;
    doc.text("EL PRESTATARIO:", 20, yOffset);
    yOffset += 10;
    doc.text(campaign.owner, 20, yOffset);

    // Listado de donaciones
    yOffset += 20;
    doc.text(
      "Actualmente, las siguientes personas están consideradas dentro del concepto de LOS INVERSORES:",
      20,
      yOffset
    );
    yOffset += 10;
    donators.forEach((donation, index) => {
      yOffset += 10;
      doc.text(
        `${index + 1}. Donante: ${donation.donator} - S/${(
          donation.donation * 1000000.00
        ).toFixed(2)}`,
        20,
        yOffset
      );
    });

    doc.save("ContratoDePrestamo.pdf");
  };

  function calculateMonthlyRate(TEA) {
    const teaDecimal = TEA / 100;
    const monthlyRate = Math.pow(1 + teaDecimal, 1 / 12) - 1;
    return monthlyRate;
  }
  function calculateAnnuityPayment(PV, monthlyRate, n) {
    let annuityPayment;
    if (monthlyRate === 0) {
      annuityPayment = PV / n;
    } else {
      annuityPayment = PV * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -n)));
    }
    return annuityPayment;
  }

  const handleRemove = async () => {
    await addEliminado({ contratoId: campaign.pId.toString() });
    dispatch({
      type: "OPEN_SNACKBAR",
      openMensaje: {
        open: true,
        mensaje:
          "Cancelación una solicitud sin inversiones realizada de manera exitosa",
        severity: "success",
      },
    });
    navigate("/mis-solicitudes");
  };

  return (
    <>
      {isLoading1 && <Loader />}
      {!isLoading1 && (
        <div>
          {isLoading && <Loader />}
          <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
            <div className="flex-1 flex-col">
              <img
                src={campaign.image}
                alt="campaign"
                className="w-full h-[410px] object-cover rounded-xl"
              />
              <div className="bg-green-200 shadow-md rounded-[20px] mt-3 mb-7  text-white text-center">
                <div
                  className="h-[30px] rounded-[20px] bg-green-500"
                  style={{
                    width: `${calculateBarPercentage(
                      campaign.montoDeseado,
                      campaign.montoObtenido
                    )}%`,
                    maxWidth: "100%",
                    transition: "width 2s ease-out",
                    alignContent: "center", // Add a smooth transition for the width change
                  }}
                >
                  <b>
                    {calculateBarPercentage(
                      campaign.montoDeseado,
                      campaign.montoObtenido
                    )}
                    %
                  </b>
                </div>
              </div>
              <div>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    generatePDF(campaign);
                  }}
                >
                  Ver Contrato en 📄 PDF
                </button>
                <p style={{ height: 10 }}></p>
                <hr></hr>
                <p style={{ height: 10 }}></p>
                <p style={{ fontStyle: "italic" }}>
                  * Este contrato se encuentra amparado y verificado bajo
                  nuestra red blockchain de{" "}
                  <a
                    style={{ textDecoration: "underline", color: "blue" }}
                    href="https://sepolia.otterscan.io/address/0x6E977Eb2653BaE058E0D2304BaA10b9932d29c00"
                  >
                    SmartContracts.
                  </a>
                </p>
              </div>
            </div>

            <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
              <CountBox title="Dias Restantes" value={remainingDays} />
              <CountBox
                title={`Colectado de S/${campaign.montoDeseado * 1000000.00}`}
                value={`S/${campaign.montoObtenido * 1000000.00}`}
              />
              <CountBox title="Donadores Totales" value={donators.length} />
              <CountBox title="Meses de Pago" value={campaign.meses} />
            </div>
          </div>

          <div className="mt-[60px] flex lg:flex-row flex-col gap-12">
            <div className="flex-[2] flex flex-col gap-[40px]">
              <div>
                <h4 className="font-epilogue font-semibold text-[18px] text-black">
                  Solicitado por:
                </h4>

                <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
                  <div>
                    <h4 className="font-epilogue font-semibold text-[14px] text-black break-all">
                      {campaign.owner}
                    </h4>
                    <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#7f7e6e]">
                      Tambien tiene {ownerCampaigns.length} solicitudes en la
                      plataforma.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-epilogue font-semibold text-[18px] text-black">
                  Descripcion:
                </h4>

                <div className="mt-[20px]">
                  <p className="font-epilogue font-normal text-[16px] text-[#7f7e6e] leading-[26px] text-justify">
                    {campaign.description}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto mt-6">
                <table className="min-w-full table-auto rounded-lg shadow overflow-hidden">
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="px-4 py-2">Inversor</th>
                      <th className="px-4 py-2">TEA</th>
                      <th className="px-4 py-2">Monto</th>
                      <th className="px-4 py-2">Meses</th>
                      <th className="px-4 py-2">Retorno Estimado</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {donators.length > 0 ? (
                      donators.map((item, index) => (
                        <tr
                          key={`${item.donator}-${index}`}
                          className="border-b border-gray-200 hover:bg-gray-100 text-center"
                        >
                          <td
                            className={`px-4 py-2 font-medium ${
                              item.donator === address
                                ? "text-sky-500"
                                : "text-gray-900"
                            }`}
                          >
                            {index + 1}. {item.donator.substring(0, 9)}...{" "}
                            {item.donator === address ? "(Tú)" : null}
                          </td>
                          <td
                            className={`px-4 py-2 ${
                              item.donator === address
                                ? "text-sky-500"
                                : "text-gray-900"
                            }`}
                          >
                            {campaign.tea}% {/* Assuming item.tea is the TEA */}
                          </td>
                          <td
                            className={`px-4 py-2 ${
                              item.donator === address
                                ? "text-sky-500"
                                : "text-gray-900"
                            }`}
                          >
                            S/{(item.donation * 1000000.00).toFixed(2)}
                          </td>
                          <td
                            className={`px-4 py-2 ${
                              item.donator === address
                                ? "text-sky-500"
                                : "text-gray-900"
                            }`}
                          >
                            {campaign.meses}
                          </td>
                          <td
                            className={`px-4 py-2 ${
                              item.donator === address
                                ? "text-sky-500"
                                : "text-gray-900"
                            }`}
                          >
                            {/* ROI Calculation Placeholder */}
                            S/
                            {(
                              calculateAnnuityPayment(
                                Number(item.donation) * 1000000.00,
                                calculateMonthlyRate(Number(campaign.tea)),
                                Number(campaign.meses)
                              ).toFixed(2) * Number(campaign.meses).toFixed(2)
                            ).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-4 py-2 text-gray-700" colSpan="4">
                          Aún no tiene ningún inversor. ¡Sé el primero!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {address &&
              campaign.montoObtenido !== campaign.montoDeseado &&
              campaign.owner !== address &&
              (sesionUsuario.usuario.tipo === "Empresa" ? (
                <p>
                  * Usted como <b>Empresa</b> no pueden realizar ningun tipo de
                  inversion sobre otras solicitudes de prestamo, porfavor
                  registre una cuenta de tipo <b>Inversor</b> para acceder a
                  esta funcionalidad
                </p>
              ) : (
                <div className="flex-1">
                  <h4 className="font-epilogue font-semibold text-[18px] text-black">
                    Invertir:
                  </h4>

                  <div className="mt-[20px] flex flex-col p-4 bg-sky-500 rounded-[20px]">
                    <p className="font-epilogue font-semibold text-[22px] leading-[22px] text-white mt-6 text-center">
                      Financiar la Solicitud
                    </p>
                    <div className="mt-[30px]">
                      <input
                        type="number"
                        placeholder="PEN 100"
                        step="100"
                        min="0"
                        className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-white bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[white] rounded-[10px]"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />

                      <div className="my-[20px] p-4 bg-sky-300 rounded-[10px]">
                        <h4 className="font-epilogue font-semibold text-[22px] leading-[22px] text-white">
                          El financimiento tendra su devolución.
                        </h4>
                        <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-gray-100">
                          Al desembolsar el monto estaras bajo el contrato {}{" "}
                          firmado por el creador de la solicitud.
                        </p>
                      </div>

                      <CustomButton
                        btnType="button"
                        title="Invertir"
                        styles="w-full bg-green-600"
                        handleClick={handleDonate}
                      />
                    </div>
                  </div>
                </div>
              ))}
            {!address && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  maxWidth: 400,
                }}
              >
                <CustomButton
                  btnType="button"
                  title={
                    address
                      ? sesionUsuario.usuario.tipo === "Inversionista"
                        ? "Ver Solicitudes 💹"
                        : "💸 Solicitar un Prestamo"
                      : "Conectar Wallet"
                  }
                  styles={"bg-[#8c6dfd] whitespace-nowrap h-[50px] w-[250px]"}
                  handleClick={() => {
                    if (address)
                      sesionUsuario.usuario.tipo === "Inversionista"
                        ? navigate("/")
                        : navigate("/solicitar-prestamo");
                    else connect();
                  }}
                />
                <p>
                  * Para iniciar operaciones de inversión porfavor connecte una
                  wallet en la plataforma
                </p>
              </div>
            )}
            {campaign.montoObtenido === campaign.montoDeseado &&
              campaign.owner !== address && (
                <div className="flex-1">
                  <div className="flex flex-col p-4 bg-green-400 rounded-[20px] h-full">
                    <p
                      className="font-epilogue font-semibold text-[22px] leading-[22px] text-white mt-6 text-center"
                      style={{ margin: "auto" }}
                    >
                      Solicitud 100% Financiada 🥳
                    </p>
                  </div>
                </div>
              )}
            {campaign.owner === address && (
              <div className="d-flex" style={{ maxWidth: 400 }}>
                <CustomButton
                  btnType="button"
                  title="Cancelar Solicitud"
                  styles={`w-full h-fit ${
                    campaign.montoObtenido > 0
                      ? "disabled bg-red-400"
                      : "bg-red-600"
                  }`}
                  handleClick={campaign.montoObtenido > 0 ? null : handleRemove}
                />
                {campaign.montoObtenido > 0 ? (
                  <p className="p-4 text-gray-700">
                    * No se puede eliminar el contrato dado que ya se encuentra
                    financiado por almenos una persona
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CampaignDetails;
