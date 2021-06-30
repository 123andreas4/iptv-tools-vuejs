<template>
  <erd-row :class="{ 'app-row': isM3UEditor }">
    <erd-breadcrumb :items="breadcrumb" :heading="heading">
      <erd-button
        class="mr-1 py-1 px-2"
        icon="las la-plus"
        @click="doAdd"
        v-if="!editor && !isM3UEditor"
        variant="success"
        :disabled="!canAddPlaylist"
        >{{ addButtonText }}</erd-button
      >
      <erd-button
        class="mr-1 py-1 px-2"
        icon="las la-save"
        @click="doSave"
        v-if="editor"
        variant="primary"
        :disabled="isBusy"
        >{{ $t("general.save") }}</erd-button
      >
      <erd-button
        class="mr-1 py-1 px-2"
        icon="las la-times"
        @click="doCancel"
        v-if="editor"
        variant="danger"
        :disabled="isBusy"
        >{{ $t("general.cancel") }}</erd-button
      >
      <erd-button
        class="mr-2 py-1 px-2"
        icon="las la-sync"
        @click="doRefresh"
        v-if="!editor && !isM3UEditor"
        >{{ $t("general.refresh") }}</erd-button
      >
      <span class="text-muted" v-if="!editor && !isM3UEditor">{{
        $t("general.from-to-total").format(
          this.total > 0 ? this.from + 1 : this.from,
          this.to,
          this.total
        )
      }}</span>
      <erd-button
        class="mr-1 py-1 px-2"
        icon="las la-save"
        @click="doSave"
        v-if="isM3UEditor && editorChanges"
        variant="primary"
        :disabled="isBusy"
        >{{ $t("general.save-changes") }}</erd-button
      >
      <erd-button
        class="mr-3 py-1 px-2"
        icon="las la-times"
        @click="doCancel"
        v-if="isM3UEditor && editorChanges"
        variant="danger"
        :disabled="isBusy"
        >{{ $t("general.cancel") }}</erd-button
      >
    </erd-breadcrumb>
    <erd-tab
      :tabs="tabsXtream"
      v-model="activeTab"
      v-if="isM3UPlaylist && editor"
    ></erd-tab>
    <erd-tab
      :tabs="tabsMovies"
      v-model="activeTab"
      v-if="isM3UMoviesSeries && editor"
    ></erd-tab>
    <div class="seperator page" v-if="showSeperator"></div>
    <router-view class="px-0 mt-0"></router-view>
  </erd-row>
</template>

<script>
/* eslint-disable no-unused-vars */
import { EventBus } from "../../../services/ebus";
import { httpService } from "../../../services/http";
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      tabsXtream: [
        this.$t("tabs.source"),
        this.$t("tabs.m3u"),
        this.$t("tabs.sync"),
        this.$t("tabs.security"),
        this.$t("tabs.backup"),
        this.$t("tabs.export"),
      ],
      tabsMovies: [this.$t("tabs.stream"), this.$t("tabs.tmdb")],
      activeTab: 0,
      from: 0,
      to: 0,
      total: 0,
      editor: false,
      isLoaded: false,
      isBusy: false,
      editorChanges: false,
      canAddPlaylist: true,
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
    isM3UPlaylist() {
      return /\/m3u\/playlists/i.test(this.$route.path);
    },
    isM3UMoviesSeries() {
      return (
        /\/m3u\/movies/i.test(this.$route.path) ||
        /\/m3u\/series/i.test(this.$route.path)
      );
    },
    isM3UEditor() {
      return /\/m3u\/editor/i.test(this.$route.path);
    },
    showSeperator() {
      if (this.isM3UPlaylist && this.editor) {
        return false;
      }
      if (this.isM3UMoviesSeries && this.editor) {
        return false;
      }
      return true;
    },
    addButtonText() {
      // Playlist
      if (/\/m3u\/playlists/i.test(this.$route.path)) {
        return this.$t("xtream.add-playlist");
      }
      // Group
      if (/\/m3u\/groups/i.test(this.$route.path)) {
        return this.$t("xtream.add-group");
      }
      // Live
      if (/\/m3u\/live/i.test(this.$route.path)) {
        return this.$t("xtream.add-live-stream");
      }
      // Movie
      if (/\/m3u\/movies/i.test(this.$route.path)) {
        return this.$t("xtream.add-movie");
      }
      // Series
      if (/\/m3u\/series/i.test(this.$route.path)) {
        return this.$t("xtream.add-series");
      }
      return "Add";
    },
  },
  methods: {
    ...mapActions(["updateSoundcloudId"]),
    updateFrom(from) {
      this.from = from;
    },
    updateTo(to) {
      this.to = to;
    },
    updateTotal(total) {
      this.total = total;
    },
    updateeditor(editor) {
      if (!editor) {
        this.activeTab = 0;
      }
      this.editor = editor;
    },
    updateIsBusy(busy) {
      this.isBusy = busy;
    },
    updateEditorChanges(val) {
      this.editorChanges = val;
    },
    updateCanAddPlaylist(val) {
      this.canAddPlaylist = val;
    },
    doRefresh() {
      EventBus.$emit("refresh");
    },
    doSave() {
      EventBus.$emit("save");
    },
    doCancel() {
      EventBus.$emit("cancel");
    },
    doAdd() {
      EventBus.$emit("add");
    },
  },
  watch: {
    $route: function () {
      this.to = 0;
      this.from = 0;
      this.total = 0;
      this.activeTab = 0;
      if (this.$route.params.editor !== true) {
        this.editor = false;
      }
    },
    activeTab: function (tab) {
      EventBus.$emit("tab-change", tab);
    },
  },
  beforeMount() {
    this.updateSoundcloudId();
    EventBus.$on("update-from", this.updateFrom);
    EventBus.$on("update-to", this.updateTo);
    EventBus.$on("update-total", this.updateTotal);
    EventBus.$on("update-editor", this.updateeditor);
    EventBus.$on("update-busy", this.updateIsBusy);
    EventBus.$on("editor-changes", this.updateEditorChanges);
    EventBus.$on("can-add-playlist", this.updateCanAddPlaylist);
  },
  beforeDestroy() {
    EventBus.$off("update-from", this.updateFrom);
    EventBus.$off("update-to", this.updateTo);
    EventBus.$off("update-total", this.updateTotal);
    EventBus.$off("update-editor", this.updateeditor);
    EventBus.$off("update-busy", this.updateIsBusy);
    EventBus.$off("editor-changes", this.updateEditorChanges);
    EventBus.$off("can-add-playlist", this.updateCanAddPlaylist);
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
