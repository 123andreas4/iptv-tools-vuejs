<template>
  <erd-row>
    <erd-breadcrumb :items="breadcrumb" :heading="heading">
      <erd-button
        class="mr-1 py-1 px-2"
        icon="las la-times"
        @click="doCancel"
        v-if="viewer && !hideAll"
        variant="primary"
        >{{ $t("general.close") }}</erd-button
      >
      <erd-button
        class="mr-2 py-1 px-2"
        icon="las la-sync"
        @click="doRefresh"
        v-if="!viewer"
        >{{ $t("general.refresh") }}</erd-button
      >
      <span class="text-muted" v-if="!viewer && !hideAll">{{
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
import { EventBus } from "../../../services/ebus";
export default {
  data() {
    return {
      from: 0,
      to: 0,
      total: 0,
      viewer: false,
      hideAll: false,
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
    },
    updateHideAll(hide) {
      this.hideAll = hide;
    },
    doRefresh() {
      EventBus.$emit("refresh");
    },
    doCancel() {
      EventBus.$emit("cancel");
    },
  },
  watch: {
    $route: function () {
      this.to = 0;
      this.from = 0;
      this.total = 0;
      if (this.$route.params.viewer !== true) {
        this.viewer = false;
      }
    },
  },
  beforeMount() {
    EventBus.$on("update-from", this.updateFrom);
    EventBus.$on("update-to", this.updateTo);
    EventBus.$on("update-total", this.updateTotal);
    EventBus.$on("update-viewer", this.updateViewer);
    EventBus.$on("hide-all", this.updateHideAll);
  },
  beforeDestroy() {
    EventBus.$off("update-from", this.updateFrom);
    EventBus.$off("update-to", this.updateTo);
    EventBus.$off("update-total", this.updateTotal);
    EventBus.$off("update-viewer", this.updateViewer);
    EventBus.$off("hide-all", this.updateHideAll);
  },
};
</script>

<style scoped>
.seperator.page {
  margin-left: 15px;
  margin-right: 15px;
  width: calc(100% - 30px);
}
</style>
