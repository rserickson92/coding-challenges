import { randomInt } from "crypto"
import { CellError, CellValue } from "./types"

export const BLOCK_SIZE = 3

export const generateEmptyArray = (size = BLOCK_SIZE) => {
  return Array.from(Array(size).keys())
}

export const generateGrid = (startingValues = 20): CellValue[][] => {
  const grid = initSolvedGrid()

  const coordinateKey = (x: number, y: number) => `${x},${y}`
  const coordinatesToUse = new Set()
  let valuesUsed = 0
  while (valuesUsed < startingValues) {
    let x = randomInt(BLOCK_SIZE**2)
    let y = randomInt(BLOCK_SIZE**2)
    if (!coordinatesToUse.has(coordinateKey(x, y))) {
      coordinatesToUse.add(coordinateKey(x, y))
      valuesUsed++
    }
  }

  for (let i = 0; i < BLOCK_SIZE**2; i++) {
    for (let j = 0; j < BLOCK_SIZE**2; j++) {
      if (coordinatesToUse.has(coordinateKey(i, j))) {
        coordinatesToUse.delete(coordinateKey(i, j))
      } else {
        grid[i][j] = { value: null }
      }
    }
  }

  return grid
}

export const clearGridErrors = (grid: CellValue[][]) => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      grid[i][j].errors = undefined
    }
  }
}

const initSolvedGrid = (): CellValue[][] => {
  const initGrid: CellValue[][] = []
  for (let i = 0; i < BLOCK_SIZE**2; i++) {
    initGrid.push([])
    for (let j = 0; j < BLOCK_SIZE**2; j++) {
      initGrid[i].push({ value: null })
    }
  }

  const grid = gridFrom(initGrid, 0, 0)
  return grid ?? initGrid
}

const gridFrom = (initGrid: CellValue[][], i: number, j: number): CellValue[][] | null => {
  const grid = structuredClone(initGrid)
  if (i >= grid.length) {
    return grid
  }

  if (j >= grid.length) {
    return gridFrom(grid, i + 1, 0)
  }

  if (!validateCellValue(grid, i, j).length) {
    return gridFrom(grid, i, j + 1)
  }

  let availableNumbers = generateEmptyArray(BLOCK_SIZE**2).map(n => n+1)
  while (availableNumbers.length > 0) {
    let randIdx = availableNumbers.length === 1 ? 0 : randomInt(availableNumbers.length - 1)
    let selectedNumber = availableNumbers.splice(randIdx, 1)[0]
    grid[i][j] = { value: selectedNumber }
    let errors = validateCellValue(grid, i, j)
    if (!errors.length) {
      let candidateGrid = gridFrom(grid, i, j + 1)
      if (candidateGrid) {
        return candidateGrid
      }
    }
  }

  return null
}

export const propagateCellErrors = (grid: CellValue[][], i: number, j: number) => {
  const errors = grid[i][j].errors
  if (!errors?.length) {
    return
  }

  if (errors.some(e => e.code === 'row')) {
    const row = grid[i]
    for (let idx = 0; idx < row.length; idx++) {
      if (idx !== j) {
        (row[idx].errors ||= []).push({ code: 'row' })
      }
    }
  }

  if (errors.some(e => e.code === 'column')) {
    for (let idx = 0; idx < grid.length; idx++) {
      if (idx !== i) {
        (grid[idx][j].errors ||= []).push({ code: 'column' })
      }
    }
  }

  if (errors.some(e => e.code === 'square')) {
    let quadrant_i = i - (i % BLOCK_SIZE)
    let quadrant_j = j - (j % BLOCK_SIZE)
    for (let idx = quadrant_i; idx < (quadrant_i + BLOCK_SIZE); idx++) {
      for (let jdx = quadrant_j; jdx < (quadrant_j + BLOCK_SIZE); jdx++) {
        if (!(idx === i && jdx === j)) {
          (grid[idx][jdx].errors ||= []).push({ code: 'square' })
        }
      }
    }
  }
}

export const validateCellValue = (grid: CellValue[][], i: number, j: number): CellError[] => {
  const value = grid[i][j].value
  if (value === null) {
    return [{code: 'empty'}]
  }

  const errors = []
  const row = grid[i]
  for (let idx = 0; idx < row.length; idx++) {
    if (idx !== j && row[idx].value === value) {
      errors.push({ code: 'row' })
    }
  }

  for (let idx = 0; idx < grid.length; idx++) {
    if (idx !== i && grid[idx][j].value === value) {
      errors.push({ code: 'column' })
    }
  }

  let quadrant_i = i - (i % BLOCK_SIZE)
  let quadrant_j = j - (j % BLOCK_SIZE)
  for (let idx = quadrant_i; idx < (quadrant_i + BLOCK_SIZE); idx++) {
    for (let jdx = quadrant_j; jdx < (quadrant_j + BLOCK_SIZE); jdx++) {
      if (!(idx === i && jdx === j) && grid[idx][jdx].value === value) {
        errors.push({ code: 'square' })
      }
    }
  }

  return errors
}