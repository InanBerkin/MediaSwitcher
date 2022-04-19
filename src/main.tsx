import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CanvasStreamContextProvider } from "./CanvasStreamContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CanvasStreamContextProvider>
      <App />
    </CanvasStreamContextProvider>
  </React.StrictMode>
);
