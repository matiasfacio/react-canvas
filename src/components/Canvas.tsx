import { CSSProperties, useCallback, useEffect, useRef, useState } from "react"
import { useCanvasResize } from "../hooks/useWindowResize"
import { useStrokeSize } from "../hooks/useStrokeSize"
import styled from "styled-components"
import { useCanvasConfig } from "../hooks/useCanvasConfig"
import { MiniCanvas } from "../hooks/MiniCanvas"

export type Coordinate = {
    x: number;
    y: number;
    strokeSize: number;
    strokeColor: string;
}

export const Canvas = () => {
    const {color, CanvasColor} = useCanvasConfig()
    const canvasSize = useCanvasResize()
    const draftCanvasRef = useRef<HTMLCanvasElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const {strokeSize, strokeColor, StrokeSelector, StrokeColorSelector} = useStrokeSize()
    const [previousPoint, setPreviousPoint] = useState<Coordinate>()
    const [handFreePath, setHandFreePath] = useState<Coordinate[]>([])
    const [handFreePathCache, setHandFreePathCache] = useState<Coordinate[][]>([])

    // we need to clear the draft canvas after a form was drew on it
    const handleClearDraftCanvas = () => {
        const c = draftCanvasRef.current!.getContext('2d');
        c?.clearRect(0, 0, draftCanvasRef.current!.width, draftCanvasRef.current!.height)
        c?.reset();
        setPreviousPoint(undefined)
    }

    const handleClearAllCanvas = () => {
        const d = draftCanvasRef.current!.getContext('2d');
        const c = canvasRef.current!.getContext('2d')
        c?.clearRect(0, 0, draftCanvasRef.current!.width, draftCanvasRef.current!.height)
        c?.reset();
        d?.clearRect(0, 0, draftCanvasRef.current!.width, draftCanvasRef.current!.height)
        d?.reset();
        setHandFreePathCache([])
        setPreviousPoint(undefined)
    }

    // this is our drawing function
    const draw = useCallback((ctx:CanvasRenderingContext2D, {x, y, strokeColor, strokeSize}:Coordinate) => {
        ctx.lineTo(x, y);
        ctx.lineWidth = strokeSize;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
    }, [])

    // we need to draw every single form
    const drawMainSingle = useCallback((c: CanvasRenderingContext2D, sketch: Coordinate[]) => {
        c.beginPath()
        c.moveTo(sketch[0].x, sketch[0].y)
        for (const coord of sketch) {
            draw(c, coord)
        }
        c.closePath();
        setHandFreePath([])
        handleClearDraftCanvas()
    }, [draw])

    // here we trigger a re drawing of the main canvas
    const drawMainComplete = useCallback(() => {
        if (canvasRef.current === null) return
        const c = canvasRef.current.getContext('2d')
        if (!c) return;
        for (const sketch of [...handFreePathCache, handFreePath]) {
            drawMainSingle(c, sketch)
        }
    }, [drawMainSingle, handFreePath, handFreePathCache])

    const handleClickOnDraft = useCallback((e: MouseEvent) => {
        // we check if it is the first click - the one that initialize drawing
        if (!previousPoint) {
            setPreviousPoint({ x: e.offsetX, y: e.offsetY, strokeSize, strokeColor })
            setHandFreePath(prev => [...prev, {x: e.offsetX, y: e.offsetY, strokeSize, strokeColor}])
            return;
        }
        // on second click we add the path to the cache, reset the first point,
        setHandFreePathCache(prev => [...prev, handFreePath])
        setPreviousPoint(undefined)
        drawMainComplete() // and draw the whole main canvas again
    }, [drawMainComplete, handFreePath, previousPoint, strokeColor, strokeSize]);

    // here we draw the grayish lines on the draft canvas
    const  handleMoveOnDraft = (e: MouseEvent) => {
        if (!previousPoint) return; // we only want to draw if there is a previous point - here we make sure that the user clicked already once
        const d = draftCanvasRef.current!.getContext('2d');
        if (!d) return;
        d.lineJoin = "round";
        d.lineCap = "round";
        const x = e.offsetX;
        const y = e.offsetY;
        setHandFreePath(prev => [...prev, {x: e.offsetX, y: e.offsetY, strokeColor, strokeSize}])
        const px = previousPoint.x;
        const py = previousPoint.y;
        d.beginPath()
        d.moveTo(px!, py!);
        d.setLineDash([5, 55]);
        draw(d, {x,y, strokeColor: 'lightgray', strokeSize})
        d.closePath();
        setPreviousPoint({ x, y, strokeColor, strokeSize })
    }

    // we want to track when the user presses 'Escape' to cancel a draft
    useEffect(() => {
        const handleCancel = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClearDraftCanvas();
                setPreviousPoint(undefined);
                setHandFreePath([])
            }
        }
        window.addEventListener('keydown', handleCancel)
        return ()=> window.removeEventListener('keydown', handleCancel)
    }, [])



    return <div style={{ display: 'flex', gap: 10, flexDirection: 'column' }}>
        <div style={{display: 'flex', gap: 10}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: 10, minWidth: 100, maxHeight: '80vh', overflowY:"auto"}}>
            {handFreePathCache.map((sketch, index) => <MiniCanvas key={index} sketch={sketch} />)}
            </div>
            <StyledCanvasContainer>
                <canvas style={mainCanvasStyles} ref={canvasRef} width={canvasSize.width} height={canvasSize.height} />
                <canvas onClick={e => handleClickOnDraft(e.nativeEvent)} onMouseMove={e => handleMoveOnDraft(e.nativeEvent)}
                   style={draftCanvasStyle(color)} ref={draftCanvasRef} width={canvasSize.width} height={canvasSize.height} />
                </StyledCanvasContainer>
        </div>
        <StyledCanvasController>
        <StrokeSelector />
        <StrokeColorSelector />
            <CanvasColor />
            <button onClick={handleClearAllCanvas}>Clear Canvas</button>
        </StyledCanvasController>
    </div>
}

const mainCanvasStyles:CSSProperties = {
    backgroundColor: 'transparent',
    marginBottom: 24,
    pointerEvents: 'none',
    position: 'absolute'
}

const draftCanvasStyle = (color: string):CSSProperties => ({ backgroundColor: color, marginBottom: 24 })

const StyledCanvasController = styled.div`
    display: flex;
    align-items: center;
    gap: 50px;
`

const StyledCanvasContainer = styled.div`
    position: relative
`