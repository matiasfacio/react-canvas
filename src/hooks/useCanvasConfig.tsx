import { useState } from "react"

export const useCanvasConfig = () => {
    const [color, setCanvasColor] = useState('#ffffff')
    const CanvasColor = () => {
        return <label>
            Canvas color:
            <input type="color" value={color} onChange={e => setCanvasColor(e.target.value)} />
        </label>
    }
    return {color, CanvasColor}
}
