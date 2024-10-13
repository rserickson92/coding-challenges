export interface CellValue {
    value: number | null
    errors?: CellError[]
    wasGenerated?: boolean
}

export interface CellError {
    code: string
    message?: string
}

export type GridStateSetter = (x: number, y: number, value: CellValue) => void

export interface WheelName {
    name: string
    color: string
}