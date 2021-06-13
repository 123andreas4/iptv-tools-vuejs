<template>
  <span
    class="badge text-nowrap"
    :class="[{ 'badge-pill': pill }, `badge-${variant}`]"
    ><slot></slot
  ></span>
</template>

<script>
export default {
  model: {
    prop: "modelValue",
    event: "change",
  },
  props: {
    variant: {
      type: String,
      default: "primary",
    },
    pill: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>
.erd-badge {
}
</style>
