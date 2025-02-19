import { Canvas } from "@react-three/fiber";
import { Sphere, OrbitControls } from "@react-three/drei";
import { Body } from "./Controls";

export default function NBodySimulation({ bodies }: { bodies: Body[] }) {
    return (
        <div>
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <OrbitControls />

                {bodies.map((body, index) => (
                    <Sphere key={index} args={[0.1, 32, 32]} position={[body.x, body.y, 0]}>
                        <meshStandardMaterial color="blue" />
                    </Sphere>
                ))}
            </Canvas>

            {/* Control Buttons */}
            {/* <div style={{ marginTop: "10px", textAlign: "center" }}>
                <button onClick={() => sendMessage("start")} style={buttonStyle}>Start Simulation</button>
                <button onClick={() => sendMessage("stop")} style={buttonStyle}>Stop Simulation</button>
            </div> */}
        </div>
    );
}

// Basic button styles
/* const buttonStyle = {
    margin: "5px",
    padding: "10px 15px",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    borderRadius: "5px",
    transition: "0.3s",
}; */

