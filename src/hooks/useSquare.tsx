import { useState } from "react";
import { Coordinate } from "../components/Canvas";

export const useSquare = () => {
    const [squareCorner, setSquareCorner] = useState<Coordinate>();
    const [squarePath, setSquarePath] = useState<Coordinate>()

    const handleSquarePath = (props?:{x: number, y: number, strokeSize: number, strokeColor: string})=> {
        if (props) {
            setSquarePath( {...props, type: 'square'})
        } else {
            setSquarePath(undefined)
        }
    }

    const drawSquare = (ctx: CanvasRenderingContext2D) => {
        if (!squarePath || !squareCorner) return
        ctx.reset()
        ctx.beginPath();
        ctx.strokeStyle = 'darkgray';
        ctx.lineWidth = squareCorner.strokeSize;
        ctx.setLineDash([10, 10])

        ctx.moveTo(squareCorner.x, squareCorner.y)
        ctx.lineTo(squareCorner.x, squarePath.y)

        ctx.moveTo(squareCorner.x, squareCorner.y)
        ctx.lineTo(squarePath.x, squareCorner.y)

        ctx.moveTo(squarePath.x, squarePath.y)
        ctx.lineTo(squareCorner.x, squarePath.y)

        ctx.moveTo(squarePath.x, squarePath.y)
        ctx.lineTo(squarePath.x, squareCorner.y)

        ctx.stroke()
    }

    return {
        squareCorner,
        setSquareCorner,
        drawSquare,
        setSquarePath:handleSquarePath,
        squarePath,
    }
}
