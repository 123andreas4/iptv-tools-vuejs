<template>
  <erd-row class="m-0 p-0">
    <erd-spinner v-if="isLoading" size="lg" overlay absolute></erd-spinner>
    <!--  

      INSTANCE EDITOR

    -->
    <erd-modal
      v-show="xdPro.modal"
      @close="xdProModal(false)"
      :title="$t('xd-pro.xd-pro')"
      class="select-none"
      small
    >
      <div class="px-2" v-if="xdPro.instance">
        <label class="w-100">{{ $t("xd-pro.name") }}</label>
        <erd-input
          class="mt-1 mb-2 w-100"
          v-model="xdPro.instance.name"
        ></erd-input>
        <label class="w-100">{{ $t("xd-pro.speed-limit") }}</label>
        <erd-select
          key="speed-limit"
          class="w-100 mt-1 mb-2"
          :items="speedLimits"
          v-model="xdPro.instance.speed_limit"
        ></erd-select>
        <label class="w-100">{{ $t("xd-pro.useragent") }}</label>
        <erd-select
          key="useragent"
          class="w-100 mt-1 mb-2"
          :items="useragents"
          v-model="xdPro.instance.useragent"
        ></erd-select>
        <label class="w-100">{{ $t("xd-pro.download-folder") }}</label>
        <erd-input
          class="mt-1 mb-2 w-100"
          v-model="xdPro.instance.download_folder"
        ></erd-input>
        <erd-checkbox
          class="mb-3"
          v-model="xdPro.instance.check_connections"
          :true-value="1"
          :false-value="0"
          >{{ $t("xd-pro.check-connections") }}</erd-checkbox
        >
        <div class="mb-5"></div>
      </div>
      <template v-slot:footer>
        <erd-button
          @click="xdProModal(false)"
          icon="la-times"
          class="mr-1"
          variant="danger"
          >{{ $t("general.cancel") }}</erd-button
        >
        <erd-button
          icon="la-check"
          variant="success"
          @click="xdProModal(false, true)"
          >{{ $t("general.ok") }}</erd-button
        >
      </template>
    </erd-modal>
    <!--  

      DOWNLOAD EDITOR

    -->
    <erd-modal
      v-show="downloads.modal"
      @close="downloadModal(false)"
      :title="$t('xd-pro.downloads')"
      class="select-none"
      small
    >
      <div class="px-2" v-if="downloads.download">
        <label class="w-100">{{ $t("xd-pro.xd-pro-instance") }}</label>
        <erd-select
          key="instance"
          class="w-100 mt-1 mb-2"
          :items="downloadInstances"
          v-model="downloads.download.xdpro_id"
        ></erd-select>
        <label class="w-100">{{ $t("xd-pro.download-url") }}</label>
        <erd-input
          class="mt-1 mb-2 w-100"
          v-model="downloads.download.download_url"
        ></erd-input>
        <label class="w-100">{{ $t("xd-pro.filename") }}</label>
        <erd-input
          class="mt-1 mb-2 w-100"
          v-model="downloads.download.filename"
        ></erd-input>
        <label class="w-100">{{ $t("xd-pro.file-extension") }}</label>
        <erd-input
          class="mt-1 mb-2 w-100"
          v-model="downloads.download.file_extension"
        ></erd-input>
        <label class="w-100">{{ $t("xd-pro.download-folder") }}</label>
        <erd-input
          class="mt-1 mb-2 w-100"
          v-model="downloads.download.download_folder"
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
          @click="downloadModal(false, true)"
          >{{ $t("general.ok") }}</erd-button
        >
      </template>
    </erd-modal>
    <!--  

      XD-PRO INSTANCES

    -->
    <erd-col xl="12" sm="12" v-show="activeTab == 0">
      <b-table :items="pagedInstances" :fields="xdPro.fields" striped small>
        <template v-slot:cell(speed_limit)="row">
          {{
            speedLimits.find((limit) => limit.value === row.item.speed_limit)
              .text
          }}
        </template>
        <template v-slot:cell(check_connections)="row">
          <erd-badge variant="success" v-if="row.item.check_connections">{{
            $t("general.yes")
          }}</erd-badge>
          <erd-badge variant="danger" v-else>{{ $t("general.no") }}</erd-badge>
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
        key="xdpro-instances"
        class="w-100 my-3"
        size="sm"
        align="center"
        :total-rows="xdPro.total"
        :per-page="perPage"
        v-model="xdPro.currentPage"
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
    <!--  

      DOWNLOADS

    -->
    <erd-col xl="12" sm="12" v-show="activeTab == 1">
      <b-table :items="pagedDownloads" :fields="downloads.fields" striped small>
        <template v-slot:cell(type)="row">
          <erd-badge variant="info" v-if="row.item.type == 1"
            ><i class="las la-film mr-1"></i>{{ $t("xd-pro.movie") }}</erd-badge
          >
          <erd-badge variant="primary" v-if="row.item.type == 2"
            ><i class="las la-video mr-1"></i
            >{{ $t("xd-pro.series") }}</erd-badge
          >
          <erd-badge variant="success" v-if="row.item.type == 3"
            ><i class="las la-tv mr-1"></i
            >{{ $t("xd-pro.catch-up") }}</erd-badge
          >
        </template>
        <template v-slot:cell(active)="row">
          <erd-badge variant="success" v-if="row.item.active == 1">{{
            $t("general.yes")
          }}</erd-badge>
          <erd-badge variant="danger" v-else>{{ $t("general.no") }}</erd-badge>
        </template>
        <template v-slot:cell(enabled)="row">
          <erd-badge variant="success" v-if="row.item.enabled == 1">{{
            $t("general.yes")
          }}</erd-badge>
          <erd-badge variant="danger" v-else>{{ $t("general.no") }}</erd-badge>
        </template>
        <template v-slot:cell(progress)="row">
          <erd-progress-bar
            :variant="row.item.has_error ? 'danger' : 'info'"
            :value="row.item.progress"
            class="download-progress"
          ></erd-progress-bar>
        </template>
        <template v-slot:cell(actions)="row">
          <erd-tooltip :tooltip="$t('xd-pro.tooltip-edit-download')" :enabled="showTooltips">
            <erd-button
              variant="info"
              class="btn-table"
              @click="editDownload(row.item)"
              :disabled="row.item.active == 1"
              ><i class="las la-pen"></i
            ></erd-button>
          </erd-tooltip>
          <erd-tooltip :tooltip="$t('xd-pro.tooltip-pause-download')" :enabled="showTooltips">
            <erd-button
              variant="primary"
              class="btn-table"
              @click="pauseDownload(row.item)"
              :disabled="row.item.active == 1 || row.item.enabled == 0"
              ><i class="las la-pause"></i
            ></erd-button>
          </erd-tooltip>
          <erd-tooltip :tooltip="$t('xd-pro.tooltip-resume-download')" :enabled="showTooltips">
            <erd-button
              variant="primary"
              class="btn-table"
              @click="resumeDownload(row.item)"
              :disabled="row.item.active == 1 || row.item.enabled == 1"
              ><i class="las la-play"></i
            ></erd-button>
          </erd-tooltip>
          <erd-tooltip :tooltip="$t('xd-pro.tooltip-delete-download')" :enabled="showTooltips">
            <erd-button
              variant="danger"
              class="btn-table"
              @click="deleteDownload(row.item.id)"
              :disabled="row.item.active == 1"
              ><i class="las la-trash"></i
            ></erd-button>
          </erd-tooltip>
        </template>
      </b-table>
      <b-pagination
        key="xdpro-downloads"
        class="w-100 my-3"
        size="sm"
        align="center"
        :total-rows="downloads.total"
        :per-page="perPage"
        v-model="downloads.currentPage"
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
    <!--  

      APP MENU

    -->
    <erd-app-menu icon="la-tools">
      <div class="pt-3 select-none xd-pro-menu">
        <erd-collapse
          :title="$t('xd-pro.xd-pro')"
          key="xd-pro-instance"
          v-if="activeTab == 0"
          small
        >
          <ul class="list-unstyled mb-0">
            <li class="nav-item">
              <a href="#" @click.prevent="addInstance"
                ><i class="las la-plus mr-1"></i
                >{{ $t("xd-pro.add-instance") }}</a
              >
            </li>
          </ul>
        </erd-collapse>
        <erd-collapse
          :title="$t('xd-pro.download-xd-pro')"
          key="xd-pro-download"
          v-if="activeTab == 0"
          small
        >
          <ul class="list-unstyled mb-0">
            <li class="nav-item">
              <a href="#" @click.prevent
                ><i class="las la-download mr-1"></i
                >{{ $t("xd-pro.download-windows") }}</a
              >
            </li>
            <li class="nav-item">
              <a href="#" @click.prevent
                ><i class="las la-download mr-1"></i
                >{{ $t("xd-pro.download-linux") }}</a
              >
            </li>
            <li class="nav-item">
              <a href="#" @click.prevent
                ><i class="las la-download mr-1"></i
                >{{ $t("xd-pro.download-macos") }}</a
              >
            </li>
            <li class="nav-item">
              <a href="#" @click.prevent
                ><i class="las la-download mr-1"></i
                >{{ $t("xd-pro.download-php") }}</a
              >
            </li>
          </ul>
        </erd-collapse>
        <erd-collapse
          :title="$t('xd-pro.downloads')"
          key="xd-pro-downloads"
          v-if="activeTab == 1"
          small
        >
          <ul class="list-unstyled mb-0">
            <li class="nav-item">
              <a href="#" @click.prevent="resumeDownloads"
                ><i class="las la-play mr-1"></i
                >{{ $t("xd-pro.resume-downloads") }}</a
              >
            </li>
            <li class="nav-item">
              <a href="#" @click.prevent="pauseDownloads"
                ><i class="las la-pause mr-1"></i
                >{{ $t("xd-pro.pause-downloads") }}</a
              >
            </li>
          </ul>
        </erd-collapse>
        <erd-collapse
          :title="$t('xd-pro.delete')"
          key="xd-pro-delete"
          v-if="activeTab == 1"
          small
        >
          <ul class="list-unstyled mb-0">
            <li class="nav-item">
              <a href="#" @click.prevent="deleteDownloads(true)"
                ><i class="las la-trash mr-1"></i
                >{{ $t("xd-pro.delete-disabled") }}</a
              >
            </li>
            <li class="nav-item">
              <a href="#" @click.prevent="deleteDownloads(false)"
                ><i class="las la-trash mr-1"></i
                >{{ $t("xd-pro.delete-all") }}</a
              >
            </li>
          </ul>
        </erd-collapse>
        <div class="px-2 xd-pro-description">
          <p class="text-muted">{{ $t("xd-pro.description") }}</p>
        </div>
      </div>
    </erd-app-menu>
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
      useragents: [
        { text: this.$t("xd-pro.iptv-tools"), value: "IPTV-Tools/1.0" },
        { text: this.$t("xd-pro.browser-default"), value: navigator.userAgent },
      ],
      speedLimits: [
        { text: this.$t("xd-pro.no-limit"), value: 0 },
        { text: this.$t("xd-pro.20-mbs"), value: 1 },
        { text: this.$t("xd-pro.15-mbs"), value: 2 },
        { text: this.$t("xd-pro.10-mbs"), value: 3 },
        { text: this.$t("xd-pro.5-mbs"), value: 4 },
      ],
      xdPro: {
        modal: false,
        instance: null,
        instances: [],
        from: 0,
        to: 0,
        total: 0,
        currentPage: 0,
        fields: [
          { key: "name", label: this.$t("xd-pro.name"), sortable: true },
          {
            key: "download_folder",
            label: this.$t("xd-pro.download-folder"),
            sortable: true,
          },
          {
            key: "speed_limit",
            label: this.$t("xd-pro.speed-limit"),
            sortable: true,
          },
          {
            key: "check_connections",
            label: this.$t("xd-pro.check-connections"),
            sortable: true,
          },
          {
            key: "downloads",
            label: this.$t("xd-pro.downloads"),
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
      },
      downloads: {
        handle: null,
        modal: false,
        download: null,
        downloads: [],
        from: 0,
        to: 0,
        total: 0,
        currentPage: 0,
        fields: [
          {
            key: "filename",
            label: this.$t("xd-pro.filename"),
            sortable: true,
          },
          {
            key: "file_extension",
            label: this.$t("xd-pro.file-extension"),
            sortable: true,
          },
          { key: "type", label: this.$t("xd-pro.type"), sortable: true },
          { key: "active", label: this.$t("xd-pro.active"), sortable: true },
          { key: "enabled", label: this.$t("xd-pro.enabled"), sortable: true },
          {
            key: "progress",
            label: this.$t("xd-pro.progress"),
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
      },
      activeTab: 0,
      search: null,
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters(["currentUser", "settings"]),
    showTooltips () {
      return this.settings.showTooltips;
    },
    searchFilteredInstances() {
      if (this.search === null) {
        return this.xdPro.instances;
      } else {
        var re = new RegExp(this.search, "i");
        return this.xdPro.instances.filter((xd) => {
          return (
            String(xd.name).match(re) ||
            String(xd.useragent).match(re) ||
            String(xd.download_folder).match(re)
          );
        });
      }
    },
    searchFilteredDownloads() {
      if (this.search === null) {
        return this.downloads.downloads;
      } else {
        var re = new RegExp(this.search, "i");
        return this.downloads.downloads.filter((download) => {
          return (
            String(download.download_url).match(re) ||
            String(download.download_host).match(re) ||
            String(download.download_username).match(re) ||
            String(download.download_password).match(re) ||
            String(download.filename).match(re) ||
            String(download.file_extension).match(re) ||
            String(download.download_sub_folder).match(re)
          );
        });
      }
    },
    perPage() {
      return this.settings.perPage;
    },
    pagedInstances() {
      this.xdPro.total = this.searchFilteredInstances.length;
      this.xdPro.from = (this.xdPro.currentPage - 1) * this.perPage || 0;
      this.xdPro.to =
        this.xdPro.from + this.perPage > this.xdPro.total
          ? this.xdPro.total
          : this.xdPro.from + this.perPage;
      return this.searchFilteredInstances.slice(this.xdPro.from, this.xdPro.to);
    },
    pagedDownloads() {
      this.downloads.total = this.searchFilteredDownloads.length;
      this.downloads.from =
        (this.downloads.currentPage - 1) * this.perPage || 0;
      this.downloads.to =
        this.downloads.from + this.perPage > this.downloads.total
          ? this.downloads.total
          : this.downloads.from + this.perPage;
      return this.searchFilteredDownloads.slice(
        this.downloads.from,
        this.downloads.to
      );
    },
    downloadInstances() {
      return this.xdPro.instances.map((instance) => {
        return {
          text: instance.name,
          value: instance.id,
        };
      });
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
    doTabChange(tab) {
      if (tab == 0) {
        this.loadInstances();
      }
      this.activeTab = tab;
    },
    doRefresh() {
      if (this.activeTab === 0) {
        this.loadInstances();
      } else {
        this.loadDownloads();
      }
    },
    xdProModal(show, save = false) {
      if (save) {
        this.saveInstance();
      }
      this.xdPro.modal = show;
    },
    downloadModal(show, save = false) {
      if (save) {
        this.saveDownload();
      }
      this.downloads.modal = show;
    },
    addInstance() {
      this.isLoading = true;
      httpService.post("xd-pro/instance").then((res) => {
        this.isLoading = false;
        if (res.status === true) {
          this.xdPro.instance = {
            id: res.data,
            name: "",
            download_folder: "",
            useragent: "IPTV-Tools/1.0",
            speed_limit: 0,
            check_connections: 1,
          };
          this.xdPro.modal = true;
        }
      });
    },
    editInstance(instance) {
      this.xdPro.instance = Object.assign({}, instance);
      this.xdPro.modal = true;
    },
    saveInstance() {
      this.isLoading = true;
      let instance = Object.assign({}, this.xdPro.instance);
      delete instance.downloads;
      httpService
        .put(`xd-pro/instance/${this.xdPro.instance.id}`, instance)
        .then((res) => {
          this.isLoading = false;
          this.loadInstances();
          if (res.status === true) {
            this.xdPro.instance = null;
            this.$notify(
              "primary",
              this.$t("profile.success"),
              this.$t("xd-pro.save-success"),
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
            this.$t("xd-pro.save-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    deleteInstance(id) {
      this.isLoading = true;
      httpService
        .delete(`xd-pro/instance/${id}`)
        .then((res) => {
          this.isLoading = false;
          this.loadInstances();
          if (res.status === true) {
            this.$notify(
              "primary",
              this.$t("profile.success"),
              this.$t("xd-pro.delete-success"),
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
            this.$t("xd-pro.delete-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    editDownload(download) {
      httpService
        .put(`xd-pro/download/${download.id}`, { enabled: 0 })
        .then((res) => {
          if (res.status === true && res.data === true) {
            this.downloads.download = Object.assign({}, download);
            this.downloads.modal = true;
          }
        })
        .catch(() => {
          //
        });
    },
    pauseDownload(download) {
      httpService
        .put(`xd-pro/download/${download.id}`, { enabled: 0 })
        .then((res) => {
          if (res.status === true && res.data === true) {
            this.loadDownloads();
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
    },
    resumeDownload(download) {
      httpService
        .put(`xd-pro/download/${download.id}`, { enabled: 1 })
        .then((res) => {
          if (res.status === true && res.data === true) {
            this.loadDownloads();
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
    },
    saveDownload() {
      this.isLoading = true;
      let download = Object.assign({}, this.downloads.download);
      httpService
        .put(`xd-pro/download/${this.downloads.download.id}`, download)
        .then((res) => {
          this.isLoading = false;
          this.loadDownloads();
          if (res.status === true) {
            this.downloads.download = null;
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
          this.isLoading = false;
          this.loadDownloads();
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("xd-pro.download-save-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    deleteDownload(id) {
      this.isLoading = true;
      httpService
        .delete(`xd-pro/download/${id}`)
        .then((res) => {
          this.isLoading = false;
          this.loadDownloads();
          if (res.status === true) {
            this.$notify(
              "primary",
              this.$t("profile.success"),
              this.$t("xd-pro.download-delete-success"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.loadDownloads();
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("xd-pro.download-delete-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    loadInstances() {
      this.isLoading = true;
      httpService
        .get("xd-pro/instances")
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.xdPro.instances = res.data;
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    loadDownloads() {
      httpService
        .get("xd-pro/download")
        .then((res) => {
          if (res.status === true) {
            this.downloads.downloads = res.data;
          }
        })
        .catch(() => {
          //
        });
    },
    pauseDownloads() {
      httpService
        .put("xd-pro/pause")
        .then((res) => {
          if (res.status === true && res.data === true) {
            this.loadDownloads();
          }
        })
        .catch(() => {
          this.loadDownloads();
        });
    },
    resumeDownloads() {
      httpService
        .put("xd-pro/resume")
        .then((res) => {
          if (res.status === true && res.data === true) {
            this.loadDownloads();
          }
        })
        .catch(() => {
          this.loadDownloads();
        });
    },
    deleteDownloads(disabled) {
      httpService
        .put(`xd-pro/delete/${disabled ? "1" : "0"}`)
        .then((res) => {
          if (res.status === true && res.data === true) {
            this.$notify(
              "primary",
              this.$t("profile.success"),
              this.$t("xd-pro.download-delete-success"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
            this.loadDownloads();
          }
        })
        .catch(() => {
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("xd-pro.download-delete-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
          this.loadDownloads();
        });
    },
  },
  beforeMount() {
    this.loadInstances();
    this.loadDownloads();
    this.downloads.handle = setInterval(this.loadDownloads, 10 * 1000);
    document.body.classList.add("right-menu");
    EventBus.$on("search", this.searchStream);
    EventBus.$on("print", this.printStreams);
    EventBus.$on("tab-change", this.doTabChange);
    EventBus.$on("refresh", this.doRefresh);
  },
  beforeDestroy() {
    clearInterval(this.downloads.handle);
    document.body.classList.remove("right-menu");
    EventBus.$off("search", this.searchStream);
    EventBus.$off("print", this.printStreams);
    EventBus.$off("tab-change", this.doTabChange);
    EventBus.$off("refresh", this.doRefresh);
  },
  watch: {},
};
</script>

<style lang="scss">
.xd-pro-menu {
  position: relative;
  height: calc(100% - 50px);
}

.xd-pro-description {
  position: absolute;
  bottom: 0;
}

.download-progress {
  min-width: 200px;
}
</style>
