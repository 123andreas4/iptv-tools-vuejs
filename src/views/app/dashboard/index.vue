<template>
  <erd-row>
    <erd-breadcrumb :items="breadcrumb" :heading="heading">
      <div v-if="!viewer && showSource">
        <erd-radiobutton
          class="d-inline-block"
          value="xtream"
          v-model="source"
          >{{ $t("movies.xtream") }}</erd-radiobutton
        >
        <erd-radiobutton
          class="d-inline-block"
          value="m3u-url"
          v-model="source"
          >{{ $t("movies.m3u-url") }}</erd-radiobutton
        >
        <erd-radiobutton
          class="d-inline-block"
          value="m3u-file"
          v-model="source"
          >{{ $t("movies.m3u-file") }}</erd-radiobutton
        >
      </div>
      <erd-button
        class="mr-1 py-1 px-2"
        icon="la-angle-double-left"
        v-if="viewer"
        @click="closeViewer"
        >{{ $t("general.back") }}</erd-button
      >
    </erd-breadcrumb>
    <div class="seperator page"></div>
    <router-view class="px-0 mt-0"></router-view>
  </erd-row>
</template>

<script>
/* eslint-disable */
import { mapGetters } from "vuex";
import { EventBus } from "../../../services/ebus";
export default {
  data() {
    return {
      viewer: false,
      from: 0,
      to: 0,
      total: 0,
    };
  },
  computed: {
    breadcrumb () {
      let res = [];
      this.$route.matched.map(item => {
        res.push({
          text: this.$t(`menu.${item.name.toLowerCase()}`),
          to: item.path !== '' ? item.path : '/'
        })
      });
      return res;
    },
    heading () {
      let br = this.breadcrumb;
      return br[br.length -1].text;
    },
    source: {
      get: function () {
        return this.$store.state.sync.moviesSource;
      },
      set: function (val) {
        this.$store.commit("setMoviesSource", val);
      },
    },
    showSource() {
      return /\/movies\/.*/.test(this.$route.path) || /\/series\/.*/.test(this.$route.path);
    },
  },
  methods: {
    updateFrom(from) {
      this.from = from;
    },
    updateTo(to) {
      this.to = to;
    },
    updateTotal(total) {
      this.total = total;
    },
    updateViewer(view) {
      this.viewer = view;
    },
    closeViewer() {
      this.viewer = false;
      EventBus.$emit("close-viewer");
    },
    getSource() {
      EventBus.$emit("update-source", this.source);
    }
  },
  beforeMount() {
    EventBus.$on("update-from", this.updateFrom);
    EventBus.$on("update-to", this.updateTo);
    EventBus.$on("update-total", this.updateTotal);
    EventBus.$on("update-viewer", this.updateViewer);
  },
  beforeDestroy() {
    EventBus.$off("update-from", this.updateFrom);
    EventBus.$off("update-to", this.updateTo);
    EventBus.$off("update-total", this.updateTotal);
    EventBus.$off("update-viewer", this.updateViewer);
  },
  watch: {
    $route: function () {
      this.to = 0;
      this.from = 0;
      this.total = 0;
      this.viewer = false;
    },
  }
};
</script>

<style scoped>
.seperator.page {
  margin-left: 15px;
  margin-right: 15px;
  width: calc(100% - 30px);
}
</style>
