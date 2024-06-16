import React, { useEffect, useState } from "react";
import { useStateValue } from "../context/storage";
import { Navigate } from "react-router-dom";
import { SmartContractContextProvider } from "../context/SmartContractContext";
import { Navbar, Sidebar } from "../components";
import { obtenerUsuarioActual } from "../actions/UsuarioAction";
import LoadingSpinner from "../components/LoadingSpinner";
import { ContratosContextProvider } from "../context/ContratosContext";

function ProtectedRoute({ children, ...rest }) {
  const [{ sesionUsuario }, dispatch] = useStateValue();
  const [loading, setLoading] = useState(true); // Added state to track loading status

  useEffect(() => {
    const verifyUser = async () => {
      if (!sesionUsuario) {
        const response = await obtenerUsuarioActual(dispatch);
        if (response) {
          if (response.status === 200) {
            window.localStorage.removeItem("tokenSeguridad");
            window.localStorage.setItem("tokenSeguridad", response.data.token);
          }
        }
      }
      setLoading(false); // Set loading to false after the checks are complete
    };

    verifyUser();
  }, [sesionUsuario, dispatch]);

  // Only render content when not loading
  if (loading) {
    return <LoadingSpinner />; // You can replace this with a loading spinner or similar component
  } else if (sesionUsuario && sesionUsuario.autenticado) {
    return (
      <ContratosContextProvider>
        <SmartContractContextProvider>
          <div className="relative sm:-8 p-4 bg-slate-50 min-h-screen flex flex-row">
            <div className="sm:flex hidden mr-10 relative">
              <Sidebar />
            </div>
            <div className="flex-1 max-sm:w-full max-w-[1260px] mx-auto sm:pr-5">
              <Navbar />
              {children}
            </div>
          </div>
        </SmartContractContextProvider>
      </ContratosContextProvider>
    );
  } else {
    return <Navigate to="/auth/login" replace />;
  }
}

export default ProtectedRoute;
