export interface CellValue {
    value: number | null
    errors?: CellError[]
}

export interface CellError {
    code: string
    message?: string
}

export type GridStateSetter = (x: number, y: number, value: CellValue) => void