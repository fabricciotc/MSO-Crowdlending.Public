import React, { useState } from "react";

const AuthLeft = () => {
  return (
    <section className="top-0 w-full bg-gray-50 dark:bg-green-600">
      <div className="max-w-5xl px-4 py-4 mx-auto md:flex md:items-center md:gap-x-6 place-content-center text-xs sm:text-sm">
        <div className="flex  md:items-center gap-x-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 text-gray-500 shrink-0 dark:text-gray-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>

          <p className="text-gray-700 dark:text-gray-200">
            Actualmente este sitio web se encuentra en pruebas. Al utilizarlo
            considere que es un{" "}
            <a
              href="https://www.choucairtesting.com/a-day-at-the-office/"
              className="underline transition-colors duration-200 hover:text-blue-500 "
            >
              ambiente controlado
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
};

export default AuthLeft;
