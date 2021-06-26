<template>
  <erd-row>
    <erd-breadcrumb :items="breadcrumb" :heading="heading">
      <erd-button class="float-right" icon="la-angle-left" v-if="viewer" @click="doBack" >{{ $t("general.back") }}</erd-button>
      <span class="text-muted" v-if="!viewer">{{
        $t("general.from-to-total").format(
          this.total > 0 ? this.from + 1 : this.from,
          this.to,
          this.total
        )
      }}</span>
    </erd-breadcrumb>
    <div class="seperator page"></div>
    <router-view class="px-0 mt-0"></router-view>
  </erd-row>
</template>

<script>
/* eslint-disable no-unused-vars */
import { EventBus } from "../../../services/ebus";
import { mapActions } from "vuex";
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
    breadcrumb() {
      let res = [];
      this.$route.matched.map((item) => {
        res.push({
          text: this.$t(`menu.${item.name.toLowerCase()}`),
          to: item.path !== "" ? item.path : "/",
        });
      });
      return res;
    },
    heading() {
      let br = this.breadcrumb;
      return br[br.length - 1].text;
    },
  },
  methods: {
    ...mapActions(["loadxdProInstances", "loadMovieSeriePlaylists"]),
    doBack() {
      EventBus.$emit("close-viewer");
    },
    updateFrom(from) {
      this.from = from;
    },
    updateTo(to) {
      this.to = to;
    },
    updateTotal(total) {
      this.total = total;
    },
    updateViewer(viewer) {
      this.viewer = viewer;
    }
  },
  watch: {
    $route: function () {
      this.loadxdProInstances();
      this.to = 0;
      this.from = 0;
      this.total = 0;
      this.activeTab = 0;
      this.editorPlaylist = undefined;
      this.viewer = false;
      if (this.$route.params.editor !== true) {
        this.editor = false;
      }
    },
    activeTab: function (tab) {
      EventBus.$emit("tab-change", tab);
    },
  },
  beforeMount() {
    this.loadxdProInstances();
    this.loadMovieSeriePlaylists();
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
};
</script>

<style scoped>
.seperator.page {
  margin-left: 15px;
  margin-right: 15px;
  width: calc(100% - 30px);
}
.playlist-select {
  min-width: 200px;
}
</style>
