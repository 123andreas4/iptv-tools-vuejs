<template>
  <div class="card" :class="{ 'h-100': fullHeight }">
    <erd-card-body v-if="hasBodySlot">
      <erd-card-title v-if="hasTitle">{{ title }}</erd-card-title>
      <slot name="body"></slot>
    </erd-card-body>
    <slot></slot>
  </div>
</template>

<script>
/* eslint-disable */
import erdCardBody from './ERDCardBody';
import erdCardTitle from './ERDCardTitle';

export default {
  components: {
  	erdCardBody,
    erdCardTitle
  },
  props: {
    title: {
      type: String,
      default: undefined
    },
    fullHeight: {
      type: Boolean,
      default: false
    }
  },
  computed: {
  	hasBodySlot () {
      return !!this.$slots['body']
    },
    hasTitle () {
      return this.title && this.title.length > 0;
    }
  }
};
</script>