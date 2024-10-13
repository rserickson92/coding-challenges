'use client'

import { ChangeEvent, useState } from "react"
import { WheelName } from "../utils/types"
import Wheel from "./wheel"

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

export default function Page() {
  const [wheelNames, setWheelNames] = useState<WheelName[]>([])

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

  return (
    <div className="flex flex-col items-center m-12">
      <label htmlFor="names">Names</label>
      <textarea
        className="text-black"
        name="names"
        onChange={updateNames}
      />
      <Wheel wheelNames={wheelNames} />
    </div>
  )
}