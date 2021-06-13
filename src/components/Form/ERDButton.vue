<template>
  <button
    class="btn"
    :class="btnClass"
    @click="$emit('click')"
    :disabled="disabled"
  >
    <i class="las la-lg" :class="icon" v-if="icon"></i> <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    buttonClass: {
      type: String,
      default: "",
    },
    variant: {
      type: String,
      default: "primary",
    },
    icon: {
      type: String,
      default: "",
    },
    rounded: {
      type: Boolean,
      default: false,
    },
    block: {
      type: Boolean,
      default: false,
    },
    dense: {
      type: Boolean,
      default: false,
    },
    outline: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    btnClass() {
      return `${this.buttonClass} btn-${this.outline ? "outline-" : ""}${
        this.variant
      } ${this.rounded ? "rounded" : ""} ${this.block ? "btn-block" : ""} ${
        this.dense ? "dense" : ""
      }`;
    },
  },
};
</script>

<style>
.btn {
}
</style>
