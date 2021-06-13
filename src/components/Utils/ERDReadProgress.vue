<template>
  <div class="erd-read-progress-container">
    <span
      class="erd-read-progress-bar"
      :class="variant"
      :style="{ width: progress + '%' }"
    ></span>
  </div>
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      default: "primary",
    },
  },
  data() {
    return {
      progress: 0,
    };
  },
  created() {
    if (process.browser) {
      window.addEventListener("scroll", this.updateReadProgress);
    }
  },
  beforeDestroy() {
    if (process.browser) {
      window.removeEventListener("scroll", this.updateReadProgress);
    }
  },
  methods: {
    updateReadProgress() {
      if (process.browser) {
        this.progress = this.currentScrollPosition(window.scrollY);
      }
    },
    currentScrollPosition(position) {
      if (process.browser) {
        return (
          (position /
            (document.body.clientHeight -
              document.documentElement.clientHeight)) *
          100
        );
      } else {
        return 0;
      }
    },
  },
};
</script>

<style>
.erd-read-progress {
}
</style>
