<template>
  <ul class="dropdown-menu" v-if="visible" role="menu">
    <li
      v-for="(item, index) in items"
      :key="`item-${index}`"
      @click.stop="close"
    >
      <a class="dropdown-item" href="#" @click.prevent="itemClick(index)"
        ><i class="las" :class="item.icon"></i>{{ item.text }}</a
      >
    </li>
  </ul>
</template>

<script>
import { createBodyClickListener } from "./../../helpers";

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      visible: false,
      bodyClickListener: createBodyClickListener((e) => {
        let isOpen = !!this.visible;
        let outsideClick = isOpen && !this.$el.contains(e.target);

        if (outsideClick) {
          if (e.which !== 1) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          } else {
            this.visible = false;
            this.$emit("cancel", this.locals);
            e.stopPropagation();
          }
        } else {
          this.visible = false;
          this.$emit("close", this.locals);
        }
      }),
    };
  },
  methods: {
    close() {
      this.visible = false;
    },
    itemClick(index) {
      this.$emit("item-click", index);
    },
  },
  mounted() {
    this.visible = this.show;
  },
};
</script>
