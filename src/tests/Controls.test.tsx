import { render, screen, fireEvent } from "@testing-library/react";
import Controls from "../components/Controls";
import { act } from "react";
import "@testing-library/jest-dom";

// Mock the ResizeObserver
import ResizeObserver from 'resize-observer-polyfill';
global.ResizeObserver = ResizeObserver;

// Mock the WebSocket API
global.WebSocket = jest.fn().mockImplementation(() => ({
    send: jest.fn(),
    close: jest.fn(),
    readyState: 1, // OPEN state
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
})) as unknown as typeof WebSocket;

describe("Controls Component", () => {
    beforeEach(() => {
        ((global.WebSocket as unknown) as jest.Mock).mockClear();
        (global.WebSocket as unknown as jest.Mock).mockImplementation(() => ({
            send: jest.fn(),
            close: jest.fn(),
            readyState: 1, // OPEN state
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            CONNECTING: 0,
            OPEN: 1,
            CLOSING: 2,
            CLOSED: 3,
        })) as unknown as typeof WebSocket;
    });

    test("renders correctly", () => {
        render(<Controls />);
        expect(screen.getByText("Paramètres de la simulation")).toBeInTheDocument();
        expect(screen.getByText("Démarrer")).toBeInTheDocument();
        expect(screen.getByText("Arrêter")).toBeInTheDocument();
    });

    test("updates number of bodies input", () => {
        render(<Controls />);
        const input = screen.getByLabelText("Nombre de corps :");
        fireEvent.change(input, { target: { value: "500" } });
        expect(input).toHaveValue(500);
    });

    test("updates gravity input", () => {
        render(<Controls />);
        const input = screen.getByLabelText("Gravité :");
        fireEvent.change(input, { target: { value: "2" } });
        expect(input).toHaveValue(2);
    });

    test("clicking 'Démarrer' starts the simulation", async () => {
        render(<Controls />);
        const startButton = screen.getByText("Démarrer");
        
        await act(async () => {
            fireEvent.click(startButton);
        });
        
        expect(screen.getByText("M-à-j")).toBeInTheDocument();
    });

    test("clicking 'Arrêter' stops the simulation", async () => {
        render(<Controls />);
        const stopButton = screen.getByText("Arrêter");

        await act(async () => {
            fireEvent.click(stopButton);
        });

        expect(screen.queryByText("M-à-j")).not.toBeInTheDocument();
    });

    test("WebSocket is called when starting simulation", async () => {
        render(<Controls />);
        const startButton = screen.getByText("Démarrer");

        await act(async () => {
            fireEvent.click(startButton);
        });

        expect(global.WebSocket).toHaveBeenCalled();
    });
});
