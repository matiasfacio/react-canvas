import { useCallback, useState } from "react"
import { Coordinate } from "../components/Canvas"
import { useStrokeSize } from "./useStrokeSize"

export const useHandFree = () => {
    const [previousPoint, setPreviousPoint] = useState<Coordinate>()
    const [path, setPath] = useState<Coordinate[]>([])
    const { strokeSize, strokeColor} = useStrokeSize()

    const draw = (ctx:CanvasRenderingContext2D, {x, y, strokeColor, strokeSize}:Coordinate) => {
        ctx.lineTo(x, y);
        ctx.lineWidth = strokeSize;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
    }

    const handleMoveOnDraft = (d: CanvasRenderingContext2D | null, e: MouseEvent) => {
        if (!previousPoint || !d) return; // we only want to draw if there is a previous point - here we make sure that the user clicked already once
        d.lineJoin = "round";
        d.lineCap = "round";
        const x = e.offsetX;
        const y = e.offsetY;
        setPath(prev => [...prev, { x: e.offsetX, y: e.offsetY, strokeColor, strokeSize, type: 'handfree'  }])
        const px = previousPoint.x;
        const py = previousPoint.y;
        d.beginPath()
        d.moveTo(px!, py!);
        d.setLineDash([5, 55]);
        draw(d, { x, y, strokeColor: 'lightgray', strokeSize,type: 'handfree'  })
        d.closePath();
        setPreviousPoint({ x, y, strokeColor, strokeSize, type: 'handfree'  })
    }

    const handleClickOnDraft = useCallback((e: MouseEvent) => {
        // we check if it is the first click - the one that initialize drawing
        if (!previousPoint) {
            setPreviousPoint({ x: e.offsetX, y: e.offsetY, strokeSize, strokeColor, type: 'handfree'  })
            setPath(prev => [...prev, { x: e.offsetX, y: e.offsetY, strokeSize, strokeColor, type: 'handfree'  }])
            return;
        }
        // otherwise, we finish the drawing
        setPreviousPoint(undefined)
    }, [previousPoint, strokeColor, strokeSize])

    return {
        handleClickOnDraft,
        handleMoveOnDraft,
        draw,
        path,
        setPath,
        setPreviousPoint,
        previousPoint
    }
}
