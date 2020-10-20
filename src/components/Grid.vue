<template>
  <div>
    <!-- GRID -->
    <div class="game-grid columns">
      <div v-for="(col, indexX) in grid" :key="indexX" class="game-column">
        <cell
          v-for="(cell, indexY) in col"
          :key="indexY"
          :cell="cell"
          @toggleCell="toggleCell(cell)"
          @hoveredCell="displayCell(cell)"
        />
      </div>
    </div>

    <!-- STATS -->
    <stats
      class="stats"
      :current-tick="currentTick"
      :cells-alive="alives().length"
      :hairyness="hairyness()"
      :compactness="compactness()"
      :edges="edges()"
      :current-speed="currentSpeed"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { CellI, Coord } from '@/engine/interfaces'
import Cell from '@/components/Cell.vue'
import Stats from '@/components/Stats.vue'

@Component({
  components: {
    Stats,
    Cell,
  },
})
export default class Board extends Vue {
  @Prop() message!: string
  @Prop() importToken!: string
  @Prop() currentSpeed!: number

  width = 31
  height = 20
  grid: CellI[][] = []
  // Stats that get passed down to the app-stats component
  currentTick = 0
  cellCount = 0
  cellsAlive = 0
  cellsCreated = 0
  // A prop that gets used by the app-cell component (drag)
  isMouseDown = false
  selected: CellI = { x: 0, y: 0, alive: false, risk: 0 }

  @Watch('message')
  onMessageChanged(val: string) {
    if (val === 'nextStep') {
      this.update()
      this.currentTick++
    } else if (val === 'redoSession') {
      this.reset()
    } else if (val === 'randomSeed') {
      this.randomSeed()
    } else if (val === 'importSession') {
      this.importSession()
    } else if (val === 'exportSession') {
      this.exportSession()
    }
  }

  created() {
    this.init()
    this.createDefaultCell()
  }

  /**
   * Creates a 2D-Array during runtime for
   * the website to use for most operations.
   */
  init(): void {
    for (let x = 0; x < this.width; x++) {
      this.grid[x] = []
      for (let y = 0; y < this.height; y++) {
        const cell: CellI = { x, y, alive: false, risk: 0 }
        this.grid[x][y] = cell
      }
    }
    this.cellCount = this.width * this.height
  }

  /** List of alive cells */
  alives(): CellI[] {
    return this.grid.flat().filter((cell: CellI) => {
      return cell.alive
    })
  }

  /** List of cells at risk */
  risks(): CellI[] {
    return this.grid.flat().filter((cell: CellI) => {
      return !cell.alive && cell.risk > 0
    })
  }

  /** List of cells at risk */
  edges(): number {
    return this.risks().reduce((acc, cell): number => acc + cell.risk, 0)
  }

  /** Hairyness */
  hairyness(): number {
    return this.edges() / this.alives().length
  }

  /** Compactness */
  compactness(): number {
    return this.alives().length / this.edges()
  }

  /**
   * Changes the grid cell to the one requested
   * in the param.
   */
  getCell(x: number, y: number): CellI {
    return this.grid[x][y]
  }

  /**
   * Changes the grid cell to the one requested
   * in the param.
   */
  displayCell(cell: CellI): void {
    this.selected = cell
  }

  /**
   * Toggle the grid cell alive status
   */
  toggleCell(cell: CellI): void {
    const tempCell = this.grid[cell.x][cell.y]
    tempCell.alive = !tempCell.alive
    this.updateRisk()
  }

