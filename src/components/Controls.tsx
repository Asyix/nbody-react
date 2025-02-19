import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";

export interface Body {
    x: number;
    y: number;
    vx: number;
    vy: number;
    mass: number;
}

export default function Controls() {
    const [numBodies, setNumBodies] = useState(5);
    const [gravity, setGravity] = useState(6.674e-11);
    const [bodies, setBodies] = useState<Body[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!wsRef.current) {
            wsRef.current = new WebSocket("ws://localhost:8080/simulation");
            wsRef.current.onopen = () => console.log("✅ WebSocket connected");
        }
        if (wsRef.current && isRunning) {
            wsRef.current.onclose = () => console.log("❌ WebSocket disconnected");
            wsRef.current.onerror = (error) => console.error("⚠️ WebSocket error:", error);
            wsRef.current.onmessage = (event) => {
                try {
                    console.log(event.data);
                    const receivedData = JSON.parse(event.data);
                    if (Array.isArray(receivedData)) {
                        setBodies(() => {
                            return receivedData;
                        });
                    } else {
                        console.error("Invalid data format received from WebSocket:", receivedData);
                    }
                } catch (error) {
                    console.error("Error parsing WebSocket message:", error);
                }
            };
        }
    }, [bodies, isRunning]);

    

    const sendMessage = (message: { action: string; numBodies?: number; gravity?: number }) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            console.log("🚀 Sending message:", message);
            wsRef.current.send(JSON.stringify(message));
        } else {
            console.error("❌ WebSocket not open, unable to send:", message);
        }
    };

    const startSimulation = () => {
        sendMessage({ action: "start", numBodies, gravity });
        setIsRunning(true);
    };

    const stopSimulation = () => {
        sendMessage({ action: "stop" });
        setIsRunning(false);
        setBodies([]);
    };

    return (
        <>
            <div className="controls">
                <h2>Paramètres de la simulation</h2>

                <label>
                    Nombre de corps :
                    <input 
                        type="number" 
                        value={numBodies} 
                        min="1"
                        onChange={(e) => setNumBodies(parseInt(e.target.value))} 
                    />
                </label>

                <label>
                    Gravité :
                    <input 
                        type="number" 
                        value={gravity} 
                        step="1e-11" 
                        onChange={(e) => setGravity(parseFloat(e.target.value))} 
                    />
                </label>

                <button onClick={startSimulation}>Démarrer</button>
                <button onClick={stopSimulation} style={{ marginLeft: "10px" }}>Arrêter</button>
            </div>

            <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
                <Canvas camera={{ position: [0, 0, 60], fov: 60 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <OrbitControls />

                    {bodies.map((body, index) => (
                        <Sphere key={index} args={[10, 32, 32]} position={[body.x/80, body.y/80, 0]}>
                            <meshStandardMaterial color="blue" />
                        </Sphere>
                    ))}
                <Sphere args={[0.1, 32, 32]} position={[10, 7, 0]}>
                    <meshStandardMaterial color="red" />
                </Sphere>
                </Canvas>
            </div>
        </>
    );
}
