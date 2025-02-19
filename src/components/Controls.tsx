import { useState } from "react";

export default function Controls() {
    const [numBodies, setNumBodies] = useState(5);
    const [gravity, setGravity] = useState(6.674e-11);

    const startSimulation = async () => {
        await fetch("http://localhost:8080/simulation/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ numBodies, gravity }),
        });
    };

    return (
        <div className="controls">
            <h2>Paramètres de la simulation</h2>
            <label>
                Nombre de corps :
                <input type="number" value={numBodies} onChange={(e) => setNumBodies(parseInt(e.target.value))} />
            </label>
            <label>
                Gravité :
                <input type="number" value={gravity} step="1e-11" onChange={(e) => setGravity(parseFloat(e.target.value))} />
            </label>
            <button onClick={startSimulation}>Démarrer</button>
        </div>
    );
}
