<template>
  <erd-row class="m-0 p-0">
    <erd-spinner v-if="isLoading" size="lg" overlay absolute></erd-spinner>
    <!--  

      INSTANCE EDITOR

    -->
    <erd-modal
      v-show="modal"
      @close="m3u2strmModal(false)"
      :title="$t('m3u2strm.m3u-2-strm')"
      class="select-none"
      small
    >
      <div class="px-2" v-if="instance">
        <label class="w-100">{{ $t("m3u2strm.name") }}</label>
        <erd-input
          class="mt-1 mb-2 w-100"
          v-model="instance.name"
        ></erd-input>
         <label class="w-100">{{ $t("general.playlist") }}</label>
        <erd-select
          key="playlist"
          class="w-100 mt-1 mb-2"
          :items="playlists"
          v-model="instance.playlist_id"
        ></erd-select>
        <label class="w-100">{{ $t("m3u2strm.file-naming-movies") }}</label>
        <erd-select
          key="file-naming-movies"
          class="w-100 mt-1 mb-2"
          :items="filenamingMovies"
          v-model="instance.file_naming_movies"
        ></erd-select>
        <label class="w-100">{{ $t("m3u2strm.movies-folder") }}</label>
        <erd-input
          class="mt-1 mb-2 w-100"
          v-model="instance.movies_folder"
        ></erd-input>
        <label class="w-100">{{ $t("m3u2strm.file-naming-series") }}</label>
        <erd-select
          key="file-naming-series"
          class="w-100 mt-1 mb-2"
          :items="filenamingSeries"
          v-model="instance.file_naming_series"
        ></erd-select>
        <label class="w-100">{{ $t("m3u2strm.series-folder") }}</label>
        <erd-input
          class="mt-1 mb-2 w-100"
          v-model="instance.series_folder"
        ></erd-input>
        <erd-checkbox
          class="mb-1 mt-1"
          v-model="instance.create_nfo"
          :true-value="1"
          :false-value="0"
          >{{ $t("m3u2strm.create-nfo") }}</erd-checkbox
        >
        <erd-checkbox
          class="mb-1 mt-1"
          v-model="instance.overwrite_files"
          :true-value="1"
          :false-value="0"
          >{{ $t("m3u2strm.overwrite-files") }}</erd-checkbox
        >
        <erd-checkbox
          class="mb-3 mt-1"
          v-model="instance.delete_removed"
          :true-value="1"
          :false-value="0"
          >{{ $t("m3u2strm.delete-removed") }}</erd-checkbox
        >
      </div>
      <template v-slot:footer>
        <erd-button
          @click="m3u2strmModal(false)"
          icon="la-times"
          class="mr-1"
          variant="danger"
          >{{ $t("general.cancel") }}</erd-button
        >
        <erd-button
          icon="la-check"
          variant="success"
          @click="m3u2strmModal(false, true)"
          >{{ $t("general.ok") }}</erd-button
        >
      </template>
    </erd-modal>
    <!--  

      APP MENU

    -->
    <erd-app-menu icon="la-tools">
      <div class="pt-3 select-none m3u-2-strm-menu">
        <erd-collapse
          :title="$t('m3u2strm.m3u-2-strm')"
          key="m3u-2-strm-instance"
          small
        >
          <ul class="list-unstyled mb-0">
            <li class="nav-item">
              <a href="#" @click.prevent="addInstance"
                ><i class="las la-plus mr-1"></i
                >{{ $t("m3u2strm.add-instance") }}</a
              >
            </li>
          </ul>
        </erd-collapse>
        <erd-collapse
          :title="$t('m3u2strm.download-m3u2strm')"
          key="m3u-2-strm-download"
          small
        >
          <ul class="list-unstyled mb-0">
            <li class="nav-item">
              <a href="https://iptv-tools.com/downloads/m3u2strm-win.zip"
                ><i class="las la-download mr-1"></i
                >{{ $t("xd-pro.download-windows") }}</a
              >
            </li>
            <li class="nav-item">
              <a href="https://iptv-tools.com/downloads/m3u2strm-linux.zip"
                ><i class="las la-download mr-1"></i
                >{{ $t("xd-pro.download-linux") }}</a
              >
            </li>
            <!--<li class="nav-item">
              <a href="https://iptv-tools.com/downloads/m3u2strm-macos.zip"
                ><i class="las la-download mr-1"></i
                >{{ $t("xd-pro.download-macos") }}</a
              >
            </li>
            <li class="nav-item">
              <a href="https://iptv-tools.com/downloads/m3u2strm-php.zip"
                ><i class="las la-download mr-1"></i
                >{{ $t("xd-pro.download-php") }}</a
              >
            </li>-->
          </ul>
        </erd-collapse>
        <div class="px-2 m3u-2-strm-description">
          <p class="text-muted">{{ $t("m3u2strm.description") }}</p>
        </div>
      </div>
    </erd-app-menu>
    <!--  

      M3U 2 STRM INSTANCES

    -->
    <erd-col xl="12" sm="12">
      <b-table :items="pagedInstances" :fields="fields" striped small>
        <template v-slot:cell(file_naming_movies)="row">
          {{ fnMovies(row.item.file_naming_movies) }}
        </template>
        <template v-slot:cell(file_naming_series)="row">
          {{ fnSeries(row.item.file_naming_series) }}
        </template>
        <template v-slot:cell(actions)="row">
          <erd-tooltip :tooltip="$t('xd-pro.tooltip-edit-instance')" :enabled="showTooltips">
            <erd-button
              variant="info"
              class="btn-table"
              @click="editInstance(row.item)"
              ><i class="las la-pen"></i
            ></erd-button>
          </erd-tooltip>
          <erd-tooltip :tooltip="$t('xd-pro.tooltip-delete-instance')" :enabled="showTooltips">
            <erd-button
              variant="danger"
              class="btn-table"
              @click="deleteInstance(row.item.id)"
              ><i class="las la-trash"></i
            ></erd-button>
          </erd-tooltip>
        </template>
      </b-table>
      <b-pagination
        key="m3u2strm-instances"
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
      search: null,
      isLoading: false,
      modal: false,
      instance: null,
      instances: [],
      playlists: [],
      from: 0,
      to: 0,
      total: 0,
      currentPage: 0,
      filenamingMovies: [
        { text: this.$t("m3u2strm.file-naming-movies-1"), value: 1 },
        { text: this.$t("m3u2strm.file-naming-movies-2"), value: 2 },
        { text: this.$t("m3u2strm.file-naming-movies-3"), value: 3 }
      ],
      filenamingSeries: [
        { text: this.$t("m3u2strm.file-naming-series-1"), value: 1 },
        { text: this.$t("m3u2strm.file-naming-series-2"), value: 2 },
        { text: this.$t("m3u2strm.file-naming-series-3"), value: 3 }
      ],
      fields: [
        { key: "name", label: this.$t("m3u2strm.name"), sortable: true },
        {
          key: "movies_folder",
          label: this.$t("m3u2strm.movies-folder"),
          sortable: true,
        },
        {
          key: "file_naming_movies",
          label: this.$t("m3u2strm.file-naming-movies"),
          sortable: true,
        },
        {
          key: "series_folder",
          label: this.$t("m3u2strm.series-folder"),
          sortable: true,
        },
        {
          key: "file_naming_series",
          label: this.$t("m3u2strm.file-naming-series"),
          sortable: true,
        },
        {
          key: "actions",
          label: this.$t("users.actions"),
          sortable: false,
          thClass: "text-right",
          tdClass: "text-right",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["currentUser", "settings"]),
    showTooltips () {
      return this.settings.showTooltips;
    },
    searchFilteredInstances() {
      if (this.search === null) {
        return this.instances;
      } else {
        var re = new RegExp(this.search, "i");
        return this.instances.filter((m3u2strm) => {
          return (
            String(m3u2strm.name).match(re) ||
            String(m3u2strm.folder).match(re) ||
            String(m3u2strm.movies).match(re) ||
            String(m3u2strm.series).match(re)
          );
        });
      }
    },
    perPage() {
      return this.settings.perPage;
    },
    pagedInstances() {
      this.total = this.searchFilteredInstances.length;
      this.from = (this.currentPage - 1) * this.perPage || 0;
      this.to =
        this.from + this.perPage > this.total
          ? this.total
          : this.from + this.perPage;
      return this.searchFilteredInstances.slice(this.from, this.to);
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
    fnMovies (val) {
      let x = this.filenamingMovies.find(fn => fn.value === val);
      return x ? x.text : "";
    },
    fnSeries (val) {
      let x = this.filenamingSeries.find(fn => fn.value === val);
      return x ? x.text : "";
    },
    addInstance() {
      this.isLoading = true;
      httpService.post("m3u-2-strm/instance").then((res) => {
        this.isLoading = false;
        if (res.status === true) {
          this.instance = {
            id: res.data,
            name: "",
            movies_folder: "",
            series_folder: "",
            file_naming_movies: 1,
            file_naming_series: 1,
            create_nfo: 0,
            overwrite_files: 0,
            delete_removed: 1,
            playlist_id: 0,
          };
          this.modal = true;
        }
      });
    },
    editInstance(instance) {
      this.instance = Object.assign({}, instance);
      this.modal = true;
    },
    deleteInstance(id) {
      this.isLoading = true;
      httpService
        .delete(`m3u-2-strm/instance/${id}`)
        .then((res) => {
          this.isLoading = false;
          this.loadInstances();
          if (res.status === true) {
            this.$notify(
              "primary",
              this.$t("profile.success"),
              this.$t("m3u2strm.delete-success"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.loadInstances();
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("m3u2strm.delete-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    saveInstance() {
      this.isLoading = true;
      let instance = Object.assign({}, this.instance);
      httpService
        .put(`m3u-2-strm/instance/${this.instance.id}`, instance)
        .then((res) => {
          this.isLoading = false;
          this.loadInstances();
          if (res.status === true) {
            this.instance = null;
            this.$notify(
              "primary",
              this.$t("profile.success"),
              this.$t("m3u2strm.save-success"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.loadInstances();
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("m3u2strm.save-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    m3u2strmModal(show, save = false) {
      if (save) {
        this.saveInstance();
      }
      this.modal = show;
    },
    loadInstances() {
      this.isLoading = true;
      httpService
        .get("m3u-2-strm/instances")
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.instances = res.data;
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    loadPlaylists() {
      httpService
        .get("playlist")
        .then((res) => {
          if (res.status === true) {
            this.playlists = res.data.map(p => {
              return {
                text: p.name,
                value: p.id
              }
            });
          }  
        });
    }
  },
  beforeMount() {
    this.loadInstances();
    this.loadPlaylists();
    document.body.classList.add("right-menu");
    EventBus.$on("search", this.searchStream);
    EventBus.$on("print", this.printStreams);
    EventBus.$on("refresh", this.loadInstances);
  },
  beforeDestroy() {
    document.body.classList.remove("right-menu");
    EventBus.$off("search", this.searchStream);
    EventBus.$off("print", this.printStreams);
    EventBus.$off("refresh", this.loadInstances);
  },
  watch: {},
};
</script>

<style lang="scss">
.m3u-2-strm-menu {
  position: relative;
  height: calc(100% - 50px);
}

.m3u-2-strm-description {
  position: absolute;
  bottom: 0;
}
</style>
