<template>
  <div
    role="alert"
    aria-live="polite"
    aria-atomic="true"
    :class="alertClass"
    v-if="showing"
  >
    <button
      type="button"
      aria-label="Close"
      class="close"
      v-if="dismissible"
      @click="hideAlert"
    >
      ×
    </button>
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showing: this.show,
    };
  },
  props: {
    dismissible: {
      type: Boolean,
      default: false,
    },
    show: {
      type: Boolean,
      default: false,
    },
    variant: {
      type: String,
      default: "primary",
    },
  },
  computed: {
    alertClass() {
      return `erd-alert ${this.dismissible ? "alert-dismissible" : ""} alert-${
        this.variant
      }`;
    },
  },
  methods: {
    hideAlert() {
      this.showing = false;
      this.$emit("show", this.showing);
    },
  },
};
</script>

<style>
.erd-alert {
}
</style>
