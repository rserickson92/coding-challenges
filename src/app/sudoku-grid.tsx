"use client"

import { useState } from "react"
import { BLOCK_SIZE, CellValue, generateEmptyArray, generateGrid } from "./utils/grid"

interface CellProps {
  coordinates: number[]
  grid: CellValue[][]
}

const Cell = ({ coordinates, grid }: CellProps) => {
  const [x, y] = coordinates
  return (
    <td>
      <input
        className="h-8 w-8"
        type="text"
        inputMode="numeric"
        pattern="[1-9]"
        value={grid[x][y] || ''}
      />
    </td>
  )
}

interface CellRowProps {
  rowNumber: number
  blockCoordinates: number[]
  grid: CellValue[][]
}

const CellRow = ({ rowNumber, blockCoordinates, grid }: CellRowProps) => {
  const colNumberOffset = blockCoordinates[1] * BLOCK_SIZE
  return (
    <tr>
      {generateEmptyArray().map((_, i) => <Cell key={i} grid={grid} coordinates={[rowNumber, colNumberOffset + i]} />)}
    </tr>
  )
}

interface BlockProps {
  blockCoordinates: number[]
  grid: CellValue[][]
}

const Block = ({ blockCoordinates, grid }: BlockProps) => {
  const rowNumberOffset = blockCoordinates[0] * BLOCK_SIZE
  return (
    <td>
      <table>
        <tbody>
          {generateEmptyArray().map((_, i) => <CellRow key={i} grid={grid} rowNumber={i + rowNumberOffset} blockCoordinates={blockCoordinates} />)}
        </tbody>
      </table>
    </td>
  )
}

interface BlockRowProps {
  blockRowNumber: number
  grid: CellValue[][]
}

const BlockRow = ({ blockRowNumber, grid }: BlockRowProps) => {
  return (
    <tr>
      {generateEmptyArray().map((_, i) => <Block grid={grid} key={i} blockCoordinates={[blockRowNumber, i]} />)}
    </tr>
  )
}


export default function SudokuGrid({ initialGrid }: { initialGrid: CellValue[][] }) {
  const [grid, setGrid] = useState(initialGrid)

  return (
    <table>
      <tbody>
        {generateEmptyArray().map((_, i) => <BlockRow key={i} blockRowNumber={i} grid={grid} />)}
      </tbody>
    </table>
  )
}