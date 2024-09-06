"use client"

import { ChangeEvent, useEffect, useState } from "react"
import { BLOCK_SIZE, clearGridErrors, generateEmptyArray, propagateCellErrors, validateCellValue } from "./utils/grid"
import { BulkGridStateSetter, CellValue, GridStateSetter } from "./utils/types"

interface CellProps {
  coordinates: number[]
  grid: CellValue[][]
  updateGrid: GridStateSetter
  bulkUpdateGrid: BulkGridStateSetter
}

const Cell = ({ coordinates, grid, updateGrid, bulkUpdateGrid }: CellProps) => {
  const [x, y] = coordinates
  const defaultClassName = 'h-8 w-8'
  const [className, setClassName] = useState(defaultClassName)

  const getValue = () => {
    const value = grid[x][y]
    return value?.value ?? ''
  }
  const updateValue = (e: ChangeEvent<HTMLInputElement>) => {
    updateGrid(x, y, { value: parseInt(e.target.value) || null })
  }
  const handleFocus = () => {
    clearGridErrors(grid)
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
  updateGrid: GridStateSetter
  bulkUpdateGrid: BulkGridStateSetter
}

const CellRow = ({ rowNumber, blockCoordinates, grid, updateGrid, bulkUpdateGrid }: CellRowProps) => {
  const colNumberOffset = blockCoordinates[1] * BLOCK_SIZE
  return (
    <tr>
      {
        generateEmptyArray().map((_, i) =>
          <Cell
            key={i}
            grid={grid}
            updateGrid={updateGrid}
            bulkUpdateGrid={bulkUpdateGrid}
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
  updateGrid: GridStateSetter
  bulkUpdateGrid: BulkGridStateSetter
}

const Block = ({ blockCoordinates, grid, updateGrid, bulkUpdateGrid}: BlockProps) => {
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
                updateGrid={updateGrid}
                bulkUpdateGrid={bulkUpdateGrid}
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
  updateGrid: GridStateSetter
  bulkUpdateGrid: BulkGridStateSetter
}

const BlockRow = ({ blockRowNumber, grid, updateGrid, bulkUpdateGrid }: BlockRowProps) => {
  return (
    <tr>
      {
        generateEmptyArray().map((_, i) =>
          <Block
            grid={grid}
            updateGrid={updateGrid}
            bulkUpdateGrid={bulkUpdateGrid}
            key={i}
            blockCoordinates={[blockRowNumber, i]}
          />
        )
      }
    </tr>
  )
}


export default function SudokuGrid({ initialGrid }: { initialGrid: CellValue[][] }) {
  const [grid, setGrid] = useState(initialGrid)
  const updateGrid = (x: number, y: number, value: CellValue) => {
    setGrid((prevGrid) => {
      const newGrid = structuredClone(prevGrid)
      newGrid[x][y] = value

      const errors = validateCellValue(newGrid, x, y)
      if (errors.length) {
        newGrid[x][y].errors = errors
        propagateCellErrors(newGrid, x, y)
      }

      return newGrid
    })
  }

  // TODO: Remove me if unused
  const bulkUpdateGrid = (values: {x: number, y: number, value: CellValue}[]) => {
    setGrid((prevGrid) => {
      const newGrid = structuredClone(prevGrid)
      values.forEach(value => {
        newGrid[value.x][value.y] = value.value
      })
      return newGrid
    })
  }

  return (
    <table>
      <tbody>
        {
          generateEmptyArray().map((_, i) =>
            <BlockRow
              key={i}
              blockRowNumber={i}
              grid={grid}
              updateGrid={updateGrid}
              bulkUpdateGrid={bulkUpdateGrid}
            />
          )
        }
      </tbody>
    </table>
  )
}