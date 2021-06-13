<template>
  <div class="erd-toggle-container">
    <label :class="toggleClass">
      <input
        type="checkbox"
        :disabled="disabled"
        @change="trigger"
        :checked="value"
      />
      <div></div>
    </label>
    <span class="label"><slot></slot></span>
  </div>
</template>

<script>
export default {
  props: {
    bold: {
      type: Boolean,
      default: false,
    },
    value: {
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    variant: {
      type: String,
      default: "primary",
    },
  },
  mounted() {
    this.$emit("input", this.value);
  },
  methods: {
    trigger(e) {
      this.$emit("input", e.target.checked);
    },
  },
  computed: {
    toggleClass() {
      return {
        "erd-toggle": true,
        bold: this.bold,
        disabled: this.disabled,
        unchecked: !this.value,
        [`${this.variant}`]: this.variant,
      };
    },
  },
};
</script>
