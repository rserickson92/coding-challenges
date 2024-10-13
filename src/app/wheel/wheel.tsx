import { useCallback, useEffect, useRef } from "react"
import { WheelName } from "../utils/types"

interface WheelProps {
  wheelNames: WheelName[]
}

export default function Wheel({ wheelNames }: WheelProps) {
  const arcSize = (2 * Math.PI) / wheelNames.length

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const draw = useCallback((ctx: CanvasRenderingContext2D | null) => {
    if (!ctx) {
      return
    }
  
    const center = { x: 250, y: 250 }
    const radius = 200
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = '#000000'

    wheelNames.forEach((wheelName, i) => {
      ctx.fillStyle = wheelName.color
      ctx.beginPath()
      ctx.arc(
        center.x,
        center.y,
        radius,
        i * arcSize,
        (i + 1) * arcSize
      )
      ctx.lineTo(center.x, center.y)
      ctx.closePath()
      ctx.fill()
    })

    wheelNames.forEach((wheelName, i) => {
      ctx.save()
      ctx.translate(center.x, center.y)
      ctx.rotate(arcSize / 2)
      ctx.rotate(i * arcSize)
      ctx.fillStyle = '#ffffff'
      ctx.font = '40px serif'
      ctx.textBaseline = 'middle'
      ctx.fillText(wheelName.name, 50, 0)
      ctx.restore()
    })
  }, [arcSize, wheelNames])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const ctx = canvas.getContext("2d")
    draw(ctx)
  }, [draw])

  return (
    <canvas ref={canvasRef} height={500} width={500} />
  )
}