<template>
  <ul role="tablist" class="nav nav-tabs separator-tabs mt-0 ml-0 mb-1">
    <li
      role="presentation"
      class="nav-item"
      v-for="(tab, index) in tabs"
      :key="`tab-${index}`"
    >
      <a
        role="tab"
        :aria-selected="index == activeTabIndex"
        target="_self"
        href="#"
        class="nav-link"
        :class="{ active: index === activeTabIndex }"
        @click.prevent="changeTab(index)"
        >{{ tab }}</a
      >
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      activeTabIndex: this.modelValue,
    };
  },
  model: {
    prop: "modelValue",
    event: "change",
  },
  props: {
    tabs: {
      type: Array,
    },
    modelValue: {
      default: 0,
    },
  },
  methods: {
    changeTab(index) {
      this.activeTabIndex = index;
      this.$emit("change", index);
    },
  },
};
</script>

<style lang="scss" scoped>
.erd-tab {
}
</style>
