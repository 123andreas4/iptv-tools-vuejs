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
        class="w-100 mt-1 mb-2"
        :items="languages"
        v-model="$i18n.locale"
      ></erd-select>
      <label>{{ $t("general.per-page") }}</label>
      <erd-select
        class="w-100 mt-1 mb-2"
        :items="perPageItems"
        v-model="perPage"
      ></erd-select>
      <label>{{ $t("general.expand-menu") }}</label>
      <erd-select
        class="w-100 mt-1 mb-2"
        :items="collapseItems"
        v-model="expandMenu"
      ></erd-select>
    </div>
    <a href="#" class="settings-menu-button" @click.prevent="toggle">
      <i class="las la-user-cog"></i>
    </a>
  </div>
</template>

<script>
import { setCurrentLanguage } from "../../helpers";
import { localeOptions } from "../../constants/config";

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
      collapseItems: [
        { text: this.$t("general.yes"), value: true },
        { text: this.$t("general.no"), value: false },
      ],
    };
  },
  computed: {
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
    expandMenu: {
      get: function () {
        return this.$store.state.user.settings.expandMenu;
      },
      set: function (val) {
        let settings = {
          perPage: this.$store.state.user.settings.perPage,
          expandMenu: val,
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
