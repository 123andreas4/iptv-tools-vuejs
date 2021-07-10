<template>
  <erd-row class="m-0 p-0"> 
    <!--  

      DOWNLOAD EDITOR

    -->
    <erd-modal
      v-show="moreInfoModal"
      @close="moreInfoModal = false"
      :title="selectedStationName"
      class="select-none"
      small
    >
      <div class="px-2" v-if="selected">
        <div class="programme-modal-date">
          <div class="day">{{ new Date(selected.start).toLocaleDateString($t("date.locale"), { weekday: 'long' }) }}</div>
          <div class="date">{{ formatTime(selected.start) }} - {{ formatTime(selected.stop) }}</div>
        </div>
        <div class="programme-modal">
          <div class="title">{{ selected.title }}</div>
          <div class="subtitle" v-if="selected.subtitle.length">{{ selected.subtitle }}</div>
          <div class="description">{{ selected.description }}</div>
        </div>
      </div>
      <template v-slot:footer>
        <erd-button
          icon="la-download"
          class="mr-1"
          variant="primary"
          :disabled="!canDownload"
          @click="downloadModal(true)"
          >{{ $t("movies.download") }}</erd-button
        >
        <erd-button
          @click="moreInfoModal = false"
          icon="la-times"
          variant="danger"
          >{{ $t("general.close") }}</erd-button
        >
      </template>
    </erd-modal>
    <!--  

      XD-PRO DOWNLOAD

    -->
    <erd-modal
      v-show="xdPro.modal"
      @close="downloadModal(false)"
      :title="$t('xd-pro.xd-pro')"
      class="select-none"
      small
    >
      <div class="px-2" style="min-height: 250px">
        <label class="w-100">{{ $t("xd-pro.xd-pro-instance") }}</label>
        <erd-select
          class="mt-1 mb-2 w-100"
          v-model="xdPro.xdpro_id"
          :items="xdProInstanceItems"
        ></erd-select>
        <label class="w-100">{{ $t("xd-pro.download-folder") }}</label>
        <erd-input
          class="mt-1 mb-2 w-100"
          v-model="xdPro.download_folder"
        ></erd-input>
      </div>
      <template v-slot:footer>
        <erd-button
          @click="downloadModal(false)"
          icon="la-times"
          class="mr-1"
          variant="danger"
          >{{ $t("general.cancel") }}</erd-button
        >
        <erd-button
          icon="la-check"
          variant="success"
          :disabled="xdPro.xdpro_id == 0"
          @click="downloadModal(false, true)"
          >{{ $t("general.ok") }}</erd-button
        >
      </template>
    </erd-modal>
    <erd-spinner v-if="isLoading" size="lg" overlay absolute></erd-spinner>
    <div class="catch-up-grid my-0 pb-0 pt-2">
      <perfect-scrollbar>
        <div class="catch-up-stations-grid" :style="`width: calc(calc(100vh / 4) * ${stations.length}`">
          <erd-context-menu
            :items="programmeContext"
            depth="1"
            ref="programme-context"
          ></erd-context-menu>
          <div v-for="(station, index) in stations" :key="`station-${index}-${station.stream_tvg_name}`" class="catch-up-station">
            <div class="station-head">
              <img :src="station.stream_tvg_logo" class="station-icon">
              <div class="station-title">{{ station.stream_tvg_name }}</div>
            </div>
            <div class="programmes">
              <perfect-scrollbar>
                <div 
                  :data-programme="pindex"
                  :data-station="index"
                  class="programme" 
                  :class="{active: selected === programme}" 
                  v-for="(programme, pindex) in station.programmes" 
                  :key="`station-${index}-programme-${pindex}`" 
                  @click="selectProgramme(programme, station)"
                  @contextmenu.prevent="openContext"
                >
                  <div class="programme-start-stop" :data-programme="pindex" :data-station="index">
                    {{ formatTime(programme.start) }}
                  </div>
                  <div class="programme-title" :data-programme="pindex" :data-station="index">
                    {{ programme.title }}
                  </div>
                </div>
              </perfect-scrollbar>
            </div>
          </div>
        </div>
      </perfect-scrollbar>
    </div>
  </erd-row>
</template>

