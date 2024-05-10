import { useState } from "react";
import { Coordinate } from "../components/Canvas";

export const useCircle = () => {
    const [circleCenter, setCircleCenter] = useState<Coordinate>();
    const [circlePath, setCirclePath] = useState<Coordinate>()

    const drawCircle = (ctx: CanvasRenderingContext2D) => {
        if (!circlePath || !circleCenter) return
        const radio = Math.abs(circlePath.x - circleCenter.x);
        ctx.reset()
        ctx.beginPath();
        ctx.arc(circleCenter.x, circleCenter.y, radio, 0, Math.PI * 2, true)
        ctx.strokeStyle = 'lightgray';
        ctx.lineWidth = circlePath.strokeSize;
        ctx.stroke()
    }

    return {
        circleCenter,
        setCircleCenter,
        drawCircle,
        setCirclePath,
        circlePath,
    }
}