<template>
  <app-layout>
    <router-view />
    <settings-menu></settings-menu>
  </app-layout>
</template>

<script>
import AppLayout from "../../layouts/AppLayout";
import SettingsMenu from "../../components/App/SettingsMenu";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    "app-layout": AppLayout,
    "settings-menu": SettingsMenu,
  },
  data() {
    return {
      playlist: null,
      tmdb: null,
      xmltv: null,
    };
  },
  computed: {
    ...mapGetters(["currentUser", "syncTMDB", "syncPlaylist", "appXmltvSync"]),
  },
  methods: {
    ...mapActions([
      "getSyncTMDB",
      "getSyncPlaylist",
      "synchronizeTMDB",
      "synchronizePlaylist",
      "addAlert",
      "getAppXmltvSync",
      "loadMovieSeriePlaylists"
    ]),
    tmdbSyncStartNotify() {
      this.$notify(
        "info",
        this.$t("general.one-moment"),
        this.$t("m3u.m3u-tmdb-start"),
        "la-sync",
        { duration: 5000, permanent: false }
      );
    },
    tmdbSyncEndNotify() {
      this.$notify(
        "primary",
        this.$t("profile.success"),
        this.$t("m3u.m3u-tmdb-stop"),
        "la-user-shield",
        { duration: 5000, permanent: false }
      );
    },
    playlistSyncStartNotify() {
      this.$notify(
        "info",
        this.$t("general.one-moment"),
        this.$t("m3u.m3u-sync-start"),
        "la-sync",
        { duration: 5000, permanent: false }
      );
    },
    playlistSyncEndNotify() {
      this.$notify(
        "primary",
        this.$t("profile.success"),
        this.$t("m3u.m3u-sync-stop"),
        "la-user-shield",
        { duration: 5000, permanent: false }
      );
    },
    xmltvStartNotify() {
      this.$notify(
        "info",
        this.$t("general.one-moment"),
        this.$t("xmltv.sync-start"),
        "la-sync",
        { duration: 5000, permanent: false }
      );
    },
    xmltvEndNotify() {
      this.$notify(
        "primary",
        this.$t("profile.success"),
        this.$t("xmltv.sync-stop"),
        "la-user-shield",
        { duration: 5000, permanent: false }
      );
    },
    resetTmdbInterval(interval) {
      clearInterval(this.tmdb);
      this.tmdb = setInterval(this.getSyncTMDB, interval * 1000);
    },
    resetPlaylistInterval(interval) {
      clearInterval(this.playlist);
      this.playlist = setInterval(this.getSyncPlaylist, interval * 1000);
    },
    resetAppXmltvSyncInterval(interval) {
      clearInterval(this.xmltv);
      this.xmltv = setInterval(this.getAppXmltvSync, interval * 1000);
    },
  },
  beforeCreate() {
    this.loadMovieSeriePlaylists(true);
  },
  beforeMount() {
    if ([3, 4, 5].includes(this.currentUser.user.role)) {
      this.getSyncTMDB();
      this.getSyncPlaylist();
      this.tmdb = setInterval(this.getSyncTMDB, 30 * 1000);
      this.playlist = setInterval(this.getSyncPlaylist, 30 * 1000);
    } else {
      this.getAppXmltvSync();
      this.xmltv = setInterval(this.getAppXmltvSync, 30 * 1000);
    }
  },
  beforeDestroy() {
    if ([3, 4, 5].includes(this.currentUser.user.role)) {
      clearInterval(this.tmdb);
      clearInterval(this.playlist);
    } else {
      clearInterval(this.xmltv);
    }
  },
  watch: {
    syncTMDB: function (val) {
      if (val) {
        this.resetTmdbInterval(10);
        this.tmdbSyncStartNotify();
        this.addAlert({
          icon: "la-sync",
          to: "/app/start/dashboard",
          text: this.$t("m3u.m3u-tmdb-start"),
          date: new Date(),
        });
      } else {
        this.resetTmdbInterval(30);
        this.tmdbSyncEndNotify();
        this.addAlert({
          icon: "la-sync",
          to: "/app/start/dashboard",
          text: this.$t("m3u.m3u-tmdb-stop"),
          date: new Date(),
        });
      }
    },
    syncPlaylist: function (val) {
      if (val) {
        this.resetPlaylistInterval(10);
        this.playlistSyncStartNotify();
        this.addAlert({
          icon: "la-sync",
          to: "/app/start/dashboard",
          text: this.$t("m3u.m3u-sync-start"),
          date: new Date(),
        });
      } else {
        this.resetPlaylistInterval(30);
        this.playlistSyncEndNotify();
        this.addAlert({
          icon: "la-sync",
          to: "/app/start/dashboard",
          text: this.$t("m3u.m3u-sync-stop"),
          date: new Date(),
        });
      }
    },
    appXmltvSync: function (val) {
      if (val) {
        this.resetAppXmltvSyncInterval(10);
        this.xmltvStartNotify();
        this.addAlert({
          icon: "la-sync",
          to: "/app/tools/xmltv",
          text: this.$t("xmltv.sync-start"),
          date: new Date(),
        });
      } else {
        this.resetAppXmltvSyncInterval(30);
        this.xmltvEndNotify();
        this.addAlert({
          icon: "la-sync",
          to: "/app/tools/xmltv",
          text: this.$t("xmltv.sync-stop"),
          date: new Date(),
        });
      }
    },
  },
};
</script>
