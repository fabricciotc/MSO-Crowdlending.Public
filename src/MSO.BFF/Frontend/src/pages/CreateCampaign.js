import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { useStateSmartContractContext } from "../context/SmartContractContext";
import { money } from "../assets";
import { prestamo } from "../assets";
import { CustomButton, FormField, Loader } from "../components";
import { checkIfImage } from "../utils";
import { useStateValue } from "../context/storage";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [{ sesionUsuario }, dispatch] = useStateValue();
  const { address, createCampaign } = useStateSmartContractContext();
  const [form, setForm] = useState({
    name: "",
    title: "",
    description: "",
    montoDeseado: "",
    tea: "19.45",
    tcea: "19.45",
    TextDecoderStream: "",
    fechaLimite: "",
    meses: 1,
    image: "",
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.montoDeseado > 100000) {
      dispatch({
        type: "OPEN_SNACKBAR",
        openMensaje: {
          open: true,
          mensaje: "(LGE401) " + "El monto no puede exceder los S/100000.00",
          severity: "error",
        },
      });
    } else {
      checkIfImage(form.image, async (exists) => {
        if (exists) {
          setIsLoading(true);
          await createCampaign({
            ...form,
            montoDeseado: ethers.utils.parseUnits(
              (form.montoDeseado / 1000000.00).toString(),
              18
            ),
          });
          setIsLoading(false);
          dispatch({
            type: "OPEN_SNACKBAR",
            openMensaje: {
              open: true,
              mensaje:
                "Formulario de solicitud de préstamo completado y subido con exito",
              severity: "success",
            },
          });
          navigate("/");
        } else {
          alert("Provide valid image URL");
          setForm({ ...form, image: "" });
        }
      });
    }
  };

  return address ? (
    <div className="flex flex-wrap w-full">
      <div className="w-full sm:w-1/2 m-auto">
        <div className="flex justify-center items-center flex-col rounded-[20px] sm:p-10 p-4 max-w-xl ml-auto bg-white border-slate-100 border-1 shadow-lg">
          {isLoading && <Loader />}

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8">
            <div className="flex flex-wrap gap-10">
              <FormField
                labelName="Datos del Solicitante"
                inputType="texto"
                isDisabled={true}
                value={`${sesionUsuario.usuario.nombreCompleto} - ${sesionUsuario.usuario.tipo}: ${sesionUsuario.usuario.numeroDocumento}`}
                handleChange={(e) => handleFormFieldChange("name", e)}
              />
              <FormField
                labelName="Monto Solicitado"
                placeholder="PEN 100.00"
                inputType="number"
                value={form.montoDeseado}
                handleChange={(e) => handleFormFieldChange("montoDeseado", e)}
              />
              <FormField
                labelName="Titulo de la Solicitud"
                placeholder="Compra de una nueva maquina de Estampado"
                inputType="text"
                value={form.title}
                handleChange={(e) => handleFormFieldChange("title", e)}
              />
              <FormField
                labelName="Meses de Pago Pactado"
                placeholder="Cantidad de Meses deseas pagar por partes"
                inputType="number"
                minNumber="0"
                step="1"
                // keyDown={if(event.key==='.'){event.preventDefault()}}
                value={form.meses}
                inputOn={(e) =>
                  (e.target.value = e.target.value.replace(/[^0-9]*/g, ""))
                }
                handleChange={(e) => handleFormFieldChange("meses", e)}
              />
            </div>

            <FormField
              labelName="Detalle del Prestamo"
              placeholder="Cuentanos tu Historia"
              isTextArea
              value={form.description}
              handleChange={(e) => handleFormFieldChange("description", e)}
            />

            <div className="w-full flex justify-start items-center p-8 bg-sky-500 rounded-[20px]">
              <FormField
                labelName="TEA Establecido *"
                placeholder=""
                inputType="text"
                isHidden={true}
                value={"19.45"}
                isDisabled={true}
                handleChange={(e) => handleFormFieldChange("tea", e)}
              />
              <FormField
                labelName="TCEA Establecido *"
                placeholder=""
                inputType="text"
                isHidden={true}
                value={"19.45"}
                isDisabled={true}
                handleChange={(e) => handleFormFieldChange("tcea", e)}
              />
              <label className="font-semibold text-white text-xl flex gap-8">
                <svg
                  className="h-[50px]"
                  fill="#ffffff"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#ffffff"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path d="M31,7H1A1,1,0,0,0,0,8V24a1,1,0,0,0,1,1H31a1,1,0,0,0,1-1V8A1,1,0,0,0,31,7ZM25.09,23H6.91A6,6,0,0,0,2,18.09V13.91A6,6,0,0,0,6.91,9H25.09A6,6,0,0,0,30,13.91v4.18A6,6,0,0,0,25.09,23ZM30,11.86A4,4,0,0,1,27.14,9H30ZM4.86,9A4,4,0,0,1,2,11.86V9ZM2,20.14A4,4,0,0,1,4.86,23H2ZM27.14,23A4,4,0,0,1,30,20.14V23Z"></path>{" "}
                    <path d="M7.51.71a1,1,0,0,0-.76-.1,1,1,0,0,0-.61.46l-2,3.43a1,1,0,0,0,1.74,1L7.38,2.94l5.07,2.93a1,1,0,0,0,1-1.74Z"></path>{" "}
                    <path d="M24.49,31.29a1,1,0,0,0,.5.14.78.78,0,0,0,.26,0,1,1,0,0,0,.61-.46l2-3.43a1,1,0,1,0-1.74-1l-1.48,2.56-5.07-2.93a1,1,0,0,0-1,1.74Z"></path>{" "}
                    <path d="M16,10a6,6,0,1,0,6,6A6,6,0,0,0,16,10Zm0,10a4,4,0,1,1,4-4A4,4,0,0,1,16,20Z"></path>{" "}
                  </g>
                </svg>
                <span>TEA: 19.45% (En base a su historial de prestamos)</span>
              </label>
            </div>
            <div
              class="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
              role="alert"
            >
              <p class="font-bold">Advertencia</p>
              <p>
                Todos los contratos digitales incluyen una pequeña comision al
                realizar su registro, asegurece de tener almenos un monto minimo
                en su billetera para subir su solicitud.
              </p>
            </div>
            <div className="flex flex-wrap gap-10">
              <FormField
                labelName="¿Hasta que fecha esperas el Financiamiento?*"
                placeholder="Fecha Limite"
                inputType="date"
                value={form.fechaLimite}
                handleChange={(e) => handleFormFieldChange("fechaLimite", e)}
              />
            </div>

            <FormField
              labelName="Campaign image *"
              placeholder="Place image URL of your campaign"
              inputType="url"
              value={form.image}
              handleChange={(e) => handleFormFieldChange("image", e)}
            />

            <div className="flex justify-center items-center mt-10">
              <CustomButton
                btnType="submit"
                title="Subir mi Campaña"
                styles="bg-sky-700 hover:bg-sky-800 p-8 text-white h-[60px]"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
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

export default CreateCampaign;
