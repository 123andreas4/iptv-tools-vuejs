<template>
  <div
    class="d-print-none"
    :class="[{ shown: isOpen }, 'settings-menu']"
    @mouseenter="isMenuOver = true"
    @mouseleave="isMenuOver = false"
  >
    <div class="body">
      <label>{{ $t("general.language") }}</label>
      <erd-select
        key="language"
        class="w-100 mt-1 mb-2"
        :items="languages"
        v-model="$i18n.locale"
      ></erd-select>
      <label>{{ $t("general.per-page") }}</label>
      <erd-select
        key="per-page"
        class="w-100 mt-1 mb-2"
        :items="perPageItems"
        v-model="perPage"
      ></erd-select>
      <label>{{ $t("general.playlist") }}</label>
      <erd-select
        key="movie-serie-playlist"
        class="w-100 mt-1 mb-2"
        :items="movieSeriePlaylists"
        v-model="movieSeriePlaylist"
        :disabled="!userHasMoviesSeries || !routeIsMoviesSeries"
      ></erd-select>
      <template v-if="routeIsCatchUp">
        <label>{{ $t("xtream.group") }}</label>
        <erd-select
          key="catch-up-group"
          class="w-100 mt-1 mb-2"
          :items="catchUpGroups"
          v-model="catchUpGroup"
        ></erd-select>
        <label>{{ $t("logins.datetime") }}</label>
        <erd-select
          key="catch-up-date"
          class="w-100 mt-1 mb-2"
          :items="catchUpDays"
          v-model="catchUpDay"
        ></erd-select>
      </template>
      <erd-checkbox
        class="my-2"
        v-model="showTooltips"
        :true-value="true"
        :false-value="false"
        >{{ $t("general.show-tooltips") }}</erd-checkbox>
    </div>
    <a href="#" class="settings-menu-button" @click.prevent="toggle">
      <i class="las la-user-cog"></i>
    </a>
  </div>
</template>

<script>
import { setCurrentLanguage } from "../../helpers";
import { localeOptions } from "../../constants/config";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      localeOptions,
      isOpen: false,
      isMenuOver: false,
      perPageItems: [
        { text: "10", value: 10 },
        { text: "25", value: 25 },
        { text: "50", value: 50 },
        { text: "100", value: 100 },
        { text: "150", value: 150 },
        { text: "200", value: 200 },
        { text: "250", value: 250 },
        { text: "500", value: 500 },
      ],
    };
  },
  computed: {
    ...mapGetters(["currentUser"]),
    routeIsMoviesSeries() {
      return (
        /app\/movies\//i.test(this.$route.path) ||
        /app\/series\//i.test(this.$route.path) ||
        /app\/xtream\/editor/i.test(this.$route.path) ||
        /app\/m3u\/editor/i.test(this.$route.path) ||
        /\/applications\/catch-up/i.test(this.$route.path)
      );
    },
    routeIsCatchUp() {
      return /\/applications\/catch-up/i.test(this.$route.path);
    },
    userHasMoviesSeries() {
      return (
        this.currentUser.subscription &&
        this.currentUser.subscription.subscription_type > 0
      );
    },
    perPage: {
      get: function () {
        return this.$store.state.user.settings.perPage;
      },
      set: function (val) {
        let settings = {
          perPage: val,
          expandMenu: this.$store.state.user.settings.expandMenu,
        };
        this.$store.commit("setSettings", settings);
      },
    },
    movieSeriePlaylists: {
      get: function () {
        return this.$store.state.sync.movieSeriePlaylists;
      },
    },
    movieSeriePlaylist: {
      get: function () {
        return this.$store.state.sync.movieSeriePlaylist;
      },
      set: function (val) {
        this.$store.commit("setMovieSeriePlaylist", val);
      },
    },
    catchUpGroups: {
      get: function () {
        return this.$store.state.sync.catchUpGroups;
      }
    },
    catchUpGroup: {
      get: function () {
        return this.$store.state.sync.catchUpGroup;
      },
      set: function (val) {
        this.$store.commit("setCatchUpGroup", val);
      },
    },
    catchUpDays: {
      get: function () {
        return this.$store.state.sync.catchUpDays;
      }
    },
    catchUpDay: {
      get: function () {
        return this.$store.state.sync.catchUpDay;
      },
      set: function (val) {
        this.$store.commit("setCatchUpDay", val);
      },
    },
    showTooltips: {
      get: function () {
        return this.$store.state.user.settings.showTooltips;
      },
      set: function (val) {
        let settings = {
          perPage: this.$store.state.user.settings.perPage,
          expandMenu: this.$store.state.user.settings.expandMenu,
          showTooltips: val,
        };
        this.$store.commit("setSettings", settings);
      },
    },
    languages() {
      return this.localeOptions.map((locale) => {
        return {
          text: locale.name,
          value: locale.id,
        };
      });
    },
  },
  methods: {
    ...mapActions(["loadMovieSeriePlaylists"]),
    addEvents() {
      document.addEventListener("click", this.handleDocumentClick);
      document.addEventListener("touchstart", this.handleDocumentClick);
    },
    removeEvents() {
      document.removeEventListener("click", this.handleDocumentClick);
      document.removeEventListener("touchstart", this.handleDocumentClick);
    },
    handleDocumentClick() {
      if (!this.isMenuOver) {
        this.toggle();
      }
    },
    toggle() {
      this.isOpen = !this.isOpen;
    },
  },
  beforeMount() {
    this.loadMovieSeriePlaylists(true);
  },
  watch: {
    isOpen(val) {
      if (val) {
        this.addEvents();
      } else {
        this.removeEvents();
      }
    },
    "$i18n.locale": function (to, from) {
      setCurrentLanguage(to);
      if (from !== to) {
        this.$router.go(this.$route.path);
      }
    },
  },
  beforeDestroy() {
    this.removeEvents();
  },
};
</script>