<script>
/* eslint-disable vue/no-side-effects-in-computed-properties */
/* eslint-disable no-unused-vars */
import { EventBus } from "../../../../services/ebus";
import { httpService } from "../../../../services/http";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      dateOptions: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
      activeTab: 0,
      search: null,
      isLoading: false,
      stations: [],
      selected: null,
      selectedStation: null,
      moreInfoModal: false,
      xdPro: {
        modal: false,
        xdpro_id: 0,
        download_folder: "",
      },
    };
  },
  computed: {
    ...mapGetters(["currentUser", "settings", "xdProInstances", "movieSeriePlaylists", "movieSeriePlaylist", "catchUpGroup", "catchUpDay"]),
    showTooltips () {
      return this.settings.showTooltips;
    },
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
    canDownload() {
      if (this.selected !== null) {
        let now = new Date().getTime();
        let max = new Date().getTime() - (86400000 * this.selectedStation.source_tv_archive_duration);
        return new Date(this.selected.start).getTime() > max && new Date(this.selected.stop).getTime() < now;
      }
      return false; 
    },
    xdProInstanceItems() {
      return this.xdProInstances.map((instance) => {
        return {
          text: instance.name,
          value: instance.id,
        };
      });
    },
    programmeContext () {
      let vm = this;
      return [
        {
          icon: "la-tv",
          text: vm.$t("movies.tooltip-show-more"),
          onClick: function () {
            if (vm.selected !== null) {
              vm.moreInfoModal = true;
            }
          },
        },
        {
          divider: true,
        },
        {
          icon: "la-download",
          text: vm.$t("movies.download"),
          onClick: function () {
            vm.downloadModal(true);
          },
        },
      ];
    },
    selectedStationName() {
      return this.selectedStation ? this.selectedStation.stream_tvg_name : "";
    }
  },
  methods: {
    ...mapActions(["loadCatchUpDays", "addxdProDownload", "loadxdProInstances"]),
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
      return new Date(date).toLocaleDateString(
        this.$t("date.locale"),
        this.dateOptions
      );
    },
    formatTime(date) {
      return new Date(date).toLocaleTimeString(
        this.$t("date.locale"),
        { hour: '2-digit', minute:'2-digit' }
      );
    },
    dateRange(startDate, endDate) {
      const dateArray = [];
      let currentDate = new Date(startDate);

      while (currentDate <= new Date(endDate)) {
        dateArray.push({
          text: this.formatDate(new Date(currentDate)),
          value: new Date(currentDate).toISOString().split('T')[0]
        });
        // Use UTC date to prevent problems with time zones and DST
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
      }

      return dateArray;
    },
    loadStations() {
      this.isLoading = true;
      httpService.get(`live/catch-up/${this.movieSeriePlaylist}/${this.catchUpGroup}/${this.catchUpDay}`).then((res) => {
        if (res.status === true) {
          this.stations = res.data;
          this.isLoading = false;
        }
      });
    },
    selectProgramme(programme, station) {
      this.selected = programme;
      this.selectedStation = station;
      this.moreInfoModal = true;
    },
    openContext(e) {
      if (e.srcElement && e.srcElement.dataset && e.srcElement.dataset.programme && e.srcElement.dataset.station) {
        this.selected = this.stations[e.srcElement.dataset.station].programmes[e.srcElement.dataset.programme];
        this.selectedStation = this.stations[e.srcElement.dataset.station];
      }
      this.$refs['programme-context'].open();
    },
    formatDateDownload(date) {
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

      if (month.length < 2) 
          month = '0' + month;
      if (day.length < 2) 
          day = '0' + day;

      let hour    = '' + d.getHours();
      let minutes = '' + d.getMinutes();

      if (hour.length < 2) 
          hour = '0' + hour;
      if (minutes.length < 2) 
          minutes = '0' + minutes;

      return `${year}-${month}-${day}:${hour}:${minutes}:00`;
    },
    downloadModal(show, save = false) {
      if (show) {
        this.moreInfoModal = false;
      }
      if (save) {
        let playlist = this.movieSeriePlaylists.find(p => p.value === this.movieSeriePlaylist).playlist;
        let download = {
          user_id: this.currentUser.user.id,
          xdpro_id: this.xdPro.xdpro_id,
          filename: `${this.selected.title}.ts`,
          file_extension: 'ts',
          type: 3,
          enabled: 0,
          download_folder: this.xdPro.download_folder,
          download_url: `http://${playlist.source_host}:${String(playlist.source_port).length ? playlist.source_port : '80'}/timeshift/${playlist.source_username}/${playlist.source_password}/${Math.ceil(((new Date(this.selected.stop).getTime() - new Date(this.selected.start).getTime()) / 1000) / 60)}/${this.formatDateDownload(this.selected.start)}/${this.selectedStation.source_stream_id}.ts`,
          download_host: playlist.source_host,
          download_port: playlist.source_port,
          download_username: playlist.source_username,
          download_password: playlist.source_password
        };
        this.addxdProDownload(download)
          .then((res) => {
            if (res.status === true) {
              this.$notify(
                "primary",
                this.$t("profile.success"),
                this.$t("xd-pro.download-save-success"),
                "la-user-shield",
                { duration: 5000, permanent: false }
              );
            }
          })
          .catch(() => {
            this.$notify(
              "error",
              this.$t("profile.failed"),
              this.$t("xd-pro.download-save-error"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
          });
      }
      this.xdPro.modal = show;
    },
  },
  created() {
    let start = new Date();
    let end   = new Date(start.getTime() - (86400000 * 7))
    this.loadCatchUpDays(this.dateRange(end, start).reverse());
  },
  beforeMount() {
    this.loadxdProInstances();
    if (this.movieSeriePlaylist && this.catchUpGroup && this.catchUpDay) {
      this.loadStations();
    }
    document.body.classList.add("right-menu");
    document.body.classList.add("catch-up-body");
    EventBus.$on("search", this.searchStream);
    EventBus.$on("print", this.printStreams);
  },
  beforeDestroy() {
    document.body.classList.remove("right-menu");
    document.body.classList.remove("catch-up-body");
    EventBus.$off("search", this.searchStream);
    EventBus.$off("print", this.printStreams);
  },
  watch: {
    movieSeriePlaylist: function () {
      if (this.movieSeriePlaylist) {
        this.loadStations();
      }
    },
    catchUpGroup: function () {
      if (this.movieSeriePlaylist && this.catchUpGroup && this.catchUpDay) {
        this.loadStations();
      }
    },
    catchUpDay: function () {
      if (this.movieSeriePlaylist && this.catchUpGroup && this.catchUpDay) {
        this.loadStations();
      }
    },
    "xdPro.xdpro_id": function (val) {
      let instance = this.xdProInstances.find((instance) => {
        return instance.id == val;
      });
      if (instance) {
        this.xdPro.download_folder = instance.download_folder;
      }
    },
  },
};
</script>

