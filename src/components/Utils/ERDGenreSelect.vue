<template>
  <ul class="erd-genre-select">
    <li
      v-for="genre in genres"
      :key="`genre-${genre.id}`"
      :class="genreClass(genre)"
      @click="selectGenre(genre)"
    >
      <img
        :src="require(`@/assets/genres/${genre.id}.png`)"
        :alt="genre.name"
      />
      <h6>{{ genre.name }}</h6>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    genres: Array,
    hidden: Number,
  },
  model: {
    prop: "hidden",
    event: "click",
  },
  data() {
    return {
      index: this.hidden,
    };
  },
  methods: {
    genreClass(genre) {
      return this.index === genre.id ? "active" : "";
    },
    selectGenre(genre) {
      this.index = genre.id;
      this.$emit("click", genre.id);
    },
  },
};
</script>
