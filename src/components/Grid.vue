<template>
  <div>
    <!-- GRID -->
    <div
      class="game-grid columns"
      @mousedown="isMouseDown = true"
      @mouseup="isMouseDown = false"
      @mouseleave="isMouseDown = false"
    >
      <div v-for="(col, indexX) in gridList" :key="indexX" class="game-column">
        <cell
          v-for="(cell, indexY) in col"
          :key="indexY"
          :cell="cell"
          @toggleCell="toggleCell(cell)"
        />
      </div>
    </div>

    <!-- SIDEBAR -->
    <stats
      class="stats"
      :current-tick="currentTick"
      :cell-count="cellCount"
      :cells-alive="cellsAlive"
      :cells-created="cellsCreated"
      :current-speed="currentSpeed"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { CellI } from '@/engine/interfaces'
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

  width = 4
  height = 3
  gridList: CellI[][] = []
  // Stats that get passed down to the app-stats component
  currentTick = 0
  cellCount = 0
  cellsAlive = 0
  cellsCreated = 0
  // A prop that gets used by the app-cell component (drag)
  isMouseDown = false

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
    this.cellCalc()
  }

  /**
   * Creates a 2D-Array during runtime for
   * the website to use for most operations.
   */
  cellCalc(): void {
    for (let x = 0; x < this.width; x++) {
      this.gridList[x] = []
      for (let y = 0; y < this.height; y++) {
        const cell: CellI = { x, y, alive: false, risk: 0 }
        this.gridList[x][y] = cell
      }
    }
    this.cellCount = this.width * this.height
  }

  /**
   * Changes the 'isAlive' object property
   * of a specific cell to the one requested
   * in the param.
   *
   * @param {number} x - the x position
   * @param {number} y - the y position
   * @param {boolean} bool - the new boolean
   */
  setCell(cell: CellI): void {
    console.log(`Set cell: ${JSON.stringify(cell)}`)
    this.gridList[cell.x][cell.y] = cell
  }

  toggleCell(cell: CellI): void {
    this.gridList[cell.x][cell.y].alive = cell.alive
    this.update()
  }

  /**
   * The main function that updates the grid
   * every tick based on the game of life rules.
   */
  update(): void {
    // Update neighbours count
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const status = this.gridList[x][y].alive
        const neighbours = this.getNeighbours(x, y)
        this.setCell({ x, y, alive: status, risk: neighbours })
      }
    }
    // Get a weighted random int for fate
    // const fateCell = this.weightedRandomFate()
    // this.setCell(fateCell)
  }

  /**
   * Returns the amount of neighbours for
   * a specific cell on the grid.
   *
   * @param {number} posX - the x position
   * @param {number} posY - the Y position
   * @return {number} neighbours - amount of neighbours
   */
  getNeighbours(posX: number, posY: number): number {
    let neighbours = 0
    if (posX <= this.width && posY <= this.height) {
      for (let offsetX = -1; offsetX < 2; offsetX++) {
        for (let offsetY = -1; offsetY < 2; offsetY++) {
          const newX = posX + offsetX
          const newY = posY + offsetY
          // check if offset is:
          // on current cell, out of bounds and if isAlive
          // for cell true
          if (
            (offsetX != 0 || offsetY != 0) &&
            newX >= 0 &&
            newX < this.width &&
            newY >= 0 &&
            newY < this.height &&
            this.gridList[posX + offsetX][posY + offsetY].alive == true
          ) {
            neighbours++
          }
        }
      }
    }
    return neighbours
  }

  /**
   * Resets all gridList cells back to the
   * start value.
   */
  reset(): void {
    this.currentTick = 0
    this.cellsAlive = 0
    this.cellsCreated = 0
    this.gridList.forEach((col) => {
      col.forEach((cell) => {
        cell.alive = false
      })
    })
  }

  /**
   * Populates and overwrites gridList with cells.
   */
  randomSeed() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const rand = Math.random()
        if (rand < 0.2) {
          this.setCell({ x, y, alive: true, risk: 0 })
        } else {
          this.setCell({ x, y, alive: false, risk: 0 })
        }
      }
    }
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
        const cell: CellI = { x: parseInt(xy[0]), y: parseInt(xy[1]), alive: true, risk: 0 }
        this.setCell(cell)
      })
    }
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
        if (this.gridList[i][j].alive) {
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
    const filtered = this.gridList.flat().filter((cell: CellI) => {
      return !cell.alive && cell.risk > 0
    })

    let rand = Math.random()
    rand *= filtered.reduce((acc, cell): number => acc + cell.risk, 0)

    let sum = 0
    for (let i = 0; i < filtered.length; i += 1) {
      sum += filtered[i].risk
      if (sum > rand) {
        return filtered[i]
      }
    }
    throw new Error('Fate Problems...')
  }
}
</script>

<style lang="scss">
.game-grid {
  border-top: 1px solid lightgrey;
  border-left: 1px solid lightgrey;
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
