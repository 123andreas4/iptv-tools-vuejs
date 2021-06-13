<template>
  <div class="erd-progress-bar">
    <div
      class="progress"
      v-if="text.length"
      :class="variant"
      :style="{ width: `${progress}%` }"
    >
      {{ progress }}% {{ text }}
    </div>
    <div
      class="progress"
      v-else
      :class="variant"
      :style="{ width: `${progress}%` }"
    >
      {{ progress }}%
    </div>
  </div>
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      default: "primary",
    },
    value: {
      type: Number,
      default: 0,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    text: {
      type: String,
      default: "",
    },
  },
  computed: {
    progressTotal() {
      return this.max - this.min;
    },
    progress() {
      return (this.value * 100) / this.progressTotal;
    },
  },
};
</script>

<style>
.erd-progress-bar {
}
</style>
