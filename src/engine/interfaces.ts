export interface Coord {
  readonly x: number
  readonly y: number
}

export interface CellI {
  x: number
  y: number
  alive: boolean
  risk: number
}

export const enum Direction {
  Right,
  Up,
  Left,
  Down,
}
