import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <h1>Select Difficulty</h1>
      <ul>
        <li>
          <Link
            href={{
              pathname: '/sudoku',
              query: { level: 'easy' }
            }}
          >
            Easy
          </Link>
        </li>
        <li>
          <Link
            href={{
              pathname: '/sudoku',
              query: { level: 'normal' }
            }}
          >
            Normal
          </Link>
        </li>
        <li>
          <Link
            href={{
              pathname: '/sudoku',
              query: { level: 'hard' }
            }}
          >
            Hard
          </Link>
        </li>
      </ul>
    </main>
  );
}
