import { randomInt } from "crypto"

export const BLOCK_SIZE = 3

export type CellValue = number | null

export const generateEmptyArray = (size = BLOCK_SIZE) => {
  return Array.from(Array(size).keys())
}

export const generateGrid = (startingValues = 10): CellValue[][] => {
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
        grid[i][j] = null
      }
    }
  }

  return grid
}

const initSolvedGrid = (): CellValue[][] => {
  const initGrid: CellValue[][] = []
  for (let i = 0; i < BLOCK_SIZE**2; i++) {
    initGrid.push([])
    for (let j = 0; j < BLOCK_SIZE**2; j++) {
      initGrid[i].push(null)
    }
  }

  const grid = gridFrom(initGrid, 0, 0)
  return grid ?? initGrid
}

const gridFrom = (initGrid: CellValue[][], i: number, j: number): CellValue[][] | null => {
  const grid = structuredClone(initGrid)
  console.log(`${i},${j}`)
  if (i >= grid.length) {
    return grid
  }

  if (j >= grid.length) {
    return gridFrom(grid, i + 1, 0)
  }

  if (isValidCellValue(grid, i, j)) {
    return gridFrom(grid, i, j + 1)
  }

  let availableNumbers = generateEmptyArray(BLOCK_SIZE**2).map(n => n+1)
  while (availableNumbers.length > 0) {
    let randIdx = availableNumbers.length === 1 ? 0 : randomInt(availableNumbers.length - 1)
    let selectedNumber = availableNumbers.splice(randIdx, 1)[0]
    grid[i][j] = selectedNumber
    if (isValidCellValue(grid, i, j)) {
      let candidateGrid = gridFrom(grid, i, j + 1)
      if (candidateGrid) {
        return candidateGrid
      }
    }
  }

  return null
}

export const isValidCellValue = (grid: CellValue[][], i: number, j: number): boolean => {
  const value = grid[i][j]
  if (value === null) {
    return false
  }

  // check row
  const row = grid[i]
  for (let idx = 0; idx < row.length; idx++) {
    if (idx !== j && row[idx] === value) {
      // console.log(`Invalid to use ${row[idx]} in row ${row}`)
      return false
    }
  }

  // check column
  for (let idx = 0; idx < grid.length; idx++) {
    if (idx !== i && grid[idx][j] === value) {
      // console.log(`Invalid to use ${grid[idx][j]} in col ${j}`)
      return false
    }
  }

  // check square
  let quadrant_i = i - (i % BLOCK_SIZE)
  let quadrant_j = j - (j % BLOCK_SIZE)
  for (let idx = quadrant_i; idx < (quadrant_i + BLOCK_SIZE); idx++) {
    for (let jdx = quadrant_j; jdx < (quadrant_j + BLOCK_SIZE); jdx++) {
      if (!(idx === i && jdx === j) && grid[idx][jdx] === value) {
        // console.log(`Invalid to use ${grid[idx][jdx]} in quadrant ${quadrant_i},${quadrant_j}`)
        return false
      }
    }
  }

  return true
}