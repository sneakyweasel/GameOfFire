import { Direction } from './interfaces'

export default class Coord {
  private static instances = new Map<number, Coord>()
  readonly x: number
  readonly y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  /**
   * Get the neighbouring grid cell at given direction
   * @param direction
   */
  adjacent(direction: Direction): Coord {
    switch (direction) {
      case Direction.NW:
        return new Coord(this.x - 1, this.y - 1)
      case Direction.N:
        return new Coord(this.x, this.y - 1)
      case Direction.NE:
        return new Coord(this.x + 1, this.y - 1)
      case Direction.W:
        return new Coord(this.x - 1, this.y)
      case Direction.E:
        return new Coord(this.x + 1, this.y)
      case Direction.SW:
        return new Coord(this.x + 1, this.y + 1)
      case Direction.S:
        return new Coord(this.x, this.y + 1)
      case Direction.SE:
        return new Coord(this.x - 1, this.y + 1)
    }
  }

  adjacents(diagonal = false): Coord[] {
    if (diagonal) {
      return [
        this.adjacent(Direction.N),
        this.adjacent(Direction.S),
        this.adjacent(Direction.W),
        this.adjacent(Direction.E),
      ]
    } else {
      return [
        this.adjacent(Direction.NW),
        this.adjacent(Direction.N),
        this.adjacent(Direction.NE),
        this.adjacent(Direction.W),
        this.adjacent(Direction.E),
        this.adjacent(Direction.SW),
        this.adjacent(Direction.S),
        this.adjacent(Direction.SE),
      ]
    }
  }

  validate(width: number, height: number): boolean {
    return this.x >= 0 && this.x < width && this.y >= 0 && this.y < height
  }
}
