<template>
  <div
    class="side-bar-menu d-print-none"
    :class="{ 'sub-menu-hidden': !subMenu || !menu, 'menu-hidden': !menu }"
  >
    <div class="main-menu">
      <perfect-scrollbar
        class="scroll"
        :settings="{ suppressScrollX: true, wheelPropagation: false }"
      >
        <ul>
          <li
            v-for="(item, index) in items"
            :key="`menu-item-${index}`"
            :class="{ active: index === active }"
            @click="setActive(index)"
          >
            <router-link :to="item.route"
              ><i :class="item.icon"></i>{{ item.title }}</router-link
            >
          </li>
        </ul>
      </perfect-scrollbar>
    </div>
    <div class="sub-menu">
      <perfect-scrollbar
        class="scroll"
        :settings="{ suppressScrollX: true, wheelPropagation: false }"
      >
        <slot></slot>
      </perfect-scrollbar>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters, mapActions } from 'vuex';

export default {
  props: {
    items: {
      type: Array,
      default: []
    },
    active: {
      type: Number,
      default: 0
    }
  },
  model: {
    prop: 'active',
    event: 'blur'
  },
  computed: {
    ...mapGetters({
      subMenu : 'subMenu',
      menu    : 'menu'
    }),
  },
  methods: {
    setActive (index) {
      this.$emit('blur', index);
    }
  }
};
</script>

<style>
.side-bar-menu{}
</style>