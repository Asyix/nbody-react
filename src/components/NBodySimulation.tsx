import { Canvas } from "@react-three/fiber";
import { Sphere, OrbitControls } from "@react-three/drei";
import { useEffect, useState } from "react";

interface Body {
    x: number;
    y: number;
    vx: number;
    vy: number;
    mass: number;
}

export default function NBodySimulation() {
    const [bodies, setBodies] = useState<Body[]>([]);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080/simulation");

        ws.onmessage = (event) => {
            setBodies(JSON.parse(event.data));
        };

        return () => ws.close();
    }, []);

    return (
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
    );
}
