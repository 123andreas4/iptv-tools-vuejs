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
      <div class="px-2" style="min-height: 250px;">
        <label class="w-100">{{ $t("xd-pro.xd-pro-instance") }}</label>
        <erd-select class="mt-1 mb-2 w-100" v-model="xdPro.xdpro_id" :items="xdProInstanceItems"></erd-select>
        <label class="w-100">{{ $t("xd-pro.download-folder") }}</label>
        <erd-input class="mt-1 mb-2 w-100" v-model="xdPro.download_folder"></erd-input>
      </div>
      <template v-slot:footer>
        <erd-button
          @click="downloadModal(false)"
          icon="la-times"
          class="mr-1"
          variant="danger"
          >{{ $t("general.cancel") }}</erd-button
        >
        <erd-button icon="la-check" variant="success" :disabled="xdPro.xdpro_id == 0" @click="downloadModal(false, true)">{{
          $t("general.ok")
        }}</erd-button>
      </template>
    </erd-modal>
    <erd-spinner v-if="isLoading" size="lg" overlay absolute></erd-spinner>
    <erd-col xl="12" v-if="!viewer">
      <label class="d-block" for="search-movies">{{ $t("menu.search") }}</label>
      <erd-input class="mt-1 mb-2 w-100" id="search-movies" :placeholder="$t('menu.search')" v-model="movieSearch"></erd-input>
    </erd-col>
    <erd-col xl="12" class="m-0 p-0" v-if="viewer" id="movies">
      <erd-row class="m-0 p-0">
        <erd-col xl="4" md="4">
          <erd-card class="movie-details-poster">
            <img
              class="movie-poster"
              :src="
                viewerMovie.tmdb.poster_path && viewerMovie.tmdb.poster_path.length
                  ? `https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${viewerMovie.tmdb.poster_path}`
                  : viewerMovie.stream_icon
              "
            />
            <erd-card-body>
              <h3 class="mt-0 mb-1">
                {{ viewerMovie.tmdb.title }}
                <span class="float-right"
                  ><span class="color-theme-1">{{
                    viewerMovie.tmdb.vote_average
                  }}</span
                  ><span>/10</span></span
                >
              </h3>
              <p class="mt-0 text-small text-muted">
                {{ formatSeconds(viewerMovie.tmdb.runtime * 60) }}
              </p>
              <div class="genres">
                <span
                  class="genre"
                  v-for="(genre, index) in viewerMovie.tmdb.genres"
                  :key="`genre-${viewerMovie.tmdb.title}-${index}`"
                  >{{ genre.name }}</span
                >
              </div>
              <p class="color-theme-1 mt-1">
                {{ formatDate(viewerMovie.tmdb.release_date) }}
              </p>
              <p>{{ viewerMovie.tmdb.overview }}</p>
              <div class="keywords py-1">
                <span
                  class="keyword"
                  v-for="(keyword, index) in viewerMovie.tmdb_keywords"
                  :key="`keyword-${viewerMovie.tmdb.title}-${index}`"
                  >{{ keyword.name }}</span
                >
              </div>
              <a
                class="d-block mt-2 text-truncate"
                :href="viewerMovie.tmdb.homepage"
                target="_blank"
                v-if="viewerMovie.tmdb.homepage.length"
                >{{ viewerMovie.tmdb.homepage }}</a
              >
              <a
                class="d-block text-truncate"
                :href="`https://www.themoviedb.org/movie/${viewerMovie.tmdb_id}`"
                target="_blank"
                >{{
                  `https://www.themoviedb.org/movie/${viewerMovie.tmdb_id}`
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
            <erd-col xl="12">
              <div class="movie-view-card">
                <vue-plyr>
                  <video
                    controls
                    playsinline
                    :data-poster="`https://www.themoviedb.org/t/p/original/${viewerMovie.tmdb.backdrop_path}`"
                  >
                    <source :src="movieURL" :type="movieVideoType" />
                  </video>
                </vue-plyr>
              </div>
            </erd-col>
            <erd-col xl="12" class="p-0 m-0" v-if="filteredVideos.length">
              <h5 class="mt-2 mb-0 ml-3">{{ $t("movies.videos-trailers") }}</h5>
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
              xl="12"
              class="p-0 m-0"
              v-if="filteredCast && filteredCast.length"
            >
              <h5 class="mt-2 mb-0 ml-3">{{ $t("movies.main-characters") }}</h5>
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
            <erd-col xl="12" class="p-0 m-0" v-if="viewerMovie.tmdb_similar.length">
              <h5 class="mt-3 mb-0 ml-3">{{ $t("movies.similar-movies") }}</h5>
              <erd-row class="p-0 m-0">
                <erd-col
                  xl="4"
                  md="6"
                  xs="12"
                  v-for="(movie, index) in filteredSimilar"
                  :key="`movie-${movie.id}-${index}`"
                >
                  <erd-card class="movie-card depth-2">
                    <div class="poster">
                      <img
                        class="movie-poster"
                        :src="
                          movie.poster_path &&
                          movie.poster_path.length
                            ? `https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${movie.poster_path}`
                            : movie.stream_icon
                        "
                      />
                      <span class="score">{{ movie.vote_average }}</span>
                    </div>
                    <erd-card-body class="py-3">
                      <h5 class="m-0">{{ movie.title }}</h5>
                      <p class="m-0 text-muted text-small">
                        {{ formatDate(movie.release_date) }}
                      </p>
                      <div class="genres mt-2">
                        <span
                          class="genre"
                          v-for="(genre, index) in movie.genres"
                          :key="`genre-${movie.title}-${index}`"
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
    <erd-row class="m-0 p-0" v-else id="movies">
      <erd-col xl="12" xs="12" v-if="topRatedMovies.length === 0">
        <p class="text-center text-muted">
          {{ $t("movies.no-movies") }}
        </p>
      </erd-col>
      <erd-col
        xl="3"
        lg="4"
        md="6"
        xs="12"
        v-for="(movie, index) in pagedMovies"
        :key="`popular-${index}`"
      >
        <erd-card class="movie-card depth-2">
          <div class="poster">
            <button class="more-button" @click="viewDetails(movie)">
              <i class="las la-ellipsis-h"></i>
            </button>
            <img
              class="movie-poster"
              :src="`https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${movie.tmdb.poster_path}`"
            />
            <span class="score">{{ movie.tmdb.vote_average }}</span>
          </div>
          <erd-card-body class="py-3">
            <h5 class="m-0">
              <a href="#" @click.prevent="viewDetails(movie)">{{
                movie.tmdb.title
              }}</a>
            </h5>
            <p class="m-0 text-muted text-small">
              {{ formatDate(movie.tmdb.release_date) }}
            </p>
            <div class="genres mt-2">
              <span
                class="genre"
                v-for="(genre, index) in movie.tmdb.genres"
                :key="`genre-${movie.tmdb.title}-${index}`"
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
      viewerMovie: null,
      viewer: false,
      search: null,
      isLoading: false,
      loadingText: "",
      topRatedMovies: [],
      from: 0,
      to: 0,
      total: 0,
      currentPage: 0,
      movieSearch: "",
      bounce: null,
      xdPro: {
        modal: false,
        xdpro_id: 0,
        download_folder: "",
      }
    };
  },
  computed: {
    ...mapGetters(["xdProInstances", "settings", "currentUser", "movieSeriePlaylist"]),
    canDownload() {
      return this.xdProInstances && this.xdProInstances.length > 0;
    },
    filteredMovies() {
      if (this.search === null) {
        return this.topRatedMovies;
      } else {
        var re = new RegExp(this.search, "i");
        return this.topRatedMovies.filter((movie) => {
          return (
            String(movie.title).match(re) ||
            String(movie.url).match(re) ||
            String(movie.year).match(re) ||
            String(movie.tmdb_id).match(re) ||
            String(movie.tmdb.original_title).match(re) ||
            String(movie.tmdb.overview).match(re) ||
            this.formatDate(movie.tmdb.release_date).match(re)
          );
        });
      }
    },
    filteredCast() {
      return this.viewerMovie.tmdb_credits.cast
        .filter((cast) => {
          return cast.profile_path && cast.profile_path.length;
        })
        .slice(0, 8);
    },
    filteredSimilar() {
      return this.viewerMovie.tmdb_similar.slice(0, 6);
    },
    filteredVideos() {
      return this.viewerMovie.tmdb_videos.slice(0, 2);
    },
    movieURL() {
      return this.viewerMovie.source_stream_url && this.viewerMovie.source_stream_url.length ? this.viewerMovie.source_stream_url : this.viewerMovie.xtream_url;
    },
    movieVideoType() {
      if (this.viewerMovie.source_container_extension.toLowerCase() == "mkv") {
        return "video/webm";
      } else {
        return "video/mp4";
      }
    },
    perPage() {
      return this.settings.perPage;
    },
    pagedMovies() {
      this.total = this.filteredMovies.length;
      this.from = (this.currentPage - 1) * this.perPage || 0;
      this.to =
        this.from + this.perPage > this.total
          ? this.total
          : this.from + this.perPage;
      return this.filteredMovies.slice(this.from, this.to);
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
    viewDetails(movie) {
      this.viewerMovie = movie;
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
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
    loadMovies(search) {
      if (!this.movieSeriePlaylist) {
        return;
      }
      if (search == null || !search.length) {
        this.topRatedMovies = [];
        return;
      }
      this.isLoading = true;
      httpService.get(`movies/search/${this.movieSeriePlaylist}/${encodeURI(search)}`)
      .then(res => {
        if (res.status === true) {
          let movies = [...res.data];
          movies.sort((a, b) => {
            return (
              new Date(b.tmdb.release_date) - new Date(a.tmdb.release_date)
            );
          });
          this.topRatedMovies = movies;
        }
        this.isLoading = false;
      });
    },
    pagePrint() {
      document.getElementById("movies").print();
    },
    keywords(index) {
      return this.$t(`faq.${index}-keywords`).split(",");
    },
    searchMovie(search) {
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
    downloadModal(show, save = false) {
      if (save) {
        let download = {
          user_id: this.currentUser.user.id,
          xdpro_id: this.xdPro.xdpro_id,
          filename: `${this.viewerMovie.movie_name} (${this.viewerMovie.movie_year}).${this.viewerMovie.source_container_extension}`,
          file_extension: this.viewerMovie.source_container_extension,
          type: 1,
          enabled: 0,
          download_folder: this.xdPro.download_folder
        };
        if (this.viewerMovie.source_stream_url && this.viewerMovie.source_stream_url.length) {
          download.download_url = this.viewerMovie.source_stream_url
          download.download_host = "";
          download.download_port = "";
          download.download_username = "";
          download.download_password = "";
        } else {
          download.download_url = this.viewerMovie.xtream_url;
          let u = new URL(this.viewerMovie.xtream_url);
          download.download_host = u.hostname;
          download.download_port = u.port;
          let p = u.pathname.split("/");
          download.download_username = p[2];
          download.download_password = p[3];
        }
        this.addxdProDownload(download)
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
          })
      }
      this.xdPro.modal = show;
    },
  },
  beforeMount() {
    this.updateTMDBGenres({ source: "movie", language: this.$t("date.tmdb") });
    EventBus.$on("print", this.pagePrint);
    EventBus.$on("search", this.searchMovie);
    EventBus.$on("close-viewer", this.closeViewer);
  },
  beforeDestroy() {
    EventBus.$off("print", this.pagePrint);
    EventBus.$off("search", this.searchMovie);
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
    movieSearch: function (val) {
      let vm = this;
      clearTimeout(this.bounce);
      this.bounce = setTimeout(function () {
        vm.loadMovies(val);
      }, 500);
    },
    "xdPro.xdpro_id": function (val) {
      let instance = this.xdProInstances.find(instance => {
        return instance.id == val;
      });
      if (instance) {
        this.xdPro.download_folder = instance.download_folder;
      }
    }
  },
};
</script>

<style scoped lang="scss">
.movie-details-poster {
}
</style>
