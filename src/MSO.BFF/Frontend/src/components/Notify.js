import React, { useEffect, useState } from "react";
import classNames from "classnames";
import toast, { Toaster } from "react-hot-toast";
import { MdOutlineClose } from "react-icons/md";
import { HiLightningBolt } from "react-icons/hi";

import styles from "./Notify.module.css";

const Notify = ({ open: externalOpen, Cuerpo, onClose, severity = "info" }) => {
  const [isOpen, setIsOpen] = useState(externalOpen);

  useEffect(() => {
    setIsOpen(externalOpen);
  }, [externalOpen]);

  useEffect(() => {
    if (isOpen) {
      toast.custom(
        (t) => (
          <div
            className={classNames([
              "rounded-lg shadow-lg p-4 transition-transform transform",
              severity === "success"
                ? "bg-green-500 border border-green-300 text-white"
                : "",
              severity === "info"
                ? "bg-white border border-gray-300 text-gray-700"
                : "",
              severity === "warning"
                ? "bg-yellow-100 border border-yellow-300 text-yellow-700"
                : "",
              severity === "error"
                ? "bg-red-100 border border-red-300 text-red-700"
                : "",
              t.visible ? "top-0" : "-top-96",
            ])}
          >
            <div className="flex items-center">
              <div className="mr-4">
                <HiLightningBolt className="text-xl" />
              </div>
              <div className="flex-grow">
                <h1 className="font-bold">{Cuerpo}</h1>
              </div>
              <MdOutlineClose
                onClick={() => {
                  setIsOpen(false);
                  toast.remove(t.id);
                  toast.dismiss();
                  if (onClose) onClose();
                }}
                className="text-xl ml-4 cursor-pointer"
              />
            </div>
          </div>
        ),
        { id: "unique-notification", position: "bottom-center" }
      );
    }
  }, [isOpen, Cuerpo, onClose, severity]);

  return <Toaster toastOptions={{ duration: 5000 }} />;
};

export default Notify;
