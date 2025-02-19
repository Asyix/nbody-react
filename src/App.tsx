import NBodySimulation from "./components/NBodySimulation";
import Controls from "./components/Controls";

export default function App() {
    return (
        <div className="container">
            <h1>Simulation N-Body</h1>
            <Controls />
            <NBodySimulation />
        </div>
    );
}
