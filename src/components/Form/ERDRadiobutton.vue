<template>
  <label class="erd-radiobutton" :class="{ disabled: disabled }">
    <slot></slot>
    <input
      class="checkbox"
      type="radio"
      :checked="isChecked"
      :value="value"
      @change="$emit('change', $event.target.value)"
      :disabled="disabled"
    />
    <span class="checkmark"></span>
  </label>
</template>

<script>
export default {
  model: {
    prop: "modelValue",
    event: "change",
  },
  props: {
    modelValue: {
      default: "",
    },
    value: {
      type: [String, Number, Boolean],
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isChecked() {
      return this.modelValue == this.value;
    },
  },
};
</script>

<style>
.erd-radiobutton {
}
</style>
