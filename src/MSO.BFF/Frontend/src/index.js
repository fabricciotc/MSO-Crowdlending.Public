import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { StateProvider } from "./context/storage";
import { initialState } from "./context/reducers/sesionUsuarioReducer";
import { mainReducer } from "./context/reducers";
import { BrowserRouter } from "react-router-dom";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <StateProvider initialState={initialState} reducer={mainReducer}>
      <BrowserRouter>
        <ThirdwebProvider
          activeChain={Sepolia}
          clientId="06f4580669c96d166a1db1e269bfcf38"
        >
          <App />
        </ThirdwebProvider>
      </BrowserRouter>
    </StateProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
