import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CanvasStreamContextProvider } from "./CanvasStreamContext";
import "./index.css";

declare global {
  interface HTMLCanvasElement {
    captureStream(frameRate?: number): MediaStream;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CanvasStreamContextProvider>
      <App />
    </CanvasStreamContextProvider>
  </React.StrictMode>
);
