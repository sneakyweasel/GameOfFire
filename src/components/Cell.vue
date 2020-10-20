<template>
  <div :class="cell.alive ? 'alive' : 'dead'" class="cell" @click="toggleCell" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { CellI } from '@/engine/interfaces'

@Component
export default class Board extends Vue {
  @Prop() cell!: CellI

  /**
   * Checks if the cell has been clicked
   * and switches its isAlive status.
   * Also emits to the grid component for the
   * drag and drop functionality.
   *
   * @param {boolean} bool - the isMouseDown boolean
   */
  toggleCell(): void {
    this.$emit('toggleCell', this.cell)
  }
}
</script>

<style>
.cell {
  flex: 1;
  border-right: 1px solid lightgrey;
  border-bottom: 1px solid lightgrey;
  padding-bottom: 100%;
}
.cell:hover {
  background-color: rgba(132, 26, 26, 0.6);
}
.alive {
  background-color: red !important;
}
</style>
