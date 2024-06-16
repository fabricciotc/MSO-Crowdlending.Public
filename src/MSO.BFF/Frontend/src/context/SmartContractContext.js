import React, { useContext, createContext } from "react";

import {
  useAddress,
  useContract,
  useConnect,
  useContractWrite,
  useDisconnect,
  metamaskWallet,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { useStateValue } from "./storage";
import { useStateContratosContextProvider } from "./ContratosContext";

const SmartContractContext = createContext();
const walletConfig = metamaskWallet();

export const SmartContractContextProvider = ({ children }) => {
  const { contract } = useContract(
    "0x6E977Eb2653BaE058E0D2304BaA10b9932d29c00"
  );
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  );
  const [{ sesionUsuario }, dispatch] = useStateValue();
  const { getEliminados } = useStateContratosContextProvider();
  const address = useAddress();
  const connect = useConnect();
  const disconnect = useDisconnect();

  const handleConnect = async () => {
    try {
      const wallet = await connect(
        walletConfig // pass the wallet config object
      );
      dispatch({
        type: "OPEN_SNACKBAR",
        openMensaje: {
          open: true,
          mensaje: "Conexión con Wallet exitoso",
          severity: "success",
        },
      });
    } catch (e) {
      const startIndex = e.toString().indexOf("Cause: ") + "Cause: ".length;
      const jsonContent = e.toString().substring(startIndex);

      const jsonObject = JSON.parse(jsonContent);
      dispatch({
        type: "OPEN_SNACKBAR",
        openMensaje: {
          open: true,
          mensaje: "(LGE): Conexión con Wallet fallido -" + jsonObject.message,
          severity: "error",
        },
      });
    }
  };

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({
        args: [
          address, // owner
          form.title, // title
          form.description, // description
          form.tcea,
          form.tea,
          form.montoDeseado,
          form.meses,
          new Date(form.fechaLimite).getTime(), // deadline,
          form.image,
        ],
      });

      dispatch({
        type: "OPEN_SNACKBAR",
        openMensaje: {
          open: true,
          mensaje: "Trans. Hash: " + data.receipt.transactionHash,
        },
      });
    } catch (error) {
      dispatch({
        type: "OPEN_SNACKBAR",
        openMensaje: {
          open: true,
          mensaje:
            "(CONTRATO NO CREADO): " +
            "Problemas en la transaccion del usuario",
          severity: "error",
        },
      });
    }
  };

  const getCampaigns = async () => {
    let eliminados = await getEliminados();
    let contratosEli = eliminados.data.map((item) => item.contratoId);
    const campaigns = await contract.call("obtenerCampaigns");
    const parsedCampaings = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      montoDeseado: ethers.utils.formatEther(campaign.montoDeseado.toString()),
      fechaLimite: campaign.fechaLimite.toNumber(),
      meses: campaign.meses.toNumber(),
      montoObtenido: ethers.utils.formatEther(
        campaign.montoObtenido.toString()
      ),
      tea: campaign.TEA,
      image: campaign.image,
      pId: i,
    }));
    const filteredCampaigns = parsedCampaings.filter((campaign) => {
      return !contratosEli.includes(campaign.pId.toString());
    });
    return filteredCampaigns;
  };

  const getCampaigns2 = async () => {
    let eliminados = await getEliminados();
    let contratosEli = eliminados.data.map((item) => item.contratoId);
    const campaigns = await contract.call("obtenerCampaigns");

    const parsedCampaings = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      montoDeseado: ethers.utils.formatEther(campaign.montoDeseado.toString()),
      fechaLimite: campaign.fechaLimite.toNumber(),
      meses: campaign.meses.toNumber(),
      montoObtenido: ethers.utils.formatEther(
        campaign.montoObtenido.toString()
      ),
      tea: campaign.TEA,
      image: campaign.image,
      pId: i,
    }));
    const filteredCampaigns = parsedCampaings.filter((campaign) => {
      return !contratosEli.includes(campaign.pId.toString());
    });

    const campaignsWithDonations = await Promise.all(
      filteredCampaigns.map(async (campaign) => {
        const donations = await getDonations(campaign.pId); // Assuming getDonations exists and works asynchronously
        return {
          ...campaign,
          donations: donations, // Add donations to the campaign object
        };
      })
    );

    return campaignsWithDonations;
  };

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter(
      (campaign) => campaign.owner === address
    );

    return filteredCampaigns;
  };

  const getOwnerCampaigns = async (owner) => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter(
      (campaign) => campaign.owner === owner
    );

    return filteredCampaigns;
  };

  const getCampaign = async (id) => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.find(
      (campaign) => campaign.pId.toString() === id
    );
    return filteredCampaigns;
  };

  const donate = async (pId, amount) => {
    const data = await contract
      .call("financiarCampaign", [pId], {
        value: ethers.utils.parseEther(amount),
      })
      .then((e) => {
        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje:
              "(Exito): Usuario participando del contrato | Hash de transaccion: " +
              e.receipt.transactionHash,
            severity: "success",
          },
        });
      })
      .catch((e) => {
        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje:
              "(Error en Financimiento): La transaccion se rechazo por parte de la wallet",
            severity: "error",
          },
        });
      });

    return data;
  };

  const getDonations = async (pId) => {
    const donations = await contract.call("obtenerDonadores", [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  };

  return (
    <SmartContractContext.Provider
      value={{
        address,
        contract,
        connect: handleConnect,
        disconnect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        getOwnerCampaigns,
        donate,
        getDonations,
        getCampaigns2,
        getCampaign,
      }}
    >
      {children}
    </SmartContractContext.Provider>
  );
};

export const useStateSmartContractContext = () =>
  useContext(SmartContractContext);
