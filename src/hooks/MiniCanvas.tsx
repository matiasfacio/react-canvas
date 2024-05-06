import { useCallback, useEffect, useRef, useState } from "react"
import { Coordinate } from "../components/Canvas"

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

        const startDraw = useCallback(() => {
            if (!canvasRef.current) return;
            const context = canvasRef.current.getContext('2d')
            if (!context) return;
            context.beginPath()
            context.moveTo(sketch[0].x * 0.05, sketch[0].y * 0.05)
            for (const coord of sketch) {
                draw(context, coord)
            }
            context.closePath();
        }, [draw, sketch])

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false)
            return
            }
            startDraw()
    }, [isFirstRender, startDraw])

    return (
        <div className={'mini-canvas'} onClick={onClick} onMouseOver={() => setIsHovered(true)}
        onMouseLeave={()=> setIsHovered(false)} >
            <canvas
                width={110}
                height={50}
                ref={canvasRef}
                style={{ border: `1px ${isHovered ? 'lightblue': 'darkgray'} solid`, cursor: 'pointer', opacity: isHovered ? 0.8: 1, position: 'relative' }}
            />
            <p className="mini-canvas-before" >Click to delete</p>
        </div>
    )
}
