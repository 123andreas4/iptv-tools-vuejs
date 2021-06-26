<template>
  <erd-row class="m-0 p-0">
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
      <div class="px-2">
        <label class="w-100">{{ $t("xd-pro.xd-pro-instance") }}</label>
        <erd-select class="mt-1 mb-2 w-100" v-model="xdPro.xdpro_id" :items="xdProInstanceItems"></erd-select>
        <label class="w-100">{{ $t("xd-pro.download-folder") }}</label>
        <erd-input class="mt-1 mb-2 w-100" v-model="xdPro.download_folder"></erd-input>
        <label class="w-100 mb-2">{{ $t("xd-pro.select-episodes") }}</label>
        <div class="radiobrowser-stations">
          <perfect-scrollbar
            :settings="{ suppressScrollX: true, wheelPropagation: false }"
          >
            <div 
              class="form-control radiobrowser-station"
              v-for="(episode, index) in viewerEpisodes"
              :key="`xdpro-episode-${index}`"
              :class="{ selected: xdPro.downloads.includes(index) }"
              @click.ctrl="toggleDownloadsSelection(index)"
              @click.shift="selectDownloadsRangeSelection(index)"
              @click.exact="selectDownloadsSelection(index)"
            >
              <span class="station-name mr-2">{{ $t("xd-pro.season-episode").format(episode.serie_season, episode.serie_episode) }}</span>
              <span class="station-name text-muted">{{ episode.tmdb.name }}</span>
            </div>
          </perfect-scrollbar>
        </div>
      </div>
      <template v-slot:footer>
        <erd-button
          @click="downloadModal(false)"
          icon="la-times"
          class="mr-1"
          variant="danger"
          >{{ $t("general.cancel") }}</erd-button
        >
        <erd-button icon="la-check" variant="success" :disabled="xdPro.xdpro_id == 0 || xdPro.downloads.length == 0" @click="downloadModal(false, true)">{{
          $t("general.ok")
        }}</erd-button>
      </template>
    </erd-modal>
    <erd-spinner v-if="isLoading" :text="loadingText" size="lg" overlay absolute></erd-spinner>
    <erd-col xl="12" class="m-0 p-0" v-if="viewer" id="series">
      <erd-row class="m-0 p-0">
        <erd-col xl="4" md="4">
          <erd-card class="movie-details-poster">
            <img
              class="poster"
              :src="`https://www.themoviedb.org/t/p/original/${viewerSeries.tmdb.poster_path}`"
            />
            <erd-card-body>
              <h3 class="mt-0 mb-1">
                {{ viewerSeries.tmdb.title }}
                <span class="float-right"
                  ><span class="color-theme-1">{{
                    viewerSeries.tmdb.vote_average
                  }}</span
                  ><span>/10</span></span
                >
              </h3>
              <div class="genres">
                <span
                  class="genre"
                  v-for="(genre, index) in viewerSeries.tmdb.genres"
                  :key="`genre-${viewerSeries.tmdb.title}-${index}`"
                  >{{ genre.name }}</span
                >
              </div>
              <p class="color-theme-1 mt-1">
                {{ formatDate(viewerSeries.tmdb.first_air_date) }}
              </p>
              <p>{{ viewerSeries.tmdb.overview }}</p>
              <a
                class="d-block mt-2 text-truncate"
                :href="viewerSeries.tmdb.homepage"
                target="_blank"
                v-if="viewerSeries.tmdb.homepage.length"
                >{{ viewerSeries.tmdb.homepage }}</a
              >
              <a
                class="d-block text-truncate"
                :href="`https://www.themoviedb.org/tv/${viewerSeries.tmdb_id}`"
                target="_blank"
                >{{
                  `https://www.themoviedb.org/tv/${viewerSeries.tmdb_id}`
                }}</a
              >
              <erd-button
                dense
                class="my-3"
                icon="la-download"
                @click="downloadModal(true)"
                v-if="canDownload"
                >{{ $t("movies.download") }}</erd-button
              >
            </erd-card-body>
          </erd-card>
        </erd-col>
        <erd-col xl="8" md="8" class="m-0 p-0">
          <erd-row class="m-0 p-0">
            <erd-col xl="12" class="p-0 m-0" v-if="filteredVideos.length">
              <h5 class="mt-2 mb-0 ml-3">{{ $t("series.videos-trailers") }}</h5>
              <erd-row class="p-0 m-0">
                <erd-col
                  xl="6"
                  md="6"
                  xs="12"
                  v-for="(video, index) in filteredVideos"
                  :key="`video-${index}`"
                >
                  <div class="video-card">
                    <vue-plyr>
                      <div
                        data-plyr-provider="youtube"
                        :data-plyr-embed-id="video.key"
                      ></div>
                    </vue-plyr>
                  </div>
                </erd-col>
              </erd-row>
            </erd-col>
            <erd-col
              class="px-0 mx-0"
              xl="12"
              v-for="(season, index) in seasonsInSeries"
              :key="`season-${index}`"
            >
              <h5 class="my-0 ml-3">{{ $t("series.season").format(season)}}</h5>
              <erd-row class="p-0 m-0">
                <erd-col
                  xl="6"
                  xs="6"
                  v-for="(episode, eindex) in episodesInSeason(season)"
                  :key="`season-${index}-episode-${eindex}`"
                >
                  <erd-card class="movie-view-card">
                    <vue-plyr>
                      <video
                        controls
                        playsinline
                        :data-poster="`https://www.themoviedb.org/t/p/original/${episode.tmdb.still_path}`"
                      >
                        <source
                          :src="episodeURL(episode)"
                          :type="episodeVideoType(episode)"
                        />
                      </video>
                    </vue-plyr>

                    <erd-card-body>
                      <p class="py-0 my-0 color-theme-1">
                        {{ episode.tmdb.name }}
                      </p>
                      <p class="py-0 my-0 text-muted">
                        {{ episode.tmdb.overview }}
                      </p>
                    </erd-card-body>
                  </erd-card>
                </erd-col>
              </erd-row>
            </erd-col>
            <erd-col xl="12" class="p-0 m-0" v-if="filteredCast && filteredCast.length">
              <h5 class="mt-2 mb-0 ml-3">{{ $t("series.main-characters") }}</h5>
              <erd-row class="p-0 m-0">
                <erd-col
                  xl="3"
                  md="4"
                  sm="6"
                  v-for="(cast, index) in filteredCast"
                  :key="`cast-${index}`"
                >
                  <erd-card class="cast-card">
                    <img
                      class="profile"
                      :src="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${cast.profile_path}`"
                    />
                    <erd-card-body class="py-1">
                      <p>
                        <span class="color-theme-1">{{ cast.character }}</span
                        ><br /><span class="text-small text-muted">{{
                          cast.name
                        }}</span>
                      </p>
                    </erd-card-body>
                  </erd-card>
                </erd-col>
              </erd-row>
            </erd-col>
            <erd-col xl="12" class="p-0 m-0" v-if="viewerSimilar.length">
              <h5 class="mt-3 mb-0 ml-3">{{ $t("series.similar-series") }}</h5>
              <erd-row class="p-0 m-0">
                <erd-col
                  xl="4"
                  md="6"
                  xs="12"
                  v-for="(series, index) in filteredSimilar"
                  :key="`movie-${index}`"
                >
                  <erd-card class="movie-card depth-2">
                    <div class="poster">
                      <img
                        class="movie-poster"
                        :src="`https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${series.poster_path}`"
                      />
                      <span class="score">{{ series.vote_average }}</span>
                    </div>
                    <erd-card-body class="py-3">
                      <h5 class="m-0">{{ series.name }}</h5>
                      <p class="m-0 text-muted text-small">
                        {{ formatDate(series.first_air_date) }}
                      </p>
                      <div class="genres mt-2">
                        <span
                          class="genre"
                          v-for="(genre, index) in series.genres"
                          :key="`genre-${series.name}-${index}`"
                          >{{ genre.name }}</span
                        >
                      </div>
                    </erd-card-body>
                  </erd-card>
                </erd-col>
              </erd-row>
            </erd-col>
          </erd-row>
        </erd-col>
      </erd-row>
    </erd-col>
    <erd-row class="m-0 p-0" v-else id="series">
      <erd-col xl="12" xs="12">
        <erd-genre-select
          :genres="tmdbFilteredGenres"
          v-model="genre"
        ></erd-genre-select>
      </erd-col>
      <erd-col xl="12" xs="12" v-if="filteredSeries.length === 0">
        <p class="text-center text-muted">
          {{ $t("series.no-series") }}
        </p>
      </erd-col>
      <erd-col
        xl="3"
        lg="4"
        md="6"
        xs="12"
        v-for="(series, index) in pagedSeries"
        :key="`serie-${series.tmdb_id}-${index}`"
      >
        <erd-card class="movie-card depth-2">
          <div class="poster">
            <button class="more-button" @click="viewDetails(series)">
              <i class="las la-ellipsis-h"></i>
            </button>
            <img
              class="movie-poster"
              :src="
                series.tmdb.poster_path && series.tmdb.poster_path.length
                  ? `https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${series.tmdb.poster_path}`
                  : series.icon
              "
            />
            <span class="score">{{ series.tmdb.vote_average }}</span>
          </div>
          <erd-card-body class="py-3">
            <h5 class="m-0">
              <a href="#" @click.prevent="viewDetails(series)">{{
                series.tmdb.name
              }}</a>
            </h5>
            <p class="m-0 text-muted text-small">
              <span>{{
                $t("series.episodes-seasons").format(
                  series.seasons,
                  series.episodes
                )
              }}</span>
            </p>
            <div class="genres mt-2">
              <span
                class="genre"
                v-for="(genre, index) in series.tmdb.genres"
                :key="`genre-${series.tmdb_id}-${index}`"
                >{{ genre.name }}</span
              >
            </div>
          </erd-card-body>
        </erd-card>
      </erd-col>
    </erd-row>
    <b-pagination
      v-if="!viewer"
      class="w-100 my-3"
      size="sm"
      align="center"
      :total-rows="total"
      :per-page="perPage"
      v-model="currentPage"
    >
      <template v-slot:next-text>
        <i class="las la-angle-right" />
      </template>
      <template v-slot:prev-text>
        <i class="las la-angle-left" />
      </template>
      <template v-slot:first-text>
        <i class="las la-angle-double-left" />
      </template>
      <template v-slot:last-text>
        <i class="las la-angle-double-right" />
      </template>
    </b-pagination>
  </erd-row>
