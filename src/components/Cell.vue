<template>
  <div :class="computeClass" @click="toggleCell" @mouseover="hoveredCell" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { CellI } from '@/engine/interfaces'

@Component
export default class Board extends Vue {
  @Prop() cell!: CellI

  alive = this.cell.alive

  /**
   * Checks if the cell has been clicked
   * and switches its isAlive status.
   */
  toggleCell(): void {
    this.alive = !this.alive
    this.$emit('toggleCell', this.cell)
  }

  /**
   * Display cell informations
   */
  hoveredCell(): void {
    this.$emit('hoveredCell', this.cell)
  }

  /**
   * Compute cell class
   */
  get computeClass(): string {
    let result = 'cell '
    if (this.cell.alive) {
      result += 'alive '
    } else {
      result += `risk${this.cell.risk}`
    }
    return result
  }
}
</script>

<style lang="scss" scoped>
// https://www.color-hex.com/color-palette/88079
$risk1: #fbc316;
$risk2: #ff9a00;
$risk3: #ff7400;
$risk4: #ff5a00;
$alive: #ff0d00;
.cell {
  flex: 1;
  padding-bottom: 100%;
  // border-right: 1px solid lightgrey;
  // border-bottom: 1px solid lightgrey;
  &:hover {
    background-color: lighten($alive, 25) !important;
  }
}
.alive {
  background-color: $alive !important;
}
.risk4 {
  background-color: $risk4;
}
.risk3 {
  background-color: $risk3;
}
.risk2 {
  background-color: $risk2;
}
.risk1 {
  background-color: $risk1;
}
</style>
