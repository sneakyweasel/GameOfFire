<template>
  <g class="dots">
    <g v-for="(row, y) in rows + 1" :key="y">
      <g v-for="(column, x) in cols + 1" :key="x">
        <circle :cx="x * tileSize" :cy="y * tileSize" r="5" fill="#edeaf4" />
      </g>
    </g>
  </g>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class HelloWorld extends Vue {
  @Prop() rows!: number
  @Prop() cols!: number
  @Prop() tileSize!: number
}
</script>

<style lang="scss" scoped>
.dots {
  width: 100%;
  height: 100%;
}
</style>
