<template>
  <div
    role="info-box"
    aria-live="polite"
    aria-atomic="true"
    class="ng-info-box"
    :class="infoBoxClass"
    v-if="showing"
  >
    <i class="icon las" :class="icon"></i>
    <div class="info-body">
      <h5 class="title">{{ title }}</h5>
      <p class="text"><slot></slot></p>
    </div>
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
    show: {
      type: Boolean,
      default: false,
    },
    variant: {
      type: String,
      default: "primary",
    },
    icon: {
      type: String,
      default: "la-info-circle",
    },
    title: {
      type: String,
      default: "",
    },
    depth: {
      type: String,
      default: "1",
    },
    alt: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    infoBoxClass() {
      return `${this.variant} depth-${this.depth} ${this.alt ? "alt" : ""}`;
    },
  },
};
</script>

<style lang="scss">
.depth-1 {
  @include depth(1);
}

.depth-2 {
  @include depth(2);
}

.depth-3 {
  @include depth(3);
}

.depth-4 {
  @include depth(4);
}

.depth-5 {
  @include depth(5);
}
</style>
