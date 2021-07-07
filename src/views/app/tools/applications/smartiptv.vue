<template>
  <erd-row class="m-0 p-0">
    <!--  

      PROFILE EDITOR

    -->
    <erd-modal
      v-show="profileModal"
      @close="doProfileModal(false)"
      :title="$t('siptv.profiles')"
      class="select-none"
      small
    >
      <div class="px-2" v-if="profile">
        <label class="w-100">{{ $t("xd-pro.name") }}</label>
        <erd-input
          class="mt-1 mb-2 w-100"
          v-model="profile.name"
        ></erd-input>
        <erd-row class="p-0 m-0">
          <erd-col xl="8" class="m-0 p-0 pr-1">
            <label class="w-100">{{ $t("siptv.mac") }}</label>
            <erd-input
              class="mt-1 mb-2 w-100"
              v-model="profile.mac"
              :placeholder="$t('general.mac-placeholder')"
            ></erd-input>
          </erd-col>
          <erd-col xl="4" class="m-0 p-0">
            <label class="w-100">{{ $t("siptv.pin") }}</label>
            <erd-input
              class="mt-1 mb-2 w-100"
              v-model="profile.pin"
            ></erd-input>
          </erd-col>
        </erd-row>
        <label class="w-100">{{ $t("siptv.epg-country") }}</label>
        <erd-select
          key="epg-country"
          class="w-100 mt-1 mb-2"
          :items="countries"
          v-model="profile.epg_country"
        ></erd-select>
        <label class="w-100">{{ $t("siptv.logos") }}</label>
        <erd-select
          key="logos"
          class="w-100 mt-1 mb-2"
          :items="logos"
          v-model="profile.logos"
        ></erd-select>
        <div class="form-control">
          <erd-checkbox
            class="mt-2 mb-1"
            v-model="profile.save_online"
            :true-value="1"
            :false-value="0"
            >{{ $t("siptv.save-online") }}</erd-checkbox
          >
          <erd-checkbox
            class="mb-1"
            v-model="profile.detect_epg"
            :true-value="1"
            :false-value="0"
            >{{ $t("siptv.detect-epg") }}</erd-checkbox
          >
          <erd-checkbox
            class="mb-2"
            v-model="profile.disable_groups"
            :true-value="1"
            :false-value="0"
            >{{ $t("siptv.disable-groups") }}</erd-checkbox
          >
        </div>
      </div>
      <template v-slot:footer>
        <erd-button
          @click="doProfileModal(false)"
          icon="la-times"
          class="mr-1"
          variant="danger"
          >{{ $t("general.cancel") }}</erd-button
        >
        <erd-button
          icon="la-check"
          variant="success"
          @click="doProfileModal(false, true)"
          >{{ $t("general.ok") }}</erd-button
        >
      </template>
    </erd-modal>
    <!--  

      DELETE PLAYLIST

    -->
    <erd-modal
      v-show="deleteModal.modal"
      @close="doDeleteModal(false)"
      :title="$t('siptv.delete-playlist')"
      class="select-none"
      small
    >
      <div class="px-2 mb-5">
        <label class="w-100">{{ $t("siptv.profile") }}</label>
        <erd-select
          key="siptv-profile-delete"
          class="w-100 mt-1 mb-2"
          :items="listProfiles"
          v-model="deleteModal.profile"
        ></erd-select>
        <label class="w-100">{{ $t("siptv.mac") }}</label>
        <erd-input
          class="mt-1 mb-2 w-100"
          v-model="deleteModal.mac"
          :placeholder="$t('general.mac-placeholder')"
        ></erd-input>
        <label class="w-100">{{ $t("siptv.message") }}</label>
        <div class="form-control p-4 text-center mt-1">
          <span v-html="deleteModal.message" class="font-weight-bold"></span>
        </div>
      </div>
      <template v-slot:footer>
        <erd-button
          @click="doDeleteModal(false)"
          icon="la-times"
          class="mr-1"
          variant="danger"
          >{{ $t("general.close") }}</erd-button
        >
        <erd-button
          icon="la-check"
          variant="success"
          @click="doDeleteModal(true, true)"
          >{{ $t("general.ok") }}</erd-button
        >
      </template>
    </erd-modal>
    <!--  

      UPLOAD PLAYLIST

    -->
    <erd-modal
      v-show="uploadModal.modal"
      @close="doUploadModal(false)"
      :title="$t('siptv.upload-playlist')"
      class="select-none"
      small
    >
      <div class="px-2">
        <label class="w-100">{{ $t("siptv.profile") }}</label>
        <erd-select
          key="siptv-profile-upload"
          class="w-100 mt-1 mb-2"
          :items="listProfiles"
          v-model="uploadModal.profile"
        ></erd-select>
        <label class="w-100">{{ $t("general.playlist") }}</label>
        <erd-select
          key="siptv-playlist-upload"
          class="w-100 mt-1 mb-2"
          :items="movieSeriePlaylists"
          v-model="uploadModal.playlist"
        ></erd-select>
        <erd-row class="p-0 m-0">
          <erd-col xl="8" class="m-0 p-0 pr-1">
            <label class="w-100">{{ $t("siptv.mac") }}</label>
            <erd-input
              class="mt-1 mb-2 w-100"
              v-model="uploadModal.mac"
              :placeholder="$t('general.mac-placeholder')"
            ></erd-input>
          </erd-col>
          <erd-col xl="4" class="m-0 p-0">
            <label class="w-100">{{ $t("siptv.pin") }}</label>
            <erd-input
              class="mt-1 mb-2 w-100"
              v-model="uploadModal.pin"
            ></erd-input>
          </erd-col>
        </erd-row>
        <label class="w-100">{{ $t("siptv.epg-country") }}</label>
        <erd-select
          key="epg-country"
          class="w-100 mt-1 mb-2"
          :items="countries"
          v-model="uploadModal.epg_country"
        ></erd-select>
        <label class="w-100">{{ $t("siptv.logos") }}</label>
        <erd-select
          key="logos"
          class="w-100 mt-1 mb-2"
          :items="logos"
          v-model="uploadModal.logos"
        ></erd-select>
        <div class="form-control mb-2">
          <erd-checkbox
            class="mt-2 mb-1"
            v-model="uploadModal.save_online"
            :true-value="1"
            :false-value="0"
            >{{ $t("siptv.save-online") }}</erd-checkbox
          >
          <erd-checkbox
            class="mb-1"
            v-model="uploadModal.detect_epg"
            :true-value="1"
            :false-value="0"
            >{{ $t("siptv.detect-epg") }}</erd-checkbox
          >
          <erd-checkbox
            class="mb-2"
            v-model="uploadModal.disable_groups"
            :true-value="1"
            :false-value="0"
            >{{ $t("siptv.disable-groups") }}</erd-checkbox
          >
        </div>
        <label class="w-100">{{ $t("siptv.message") }}</label>
        <div class="form-control p-4 text-center mt-1">
          <span v-html="uploadModal.message" class="font-weight-bold"></span>
        </div>
      </div>
      <template v-slot:footer>
        <erd-button
          @click="doUploadModal(false)"
          icon="la-times"
          class="mr-1"
          variant="danger"
          >{{ $t("general.close") }}</erd-button
        >
        <erd-button
          icon="la-check"
          variant="success"
          :disabled="!uploadModal.playlist"
          @click="doUploadModal(true, true)"
          >{{ $t("general.ok") }}</erd-button
        >
      </template>
    </erd-modal>
    <!--  

      SIPTV PROFILES

    -->
    <erd-col xl="12" sm="12">
      <b-table :items="pagedProfiles" :fields="fields" striped small>
        <template v-slot:cell(save_online)="row">
          <erd-badge variant="success" v-if="row.item.save_online">{{
            $t("general.yes")
          }}</erd-badge>
          <erd-badge variant="danger" v-else>{{ $t("general.no") }}</erd-badge>
        </template>
        <template v-slot:cell(detect_epg)="row">
          <erd-badge variant="success" v-if="row.item.detect_epg">{{
            $t("general.yes")
          }}</erd-badge>
          <erd-badge variant="danger" v-else>{{ $t("general.no") }}</erd-badge>
        </template>
        <template v-slot:cell(disable_groups)="row">
          <erd-badge variant="success" v-if="row.item.disable_groups">{{
            $t("general.yes")
          }}</erd-badge>
          <erd-badge variant="danger" v-else>{{ $t("general.no") }}</erd-badge>
        </template>
        <template v-slot:cell(logos)="row">
          {{ logos.find(logo => logo.value == row.item.logos).text }}
        </template>
        <template v-slot:cell(actions)="row">
          <erd-tooltip :tooltip="$t('siptv.tooltip-edit-profile')" :enabled="showTooltips">
            <erd-button
              variant="info"
              class="btn-table"
              @click="editProfile(row.item)"
              ><i class="las la-pen"></i
            ></erd-button>
          </erd-tooltip>
          <erd-tooltip :tooltip="$t('siptv.tooltip-delete-profile')" :enabled="showTooltips">
            <erd-button
              variant="danger"
              class="btn-table"
              @click="deleteProfile(row.item.id)"
              ><i class="las la-trash"></i
            ></erd-button>
          </erd-tooltip>
        </template>
      </b-table>
      <b-pagination
        key="siptv-profiles"
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
    <!--  

      APP MENU

    -->
    <erd-app-menu icon="la-tools">
      <div class="pt-3 select-none xd-pro-menu">
        <erd-collapse
          :title="$t('siptv.profiles')"
          key="siptv-profiles"
          small
        >
          <ul class="list-unstyled mb-0">
            <li class="nav-item">
              <a href="#" @click.prevent="addProfile"
                ><i class="las la-plus mr-1"></i
                >{{ $t("siptv.add-profile") }}</a
              >
            </li>
          </ul>
        </erd-collapse>
        <erd-collapse
          :title="$t('siptv.siptv')"
          key="siptv-actions"
          small
        >
          <ul class="list-unstyled mb-0">
            <li class="nav-item">
              <a href="#" @click.prevent="doUploadModal(true)"
                ><i class="las la-upload mr-1"></i
                >{{ $t("siptv.upload-playlist") }}</a
              >
            </li>
            <li class="nav-item">
              <a href="#" @click.prevent="doDeleteModal(true)"
                ><i class="las la-trash mr-1"></i
                >{{ $t("siptv.delete-playlist") }}</a
              >
            </li>
          </ul>
        </erd-collapse>
        <div class="px-2 siptv-description">
          <p class="text-muted">{{ $t("siptv.description") }}</p>
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
      search: null,
      isLoading: false,
      from: 0,
      to: 0,
      total: 0,
      currentPage: 0,
      fields: [
        { key: "name", label: this.$t("xd-pro.name"), sortable: true },
        {
          key: "mac",
          label: this.$t("siptv.mac"),
          sortable: true,
        },
        {
          key: "pin",
          label: this.$t("siptv.pin"),
          sortable: true,
        },
        {
          key: "save_online",
          label: this.$t("siptv.save-online"),
          sortable: true,
        },
        {
          key: "detect_epg",
          label: this.$t("siptv.detect-epg"),
          sortable: true,
        },
        {
          key: "disable_groups",
          label: this.$t("siptv.disable-groups"),
          sortable: true,
        },
        {
          key: "epg_country",
          label: this.$t("siptv.epg-country"),
          sortable: true,
        },
        {
          key: "logos",
          label: this.$t("siptv.logos"),
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
      profiles: [],
      profileModal: false,
      deleteModal: {
        modal: false,
        mac: "",
        profile: 0,
        message: "",
      },
      uploadModal: {
        message: "",
        modal: false,
        profile: 0,
        playlist: null,
        mac: "",
        pin: "",
        save_online: 0,
        detect_epg: 0,
        disable_groups: 0,
        epg_country: "",
        logos: 0,
      },
      profile: {
        id: -1,
        name: "",
        mac: "",
        pin: "",
        save_online: 0,
        detect_epg: 0,
        disable_groups: 0,
        epg_country: "",
        logos: 0,
      },
      countries: [],
      logos: [
        { text: this.$t("siptv.logos-1"), value: 0 },
        { text: this.$t("siptv.logos-2"), value: 1 },
        { text: this.$t("siptv.logos-3"), value: 2 },
      ]
    };
  },
  computed: {
    ...mapGetters(["currentUser", "settings", "movieSeriePlaylists"]),
    showTooltips () {
      return this.settings.showTooltips;
    },
    searchFiltered() {
      if (this.search === null) {
        return this.profiles;
      } else {
        var re = new RegExp(this.search, "i");
        return this.profiles.filter((profile) => {
          return (
            String(profile.name).match(re) ||
            String(profile.mac).match(re) ||
            String(profile.pin).match(re)
          );
        });
      }
    },
    perPage() {
      return this.settings.perPage;
    },
    pagedProfiles() {
      this.total = this.searchFiltered.length;
      this.from = (this.currentPage - 1) * this.perPage || 0;
      this.to =
        this.from + this.perPage > this.total
          ? this.total
          : this.from + this.perPage;
      return this.searchFiltered.slice(this.from, this.to);
    },
    listProfiles() {
      return this.profiles.map(profile => {
        return {
          text: profile.name,
          value: profile.id
        }
      })
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
    doProfileModal(show, save = false) {
      if (save) {
        this.saveProfile();
      }
      this.profileModal = show;
    },
    doDeleteModal(show, save = false) {
      if (save) {
        this.deletePlaylist();
      }
      this.deleteModal.message = "";
      this.deleteModal.modal = show;
    },
    doUploadModal(show, save = false) {
      if (save) {
        this.uploadPlaylist();
      }
      this.uploadModal.message = "";
      this.uploadModal.modal = show;
    },
    addProfile() {
      this.isLoading = true;
      httpService.post("siptv/profile").then((res) => {
        this.isLoading = false;
        if (res.status === true) {
          this.profile = {
            id: res.data,
            name: "",
            mac: "",
            pin: "",
            save_online: 0,
            detect_epg: 0,
            disable_groups: 0,
            epg_country: "",
            logos: 0,
          }
          this.profileModal = true;
        }
      });
    },
    editProfile(profile) {
      this.profile = Object.assign({}, profile);
      this.profileModal = true;
    },
    deleteProfile(id) {
      this.isLoading = true;
      httpService
        .delete(`siptv/profile/${id}`)
        .then((res) => {
          this.isLoading = false;
          this.loadProfiles();
          if (res.status === true) {
            this.$notify(
              "primary",
              this.$t("profile.success"),
              this.$t("siptv.delete-success"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.loadProfiles();
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("siptv.delete-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    saveProfile() {
      this.isLoading = true;
      let profile = Object.assign({}, this.profile);
      httpService
        .put(`siptv/profile/${this.profile.id}`, profile)
        .then((res) => {
          this.isLoading = false;
          this.loadProfiles();
          if (res.status === true) {
            this.profile = null;
            this.$notify(
              "primary",
              this.$t("profile.success"),
              this.$t("siptv.save-success"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.loadProfiles();
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("siptv.save-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    loadProfiles() {
      this.isLoading = true;
      httpService
        .get("siptv/profiles")
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.profiles = res.data;
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    loadSiptvCountries() {
      httpService
        .get("editor/smart-iptv-countries")
        .then((res) => {
          this.countries = res.data;
        })
        .catch(() => {
          //
        });
    },
    deletePlaylist() {
      httpService.post("siptv/delete-playlist", { mac: this.deleteModal.mac }).then((res) => {
        if (res.status === true) {
          this.deleteModal.message = res.data;
        }
      });
    },
    uploadPlaylist() {
      httpService.post("siptv/upload-playlist", this.uploadModal).then((res) => {
        if (res.status === true) {
          this.uploadModal.message = res.data;
        }
      });
    }
  },
  beforeMount() {
    this.loadProfiles();
    this.loadSiptvCountries();
    document.body.classList.add("right-menu");
    EventBus.$on("search", this.searchStream);
    EventBus.$on("print", this.printStreams);
    EventBus.$on("refresh", this.loadProfiles);
  },
  beforeDestroy() {
    document.body.classList.remove("right-menu");
    EventBus.$off("search", this.searchStream);
    EventBus.$off("print", this.printStreams);
    EventBus.$off("refresh", this.loadProfiles);
  },
  watch: {
    "deleteModal.profile": function (val) {
      let profile = this.profiles.find(profile => profile.id === val);
      if (profile) {
        this.deleteModal.mac = profile.mac;
      }
    },
    "uploadModal.profile": function (val) {
      let profile = this.profiles.find(profile => profile.id === val);
      if (profile) {
        this.uploadModal.mac            = profile.mac;
        this.uploadModal.pin            = profile.pin;
        this.uploadModal.save_online    = profile.save_online;
        this.uploadModal.detect_epg     = profile.detect_epg;
        this.uploadModal.disable_groups = profile.disable_groups;
        this.uploadModal.epg_country    = profile.epg_country;
        this.uploadModal.logos          = profile.logos;
      }
    }
  },
};
</script>

<style lang="scss">
.xd-pro-menu {
  position: relative;
  height: calc(100% - 50px);
}

.siptv-description {
  position: absolute;
  bottom: 0;
}

.download-progress {
  min-width: 200px;
}
</style>