  /**
   * The main function that updates the grid
   * every tick based on the game of life rules.
   */
  updateRisk(): void {
    // Update neighbours count
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const cell = this.getCell(x, y)
        const neighbours = this.getNeighbours(x, y)
        if (cell.alive) {
          this.grid[cell.x][cell.y] = { x, y, alive: true, risk: 0 }
        } else {
          this.grid[cell.x][cell.y] = { x, y, alive: false, risk: neighbours }
        }
      }
    }
    this.$forceUpdate()
  }

  /**
   * The main function that updates the grid
   * every tick based on a random weighted fate toggle.
   */
  update(): void {
    const cell = this.weightedRandomFate()
    console.log(`Fate has selected: ${JSON.stringify(cell)}`)
    cell.alive = true
    this.grid[cell.x][cell.y] = cell
    this.updateRisk()
  }

  /**
   * Returns the amount of neighbours for
   * a specific cell on the grid.
   *
   * @param {number} posX - the x position
   * @param {number} posY - the Y position
   * @return {number} neighbours - amount of neighbours
   */
  getNeighbours(x: number, y: number): number {
    const coords = this.neighbours(x, y)
    return coords.filter((coord) => {
      return this.grid[coord.x][coord.y].alive
    }).length
  }

  /**
   * Get the neighbouring grid cell at given direction
   * @param direction
   */
  neighbours(x: number, y: number): Coord[] {
    let coords = [
      {
        x: x + 1,
        y,
      },
      {
        x,
        y: y - 1,
      },
      {
        x: x - 1,
        y,
      },
      {
        x,
        y: y + 1,
      },
    ]
    coords = coords.filter((coord: Coord) => this.validate(coord))
    return coords
  }

  /** Check coord */
  validate(coord: Coord): boolean {
    return coord.x >= 0 && coord.x < this.width && coord.y >= 0 && coord.y < this.height
  }

  /**
   * Resets all gridList cells back to the
   * start value.
   */
  reset(): void {
    this.currentTick = 0
    this.cellsAlive = 0
    this.cellsCreated = 0
    this.grid.forEach((col) => {
      col.forEach((cell) => {
        cell.alive = false
      })
    })
    this.updateRisk()
  }

  /** Create default cell */
  createDefaultCell() {
    if (this.alives.length === 0) {
      this.toggleCell({
        x: Math.floor(this.width / 2),
        y: Math.floor(this.height / 2),
        alive: true,
        risk: 0,
      })
    }
  }

  /**
   * Populates and overwrites gridList with cells.
   */
  randomSeed() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const rand = Math.random()
        if (rand < 0.1) {
          this.grid[x][y] = { x, y, alive: true, risk: 0 }
        } else {
          this.grid[x][y] = { x, y, alive: false, risk: 0 }
        }
      }
    }
    this.updateRisk()
  }

  /**
   * Resets and then imports new cells into the gridList
   * based on the importToken prop that gets passed down
   * App.vue.
   * The importToken is a string and its syntax looks
   * like this:
   * '[xPos,yPos],[xPos,yPos]...'.
   */
  importSession(): void {
    this.reset()
    const regex = /\[\d+,\d+\]/gm
    const tempArr = this.importToken.match(regex)
    if (tempArr) {
      tempArr.forEach((element) => {
        element = element.substring(1, element.length - 1)
        const xy = element.split(',')
        const x = parseInt(xy[0])
        const y = parseInt(xy[1])
        if (this.validate({ x, y })) {
          const cell: CellI = { x: parseInt(xy[0]), y: parseInt(xy[1]), alive: true, risk: 0 }
          this.grid[cell.x][cell.y] = cell
        }
      })
    }
    this.updateRisk()
  }

  /**
   * Uses gridList to create an exportToken and
   * emits it up to App.vue for the user to copy.
   * Same format as in importToken().
   */
  exportSession() {
    let exportToken = ''
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        if (this.grid[i][j].alive) {
          exportToken += '[' + i + ',' + j + ']'
        }
      }
    }
    this.$emit('exportToken', exportToken)
  }

  /**
   * Updates the current cellcount on each new tick.
   *
   * @param {boolean} bool - boolean based on cell isAlive status
   */
  updateCellCount(bool: boolean): void {
    if (bool) {
      this.cellsAlive++
      this.cellsCreated++
    } else {
      this.cellsAlive--
    }
  }

  /**
   * Pick a random index of an array according to weights.
   * @param weights An array of weights. By default they should sum up to 1.
   * @param normalize If to normalize array.
   * @returns A number [0, ..., weights.length -1].
   */
  weightedRandomFate(): CellI {
    // Random scaled value
    const risks = this.risks()
    let rand = Math.random()
    rand *= risks.reduce((acc, cell): number => acc + cell.risk, 0)
    // Fate selection
    let sum = 0
    for (let i = 0; i < risks.length; i += 1) {
      sum += risks[i].risk
      if (sum > rand) {
        return risks[i]
      }
    }
    return risks[0]
    // throw new Error('Fate Problems...')
  }
}
</script>

<style lang="scss" scoped>
.game-grid {
  // border-top: 1px solid lightgrey;
  // border-left: 1px solid lightgrey;
  background-color: black;
  display: flex;
  flex: 0.8;
  justify-content: center;
}
.game-column {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 0;
  margin: 0 auto;
  flex-direction: column;
}
</style>
