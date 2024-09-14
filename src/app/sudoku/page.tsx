import SudokuGrid from "./sudoku-grid";
import { generateGrid } from "../utils/grid";

const LEVELS: { [index: string]: number | undefined } = {
  easy: 50,
  normal: 40,
  hard: 30,
}

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function Page({ searchParams }: PageProps) {
  const level = [searchParams?.level].flat()[0] ?? 'normal'
  const initialValueCount = LEVELS[level] ?? LEVELS['normal']

  return (
    <SudokuGrid
      initialGrid={generateGrid(initialValueCount)}
    />
  )
}