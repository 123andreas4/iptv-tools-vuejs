<template>
  <erd-row :class="{ 'app-row': isXDPro }">
    <erd-breadcrumb :items="breadcrumb" :heading="heading">
      <erd-button
        class="mr-2 py-1 px-2"
        icon="las la-sync"
        @click="doRefresh"
        >{{ $t("general.refresh") }}</erd-button
      >
      <span class="text-muted" v-if="isXDPro && activeTab === 1">{{
        $t("general.from-to-total").format(
          this.total > 0 ? this.from + 1 : this.from,
          this.to,
          this.total
        )
      }}</span>
    </erd-breadcrumb>
    <erd-tab
      v-if="isXDPro"
      :tabs="tabsXDPro"
      v-model="activeTab"
    ></erd-tab>
    <div class="seperator page" v-if="!isXDPro"></div>
    <router-view class="px-0 mt-0"></router-view>
  </erd-row>
</template>

<script>
/* eslint-disable no-unused-vars */
import { EventBus } from "../../../../services/ebus";
import { httpService } from "../../../../services/http";
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      tabsXDPro: [
        this.$t("tabs.xd-pro"),
        this.$t("tabs.downloads")
      ],
      activeTab: 0,
      from: 0,
      to: 0,
      total: 0,   
    };
  },
  computed: {
    ...mapGetters(["currentUser"]),
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
    isXDPro() {
      return /\/applications\/xd-pro/.test(this.$route.path);
    },
  },
  methods: {
    ...mapActions(["updateSoundcloudId"]),
    doRefresh() {
      EventBus.$emit("refresh");
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
  },
  watch: {
    $route: function () {
      this.to = 0;
      this.from = 0;
      this.total = 0;
      this.activeTab = 0;
      this.editorPlaylist = undefined;
      if (this.$route.params.editor !== true) {
        this.editor = false;
      }
    },
    activeTab: function (tab) {
      EventBus.$emit("tab-change", tab);
    },
  },
  beforeMount() {
    EventBus.$on("update-from", this.updateFrom);
    EventBus.$on("update-to", this.updateTo);
    EventBus.$on("update-total", this.updateTotal);
  },
  beforeDestroy() {
    EventBus.$off("update-from", this.updateFrom);
    EventBus.$off("update-to", this.updateTo);
    EventBus.$off("update-total", this.updateTotal);
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
