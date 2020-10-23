export interface Coord {
  readonly x: number
  readonly y: number
}

export interface CellI {
  x: number
  y: number
  alive: boolean
  edges: number
  risk: number
}

export const enum Direction {
  Right,
  Up,
  Left,
  Down,
}
