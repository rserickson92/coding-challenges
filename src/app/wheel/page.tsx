'use client'

import { useCallback, useEffect, useRef, useState } from "react"

const COLORS = [
  'red',
  'blue',
  'green',
  'orange',
  'yellow',
  'purple',
  'brown'
]

export default function Page() {
  const canvasRef = useRef(null)
  const [names, setNames] = useState([])
  const arcSize = (2 * Math.PI) / names.length

  const updateNames = (e: any) => {
    const newNames = e.target.value.split("\n").filter((n: string) => n)
    setNames(newNames)
  }

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    const center = { x: 250, y: 250 }
    const radius = 200
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = '#000000'

    names.forEach((name, i) => {
      ctx.fillStyle = COLORS[Math.floor(Math.random() * COLORS.length)]
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

    names.forEach((name, i) => {
      ctx.save()
      ctx.translate(center.x, center.y)
      ctx.rotate(arcSize / 2)
      ctx.rotate(i * arcSize)
      ctx.fillStyle = '#ffffff'
      ctx.font = '40px serif'
      ctx.textBaseline = 'middle'
      ctx.fillText(name, 50, 0)
      ctx.restore()
    })
  }, [arcSize, names])

  useEffect(() => {
    const canvas: any = canvasRef.current
    if (!canvas) {
      return
    }

    const ctx = canvas.getContext("2d")
    draw(ctx)
  }, [draw])

  return (
    <div className="flex flex-col items-center m-12">
      <label htmlFor="names">Names</label>
      <textarea
        className="text-black"
        name="names"
        onChange={updateNames}
      />
      <canvas ref={canvasRef} height={500} width={500} />
    </div>
  )
}