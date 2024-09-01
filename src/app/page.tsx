import Image from "next/image";
import SudokuGrid from "./sudoku-grid";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 text-black">
      <SudokuGrid />
    </main>
  );
}
