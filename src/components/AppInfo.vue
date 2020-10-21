<template>
  <div class="gameinfo">
    <h1 class="title">Game of Fire</h1>
    <h2 class="subtitle">
      Implementation of John Conway's quantamagazine third game. (<a
        href="https://www.quantamagazine.org/three-math-puzzles-inspired-by-john-horton-conway-20201015/"
        >Quanta Magazine article</a
      >)
    </h2>
    <hr />
    <div class="content">
      <h5 class="title is-5">About the game:</h5>
      <p>
        You have an infinite plane on which you place square tiles. One at a time, you add new tiles
        randomly such that each new tile shares at least one edge with a previously placed tile. The
        probability of a tile being placed in any given location is proportional to the number of
        edges of previously placed tiles that border that location.
      </p>

      <h5 class="title is-5">The rules:</h5>
      <p>
        We define the “hairiness” (H) or exteriority of any configuration as the number of exposed
        tile edges divided by the number of tiles.
        <br />
        The reciprocal of H may be called the interiority or compactness of the configuration.
      </p>
      <ul>
        <li>
          With one tile on the plane, H = 4 edges ÷ 1 tile = 4.
        </li>
        <li>
          For a ring of eight tiles, H = 16 edges ÷ 8 tiles = 2.
        </li>
        <li>
          For a row of eight tiles, H = 18 edges ÷ 8 tiles = 2.25.
        </li>
      </ul>

      <h5 class="title is-5">Questions</h5>
      <ol>
        <li>
          A new tile may be placed next to a single edge (touching only one tile), at a corner
          (touching two), inside a “U” (touching three) or inside a hole (touching all four). How
          does each placement affect the number of exposed edges in the new configuration?
        </li>
        <li>
          What are the minimum and maximum values of H, and what kinds of tile patterns do they
          correspond to? Can you come up with an approximate or exact formula for the maximum and
          minimum values of H as the number of tiles (n) increases?
        </li>
        <li>
          What’s the expected value of H (approximate or exact) for a given value of n?
        </li>
        <li>
          Find the smallest tiling that is “balanced,” such that the addition of the next tile is as
          likely to increase the number of exposed edges as it is to decrease it. Can you find a
          symmetrical configuration that has this property?
        </li>
        <li>
          Find the smallest tiling for which the expected value of H remains the same after you add
          one tile. What’s the next-smallest tiling for which this property is true?
        </li>
      </ol>
      <h5 class="title is-5">Thanks</h5>
      <p>
        This game is based on <a href="https://github.com/Ijee">ljee</a> game of life implementation
        refactored with typescript and code I wrote for
        <a href="https://quantumgame.io/">Quantum Game 2</a>.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class AppInfo extends Vue {}
</script>

<style lang="scss" scoped>
.subtitle {
  color: grey;
}
hr {
  border: 1px solid #000;
}
</style>
