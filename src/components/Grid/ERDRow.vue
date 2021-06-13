<template>
  <div class="row" :class="classes">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ["cols", "sm", "md", "lg", "xl", "xxl", "p", "m"],
  data() {
    return {
      classes: {},
    };
  },
  mounted() {
    let customClass = {};

    for (var p in this.$props) {
      if (this.$props[p]) {
        if (p === "cols") {
          customClass = {
            ...customClass,
            ["row-cols-" + this.$props[p]]: true,
          };
        } else if (p === "sm") {
          customClass = {
            ...customClass,
            ["row-cols-sm-" + this.$props[p]]: true,
          };
        } else if (p === "md") {
          customClass = {
            ...customClass,
            ["row-cols-md-" + this.$props[p]]: true,
          };
        } else if (p === "lg") {
          customClass = {
            ...customClass,
            ["row-cols-lg-" + this.$props[p]]: true,
          };
        } else if (p === "xl") {
          customClass = {
            ...customClass,
            ["row-cols-xl-" + this.$props[p]]: true,
          };
        } else if (p === "xxl") {
          customClass = {
            ...customClass,
            ["row-cols-xxl-" + this.$props[p]]: true,
          };
        } else if (p === "p") {
          customClass = { ...customClass, ["p-" + this.$props[p]]: true };
        } else if (p === "m") {
          customClass = { ...customClass, ["m-" + this.$props[p]]: true };
        }
      }
    }
    this.classes = { ...customClass };
  },
};
</script>
