import React, { useState } from "react";
import { loan, smartContract, whatsapp, wpp } from "../assets";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div
      className={`bg-white p-4 mb-2 rounded-lg shadow ${
        isOpen ? "shadow-md" : ""
      }`}
    >
      <button
        onClick={toggle}
        className="text-left w-full text-lg font-semibold flex items-center"
      >
        <span className="mr-2"></span>
        {question}
      </button>
      {isOpen && <p className="mt-2 text-gray-700 p-4">{answer}</p>}
    </div>
  );
};

const Orientacion = () => {
  return (
    <div className="bg-gray-100 p-4 min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-center mb-4">
          Centro de Recursos 📚
        </h1>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">
            Preguntas Frecuentes (FAQ)
          </h2>
          <FAQItem
            question="¿Cómo puedo solicitar un préstamo para mi empresa?"
            answer="Para solicitar un préstamo, navega a la sección de solicitudes en nuestra plataforma, completa el formulario y espera la aprobación. Este proceso está diseñado para ser rápido y eficiente, asegurando que puedas obtener los recursos financieros necesarios para tu negocio con facilidad y transparencia."
          />
          <FAQItem
            question="¿Qué es el Crowdlending?"
            answer="El Crowdlending es una modalidad de financiamiento colaborativo que permite a individuos invertir en préstamos de otros individuos o empresas. Es una alternativa moderna a los métodos tradicionales de financiamiento, ofreciendo menores tasas de interés y mayor accesibilidad a capitales."
          />
          <FAQItem
            question="¿Cómo funcionan los Smart Contracts?"
            answer="Los Smart Contracts son contratos autoejecutables escritos en código de programación que se ejecutan automáticamente cuando se cumplen sus términos y condiciones. Proporcionan una estructura de seguridad y transparencia superior para transacciones financieras, especialmente en entornos descentralizados como blockchain."
          />
        </div>

        <div className="my-4 p-4 bg-white shadow-md rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
          <h2 className="text-xl font-semibold col-span-full">
            (RECURSOS) Enlaces Útiles ℹ️
          </h2>
          <a
            href="https://www.ecrowdinvest.com/que-es-el-crowdlending"
            className="flex items-center text-blue-500 hover:underline"
            target="_blank"
          >
            <img src={loan} alt="Link Icon" className="w-6 h-6 mr-2" />
            Más sobre Crowdlending
          </a>
          <a
            href="https://www.santander.com/es/stories/smart-contracts"
            className="flex items-center text-blue-500 hover:underline"
            target="_blank"
          >
            <img src={smartContract} alt="Link Icon" className="w-6 h-6 mr-2" />
            Más sobre Smart Contracts
          </a>
        </div>

        <div className="text-center p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Contacta con nosotros</h2>
          <a
            href="https://wa.me/51927606719?text=Hola%20necesito%20ayuda%20con%20la%20web%20de%20Misio%20para%20pr%C3%A9stamos%20online"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center mt-2"
            target="_blank"
          >
            <img src={wpp} alt="Link Icon" className="w-6 h-6 mr-2" />
            Contactar via WhatsApp
          </a>
        </div>

        <div className="my-4 p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">
            ¿Cómo funciona nuestra plataforma?
          </h2>
          <p className="p-4">
            En nuestra plataforma, las empresas tienen la oportunidad única de
            solicitar préstamos que son directamente financiados por usuarios
            individuales. Este proceso se realiza a través de Smart Contracts,
            es decir, contratos inteligentes que operan sobre tecnología
            blockchain. Esta innovadora metodología no solo garantiza una
            transparencia absoluta al registrar cada transacción de manera
            inalterable y visible para todas las partes involucradas, sino que
            también asegura la máxima seguridad en cada operación. Los Smart
            Contracts automatizan la ejecución de los acuerdos, minimizando la
            necesidad de intermediarios y reduciendo las posibilidades de fraude
            o malentendidos. Así, nuestra plataforma proporciona un ambiente de
            confianza donde los financiadores pueden invertir en las necesidades
            de financiamiento de las empresas, sabiendo que sus aportaciones
            están protegidas y gestionadas de manera eficiente y transparente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Orientacion;
