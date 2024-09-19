"use client"

import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react"
import { BLOCK_SIZE, generateEmptyArray, isSolved, propagateCellErrors, validateCellValue } from "../utils/grid"
import { CellValue, GridStateSetter } from '../utils/types'

interface CellProps {
  coordinates: number[]
  grid: CellValue[][]
  setGrid: Dispatch<SetStateAction<CellValue[][]>>
  updateGrid: GridStateSetter
}

const Cell = ({ coordinates, grid, setGrid, updateGrid }: CellProps) => {
  const [x, y] = coordinates
  const defaultClassName = 'h-8 w-8 text-center'
  const [className, setClassName] = useState(defaultClassName)

  const getValue = () => {
    const value = grid[x][y]
    return value?.value ?? ''
  }
  const valueIsDisabled = () => {
    return grid[x][y].wasGenerated
  }
  const updateValue = (e: ChangeEvent<HTMLInputElement>) => {
    updateGrid(x, y, { value: parseInt(e.target.value) || null })
  }
  const clearGridErrors = () => {
    setGrid((prevGrid) => {
      const newGrid = structuredClone(prevGrid)
      for (let i = 0; i < newGrid.length; i++) {
        for (let j = 0; j < newGrid.length; j++) {
          newGrid[i][j].errors = undefined
        }
      }

      return newGrid
    })
  }

  const handleFocus = () => {
    clearGridErrors()
  }

  useEffect(() => {
    if (grid[x][y].errors?.length) {
      setClassName(`${defaultClassName} bg-red-400`)
    } else {
      setClassName(defaultClassName)
    }
  }, [grid, x, y])

  return (
    <td>
      <input
        className={className}
        type="text"
        inputMode="numeric"
        pattern="[1-9]"
        disabled={valueIsDisabled()}
        value={getValue()}
        onChange={updateValue}
        onFocus={handleFocus}
      />
    </td>
  )
}

interface CellRowProps {
  rowNumber: number
  blockCoordinates: number[]
  grid: CellValue[][]
  setGrid: Dispatch<SetStateAction<CellValue[][]>>
  updateGrid: GridStateSetter
}

const CellRow = ({ rowNumber, blockCoordinates, grid, setGrid, updateGrid }: CellRowProps) => {
  const colNumberOffset = blockCoordinates[1] * BLOCK_SIZE
  return (
    <tr>
      {
        generateEmptyArray().map((_, i) =>
          <Cell
            key={i}
            grid={grid}
            setGrid={setGrid}
            updateGrid={updateGrid}
            coordinates={[rowNumber, colNumberOffset + i]}
          />
        )
      }
    </tr>
  )
}

interface BlockProps {
  blockCoordinates: number[]
  grid: CellValue[][]
  setGrid: Dispatch<SetStateAction<CellValue[][]>>
  updateGrid: GridStateSetter
}

const Block = ({ blockCoordinates, grid, setGrid, updateGrid }: BlockProps) => {
  const rowNumberOffset = blockCoordinates[0] * BLOCK_SIZE
  return (
    <td>
      <table>
        <tbody>
          {
            generateEmptyArray().map((_, i) => 
              <CellRow
                key={i}
                grid={grid}
                setGrid={setGrid}
                updateGrid={updateGrid}
                rowNumber={i + rowNumberOffset}
                blockCoordinates={blockCoordinates}
              />
            )
          }
        </tbody>
      </table>
    </td>
  )
}

interface BlockRowProps {
  blockRowNumber: number
  grid: CellValue[][]
  setGrid: Dispatch<SetStateAction<CellValue[][]>>
  updateGrid: GridStateSetter
}

const BlockRow = ({ blockRowNumber, grid, setGrid, updateGrid }: BlockRowProps) => {
  return (
    <tr>
      {
        generateEmptyArray().map((_, i) =>
          <Block
            grid={grid}
            setGrid={setGrid}
            updateGrid={updateGrid}
            key={i}
            blockCoordinates={[blockRowNumber, i]}
          />
        )
      }
    </tr>
  )
}

interface GameTimerProps {
  secondsElapsed: number
}

const GameTimer = ({ secondsElapsed }: GameTimerProps) => {
  const zeroPad = (n: number) => {
    return n.toString().padStart(2, '0')
  }
  const seconds = zeroPad(Math.floor(secondsElapsed % 60))
  const minutes = zeroPad(Math.floor((secondsElapsed / 60) % 60));
  const hours = zeroPad(Math.floor(secondsElapsed / 60 / 60));
  const timeElapsed = `${hours}:${minutes}:${seconds}`
  return (
    <p className="text-green-700 text-3xl">
      {timeElapsed}
    </p>
  )
}

export default function SudokuGrid({ initialGrid }: { initialGrid: CellValue[][] }) {
  const [grid, setGrid] = useState(initialGrid)
  const [victorySeconds, setVictorySeconds] = useState(0)
  const [secondsElapsed, setSecondsElapsed] = useState(0)

  const updateGrid = (x: number, y: number, value: CellValue) => {
    setGrid((prevGrid) => {
      const newGrid = structuredClone(prevGrid)
      newGrid[x][y] = value

      const errors = validateCellValue(newGrid, x, y)
      if (errors.length) {
        newGrid[x][y].errors = errors
        propagateCellErrors(newGrid, x, y)
      }

      if (isSolved(newGrid)) {
        setVictorySeconds(secondsElapsed)
      }

      return newGrid
    })
  }

  useEffect(() => {
    const secondsElapsedId = setInterval(() => {
      setSecondsElapsed(s => s + 1)
    }, 1000)

    return () => {
      clearInterval(secondsElapsedId)
    }
  }, [])

  return (
    <div className="flex flex-col items-center m-12">
      <GameTimer secondsElapsed={victorySeconds || secondsElapsed} />
      <table className="flex min-h-screen flex-col items-center justify-between p-24 text-black">
        <tbody>
          {
            generateEmptyArray().map((_, i) =>
              <BlockRow
                key={i}
                blockRowNumber={i}
                grid={grid}
                setGrid={setGrid}
                updateGrid={updateGrid}
              />
            )
          }
        </tbody>
      </table>
    </div>
  )
}