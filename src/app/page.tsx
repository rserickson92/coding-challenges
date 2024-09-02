import SudokuGrid from "./sudoku-grid";
import { generateGrid } from "./utils/grid";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 text-black">
      <SudokuGrid initialGrid={generateGrid()} />
    </main>
  );
}
