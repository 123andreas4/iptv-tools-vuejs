<template>
  <div class="erd-collapse">
    <template v-if="!small">
      <h5 :class="{ header: true, open: isOpen }" @click="isOpen = !isOpen">
        {{ title }} <i class="las la-angle-down"></i>
        <span class="float-right mr-2 mt-1 text-small text-muted text-capitalize" v-if="subtitle">
          {{ subtitle }}
        </span>
      </h5>
    </template>
    <template v-else>
      <p
        :class="{ header: true, open: isOpen, gray: gray }"
        @click="isOpen = !isOpen"
      >
        {{ title }} <i class="las la-angle-down"></i>
      </p>
    </template>
    <div class="content" :id="id" :style="contentStyle">
      <slot name="default"></slot>
    </div>
  </div>
</template>

<script>
import { randomId } from "../plugins/utilities";

export default {
  data() {
    return {
      isOpen: this.open,
    };
  },
  props: {
    id: {
      type: [String, Number],
      default: () => randomId(),
    },
    title: {
      type: [String, Number],
      default: "",
    },
    subtitle: {
      type: [String, Number],
      default: "",
    },
    open: {
      type: Boolean,
      default: false,
    },
    gray: {
      type: Boolean,
      default: true,
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    contentStyle() {
      return this.isOpen
        ? `maxHeight: ${document.getElementById(this.id).scrollHeight}px`
        : "";
    },
  },
  mounted() {
    let vw = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );
    this.isOpen = !this.small ? (vw > 768 ? true : false) : false;
  },
};
</script>

<style lang="scss" scoped>
.erd-collapse {
  width: 100%;
  margin-bottom: 1rem;

  p.header {
    font-size: 0.8rem;
    transition: color 0.3s;
    cursor: pointer;
    margin-top: 0;
    margin-bottom: 0;
    border-bottom: 1px solid $separator-color-light;
    padding-bottom: 4px;

    &.gray {
      color: $muted-color;
    }

    i {
      margin-right: 0.25rem;
      float: right;
      -webkit-transition: transform 0.3s;
      transition: transform 0.3s;
    }

    &:hover {
      color: $theme-color-1;
    }

    &.open {
      i {
        transform: rotate(-180deg);
      }
    }
  }

  h5.header {
    transition: color 0.3s;
    cursor: pointer;
    margin-top: 0;
    margin-bottom: 0;
    border-bottom: 1px solid $separator-color;
    padding-bottom: 4px;

    i {
      margin-right: 0.25rem;
      float: right;
      -webkit-transition: transform 0.3s;
      transition: transform 0.3s;
    }

    &:hover {
      color: $theme-color-1;
    }

    &.open {
      i {
        transform: rotate(-180deg);
      }
    }
  }

  .content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.2s ease-out;
  }
}

@media print {
  .erd-collapse {
    h5 {
      font-size: 24px;

      i {
        display: none;
      }
    }
  }

  .content {
    max-height: none !important;
  }
}
</style>
