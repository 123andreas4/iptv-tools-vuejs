<template>
  <div class="erd-tooltip">
    <transition name="fade">
      <span
        class="erd-tooltip-text"
        :class="{ 'no-line-break': !hasTooltipSlot, bottom: bottom }"
        v-if="isVisible"
      >
        <slot name="tooltip" v-if="hasTooltipSlot"></slot>
        <template v-else>{{ tooltip }}</template>
      </span>
    </transition>
    <div
      class="erd-tooltip-container"
      @mouseover="mouseover"
      @mouseleave="mouseleave"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    enabled: {
      type: Boolean,
      default: true
    },
    tooltip: {
      type: String,
      default: ''
    },
    hover: {
      type: Boolean,
      default: true
    },
    bottom: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: false
    }
  },
  computed: {
  	hasTooltipSlot () {
      return !!this.$slots['tooltip']
    },
    isVisible () {
      return this.show ? this.show : this.hover ? this.visible : false;
    }
  },
  methods: {
    mouseover () {
      this.visible = this.enabled;
    },
    mouseleave () {
      this.visible = false;
    }
  }
};
</script>