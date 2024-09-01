
const Cell = () => {
  return (
    <td>
      <input
        className="h-8 w-8"
        type="text"
        inputMode="numeric"
        pattern="[1-9]"
      />
    </td>
  )
}

const CellRow = () => {
  return (
    <tr>
      <Cell />
      <Cell />
      <Cell />
    </tr>
  )
}

const Block = () => {
  return (
    <td>
      <table>
        <tbody>
          <CellRow />
          <CellRow />
          <CellRow />
        </tbody>
      </table>
    </td>
  )
}

const BlockRow = () => {
  return (
    <tr>
      <Block />
      <Block />
      <Block />
    </tr>
  )
}

export default function SudokuGrid() {
  return (
    <table>
      <tbody>
        <BlockRow />
        <BlockRow />
        <BlockRow />
      </tbody>
    </table>
  )
}