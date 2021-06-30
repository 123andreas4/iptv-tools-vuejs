<template>
  <span>
    <h1 v-if="heading.length > 0">{{ heading }}</h1>
    <ul class="breadcrumb-container pt-0 d-inline-block">
      <ol class="breadcrumb ml-2 ml-md-none">
        <li
          class="breadcrumb-item"
          v-for="(item, index) in items"
          :key="`breadcrumb-item-${index}`"
          :class="{ active: index === items.length - 1 }"
        >
          <router-link :to="item.to" v-if="index < items.length - 1">{{
            item.text
          }}</router-link>
          <span v-else>{{ item.text }}</span>
        </li>
      </ol>
    </ul>
    <div class="d-inline-block float-right mt-2 mt-md-4 pt-md-2">
      <slot></slot>
    </div>
  </span>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => {
        return [];
      },
    },
    heading: {
      type: String,
      default: "",
    },
  },
};
</script>
