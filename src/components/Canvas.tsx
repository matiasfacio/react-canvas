import { CSSProperties, useCallback, useEffect, useRef, useState } from "react"
import { useCanvasResize } from "../hooks/useWindowResize"
import { useStrokeSize } from "../hooks/useStrokeSize"
import styled from "styled-components"
import { useCanvasConfig } from "../hooks/useCanvasConfig"
import { MiniCanvas } from "../hooks/MiniCanvas"
import { useHandFree } from "../hooks/useHandFree"
import { Form } from "../App"
import { useCircle } from "../hooks/useCircle"
//import { useSquare } from "../hooks/useSquare"

export type Coordinate = {
    x: number;
    y: number;
    strokeSize: number;
    strokeColor: string;
    type: Form;
}

export type CoordinateCircle = Coordinate & {radio: number}

type Props = {
    activeForm: Form
}

export const Canvas = ({ activeForm }: Props) => {
    const {color, CanvasColor} = useCanvasConfig()
    const canvasSize = useCanvasResize()
    const draftCanvasRef = useRef<HTMLCanvasElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const {strokeSize, strokeColor, StrokeSelector, StrokeColorSelector} = useStrokeSize()
    const [cache, setCache] = useState<Array<Coordinate[] | CoordinateCircle[]>>([])
    const {previousPoint, setPreviousPoint, path, setPath, draw} = useHandFree()
    //const {drawSquare, setSquareCenter, setSquarePath, squareCenter, squarePath} = useSquare()
    const {drawCircle, setCircleCenter, setCirclePath, circleCenter, circlePath} = useCircle()

    // we need to clear the draft canvas after a form was drew on it
    const handleClearDraftCanvas = useCallback(() => {
        const c = draftCanvasRef.current!.getContext('2d');
        c?.clearRect(0, 0, draftCanvasRef.current!.width, draftCanvasRef.current!.height)
        c?.reset();
        setPreviousPoint(undefined)
    },[setPreviousPoint])

    const handleClearAllCanvas = useCallback(({keepCache}:{keepCache?: boolean}) => {
        const d = draftCanvasRef.current!.getContext('2d');
        const c = canvasRef.current!.getContext('2d')
        c?.clearRect(0, 0, draftCanvasRef.current!.width, draftCanvasRef.current!.height)
        c?.reset();
        d?.clearRect(0, 0, draftCanvasRef.current!.width, draftCanvasRef.current!.height)
        d?.reset();
        if (!keepCache) {
            setCache([])
            setPreviousPoint(undefined)
        }
    },[setPreviousPoint])

    // we need to draw every single form
    const drawMainSingle = useCallback((c: CanvasRenderingContext2D, sketch: Coordinate[]) => {
        c.beginPath()
        c.moveTo(sketch[0].x, sketch[0].y)
        for (const coord of sketch) {
            draw(c, coord)
        }
        c.closePath();
        setPath(()=> ([]))
        handleClearDraftCanvas()
    }, [draw, handleClearDraftCanvas, setPath])

    const drawMainCircle = useCallback((ctx: CanvasRenderingContext2D, sketch: CoordinateCircle[]) => {
        const radio = sketch[0].radio;
        ctx.beginPath();
        ctx.arc(sketch[0]?.x, sketch[0].y, radio, 0, Math.PI * 2, true)
        ctx.strokeStyle = sketch[0].strokeColor;
        ctx.lineWidth = sketch[0].strokeSize;
        ctx.stroke()
        setCircleCenter(undefined)
        setCirclePath(undefined)
    }, [setCircleCenter, setCirclePath])

    // here we trigger a re drawing of the main canvas
    const drawMainComplete = useCallback(() => {
        if (canvasRef.current === null) return
        const c = canvasRef.current.getContext('2d')
        if (!c) return;
        for (const sketch of cache) {
            if (sketch[0].type === 'handfree') drawMainSingle(c, sketch as Coordinate[])
            if (sketch[0].type === 'circle') drawMainCircle(c, sketch as CoordinateCircle[])
        }
    }, [cache, drawMainSingle, drawMainCircle])

    useEffect(() => {
        handleClearAllCanvas({keepCache: true});
        drawMainComplete()
    }, [drawMainComplete, cache, handleClearAllCanvas])

    const handleFreeHandClickOnDraft = useCallback((e: MouseEvent) => {
        // we check if it is the first click - the one that initialize drawing
        if (!previousPoint) {
            setPreviousPoint({ x: e.offsetX, y: e.offsetY, strokeSize, strokeColor, type: 'handfree' })
            setPath(prev => [...prev, {x: e.offsetX, y: e.offsetY, strokeSize, strokeColor, type: 'handfree' }])
            return;
        }
        // on second click we add the path to the cache, reset the first point,
        setCache(prev => [...prev, path])
        setPreviousPoint(undefined)
        drawMainComplete() // and draw the whole main canvas again
    }, [drawMainComplete, path, previousPoint, setPath, setPreviousPoint, strokeColor, strokeSize]);

    // here we draw the grayish lines on the draft canvas
    const handleFreeHandMoveOnDraft = (e: MouseEvent) => {
        if (!previousPoint) return; // we only want to draw if there is a previous point - here we make sure that the user clicked already once
        const d = draftCanvasRef.current!.getContext('2d');
        if (!d) return;
        d.lineJoin = "round";
        d.lineCap = "round";
        const x = e.offsetX;
        const y = e.offsetY;
        setPath(prev => [...prev, {x: e.offsetX, y: e.offsetY, strokeColor, strokeSize, type: 'handfree' }])
        const px = previousPoint.x;
        const py = previousPoint.y;
        d.beginPath()
        d.moveTo(px!, py!);
        d.setLineDash([5, 55]);
        draw(d, {x,y, strokeColor: 'lightgray', strokeSize, type: 'handfree' })
        d.closePath();
        setPreviousPoint({ x, y, strokeColor, strokeSize, type: 'handfree'  })
    }

    // we want to track when the user presses 'Escape' to cancel a draft
    useEffect(() => {
        const handleCancel = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClearDraftCanvas();
                setPreviousPoint(undefined);
                setPath(() => ([]))
            }
        }
        window.addEventListener('keydown', handleCancel)
        return ()=> window.removeEventListener('keydown', handleCancel)
    }, [handleClearDraftCanvas, setPath, setPreviousPoint])

    const handleMiniCanvasClick = (x: number, y: number) => {
        const copy = cache.filter((t) => t[0].x !== x && t[0].y !== y )
        setCache(copy)
    }

    const handleCircleClickOnDraft = (e:MouseEvent) => {
        if (!circleCenter) {
            setCircleCenter({ x: e.offsetX, y: e.offsetY, strokeColor, strokeSize, type: 'circle'  })
            return
        }
        if (!circlePath) return;
        const radio = Math.abs(circlePath.x - circleCenter.x)
        setCache(prev => [...prev, [{x: circleCenter.x, y:circleCenter.y, radio, type:'circle', strokeColor, strokeSize}]])
    }

    const handleCircleMoveOnDraft = (e: MouseEvent) => {
        console.log(e);
        setCirclePath({ x: e.offsetX, y: e.offsetY, strokeColor, strokeSize, type: 'circle'  })
        drawCircle(draftCanvasRef.current!.getContext('2d')!)
    }

    const handleSquareClickOnDraft = (e:MouseEvent) => {
        console.log(e);
    }

    const handleSquareMoveOnDraft = (e:MouseEvent) => {
        console.log(e);
    }

    return (
            <StyledContainer>
                <StyledCanvasAndMiniCanvasContainer>
                    <StyledMiniCanvasContainer>
                        {
                            cache?.map((sketch) => {
                                if (!sketch) return;
                                return <MiniCanvas key={sketch[0].x + sketch[0].y} sketch={sketch}
                                    onClick={() => handleMiniCanvasClick(sketch[0].x, sketch[0].y)} />
                            })
                        }
                    </StyledMiniCanvasContainer>
                    <StyledCanvasContainer>
                        <canvas style={mainCanvasStyles} ref={canvasRef} width={canvasSize.width} height={canvasSize.height} />
                        <canvas
                            onClick={e => activeForm === 'handfree'
                                ? handleFreeHandClickOnDraft(e.nativeEvent)
                                    : activeForm === 'circle'
                                    ? handleCircleClickOnDraft(e.nativeEvent)
                                : handleSquareClickOnDraft(e.nativeEvent)
                            }
                            onMouseMove={e => activeForm === 'handfree'
                                ? handleFreeHandMoveOnDraft(e.nativeEvent)
                                    : activeForm === 'circle'
                                    ? handleCircleMoveOnDraft(e.nativeEvent)
                                : handleSquareMoveOnDraft(e.nativeEvent)}
                            style={draftCanvasStyle(color)}
                            ref={draftCanvasRef}
                            width={canvasSize.width}
                            height={canvasSize.height}
                        />
                    </StyledCanvasContainer>
                </StyledCanvasAndMiniCanvasContainer>
                <StyledCanvasController>
                <StrokeSelector />
                <StrokeColorSelector />
                    <CanvasColor />
                    <button onClick={()=> handleClearAllCanvas({keepCache: false})}>Clear Canvas</button>
                </StyledCanvasController>
                {activeForm}
        </StyledContainer>
        )
}

const StyledMiniCanvasContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 120px;
    max-height: 80vh;
    overflow-y: auto;
`

const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`

const StyledCanvasAndMiniCanvasContainer = styled.div`
    display: flex;
    gap: 12px;
`

const mainCanvasStyles:CSSProperties = {
    backgroundColor: 'transparent',
    pointerEvents: 'none',
    position: 'absolute'
}

const draftCanvasStyle = (color: string):CSSProperties => ({ backgroundColor: color })

const StyledCanvasController = styled.div`
    display: flex;
    align-items: center;
    gap: 50px;
`

const StyledCanvasContainer = styled.div`
    position: relative;
`