'use client'

import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react"

const COLORS = [
  'red',
  'blue',
  'green',
  'orange',
  'yellow',
  'purple',
  'brown',
  'pink'
]

interface WheelName {
  name: string
  color: string
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [wheelNames, setWheelNames] = useState<WheelName[]>([])
  const arcSize = (2 * Math.PI) / wheelNames.length

  const updateNames = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const inputNames = e.target.value.split("\n").filter((n: string) => n)
    setWheelNames((currentWheelNames) => {
      const newWheelNames: WheelName[] = []
      inputNames.forEach((iwn, i) => {
        const existingWheelName = currentWheelNames.find(wn => wn.name === iwn)
        if (!existingWheelName && newWheelNames.length) {
          newWheelNames.push({
            name: iwn,
            color: selectColor(
              newWheelNames[0].color,
              newWheelNames[newWheelNames.length-1].color
            )
          })
        } else if (existingWheelName) {
          newWheelNames.push({
            name: iwn,
            color: existingWheelName.color
          })
        } else {
          newWheelNames.push({
            name: iwn,
            color: selectColor()
          })
        }
      })

      return newWheelNames
    })
  }

  const selectColor = (...except: string[]) => {
    const colors = COLORS.filter(c => !except.includes(c))
    return colors[Math.floor(Math.random() * colors.length)]
  }

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