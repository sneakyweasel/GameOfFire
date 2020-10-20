<template>
  <div class="box">
    <div class="columns is-fullwidth is-gapless">
      <div class="column is-size-7-mobile is-half-mobile">
        <strong>TIME: {{ currentTick }}</strong>
      </div>
      <div class="column is-size-7-mobile is-half-mobile">
        <strong>CELLS ALIVE: {{ cellsAlive }}</strong>
      </div>
      <div class="column is-size-7-mobile is-half-mobile">
        <strong>EDGES: {{ edges }}</strong>
      </div>
      <div class="column is-size-7-mobile is-half-mobile">
        <strong>HAIRYNESS: {{ hairyness.toFixed(3) }}</strong>
      </div>
      <div class="column is-size-7-mobile is-half-mobile">
        <strong>SPEED: {{ currentSpeed }} %</strong>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Board extends Vue {
  @Prop() currentTick!: number
  @Prop() cellCount!: number
  @Prop() cellsAlive!: number
  @Prop() cellsCreated!: number
  @Prop() currentSpeed!: number
  @Prop() hairyness!: number
  @Prop() edges!: number
}
</script>

<style scoped>
.box {
  background-color: #eee;
}
.columns {
  display: flex;
  flex-wrap: wrap;
}
.column {
  color: white;
  margin: 0;
}
</style>
