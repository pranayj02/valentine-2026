import { useEffect, useRef } from 'react'
import './GrainOverlay.css'

function GrainOverlay() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = 300
    canvas.height = 300

    const imageData = ctx.createImageData(canvas.width, canvas.height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const gray = Math.random() * 255
      data[i] = gray
      data[i + 1] = gray
      data[i + 2] = gray
      data[i + 3] = 50
    }

    ctx.putImageData(imageData, 0, 0)
  }, [])

  return (
    <div className="grain-overlay">
      <canvas ref={canvasRef} />
    </div>
  )
}

export default GrainOverlay
