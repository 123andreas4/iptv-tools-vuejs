<template>
  <erd-row class="m-0 p-0">
    <erd-col xl="12" class="">
      <label class="w-100">{{ $t("siptv.mac") }}</label>
      <erd-input
        class="mt-1 mb-2 w-100"
        :placeholder="$t('general.mac-placeholder')"
        v-model="mac"
      ></erd-input>
      <label class="w-100 mt-2">{{ $t("subscriptions.portal") }}</label>
      <erd-input
        class="mt-1 mb-2 w-100"
        v-model="portal"
      ></erd-input>
      <label class="w-100 mt-2">{{ $t("m3u.playlist-url") }}</label>
      <erd-input
        class="mt-1 mb-2 w-100"
        v-model="url"
        readonly
      ></erd-input>
    </erd-col>
  </erd-row>
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
      mac: "",
      portal: "",
      url: "",
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
    convert() {
      httpService.post("mac-2-m3u", { mac: this.mac, portal: this.portal })
      .then((res) => {
        if (res.status === true && res.data !== false) {
          this.url = res.data.url;
          this.$notify(
            "primary",
            this.$t("profile.success"),
            this.$t("m3u2strm.success"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        } else {
          this.url = "";
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("m3u2strm.failed"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        }
      })
      .catch(() => {
        this.url = "";
        this.$notify(
          "error",
          this.$t("profile.failed"),
          this.$t("m3u2strm.failed"),
          "la-user-shield",
          { duration: 5000, permanent: false }
        );
      });
    }
  },
  beforeMount() {
    document.body.classList.add("right-menu");
    EventBus.$on("search", this.searchStream);
    EventBus.$on("print", this.printStreams);
    EventBus.$on("convert", this.convert);
  },
  beforeDestroy() {
    document.body.classList.remove("right-menu");
    EventBus.$off("search", this.searchStream);
    EventBus.$off("print", this.printStreams);
    EventBus.$off("convert", this.convert);
  },
  watch: {},
};
</script>

<style lang="scss"></style>