</template>

<script>
/* eslint-disable vue/no-side-effects-in-computed-properties */
import { EventBus } from "../../../services/ebus";
import { httpService } from "../../../services/http";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      viewerSeries: null,
      viewerCredits: [],
      viewerKeywords: [],
      viewerSimilar: [],
      viewerVideos: [],
      viewerEpisodes: [],
      viewerSeasons: [],
      viewerGroup: "",
      viewerPlaylist: "",
      viewer: false,
      search: null,
      isLoading: false,
      loadingText: "",
      series: [],
      from: 0,
      to: 0,
      total: 0,
      currentPage: 0,
      genre: 10759,
      xdPro: {
        modal: false,
        xdpro_id: 0,
        download_folder: "",
        downloads: [],
      }
    };
  },
  computed: {
    ...mapGetters(["tmdbGenres", "tmdbFilteredGenres", "settings", "currentUser", "movieSeriePlaylist", "xdProInstances"]),
    canDownload() {
      return this.xdProInstances && this.xdProInstances.length > 0;
    },
    tmdbSeries() {
      return this.series.filter((series) => {
        return series.tmdb_id;
      });
    },
    filteredByGenre() {
      let currentGenre = this.genre;
      return this.tmdbSeries.filter((serie) => {
        return serie.tmdb && serie.tmdb.genres
          ? serie.tmdb.genres.findIndex((genre) => {
              return genre.id === currentGenre;
            }) > -1
          : false;
      });
    },
    filteredSeries() {
      if (this.search === null) {
        return this.filteredByGenre;
      } else {
        var re = new RegExp(this.search, "i");
        return this.filteredByGenre.filter((series) => {
          return (
            String(series.tmdb.name).match(re) ||
            String(series.tmdb.original_name).match(re) ||
            String(series.tmdb_id).match(re) ||
            String(series.tmdb.overview).match(re) ||
            this.formatDate(series.tmdb.release_date).match(re)
          );
        });
      }
    },
    filteredCast() {
      return this.viewerCredits
        .filter((cast) => {
          return cast.profile_path && cast.profile_path.length;
        })
        .slice(0, 8);
    },
    filteredSimilar() {
      return this.viewerSimilar.slice(0, 6);
    },
    filteredVideos() {
      return this.viewerVideos.slice(0, 2);
    },
    seasonsInSeries() {
      let seasons = 0;
      this.viewerEpisodes.map(e => {
        if (e.serie_season > seasons) {
          seasons = e.serie_season;
        }
      })
      return seasons;
    },
    perPage() {
      return this.settings.perPage;
    },
    pagedSeries() {
      this.total = this.filteredSeries.length;
      this.from = (this.currentPage - 1) * this.perPage || 0;
      this.to =
        this.from + this.perPage > this.total
          ? this.total
          : this.from + this.perPage;
      return this.filteredSeries.slice(this.from, this.to);
    },
    xdProInstanceItems() {
      return this.xdProInstances.map(instance => {
        return {
          text: instance.name,
          value: instance.id,
        }
      })
    }
  },
  methods: {
    ...mapActions(["updateTMDBGenres", "addxdProDownload"]),
    closeViewer() {
      this.viewer = false;
    },
    viewDetails(series) {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      this.viewerCredits = [];
      this.viewerKeywords = [];
      this.viewerSimilar = [];
      this.viewerVideos = [];
      this.viewerEpisodes = [];
      this.viewerSeries = series;
      this.viewerGroup = "";
      this.viewerPlaylist = "";
      this.loadSeriesDetails();
      this.viewer = true;
    },
    allProgress(proms, progress_cb) {
      let d = 0;
      progress_cb(0);
      for (const p of proms) {
        p.then(()=> {    
          d ++;
          progress_cb( (d * 100) / proms.length );
        });
      }
      return Promise.all(proms);
    },
    loadSeries() {
      this.isLoading = true;
      httpService.get(`serie/total/${this.movieSeriePlaylist}`)
        .then(res => {
          if (res.status === true) {
            let requests = [];
            for (var i = 0; i < res.data; i += 50) {
              requests.push(
                httpService.get(
                  `serie/browse/${this.movieSeriePlaylist}/${i}/50`
                )
              );
            } 
            this.allProgress(requests, (p) => {
              this.loadingText = this.$t("series.browse-loading").format(Math.round(p));
            })
            .then(res => {
              let series = [];
              res.forEach(result => {
                if (result.status === true) {
                  series = [...series, ...result.data];
                }
              });
              series.sort((a, b) => {
                return (
                  new Date(b.tmdb.first_air_date) - new Date(a.tmdb.first_air_date)
                );
              });
              this.series = series;
              this.isLoading = false;
            });
          }
        });

    },
    loadSeriesDetails() {
      this.isLoading = true;
      this.loadingText = "";
      httpService
        .get(`serie/details/${this.movieSeriePlaylist}/${this.viewerSeries.tmdb_id}`)
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.viewerCredits = res.data.credits.cast;
            this.viewerKeywords = res.data.keywords;
            this.viewerSimilar = res.data.similar;
            this.viewerVideos = res.data.videos;
            this.viewerGroup = res.data.group;
            this.viewerPlaylist = res.data.playlist;
            this.viewerEpisodes = res.data.episodes;
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    pagePrint() {
      document.getElementById("series").print();
    },
    searchSeries(search) {
      if (search.length === 0) {
        this.search = null;
      } else {
        this.search = search;
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString(this.$t("date.locale"), {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    formatSeconds(sec) {
      var d = Number(sec);
      var h = Math.floor(d / 3600);
      var m = Math.floor((d % 3600) / 60);
      var s = Math.floor((d % 3600) % 60);

      var hour = this.$t("general.hour");
      var hours = this.$t("general.hours");
      var minute = this.$t("general.minute");
      var minutes = this.$t("general.minutes");
      var second = this.$t("general.second");
      var seconds = this.$t("general.seconds");

      var hDisplay = h > 0 ? h + (h == 1 ? ` ${hour} ` : ` ${hours} `) : "";
      var mDisplay = m > 0 ? m + (m == 1 ? ` ${minute} ` : ` ${minutes} `) : "";
      var sDisplay = s > 0 ? s + (s == 1 ? ` ${second} ` : ` ${seconds} `) : "";
      return hDisplay + mDisplay + sDisplay;
    },
    downloadEpisode(url) {
      var link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.click();
    },
    episodesInSeason(season) {
      return this.viewerEpisodes.filter((episode) => {
        return episode.serie_season === season;
      });
    },
    episodeURL(episode) {
      return episode.source_stream_url && episode.source_stream_url.length ? episode.source_stream_url : episode.xtream_url;
    },
    episodeVideoType(episode) {
      if (episode.source_container_extension.toLowerCase() == "mkv") {
        return "video/webm";
      } else {
        return "video/mp4";
      }
    },
    formatDownloadFolder(folder) {
      return this.xdPro.download_folder.slice(-1) == "/" ? `${this.xdPro.download_folder}${folder}` : `${this.xdPro.download_folder}/${folder}`;
    },
    downloadModal(show, save = false) {
      if (show) {
        this.xdPro.downloads.length = 0;
      }
      if (save) {
        let downloads = [];
        this.xdPro.downloads.map(index => {
          const episode = this.viewerEpisodes[index];
          const year = new Date(this.viewerSeries.tmdb.first_air_date).getFullYear();
          let download = {
            user_id: this.currentUser.user.id,
            xdpro_id: this.xdPro.xdpro_id,
            filename: `${this.viewerSeries.tmdb.original_name} (${year}) S${String(episode.serie_season).padStart(2, "0")}E${String(episode.serie_episode).padStart(2, "0")}.${episode.source_container_extension}`,
            file_extension: episode.source_container_extension,
            type: 2,
            enabled: 0,
            download_folder: this.formatDownloadFolder(`${this.viewerSeries.tmdb.original_name} (${year})/Season ${episode.serie_season}/`)
          };
          if (episode.source_stream_url && episode.source_stream_url.length) {
            download.download_url = episode.source_stream_url;
            download.download_host = "";
            download.download_port = "";
            download.download_username = "";
            download.download_password = "";
          } else {
            download.download_url = episode.xtream_url;
            let u = new URL(episode.xtream_url);
            download.download_host = u.hostname;
            download.download_port = u.port;
            let p = u.pathname.split("/");
            download.download_username = p[2];
            download.download_password = p[3];
          }
          downloads.push(download);
        });
        this.addxdProDownload(downloads)
          .then(res => {
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
    toggleDownloadsSelection(item) {
      let idx = this.xdPro.downloads.indexOf(item);
      if (idx !== -1) {
        this.xdPro.downloads.splice(idx, 1);
      } else {
        this.xdPro.downloads.push(item);
      }
    },
    selectDownloadsRangeSelection(index) {
      const lastIndex =
        this.xdPro.downloads[this.xdPro.downloads.length - 1];
      const dir = index > lastIndex ? 1 : -1;
      for (let i = lastIndex; i != index + dir; i += dir) {
        if (!this.xdPro.downloads.includes(i)) {
          this.xdPro.downloads.push(i);
        }
      }
    },
    selectDownloadsSelection(item) {
      this.xdPro.downloads.length = 0;
      this.xdPro.downloads.push(item);
    },
  },
  beforeMount() {
    this.updateTMDBGenres({ source: "tv", language: this.$t("date.tmdb") });
    EventBus.$on("print", this.pagePrint);
    EventBus.$on("search", this.searchSeries);
    EventBus.$on("close-viewer", this.closeViewer);
    this.loadSeries();
  },
  beforeDestroy() {
    EventBus.$off("print", this.pagePrint);
    EventBus.$off("search", this.searchSeries);
    EventBus.$off("close-viewer", this.closeViewer);
  },
  watch: {
    viewer: function (val) {
      EventBus.$emit("update-viewer", val);
    },
    from: function (val) {
      EventBus.$emit("update-from", val);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    },
    to: function (val) {
      EventBus.$emit("update-to", val);
    },
    total: function (val) {
      EventBus.$emit("update-total", val);
    },
    "xdPro.xdpro_id": function (val) {
      let instance = this.xdProInstances.find(instance => {
        return instance.id == val;
      });
      if (instance) {
        this.xdPro.download_folder = instance.download_folder;
      }
    },
    movieSeriePlaylist: function () {
      this.loadSeries();
    }
  },
};
</script>

<style scoped lang="scss">
.radiobrowser-stations {
  overflow: hidden;

  .ps {
    max-height: 300px;
    padding-top: 0.25rem;
    padding-bottom: 0.5rem;
  }

  .radiobrowser-station {
    margin-top: 0.1rem;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    -khtml-user-select: none;
    -ms-user-select: none;
    -moz-user-select: none;
    user-select: none;

    &:focus,
    &:focus-within {
      &.selected {
        background-color: $theme-color-1 !important;

        a,
        i,
        span {
          color: $button-text-color !important;
        }
      }

      &.active {
        border-color: rgba($theme-color-1, 0.6) !important;

        a,
        span {
          font-weight: bold;
        }
        a,
        i,
        span {
          color: $theme-color-1;
        }
      }
    }

    &.selected {
      background-color: $theme-color-1 !important;
      &.success {
        background-color: $success-color !important;
      }
      &.danger {
        background-color: $error-color !important;
      }
      &.info {
        background-color: $info-color !important;
      }

      a,
      i,
      span {
        color: $button-text-color !important;
      }
    }

    &.active {
      border-color: rgba($theme-color-1, 0.6) !important;

      a,
      span {
        font-weight: bold;
      }
      a,
      i,
      span {
        color: $theme-color-1;
      }
    }
  }
}
</style>
