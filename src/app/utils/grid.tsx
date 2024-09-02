import { randomInt } from "crypto"

export const BLOCK_SIZE = 3

export type CellValue = number | null

export const generateEmptyArray = (size = BLOCK_SIZE) => {
  return Array.from(Array(size).keys())
}

export const generateGrid = (startingValues = 10): CellValue[][] => {
  const grid: CellValue[][] = []
  for (let i = 0; i < BLOCK_SIZE**2; i++) {
    grid.push([])
    for (let j = 0; j < BLOCK_SIZE**2; j++) {
      grid[i].push(null)
    }
  }

  for (let i = 0; i < BLOCK_SIZE**2; i++) {
    for (let j = 0; j < BLOCK_SIZE**2; j++) {
      let availableNumbers = generateEmptyArray(BLOCK_SIZE**2).map(n => n+1)
      while (!isValidCellValue(grid, i, j)) {
        let randIdx = availableNumbers.length === 1
          ? 0
          : randomInt(availableNumbers.length - 1)
        let selectedNumber = availableNumbers.splice(randIdx, 1)[0]
        grid[i][j] = selectedNumber
      }
    }
  }

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

export const isValidCellValue = (grid: CellValue[][], i: number, j: number): boolean => {
  const value = grid[i][j]
  if (value === null) {
    return false
  }

  // check row
  const row = grid[i]
  for (let idx = 0; idx < row.length; idx++) {
    if (idx !== j && row[idx] === value) {
      return false;
    }
  }

  // check column
  for (let idx = 0; idx < grid.length; idx++) {
    if (idx !== i && grid[idx][j] === value) {
      return false;
    }
  }

  // check square
  let quadrant_i = i - (i % BLOCK_SIZE)
  let quadrant_j = j - (j % BLOCK_SIZE)
  for (let idx = quadrant_i; idx < (quadrant_i + BLOCK_SIZE); idx++) {
    for (let jdx = quadrant_j; jdx < (quadrant_j + BLOCK_SIZE); jdx++) {
      if (!(idx === i && jdx === j) && grid[idx][jdx] === value) {
        return false
      }
    }
  }

  return true
}