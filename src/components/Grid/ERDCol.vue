<template>
  <div class="col" :class="classes">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: [
    "col",
    "sm",
    "md",
    "lg",
    "xl",
    "xxl",
    "offset-sm",
    "offset-md",
    "offset-lg",
    "offset-xl",
    "offset-xxl",
    "offset",
    "order",
    "align-self",
    "flex",
    "center",
  ],
  data() {
    return {
      classes: {},
    };
  },
  mounted() {
    let cols = {};
    let customClass = {};

    if (this.col === undefined) {
      customClass = {
        "col-12": true,
      };
    }

    for (var p in this.$props) {
      if (this.$props[p]) {
        if (p === "cols") {
          customClass = { ...customClass, ["col-" + this.$props[p]]: true };
        } else if (p === "sm") {
          customClass = { ...customClass, ["col-sm-" + this.$props[p]]: true };
        } else if (p === "md") {
          customClass = { ...customClass, ["col-md-" + this.$props[p]]: true };
        } else if (p === "lg") {
          customClass = { ...customClass, ["col-lg-" + this.$props[p]]: true };
        } else if (p === "xl") {
          customClass = { ...customClass, ["col-xl-" + this.$props[p]]: true };
        } else if (p === "xxl") {
          customClass = { ...customClass, ["col-xxl-" + this.$props[p]]: true };
        } else if (p === "offset") {
          customClass = { ...customClass, ["offset-" + this.$props[p]]: true };
        } else if (p === "offsetSm") {
          customClass = {
            ...customClass,
            ["offset-sm-" + this.$props[p]]: true,
          };
        } else if (p === "offsetMd") {
          customClass = {
            ...customClass,
            ["offset-md-" + this.$props[p]]: true,
          };
        } else if (p === "offsetLg") {
          customClass = {
            ...customClass,
            ["offset-lg-" + this.$props[p]]: true,
          };
        } else if (p === "offsetXl") {
          customClass = {
            ...customClass,
            ["offset-xl-" + this.$props[p]]: true,
          };
        } else if (p === "offsetXxl") {
          customClass = {
            ...customClass,
            ["offset-xxl-" + this.$props[p]]: true,
          };
        } else if (p === "order") {
          customClass = { ...customClass, ["order-" + this.$props[p]]: true };
        } else if (p === "alignSelf") {
          customClass = {
            ...customClass,
            ["align-self-" + this.$props[p]]: true,
          };
        } else {
          cols = { ...cols, [p]: this.$props[p] };
        }
      }
    }

    if (this.flex !== undefined) {
      customClass = { ...customClass, ["d-flex"]: true };
    }
    if (this.center !== undefined) {
      customClass = { ...customClass, ["justify-content-center"]: true };
    }

    this.classes = { ...customClass };
  },
};
</script>