<style lang="scss">
  .catch-up-body {
    padding-bottom: 0px;
    min-height: calc(100% - 120px);
  }

  .catch-up-grid {
    width: 100%;
    height: calc(100vh - 230px);

    .ps {
      width: 100%;
      height: 100%;//calc(100vh - 320px);
    }
  }

  .catch-up-stations-grid {
    display: flex;
    text-align: center;
    min-height: 100%; 
    align-items: stretch;

    .station-head {
      position: sticky;
      width: 100%;
      display: block;
      height: 50px;
      line-height: 50px;
      background: $separator-color-light;
      border-top: 1px solid $separator-color;
      border-bottom: 1px solid $separator-color;
      box-sizing: border-box;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;

      .station-icon {
        max-height: 24px;
        vertical-align: middle;
        margin-right: 0.25rem;
      }

      .station-title {
        line-height: 24px;
        display: inline-block;
        vertical-align: middle;
      }

    }
  }

  .catch-up-station {
    width: calc((100vh / 4) - 1px);
    display: inline-block;
    min-height: 100%;

    &:nth-child(2) {
      .station-head {
        border-left: 1px solid $separator-color;
      }
    }
    
    &:last-child {
      .station-head {
        border-right: 1px solid $separator-color;
      }
    }

    &:not(:last-child) {
      border-right: 1px solid $separator-color;
    }

    .programmes {
      box-sizing: border-box;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      height: calc(100vh - 300px);

      .ps {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        padding: 0.25rem;
      }

    }

    .programme {
      width: 100%;
      height: 50px;
      display: inline-block;
      text-align: left;
      box-sizing: border-box;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      cursor: pointer;
      padding: 5px;
      
      &.active {
        background-color: $theme-color-1;
        color: $foreground-color;
        border: 1px solid $theme-color-1;
      }      
      
      &:hover:not(.active) {
        padding: 4px;
        background-color: $input-background;
        color: $theme-color-1;
        border: 1px solid $theme-color-1;
      }

      .programme-start-stop {
        display: block;
        float: left;
        height: 100%;
        width: 44px;
      }

      .programme-title {
        display: block;
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        float: left;
        height: 100%;
        width: calc(100% - 50px);
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 5px;
        font-weight: bold;
      }
    }
  }

  .programme-modal-date {
    width: 120px;
    float: left;
    padding-top: 6px;

    .day {
      text-transform: capitalize;
      font-weight: bold;
    }

    .date {

    }
  }

  .programme-modal {
    width: calc(100% - 120px);
    float: left;

    .title {
      font-size: 18px;
      font-weight: bold;
    }

    .subtitle {
      font-weight: bold;
    }

    .description {
      margin-top: 0.25rem;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
