import { useState, useEffect, useRef } from "react";
import { Camera, Canvas } from "@react-three/fiber";
import { Circle } from "@react-three/drei";

export interface Body {
    x: number;
    y: number;
    vx: number;
    vy: number;
    mass: number;
}

export default function Controls() {
    const [numBodies, setNumBodies] = useState(300);
    const [gravity, setGravity] = useState(1);
    const [bodies, setBodies] = useState<Body[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [zoomSlider, setZoomSlider] = useState(50); // Slider value (0-100)
    const wsRef = useRef<WebSocket | null>(null);
    const cameraRef = useRef<Camera | null>(null); // Reference to the camera

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
                    const receivedData = JSON.parse(event.data);
                    if (Array.isArray(receivedData)) {
                        //console.log(receivedData)
                        setBodies(() => receivedData);
                    } else {
                        console.error("Invalid data format received from WebSocket:", receivedData);
                    }
                } catch (error) {
                    console.error("Error parsing WebSocket message:", error);
                }
            };
        }
        // Update the camera zoom dynamically when the slider changes
        if (cameraRef.current) {
            cameraRef.current.zoom = zoomLevel;
            cameraRef.current.updateProjectionMatrix(); // Required to apply zoom changes
        }
    }, [bodies, isRunning, zoomSlider]);

    const sendMessage = (message: { action: string; numBodies?: number; gravity?: number }) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
        } else {
            console.log("❌ WebSocket not open, unable to send:", message);
        }
    };

    const startSimulation = () => {
        if (numBodies <= 0 || !numBodies) {
            setNumBodies(0);
        }
        if (gravity <= 0 || !gravity) {
            setGravity(0);
        }
        if (numBodies >= 1000) {
            setNumBodies(1000);
        }
        sendMessage({ action: "start", numBodies, gravity });
        setIsRunning(true);
    };

    const updateSimulation = () => {
        if (numBodies <= 0 || !numBodies) {
            setNumBodies(0);
        }
        if (gravity <= 0 || !gravity) {
            setGravity(0);
        }
        if (numBodies >= 1000) {
            setNumBodies(1000);
        }
        sendMessage({ action: "update", numBodies, gravity });
    }

    const stopSimulation = () => {
        sendMessage({ action: "stop" });
        setIsRunning(false);
        setBodies([]);
    };

    const handleNumBodiesChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10) ?? 0;
        if (value <= 0) {
            setNumBodies(0);
        } else if (value >= 1000) {
            setNumBodies(1000);
        } else {
            setNumBodies(value);
        }
    }

    const handleGravityChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10) ?? 0;
        if (value <= 0) {
            setGravity(0);
        } else if (value >= 1000) {
            setGravity(1000);
        } else {
            setGravity(value);
        }
    }

    // Convert slider value (0-100) to zoom range (5-50)
    const zoomLevel = 5 + (zoomSlider / 100) * 45;

    return (
        <>
            <div className="controls" style={{ paddingTop: "50px" }}>
                <h2>Paramètres de la simulation</h2>

                <label>
                    Nombre de corps :
                    <input 
                        type="number" 
                        value={numBodies} 
                        min="1"
                        onChange={(e) => handleNumBodiesChange(e)} 
                    />
                </label>

                <label>
                    Gravité :
                    <input 
                        type="number" 
                        value={gravity} 
                        step="1e-11" 
                        onChange={(e) => handleGravityChange(e)} 
                    />
                </label>

                {/* Zoom Slider */}
                <label>
                    Zoom :
                    <input 
                        type="range" 
                        min="0" max="100" step="1"
                        value={zoomSlider} 
                        onChange={(e) => setZoomSlider(parseInt(e.target.value))} 
                    />
                    <span>{Math.round(zoomLevel)}</span>
                </label>

                <button onClick={() => {
                    startSimulation();
                    document.getElementById("canvas-container")?.scrollIntoView({ behavior: "smooth" });
                }}>Démarrer</button>
                {isRunning ? <button onClick={() => {
                    updateSimulation();
                    document.getElementById("canvas-container")?.scrollIntoView({ behavior: "smooth" });
                }} style={{ marginLeft: "10px" }}>M-à-j</button> : null}
                <button onClick={stopSimulation} style={{ marginLeft: "10px" }}>Arrêter</button>
            </div>

            <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }} id="canvas-container">
                <Canvas orthographic camera={{ position: [0, 0, 10], zoom: zoomLevel }} onCreated={({ camera }) => (cameraRef.current = camera)}>
                    <ambientLight intensity={0.5} />

                    {bodies.map((body, index) => (
                        <Circle key={index} args={[body.mass/50, 32]} position={[body.x / 80, body.y / 80, 0]}>
                            <meshBasicMaterial color="blue" />
                        </Circle>
                    ))}
                    
                    {/* Example of a stationary red object */}
                    <Circle args={[0.2, 32]} position={[0, 0, 0]}>
                        <meshBasicMaterial color="red" />
                    </Circle>
                </Canvas>
            </div>
        </>
    );
}
