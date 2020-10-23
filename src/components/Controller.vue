<template>
  <div class="box">
    <div class="field has-addons has-addons-centered is-marginless">
      <p class="control">
        <input class="num" type="number" v-model="num1" placeholder="1" @change="updateValues">
        <input class="num" type="number" v-model="num2" placeholder="2" @change="updateValues">
        <input class="num" type="number" v-model="num3" placeholder="3" @change="updateValues">
        <input class="num" type="number" v-model="num4" placeholder="4" @change="updateValues">
      </p>
      <p class="control">
        <button
          :disabled="mainComponent !== 'gamePage'"
          class="button"
          title="slow down"
          @click="send('slowDown')"
        >
          <i class="fas fa-backward" />
        </button>
      </p>
      <p class="control">
        <button
          :disabled="mainComponent !== 'gamePage'"
          :class="isRunning ? 'green' : 'red'"
          class="button"
          title="play"
          @click="send('play')"
        >
          <font-awesome-icon v-show="isRunning" :icon="['fas', 'stop']"></font-awesome-icon>
          <font-awesome-icon v-show="!isRunning" :icon="['fas', 'play']"></font-awesome-icon>
        </button>
      </p>
      <p class="control">
        <button
          :disabled="mainComponent !== 'gamePage'"
          class="button"
          title="clear grid"
          @click="send('redoSession')"
        >
          <i class="fas fa-redo" />
        </button>
      </p>
      <p class="control">
        <button
          :disabled="mainComponent !== 'gamePage'"
          class="button"
          title="next step"
          @click="send('nextStep')"
        >
          <i class="fas fa-step-forward" />
        </button>
      </p>
      <p class="control">
        <button
          :disabled="mainComponent !== 'gamePage'"
          class="button"
          title="speed up"
          @click="send('speedUp')"
        >
          <i class="fas fa-forward" />
        </button>
      </p>
      <p class="control">
        <button :disabled="mainComponent !== 'gamePage'" class="button" @click="send('randomSeed')">
          <span class="icon">
            <i class="fas fa-random" />
          </span>
          <b>Random</b>
        </button>
      </p>
      <p class="control">
        <button
          :disabled="mainComponent !== 'gamePage'"
          class="button"
          @click="send('importSession')"
        >
          <span class="icon">
            <i class="fa fa-upload" />
          </span>
          <b>Import</b>
        </button>
      </p>
      <p class="control">
        <button
          :disabled="mainComponent !== 'gamePage'"
          class="button"
          @click="send('exportSession')"
        >
          <span class="icon">
            <i class="fa fa-download" />
          </span>
          <b>Export</b>
        </button>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Controller extends Vue {
  @Prop() isRunning = false
  @Prop() mainComponent = 'gamePage'

  num1 = 1
  num2 = 2
  num3 = 3
  num4 = 4

  updateValues() {
    // console.log(`EMIT: ${[this.num1, this.num2, this.num3, this.num4]}`)
    this.$emit('update', [this.num1, this.num2, this.num3, this.num4])
  }

  /**
   * emits the action that is requested
   * by the client up to the App component.
   */
  send(event: string) {
    this.$emit('send', event)
  }
}
</script>

<style lang="scss" scoped>
.box {
  padding: 0;
}
.button {
  background-color: transparent;
  color: white;
}
.green {
  background-color: hsla(120, 77%, 26%, 0.6);
}
.red {
  background-color: hsla(0, 67%, 31%, 0.6);
}
.num {
  background-color: black;
  color: white;
  width: 40px;
  height: 36px;
  border: 1px solid white;
  text-align: center;
}
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
