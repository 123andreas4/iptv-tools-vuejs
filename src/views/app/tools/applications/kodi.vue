<template>
  <erd-row class="m-0 p-0"> </erd-row>
</template>

<script>
/* eslint-disable vue/no-side-effects-in-computed-properties */
/* eslint-disable no-unused-vars */
import { EventBus } from "../../../../services/ebus";
import { httpService } from "../../../../services/http";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      activeTab: 0,
      search: null,
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters(["currentUser", "settings"]),
    searchFiltered() {
      if (this.search === null) {
        return this.streams;
      } else {
        var re = new RegExp(this.search, "i");
        return this.streams.filter((stream) => {
          return (
            String(stream.stream_tvg_name).match(re) ||
            String(stream.stream_tvg_id).match(re) ||
            String(stream.stream_tvg_logo).match(re) ||
            String(stream.playlist).match(re) ||
            String(stream.group).match(re)
          );
        });
      }
    },
  },
  methods: {
    searchStream(search) {
      if (search.length === 0) {
        this.search = null;
      } else {
        this.search = search;
      }
    },
    printStreams() {
      document.getElementById("streams").print();
    },
    formatDate(date) {
      return new Date(date).toLocaleString(
        this.$t("date.locale"),
        this.dateOptions
      );
    },
    doTabChange(tab) {
      if (tab == 1) {
        this.loadStreams();
      }
      this.activeTab = tab;
    },
  },
  beforeMount() {
    document.body.classList.add("right-menu");
    EventBus.$on("search", this.searchStream);
    EventBus.$on("print", this.printStreams);
    EventBus.$on("tab-change", this.doTabChange);
  },
  beforeDestroy() {
    document.body.classList.remove("right-menu");
    EventBus.$off("search", this.searchStream);
    EventBus.$off("print", this.printStreams);
    EventBus.$off("tab-change", this.doTabChange);
  },
  watch: {},
};
</script>

<style lang="scss"></style>
