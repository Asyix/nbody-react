import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css"; // Ajout d'un fichier CSS pour le style

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
