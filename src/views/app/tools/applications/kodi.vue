<template>
  <erd-row class="m-0 p-0">
    <erd-spinner v-if="isLoading" size="lg" overlay absolute></erd-spinner>
    <!--  

      INSTANCE EDITOR

    -->
    <erd-modal
      v-show="modal"
      @close="m3u2strmModal(false)"
      :title="$t('kodi.kodi')"
      class="select-none"
      small
    >
      <div class="px-2" v-if="instance">
        <label class="w-100">{{ $t("kodi.name") }}</label>
        <erd-input
          class="mt-1 mb-2 w-100"
          v-model="instance.name"
        ></erd-input>
        <label class="w-100">{{ $t("kodi.code") }}</label>
        <erd-input
          class="mt-1 mb-2 w-100"
          v-model="instance.code"
          readonly
        ></erd-input>
        <label class="w-100">{{ $t("kodi.movies") }}</label>
        <div class="kodi-movies form-control mt-1 mb-2">
          <perfect-scrollbar>
            <erd-checkbox v-for="(movie, index) in movies" :key="`movie-${index}`" class="mx-2" :class="{'mt-2': index === 0}" v-model="instance.groups" :value="movie.id">{{ movie.group_name }}</erd-checkbox>
          </perfect-scrollbar>
        </div>
        <label class="w-100">{{ $t("kodi.series") }}</label>
        <div class="kodi-series form-control mt-1 mb-2">
          <perfect-scrollbar>
            <erd-checkbox v-for="(serie, index) in series" :key="`serie-${index}`" class="mx-2" :class="{'mt-2': index === 0}" v-model="instance.groups" :value="serie.id">{{ serie.group_name }}</erd-checkbox>
          </perfect-scrollbar>
        </div>
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
      <div class="pt-3 select-none kodi-menu">
        <erd-collapse
          :title="$t('kodi.kodi')"
          key="kodi-instance"
          small
        >
          <ul class="list-unstyled mb-0">
            <li class="nav-item">
              <a href="#" @click.prevent="addInstance"
                ><i class="las la-plus mr-1"></i
                >{{ $t("kodi.add-instance") }}</a
              >
            </li>
          </ul>
        </erd-collapse>
        <erd-collapse
          :title="$t('kodi.download-addon')"
          key="kodi-download"
          small
        >
          <ul class="list-unstyled mb-0">
            <li class="nav-item">
              <a href="https://iptv-tools.com/downloads/m3u2strm-win.zip"
                ><i class="las la-download mr-1"></i
                >{{ $t("kodi.download-zip") }}</a
              >
            </li>
            <li class="nav-item">
              <div class="form-control">
                <p class="text-center text-small">{{ $t("kodi.add-source") }}</p>
              </div>
            </li>
          </ul>
        </erd-collapse>
        <div class="px-2 kodi-description">
          <p class="text-muted">{{ $t("kodi.description") }}</p>
        </div>
      </div>
    </erd-app-menu>
    <!--  

      M3U 2 STRM INSTANCES

    -->
    <erd-col xl="12" sm="12">
      <b-table :items="pagedInstances" :fields="fields" striped small>
        <template v-slot:cell(groups)="row">
          <erd-badge v-for="group in row.item.groups" :key="`group-${group}`" :variant="groupVariant(group)" class="mr-1 mt-1 d-inline-block">{{ groupName(group) }}</erd-badge>
        </template>
        <template v-slot:cell(code)="row">
          <erd-badge variant="success"><i class="las la-key"></i> {{ row.item.code }}</erd-badge>
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
      movies: [],
      series: [],
      from: 0,
      to: 0,
      total: 0,
      currentPage: 0,
      fields: [
        { key: "name", label: this.$t("m3u2strm.name"), sortable: true },
        {
          key: "groups",
          label: this.$t("kodi.groups"),
          sortable: true,
        },
        {
          key: "code",
          label: this.$t("kodi.code"),
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
        return this.instances.filter((kodi) => {
          return (
            String(kodi.name).match(re) ||
            String(kodi.code).match(re) ||
            String(kodi.groups).match(re)
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
    addInstance() {
      this.isLoading = true;
      httpService.post("kodi/instance").then((res) => {
        this.isLoading = false;
        if (res.status === true) {
          this.instance = {
            id: res.data.id,
            name: "",
            groups: [],
            code: res.data.code,
            pin: ""
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
        .delete(`kodi/instance/${id}`)
        .then((res) => {
          this.isLoading = false;
          this.loadInstances();
          if (res.status === true) {
            this.$notify(
              "primary",
              this.$t("profile.success"),
              this.$t("kodi.delete-success"),
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
            this.$t("kodi.delete-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    saveInstance() {
      this.isLoading = true;
      let instance = Object.assign({}, this.instance);
      httpService
        .put(`kodi/instance/${this.instance.id}`, instance)
        .then((res) => {
          this.isLoading = false;
          this.loadInstances();
          if (res.status === true) {
            this.instance = null;
            this.$notify(
              "primary",
              this.$t("profile.success"),
              this.$t("kodi.save-success"),
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
            this.$t("kodi.save-error"),
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
        .get("kodi/instances")
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
    loadGroups() {
      this.isLoading = true;
      httpService
        .get("kodi/groups")
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.movies = res.data.movies;
            this.series = res.data.series;
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    refresh() {
      this.loadGroups();
      this.loadInstances();
    },
    groupVariant(id) {
      let movie = this.movies.find(m => m.id === id);
      let serie = this.series.find(s => s.id === id);
      if (movie !== undefined) {
        return 'info';
      }
      if (serie !== undefined) {
        return 'primary';
      }
      return 'danger';
    },
    groupName(id) {
      let movie = this.movies.find(m => m.id === id);
      let serie = this.series.find(s => s.id === id);
      if (movie !== undefined) {
        return movie.group_name;
      }
      if (serie !== undefined) {
        return serie.group_name;
      }
      return 'N/A';
    }
  },
  beforeMount() {
    this.loadGroups();
    this.loadInstances();
    document.body.classList.add("right-menu");
    EventBus.$on("search", this.searchStream);
    EventBus.$on("print", this.printStreams);
    EventBus.$on("refresh", this.refresh);
  },
  beforeDestroy() {
    document.body.classList.remove("right-menu");
    EventBus.$off("search", this.searchStream);
    EventBus.$off("print", this.printStreams);
    EventBus.$off("refresh", this.refresh);
  },
  watch: {},
};
</script>

<style lang="scss">
.kodi-menu {
  position: relative;
  height: calc(100% - 50px);
}

.kodi-description {
  position: absolute;
  bottom: 0;
}

.kodi-movies {
  height: 150px !important;
  padding: 0 !important;
  .ps {
    height: 100%;
  }
}

.kodi-series {
  height: 150px !important;
  padding: 0 !important;
  .ps {
    height: 100%;
  }
}
</style>
