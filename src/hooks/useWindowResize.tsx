import { useEffect, useState } from "react"

export const useCanvasResize = () => {
    const [canvasSize, setCanvasSize] = useState({
        width: window.innerWidth * 0.8, height: window.innerHeight * 0.8
    })
    useEffect(() => {
        const handleResize = () => {
            setCanvasSize({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }
        window.addEventListener('resize', handleResize)
        return ()=> window.removeEventListener('resize', handleResize)
    }, [])

    return canvasSize
}