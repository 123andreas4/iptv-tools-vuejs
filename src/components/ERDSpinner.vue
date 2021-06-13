<template>
  <div>
    <template v-if="overlay">
      <transition name="fade">
        <div class="erd-spinner-overlay">
          <div class="absolute">
            <div
              class="erd-spinner"
              :class="variant"
              :style="spinnerStyle"
            ></div>
            <div
              class="erd-spinner-text"
              :style="textStyle"
              v-if="text.length > 0"
            >
              {{ text }}
            </div>
          </div>
        </div>
      </transition>
    </template>
    <template v-else>
      <div :class="{ absolute: absolute }">
        <div class="erd-spinner" :class="variant" :style="spinnerStyle"></div>
        <div class="erd-spinner-text" :style="textStyle" v-if="text.length > 0">
          {{ text }}
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: "md",
    },
    speed: {
      type: Number,
      default: 0.8,
    },
    text: {
      type: String,
      default: "",
    },
    variant: {
      type: String,
      default: "primary",
    },
    absolute: {
      type: Boolean,
      default: false,
    },
    overlay: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    isNumber(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    },
  },
  computed: {
    size_px() {
      switch (this.size) {
        case "xs":
          return 12;
        case "sm":
          return 16;
        case "md":
          return 32;
        case "lg":
          return 48;
        case "xl":
          return 64;
        case "xxl":
          return 96;
      }

      return this.isNumber(this.size) ? this.size : 32;
    },
    line_size_px() {
      switch (this.size) {
        case "xs":
          return 1;
        case "sm":
          return 2;
        case "md":
          return 3;
        case "lg":
          return 3;
        case "xl":
          return 4;
        case "xxl":
          return 4;
      }

      return this.isNumber(this.lineSize) ? this.lineSize : 4;
    },
    text_margin_top() {
      return Math.min(Math.max(Math.ceil(this.size_px / 8), 3), 12);
    },
    text_font_size() {
      return Math.min(Math.max(Math.ceil(this.size_px * 0.4), 11), 32);
    },
    spinnerStyle() {
      return {
        border: `${this.line_size_px}px solid #eee`,
        "border-top": `${this.line_size_px}px solid #6cc24a`,
        width: `${this.size_px}px`,
        height: `${this.size_px}px`,
        animation: `erd-spinner-spin ${this.speed}s linear infinite`,
      };
    },
    textStyle() {
      return {
        "margin-top": `${this.text_margin_top}px`,
        "font-size": `${this.text_font_size}px`,
      };
    },
  },
  mounted() {
    if (this.overlay) {
      document.body.classList.add("hide-scroll");
    }
  },
  destroyed() {
    if (this.overlay) {
      document.body.classList.remove("hide-scroll");
    }
  },
};
</script>
