<template>
  <textarea
    class="form-control"
    :value="value"
    @input="updateValue($event.target.value)"
    :spellcheck="spellCheck"
    :rows="rows"
    :cols="cols"
    :disabled="disabled"
    :placeholder="placeholder"
    :style="textareaStyle"
    :readonly="readonly"
  ></textarea>
</template>

<script>
export default {
  props: {
    inputClass: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
    spellCheck: {
      type: Boolean,
      default: true,
    },
    rows: {
      type: [String, Number],
      default: 5,
    },
    cols: {
      type: [String, Number],
      default: 50,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "",
    },
    noResize: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    updateValue(value) {
      this.$emit("input", value);
    },
  },
  computed: {
    textareaStyle() {
      return this.noResize ? "resize: none;" : "";
    },
  },
};
</script>

<style>
.textarea {
}
</style>
