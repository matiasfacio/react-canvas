import { useState } from "react";

export const useStrokeSize = () => {
    const [strokeColor, setStrokeColor] = useState('black')
    const [strokeSize, setStrokeSize] = useState(1)


    const StrokeSelector = () => <label>
        Stroke Size:
        <input type="number" onChange={e => setStrokeSize(e.target.valueAsNumber)} value={strokeSize} />
    </label>

    const StrokeColorSelector = () => <label>
    Stroke Color:
    <input type="color" onChange={e => setStrokeColor(e.target.value)} value={strokeColor} />
    </label>


    return {strokeSize, strokeColor, StrokeSelector, StrokeColorSelector}
}