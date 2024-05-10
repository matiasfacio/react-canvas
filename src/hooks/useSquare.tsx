import { useState } from "react";
import { Coordinate } from "../components/Canvas";

export const useSquare = () => {
    const [squareCenter, setSquareCenter] = useState<Coordinate>();
    const [squarePath, setSquarePath] = useState<Coordinate[]>([])
    return {
        squareCenter,
        setSquareCenter,
        drawSquare: () => null,
        setSquarePath,
        squarePath,
    }
}