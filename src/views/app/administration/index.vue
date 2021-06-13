<template>
  <erd-row>
    <erd-breadcrumb :items="breadcrumb" :heading="heading">
      <erd-button
        class="mr-1 py-1 px-2"
        icon="las la-save"
        @click="doSave"
        v-if="editor"
        variant="success"
        >{{ $t("general.save") }}</erd-button
      >
      <erd-button
        class="py-1 px-2"
        icon="las la-ban"
        @click="doCancel"
        v-if="editor"
        variant="danger"
        >{{ $t("general.cancel") }}</erd-button
      >
      <erd-button
        class="mr-2 py-1 px-2"
        icon="las la-sync"
        @click="doRefresh"
        v-if="!editor"
        >{{ $t("general.refresh") }}</erd-button
      >
      <span class="text-muted" v-if="!editor">{{
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
      editor: false,
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
    updateEditor(editor) {
      this.editor = editor;
    },
    doRefresh() {
      EventBus.$emit("refresh");
    },
    doCancel() {
      EventBus.$emit("cancel");
    },
    doSave() {
      EventBus.$emit("save");
    },
  },
  watch: {
    $route: function () {
      this.to = 0;
      this.from = 0;
      this.total = 0;
      if (this.$route.params.editor !== true) {
        this.editor = false;
      }
    },
  },
  beforeMount() {
    EventBus.$on("update-from", this.updateFrom);
    EventBus.$on("update-to", this.updateTo);
    EventBus.$on("update-total", this.updateTotal);
    EventBus.$on("update-editor", this.updateEditor);
  },
  beforeDestroy() {
    EventBus.$off("update-from", this.updateFrom);
    EventBus.$off("update-to", this.updateTo);
    EventBus.$off("update-total", this.updateTotal);
    EventBus.$off("update-editor", this.updateEditor);
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
