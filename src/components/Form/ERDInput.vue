<template>
  <input
    class="form-control"
    type="text"
    :value="value"
    @input="updateValue($event.target.value)"
    @change="onChange"
    :spellcheck="spellCheck"
    :disabled="disabled"
    :placeholder="placeholder"
  />
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: "",
    },
    spellCheck: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "",
    },
  },
  methods: {
    updateValue(value) {
      this.$emit("input", value);
    },
    onChange(event) {
      this.$emit("change", event);
    },
  },
};
</script>

<style>
.btn {
}
</style>
