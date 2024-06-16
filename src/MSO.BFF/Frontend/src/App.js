import "./App.css";
import Notify from "./components/Notify";
import ProtectedRoute from "./seguridad/ProtectedRoute";
import Registro from "./pages/Registro";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CreateCampaign from "./pages/CreateCampaign";
import CampaignDetails from "./pages/CampaignDetails";
import { useStateValue } from "./context/storage";
import { Route, Routes } from "react-router-dom";
import MyCampaigns from "./pages/MyCampaigns";
import PerfilUsuario from "./pages/PerfilUsuario";
import PasswordUpdate from "./pages/PasswordUpdate";
import Pagos from "./pages/Pagos";
import CreatePago from "./pages/CreatePago";
import UpdatePago from "./pages/UpdatePago";
import MisInversiones from "./pages/MisInversiones";
import Retorno from "./pages/Retorno";
import CreateRetorno from "./pages/CreateRetorno";
import UpdateRetorno from "./pages/UpdateRetorno";
import Orientacion from "./pages/Orientacion";

function App() {
  const [{ sesionUsuario, openSnackBar }, dispatch] = useStateValue();

  const handleClose = () =>
    dispatch({
      type: "OPEN_SNACKBAR",
      openMensaje: {
        open: false,
      },
    });

  return (
    <>
      <Notify
        open={openSnackBar ? openSnackBar.open : false}
        Cuerpo={openSnackBar ? openSnackBar.mensaje : ""}
        onClose={handleClose}
        severity={openSnackBar ? openSnackBar.severity : null}
      />

      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/registro" element={<Registro />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <PerfilUsuario />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil/password"
          element={
            <ProtectedRoute>
              <PasswordUpdate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mis-solicitudes"
          element={
            <ProtectedRoute>
              <MyCampaigns />
            </ProtectedRoute>
          }
        />
        <Route
          path="/solicitar-prestamo"
          element={
            <ProtectedRoute>
              <CreateCampaign />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prestamo-detalle/:id"
          element={
            <ProtectedRoute>
              <CampaignDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mis-pagos"
          element={
            <ProtectedRoute>
              <Pagos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orientacion"
          element={
            <ProtectedRoute>
              <Orientacion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mis-retornos"
          element={
            <ProtectedRoute>
              <Retorno />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mis-inversiones"
          element={
            <ProtectedRoute>
              <MisInversiones />
            </ProtectedRoute>
          }
        />
        <Route
          path="/crear-pago"
          element={
            <ProtectedRoute>
              <CreatePago />
            </ProtectedRoute>
          }
        />
        <Route
          path="/crear-retorno"
          element={
            <ProtectedRoute>
              <CreateRetorno />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editar-retorno/:id"
          element={
            <ProtectedRoute>
              <UpdateRetorno />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editar-pago/:id"
          element={
            <ProtectedRoute>
              <UpdatePago />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
