import { useCallback, useEffect, useRef, useState } from "react"
import { Coordinate, CoordinateCircle } from "../components/Canvas"
import { FiTrash2 } from "react-icons/fi";

export function MiniCanvas({ sketch, onClick }: { sketch: Coordinate[];  onClick: ()=> void}) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isFirstRender, setIsFirstRender] = useState(true)
    const [isHovered, setIsHovered] = useState(false)
    // all magic numbers for now
    const draw = useCallback((ctx: CanvasRenderingContext2D, { x, y, strokeColor, strokeSize }: Coordinate) => {
            ctx.lineTo(x * 0.05, y * 0.05);
            ctx.lineWidth = strokeSize * 0.5;
            ctx.strokeStyle = strokeColor;
            ctx.stroke();
    }, [])

    const drawCircle = useCallback((ctx: CanvasRenderingContext2D, sketch: CoordinateCircle) => {
        const radio = sketch.radio * 0.05;
        ctx.beginPath();
        ctx.arc(sketch?.x * 0.05, sketch.y * 0.05, radio, 0, Math.PI * 2, true)
        ctx.strokeStyle = sketch.strokeColor;
        ctx.lineWidth = sketch.strokeSize * 0.5;
        ctx.stroke()
    }, [])

    const startDraw = useCallback(() => {
        if (!canvasRef.current) return;
        const context = canvasRef.current.getContext('2d')
        if (!context) return;
        context.beginPath()
        context.moveTo(sketch[0].x * 0.05, sketch[0].y * 0.05)
        for (const coord of sketch) {
            if (coord.type === 'handfree') draw(context, coord)
            if (coord.type === 'circle') drawCircle(context, coord as CoordinateCircle)
        }
        context.closePath();
    }, [draw, drawCircle, sketch])

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false)
            return
        }
        startDraw()
    }, [isFirstRender, startDraw])

    return (
        <div className={'mini-canvas'} onMouseOver={() => setIsHovered(true)}
        onMouseLeave={()=> setIsHovered(false)} >
            <canvas
                width={110}
                height={50}
                ref={canvasRef}
                style={{ border: "1px darkgray solid", cursor: 'pointer', opacity: isHovered ? 0.8: 1, position: 'relative' }}
            />
            <FiTrash2 className="mini-canvas-before" size={20} onClick={onClick}/>
        </div>
    )
}
