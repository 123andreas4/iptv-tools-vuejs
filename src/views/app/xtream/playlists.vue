<template>
  <erd-row class="m-0 p-0" id="playlists">
    <!--  

      Playlist Info

    -->
    <erd-modal
      v-show="playlistInfo.modal"
      @close="playlistInfoModal(false)"
      :title="$t('xtream.playlist-info')"
      class="select-none"
      small
    >
      <div class="px-2">
        <p class="mt-0">{{ $t("xtream.playlist-info-text") }}</p>
        <erd-row class="m-0 p-0">
          <erd-col xxl="8" sm="8" class="my-0 p-0">
            <label class="w-100">{{ $t("xtream.host") }}</label>
            <erd-input
              class="mt-1 mb-2 w-100"
              :value="iptvToolsHost"
              readonly
            ></erd-input>
          </erd-col>
          <erd-col xxl="4" sm="4" class="my-0 py-0 pr-0">
            <label class="w-100">{{ $t("xtream.port") }}</label>
            <erd-input
              class="mt-1 mb-2 w-100"
              :value="iptvToolsPort"
              readonly
            ></erd-input>
          </erd-col>
        </erd-row>
        <label class="w-100">{{ $t("xtream.username") }}</label>
        <erd-input
          class="mt-1 mb-2 w-100"
          :value="playlistInfo.username"
          readonly
        ></erd-input>
        <label class="w-100">{{ $t("xtream.password") }}</label>
        <erd-input
          class="mt-1 mb-2 w-100"
          :value="playlistInfo.password"
          readonly
        ></erd-input>
      </div>
      <template v-slot:footer>
        <erd-button
          @click="playlistInfoModal(false)"
          icon="la-times"
          class="mr-1"
          variant="primary"
          >{{ $t("general.close") }}</erd-button
        >
      </template>
    </erd-modal>
    <erd-spinner v-if="isLoading" size="lg" overlay absolute></erd-spinner>
    <erd-col xl="12" sm="12" v-if="!editor">
      <b-table :items="paged" :fields="fields" striped small>
        <template v-slot:cell(created_at)="row">
          {{ formatDate(row.item.created_at) }}
        </template>
        <template v-slot:cell(last_updated)="row">
          {{ formatDate(row.item.last_updated) }}
        </template>
        <template v-slot:cell(synced_at)="row">
          {{
            row.item.synced_at && row.item.synced_at !== "0000-00-00 00:00:00"
              ? formatDate(row.item.synced_at)
              : $t("general.not-available")
          }}
        </template>
        <template v-slot:cell(source_exp_date)="row">
          {{ formatDate(row.item.source_exp_date * 1000) }}
        </template>
        <template v-slot:cell(sync_interval)="row">
          {{ $t(`sync-interval.${row.item.sync_interval}`) }}
        </template>
        <template v-slot:cell(actions)="row">
          <erd-tooltip :tooltip="$t('xtream.tooltip-playlist-info')" :enabled="showTooltips">
            <erd-button
              variant="info"
              class="btn-table"
              @click="playlistInfoModal(true, row.item)"
              ><i class="las la-info"></i
            ></erd-button>
          </erd-tooltip>
          <erd-tooltip :tooltip="$t('xtream.tooltip-sync-playlist')" :enabled="showTooltips">
            <erd-button
              variant="info"
              class="btn-table"
              :disabled="syncPlaylist"
              @click="synchronizePlaylist(row.item.id)"
              ><i class="las la-sync"></i
            ></erd-button>
          </erd-tooltip>
          <erd-tooltip :tooltip="$t('xtream.tooltip-sync-tmdb')" :enabled="showTooltips">
            <erd-button
              variant="info"
              class="btn-table"
              :disabled="syncTMDB"
              @click="synchronizeTMDB(row.item.id)"
              ><i class="lab la-imdb"></i
            ></erd-button>
          </erd-tooltip>
          <erd-tooltip :tooltip="$t('xtream.tooltip-edit-playlist')" :enabled="showTooltips">
            <erd-button
              variant="info"
              class="btn-table"
              @click="editPlaylist(row.item)"
              ><i class="las la-pen"></i
            ></erd-button>
          </erd-tooltip>
          <erd-tooltip :tooltip="$t('xtream.tooltip-delete-playlist')" :enabled="showTooltips">
            <erd-button
              variant="danger"
              class="btn-table"
              @click="deletePlaylist(row.item.id)"
              ><i class="las la-trash"></i
            ></erd-button>
          </erd-tooltip>
        </template>
      </b-table>
      <b-pagination
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
    <!-- SOURCE -->
    <erd-col xl="12" sm="12" v-if="editor && activeTab === 0">
      <label class="d-block" for="source-title">{{ $t("xtream.title") }}</label>
      <erd-input
        id="source-title"
        class="mt-1 mb-2 w-100"
        v-model="playlist.name"
      ></erd-input>
      <div v-if="playlist.url !== undefined">
        <label class="d-block" for="source-url">{{ $t("xtream.url") }}</label>
        <erd-input
          id="source-url"
          class="mt-1 mb-2 w-100"
          :placeholder="$t('xtream.url-placeholder')"
          v-model="playlist.url"
        ></erd-input>
      </div>
      <label class="d-block" for="source-host">{{ $t("xtream.host") }}</label>
      <erd-input
        id="source-host"
        class="mt-1 mb-2 w-100"
        v-model="playlist.source_host"
      ></erd-input>
      <label class="d-block" for="source-port">{{ $t("xtream.port") }}</label>
      <erd-input
        id="source-port"
        class="mt-1 mb-2 w-100"
        v-model="playlist.source_port"
      ></erd-input>
      <label class="d-block" for="source-username">{{
        $t("xtream.username")
      }}</label>
      <erd-input
        id="source-username"
        class="mt-1 mb-2 w-100"
        v-model="playlist.source_username"
      ></erd-input>
      <label class="d-block" for="source-password">{{
        $t("xtream.password")
      }}</label>
      <erd-input
        id="source-password"
        class="mt-1 mb-2 w-100"
        v-model="playlist.source_password"
      ></erd-input>
      <label class="d-block" for="source-expiry">{{
        $t("xtream.expire")
      }}</label>
      <erd-input
        id="source-expiry"
        class="mt-1 mb-2 w-100"
        :value="formatDate(playlist.source_exp_date * 1000)"
        disabled
      ></erd-input>
      <label class="d-block" for="max-connections">{{
        $t("xtream.max-connections")
      }}</label>
      <erd-input
        id="source-max-connections"
        class="mt-1 mb-2 w-100"
        :value="formatMaxConnections(playlist.source_max_connections)"
        disabled
      ></erd-input>
    </erd-col>
    <!-- API -->
    <erd-col xl="12" sm="12" v-if="editor && activeTab === 1">
      <erd-tooltip :tooltip="$t('xtream.tooltip-api-enabled')" :enabled="showTooltips">
        <erd-checkbox
          class="mb-2 w-100"
          v-model="playlist.enabled"
          :true-value="1"
          :false-value="0"
          >{{ $t("xtream.enabled") }}</erd-checkbox
        >
      </erd-tooltip>
      <label class="d-block" for="api-username">{{
        $t("xtream.username")
      }}</label>
      <erd-input
        id="api-username"
        class="mt-1 mb-2 w-100"
        v-model="playlist.api_username"
        :disabled="!canUseCustomUserPass"
      ></erd-input>
      <label class="d-block" for="api-password">{{
        $t("xtream.password")
      }}</label>
      <erd-input
        id="api-password"
        class="mt-1 mb-2 w-100"
        v-model="playlist.api_password"
        :disabled="!canUseCustomUserPass"
      ></erd-input>
      <erd-button
        icon="la-random"
        variant="info"
        class="mb-3"
        v-if="!canUseCustomUserPass"
        @click="randomPassword"
        >{{ $t("xtream.generate-password") }}</erd-button
      >
      <erd-button
        icon="la-search"
        variant="info"
        class="mb-3"
        v-if="canUseCustomUserPass"
        @click="checkAvailability"
        >{{ $t("xtream.check-availability") }}</erd-button
      >
      <label class="d-block" for="api-message">{{
        $t("xtream.message")
      }}</label>
      <erd-textarea
        class="w-100"
        id="api-message"
        rows="3"
        v-model="playlist.api_message"
      ></erd-textarea>
      <label class="d-block" for="api-output">{{
        $t("xtream.output-format")
      }}</label>
      <erd-select
        id="api-output"
        class="mt-1 mb-2 w-100"
        v-model="playlist.api_output_format"
        :items="outputTypes"
        :placeholder="$t('xtream.output-format')"
      ></erd-select>
      <label class="d-block" for="epg-timeshift">{{
        $t("xtream.epg-timeshift")
      }}</label>
      <erd-input
        id="epg-timeshift"
        class="mt-1 mb-2 w-100"
        v-model="playlist.epg_offset"
        type="number"
      ></erd-input>
    </erd-col>
    <!-- SYNC -->
    <erd-col xl="12" sm="12" v-if="editor && activeTab === 2">
      <erd-tooltip :tooltip="$t('xtream.tooltip-sync-enabled')" :enabled="showTooltips">
        <erd-checkbox
          class="mb-2 w-100"
          v-model="playlist.sync_enabled"
          :true-value="1"
          :false-value="0"
          >{{ $t("xtream.enabled") }}</erd-checkbox
        >
      </erd-tooltip>
      <label class="d-block" for="sync-interval">{{
        $t("xtream.sync-interval")
      }}</label>
      <erd-select
        id="sync-interval"
        ref="sync-interval"
        key="sync-interval"
        class="mt-1 mb-2 w-100"
        v-model="playlist.sync_interval"
        :items="syncIntervals"
        :disabled="!playlist.sync_enabled"
      ></erd-select>
      <label class="d-block" for="sync-tmdb-language">{{
        $t("xtream.tmdb-language")
      }}</label>
      <erd-select
        id="sync-tmdb-language"
        ref="sync-tmdb-language"
        key="sync-tmdb-language"
        class="mt-1 mb-2 w-100"
        v-model="playlist.tmdb_language"
        :items="tmdbLanguages"
        :disabled="!playlist.sync_enabled || !canUseMoviesSeries"
      ></erd-select>
      <erd-row class="m-0 p-0">
        <erd-col xl="4" md="4" sm="12" class="pl-0">
          <erd-context-menu
            :items="contextLive"
            depth="1"
            ref="context-live"
          ></erd-context-menu>
          <label class="mt-0">{{ $t("dashboard.live-streams") }}</label>
          <div
            class="form-control sync-groups"
            @contextmenu.prevent="openContext('context-live')"
          >
            <erd-checkbox
              v-for="(group, index) in playlistGroups.live"
              :key="`group-1-${index}`"
              :value="group.category_id"
              v-model="playlist.sync_live"
              >{{ group.category_name }}</erd-checkbox
            >
            <div class="empty-group" v-if="playlistGroups.live.length === 0">
              <i class="las la-folder-open la-3x"></i>
              <p class="mt-1">{{ $t("general.not-available") }}</p>
            </div>
          </div>
        </erd-col>
        <erd-col xl="4" md="4" sm="12" class="p-0">
          <erd-context-menu
            :items="contextMovies"
            depth="1"
            ref="context-movies"
          ></erd-context-menu>
          <label class="mt-0">{{ $t("dashboard.movies") }}</label>
          <div
            class="form-control sync-groups"
            @contextmenu.prevent="openContext('context-movies')"
          >
            <erd-checkbox
              v-for="(group, index) in playlistGroups.movies"
              :key="`group-2-${index}`"
              :value="group.category_id"
              v-model="playlist.sync_movies"
              :disabled="!canUseMoviesSeries"
              >{{ group.category_name }}</erd-checkbox
            >
            <div class="empty-group" v-if="playlistGroups.movies.length === 0">
              <i class="las la-folder-open la-3x"></i>
              <p class="mt-1">{{ $t("general.not-available") }}</p>
            </div>
          </div>
        </erd-col>
        <erd-col xl="4" md="4" sm="12" class="pr-0">
          <erd-context-menu
            :items="contextSeries"
            depth="1"
            ref="context-series"
          ></erd-context-menu>
          <label class="mt-0">{{ $t("dashboard.series") }}</label>
          <div
            class="form-control sync-groups"
            @contextmenu.prevent="openContext('context-series')"
          >
            <erd-checkbox
              v-for="(group, index) in playlistGroups.series"
              :key="`group-3-${index}`"
              :value="group.category_id"
              v-model="playlist.sync_series"
              :disabled="!canUseMoviesSeries"
              >{{ group.category_name }}</erd-checkbox
            >
            <div class="empty-group" v-if="playlistGroups.series.length === 0">
              <i class="las la-folder-open la-3x"></i>
              <p class="mt-1">{{ $t("general.not-available") }}</p>
            </div>
          </div>
        </erd-col>
      </erd-row>
    </erd-col>
    <!-- SECURITY -->
    <erd-col xl="12" sm="12" v-if="editor && activeTab === 3">
      <erd-tooltip :tooltip="$t('xtream.tooltip-security-enabled')" :enabled="showTooltips">
        <erd-checkbox
          :true-value="1"
          :false-value="0"
          class="mb-2"
          v-model="playlist.ip_protection"
          >{{ $t("xtream.ip-security") }}</erd-checkbox
        >
      </erd-tooltip>
      <label class="d-block" for="allowed-ips">{{
        $t("xtream.allow-only-ips")
      }}</label>
      <erd-textarea
        class="w-100 mb-1"
        id="allowed-ips"
        rows="3"
        v-model="allowedIps"
        :disabled="!playlist.ip_protection"
      ></erd-textarea>
      <erd-button
        variant="info"
        icon="la-server"
        :disabled="!playlist.ip_protection"
        @click="getIPAddress"
        >{{ $t("xtream.get-ip") }}</erd-button
      >
    </erd-col>
    <!-- BACK-UP -->
    <erd-col xl="12" sm="12" v-if="editor && activeTab === 4">
      <p class="mt-0 mb-2">{{ $t("backup.streams") }}</p>
      <!-- LIVE STREAMS BACKUP -->
      <erd-button
        icon="la-file-export"
        variant="primary"
        class="backup-button mb-1"
        :disabled="playlistIsEmpty"
        @click="backupPlaylist('live')"
        >{{ $t("backup.back-up-live") }}</erd-button
      >
      <erd-button
        icon="la-file-export"
        variant="primary"
        class="backup-button mb-1"
        :disabled="playlistIsEmpty"
        @click="backupPlaylist('movies')"
        >{{ $t("backup.back-up-movies") }}</erd-button
      >
      <erd-button
        icon="la-file-export"
        variant="primary"
        class="backup-button mb-1"
        :disabled="playlistIsEmpty"
        @click="backupPlaylist('series')"
        >{{ $t("backup.back-up-series") }}</erd-button
      >
      <!-- PLAYLIST BACKUP -->
      <p class="mt-3 mb-2">{{ $t("backup.playlist") }}</p>
      <erd-button
        icon="la-file-export"
        variant="primary"
        class="backup-button mb-1"
        :disabled="playlistIsEmpty"
        @click="backupPlaylist('playlist')"
        >{{ $t("backup.back-up-playlist") }}</erd-button
      >
      <erd-button
        icon="la-file-import"
        variant="info"
        class="backup-button"
        :disabled="playlistIsEmpty"
        @click="$refs['restore-playlist'].click()"
        >{{ $t("backup.restore-playlist") }}</erd-button
      >
      <input
        type="file"
        ref="restore-playlist"
        style="display: none"
        accept=".zip"
        @change="restorePlaylist"
      />
      <p class="mt-3 mb-2">{{ $t("backup.tv-guide") }}</p>
      <!-- EPG CODES BACKUP -->
      <erd-button
        icon="la-file-export"
        variant="primary"
        class="backup-button mb-1"
        :disabled="playlistIsEmpty"
        @click="backupEPGCodes"
        >{{ $t("backup.back-up-epg-channel-ids") }}</erd-button
      >
      <erd-button
        icon="la-file-import"
        variant="info"
        class="backup-button"
        :disabled="playlistIsEmpty"
        @click="$refs['restore-epg-codes'].click()"
        >{{ $t("backup.restore-epg-channel-ids") }}</erd-button
      >
      <input
        type="file"
        ref="restore-epg-codes"
        style="display: none"
        accept=".zip"
        @change="restoreEPGCodes"
      />
    </erd-col>
    <!-- EXPORT -->
    <erd-col xl="12" sm="12" v-if="editor && activeTab === 5">
      <p class="mt-0 mb-2">{{ $t("export.playlist") }}</p>
      <erd-button
        icon="la-file-export"
        variant="primary"
        class="export-button mb-1"
        :disabled="playlistIsEmpty"
        @click="exportM3U"
        >{{ $t("export.m3u") }}</erd-button
      >
      <erd-button
        icon="la-file-export"
        variant="primary"
        class="export-button mb-1"
        :disabled="playlistIsEmpty"
        @click="exportSIPTV"
        >{{ $t("export.siptv") }}</erd-button
      >
      <erd-button
        icon="la-file-export"
        variant="primary"
        class="export-button"
        :disabled="playlistIsEmpty"
        @click="exportBouquet"
        >{{ $t("export.bouquet") }}</erd-button
      >
      <p class="mt-3 mb-2">{{ $t("export.other") }}</p>
      <erd-button
        icon="la-file-csv"
        variant="info"
        class="export-button mb-1"
        :disabled="playlistIsEmpty"
        @click="exportCSV"
        >{{ $t("export.csv") }}</erd-button
      >
      <!--<erd-button icon="la-file-code" variant="info" class="export-button mb-1" :disabled="playlistIsEmpty">{{ $t("export.html") }}</erd-button>-->
      <erd-button
        icon="la-file-code"
        variant="info"
        class="export-button"
        :disabled="playlistIsEmpty"
        @click="exportJSON"
        >{{ $t("export.json") }}</erd-button
      >
    </erd-col>
  </erd-row>
</template>

<script>
/* eslint-disable vue/no-side-effects-in-computed-properties */
import { EventBus } from "../../../services/ebus";
import { httpService } from "../../../services/http";
import { languages } from "../../../helpers";
import { UserRole, SubscriptionType } from "../../../constants/config";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      dateOptions: { day: "2-digit", month: "numeric", year: "numeric" },
      languages,
      activeTab: 0,
      playlistGroups: {
        live: [],
        movies: [],
        series: [],
      },
      playlistInfo: {
        modal: false,
        username: "",
        password: "",
      },
      playlists: [],
      playlist: null,
      editor: false,
      search: null,
      isLoading: false,
      from: 0,
      to: 0,
      total: 0,
      currentPage: 1,
      fields: [
        { key: "created_at", label: this.$t("xtream.created"), sortable: true },
        {
          key: "last_updated",
          label: this.$t("xtream.last-updated"),
          sortable: true,
        },
        { key: "name", label: this.$t("xtream.name"), sortable: true },
        { key: "groups", label: this.$t("xtream.groups"), sortable: true },
        { key: "streams", label: this.$t("xtream.streams"), sortable: true },
        {
          key: "sync_interval",
          label: this.$t("xtream.sync-interval"),
          sortable: true,
        },
        {
          key: "synced_at",
          label: this.$t("xtream.synced-at"),
          sortable: true,
        },
        {
          key: "source_exp_date",
          label: this.$t("xtream.expire"),
          sortable: true,
        },
        {
          key: "source_max_connections",
          label: this.$t("xtream.max-connections"),
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
      syncIntervals: [
        { text: this.$t("sync-interval.48"), value: 48 },
        { text: this.$t("sync-interval.24"), value: 24 },
        { text: this.$t("sync-interval.12"), value: 12 },
        { text: this.$t("sync-interval.6"), value: 6 },
        { text: this.$t("sync-interval.1"), value: 1 },
      ],
      outputTypes: [
        { text: this.$t("output.1"), value: 1 },
        { text: this.$t("output.2"), value: 2 },
      ],
      iptvToolsHost: "http://tv.iptv-tools.com",
      iptvToolsPort: 80,
    };
  },
  computed: {
    ...mapGetters(["currentUser", "settings", "syncTMDB", "syncPlaylist"]),
    showTooltips () {
      return this.settings.showTooltips;
    },
    epgOffset() {
      let dt = new Date();
      return Math.abs(dt.getTimezoneOffset() / 60);
    },
    perPage() {
      return this.settings.perPage;
    },
    searchFiltered() {
      if (this.search === null) {
        return this.playlists;
      } else {
        var re = new RegExp(this.search, "i");
        return this.playlists.filter((account) => {
          return (
            String(account.title).match(re) ||
            String(account.host).match(re) ||
            String(account.port).match(re) ||
            String(account.username).match(re) ||
            String(account.password).match(re) ||
            this.formatDate(account.synced_at).match(re) ||
            this.$t(`sync-interval.${account.sync_interval}`).match(re)
          );
        });
      }
    },
    paged() {
      this.total = this.searchFiltered.length;
      this.from = (this.currentPage - 1) * this.perPage || 0;
      this.to =
        this.from + this.perPage > this.total
          ? this.total
          : this.from + this.perPage;
      return this.searchFiltered.slice(this.from, this.to);
    },
    allowedIps: {
      get: function () {
        return this.playlist.ip_allowed
          ? this.playlist.ip_allowed.join(",")
          : "";
      },
      set: function (val) {
        this.playlist.ip_allowed = val.split(",").map((ip) => {
          return ip.trim();
        });
      },
    },
    contextLive() {
      let vm = this;
      let live = [...vm.playlistGroups.live];
      return [
        {
          text: vm.$t("general.select-all"),
          onClick: function () {
            vm.playlist.sync_live = [...live.map((g) => g.category_id)];
          },
        },
        {
          text: vm.$t("general.select-none"),
          onClick: function () {
            vm.playlist.sync_live = [];
          },
        },
      ];
    },
    contextMovies() {
      let vm = this;
      let movies = [...vm.playlistGroups.movies];
      return [
        {
          text: vm.$t("general.select-all"),
          onClick: function () {
            if (vm.canUseMoviesSeries) {
              vm.playlist.sync_movies = [...movies.map((g) => g.category_id)];
            }
          },
          disabled: !vm.canUseMoviesSeries,
        },
        {
          text: vm.$t("general.select-none"),
          onClick: function () {
            vm.playlist.sync_movies = [];
          },
          disabled: !vm.canUseMoviesSeries,
        },
      ];
    },
    contextSeries() {
      let vm = this;
      let series = [...vm.playlistGroups.series];
      return [
        {
          text: vm.$t("general.select-all"),
          onClick: function () {
            if (vm.canUseMoviesSeries) {
              vm.playlist.sync_series = [...series.map((g) => g.category_id)];
            }
          },
          disabled: !vm.canUseMoviesSeries,
        },
        {
          text: vm.$t("general.select-none"),
          onClick: function () {
            vm.playlist.sync_series = [];
          },
          disabled: !vm.canUseMoviesSeries,
        },
      ];
    },
    tmdbLanguages() {
      return Object.keys(this.languages).map((language) => {
        return {
          value: language,
          text: `${this.languages[language].name} (${this.languages[language].nativeName})`,
        };
      });
    },
    canUseCustomUserPass() {
      return [UserRole.SuperAdmin, UserRole.Admin, UserRole.Moderator].includes(
        this.currentUser.user.role
      );
    },
    canUseMoviesSeries() {
      return [
        SubscriptionType.Professional,
        SubscriptionType.Family,
        SubscriptionType.BusinessSmall,
        SubscriptionType.BusinessProfessional,
        SubscriptionType.BusinessEnterprise,
        SubscriptionType.Manager,
      ].includes(this.currentUser.subscription.subscription_type);
    },
    playlistIsEmpty() {
      return (
        (this.playlist && this.playlist.groups == 0) ||
        this.playlist.streams == 0
      );
    },
    canAddPlaylist() {
      if (this.currentUser.subscription) {
        let subscription = this.currentUser.subscription;
        if (subscription.end_date != null && new Date(subscription.end_date).getTime() < new Date().getTime()) {
          return false;
        }
        if (subscription.custom_plan == 1) {
          return this.playlists.length < subscription.max_playlist;
        }
        if (subscription.enabled != 1) {
          return false;
        }
        switch (subscription.subscription_type) {
          case 0:
          case 1:
            return this.playlists.length < 2;
          case 2:
            return this.playlists.length < 5;
          case 3:
            return this.playlists.length < 5;
          case 4:
            return this.playlists.length < 10;
          case 5:
            return this.playlists.length < 25;
        }
      }
      return false;
    },
  },
  methods: {
    ...mapActions(["synchronizeTMDB", "synchronizePlaylist"]),
    openContext(context) {
      this.$refs[context].open();
    },
    loadGroups() {
      this.isLoading = true;
      httpService
        .post("playlist/load-groups", {
          host: this.playlist.source_host,
          port: this.playlist.source_port,
          username: this.playlist.source_username,
          password: this.playlist.source_password,
        })
        .then((res) => {
          this.isLoading = false;
          if (Array.isArray(res.data.live) && Array.isArray(res.data.movies) && Array.isArray(res.data.series)) {
            this.playlistGroups = res.data;
          }
        });
    },
    loadPlaylists() {
      this.isLoading = true;
      httpService
        .get("playlist")
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.playlists = res.data;
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("xtream.xtream-load-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    addPlaylist() {
      if (this.canAddPlaylist !== true) {
        return;
      }
      httpService
        .post("playlist/add")
        .then((res) => {
          if (res.status === true && res.data !== false) {
            this.playlist = {
              id: res.data,
              url: "",
              enabled: 1,
              source_host: "",
              source_port: "",
              source_username: "",
              source_password: "",
              source_exp_date: false,
              source_max_connections: false,
              sync_enabled: 1,
              sync_interval: 48,
              sync_live: [],
              sync_movies: [],
              sync_series: [],
              ip_protection: 0,
              ip_allowed: [],
              api_username: this.currentUser.user.username,
              api_password: "",
              api_message: "Welcome to IPTV-Tools.com",
              api_output_format: 1,
              name: "",
              tmdb_language: this.$i18n.locale,
              epg_offset: this.epgOffset,
            };
            this.playlistGroups = {
              live: [],
              movies: [],
              series: [],
            };
            this.randomPassword();
            this.editor = true;
          }
        })
        .catch(() => {
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("xtream.xtream-new-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    editPlaylist(playlist) {
      this.playlist = Object.assign({}, playlist);
      this.playlistAuth();
      this.editor = true;
    },
    playlistInfoModal(show, playlist) {
      if (playlist) {
        this.playlistInfo.username = playlist.api_username;
        this.playlistInfo.password = playlist.api_password;
      }
      this.playlistInfo.modal = show;
    },
    cancelEditor() {
      this.editor = false;
    },
    saveEditor() {
      let playlist = this.playlist;
      let playlistId = this.playlist.id;
      delete playlist.id;
      delete playlist.url;
      delete playlist.groups;
      delete playlist.streams;

      playlist.last_updated = new Date();
      httpService
        .put(`playlist/${playlistId}`, playlist)
        .then((res) => {
          if (res.status === true && res.data === true) {
            this.$notify(
              "primary",
              this.$t("profile.success"),
              this.$t("xtream.xtream-save-success"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
            this.editor = false;
            this.loadPlaylists();
          }
        })
        .catch(() => {
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("xtream.xtream-save-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    deletePlaylist(id) {
      httpService
        .delete(`playlist/${id}`)
        .then((res) => {
          if (res.status === true) {
            this.$notify(
              "primary",
              this.$t("profile.success"),
              this.$t("xtream.xtream-delete-success"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
            this.loadPlaylists();
          }
        })
        .catch(() => {
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("xtream.xtream-delete-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    searchAccount(search) {
      if (search.length === 0) {
        this.search = null;
      } else {
        this.search = search;
      }
    },
    printAccounts() {
      document.getElementById("playlists").print();
    },
    formatDate(date) {
      return date === false
        ? ""
        : date === null ||
          date === "0000-00-00 00:00:00" ||
          date === 0 ||
          date === ""
        ? this.$t("xtream.unlimited")
        : new Date(date).toLocaleString(
            this.$t("date.locale"),
            this.dateOptions
          );
    },
    formatMaxConnections(max) {
      return max === false
        ? ""
        : max === null || max <= 0
        ? this.$t("xtream.unlimited")
        : max;
    },
    doTabChange(tab) {
      if (tab == 1) {
        //this.loadGroups();
      }
      this.activeTab = tab;
    },
    randomPassword() {
      httpService
        .post("playlist/random-password", {
          username: this.playlist.api_username,
        })
        .then((res) => {
          if (res.status === true) {
            this.playlist.api_password = res.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    playlistAuth() {
      this.isLoading = true;
      httpService
        .post("playlist/authenticate", {
          host: this.playlist.source_host,
          port: this.playlist.source_port,
          username: this.playlist.source_username,
          password: this.playlist.source_password,
        })
        .then((res) => {
          this.isLoading = false;
          if (res.status === true && res.data.auth) {
            this.playlist.source_exp_date = res.data.exp_date;
            this.playlist.source_max_connections = res.data.max_connections;
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    getIPAddress() {
      httpService
        .get("playlist/ip-address")
        .then((res) => {
          if (res.status === true) {
            this.playlist.ip_allowed.push(res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    checkAvailability() {
      httpService
        .post("playlist/user-pass-exists", {
          username: this.playlist.api_username,
          password: this.playlist.api_password,
        })
        .then((res) => {
          if (res.status === true) {
            if (res.data === true) {
              this.$notify(
                "error",
                this.$t("xtream.not-available"),
                this.$t("xtream.user-pass-used"),
                "la-exclamation-triangle",
                { duration: 5000, permanent: false }
              );
            } else {
              this.$notify(
                "success",
                this.$t("xtream.available"),
                this.$t("xtream.user-pass-available"),
                "la-check-circle",
                { duration: 5000, permanent: false }
              );
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    exportM3U() {
      this.isLoading = true;
      httpService
        .download(`playlist/export/m3u/${this.playlist.id}`)
        .then((blob) => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "export.m3u";
          document.body.appendChild(a);
          a.click();
          a.remove();
          this.isLoading = false;
        });
    },
    exportSIPTV() {
      this.isLoading = true;
      httpService
        .download(`playlist/export/siptv/${this.playlist.id}`)
        .then((blob) => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "export.txt";
          document.body.appendChild(a);
          a.click();
          a.remove();
          this.isLoading = false;
        });
    },
    exportBouquet() {
      this.isLoading = true;
      httpService
        .download(`playlist/export/bouquet/${this.playlist.id}`)
        .then((blob) => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "export.zip";
          document.body.appendChild(a);
          a.click();
          a.remove();
          this.isLoading = false;
        });
    },
    exportCSV() {
      this.isLoading = true;
      httpService
        .download(`playlist/export/csv/${this.playlist.id}`)
        .then((blob) => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "export.zip";
          document.body.appendChild(a);
          a.click();
          a.remove();
          this.isLoading = false;
        });
    },
    exportJSON() {
      this.isLoading = true;
      httpService
        .download(`playlist/export/json/${this.playlist.id}`)
        .then((blob) => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "export.zip";
          document.body.appendChild(a);
          a.click();
          a.remove();
          this.isLoading = false;
        });
    },
    backupPlaylist(path) {
      this.isLoading = true;
      httpService
        .download(`playlist/back-up/${path}/${this.playlist.id}`)
        .then((blob) => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "backup.zip";
          document.body.appendChild(a);
          a.click();
          a.remove();
          this.isLoading = false;
        });
    },
    backupEPGCodes() {
      this.isLoading = true;
      httpService
        .download(`playlist/back-up/epg-codes/${this.playlist.id}`)
        .then((blob) => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "backup.zip";
          document.body.appendChild(a);
          a.click();
          a.remove();
          this.isLoading = false;
        });
    },
    restoreEPGCodes(e) {
      this.isLoading = true;
      if (e && e.target.files.length == 1) {
        var formData = new FormData();
        formData.append("backup.zip", e.target.files[0]);
        httpService
          .postFile(`playlist/restore/epg-codes/${this.playlist.id}`, formData)
          .then((res) => {
            this.isLoading = false;
            if (res.status === true && res.data === true) {
              this.$notify(
                "primary",
                this.$t("profile.success"),
                this.$t("xtream.restore-epgcodes-success"),
                "la-user-shield",
                { duration: 5000, permanent: false }
              );
            } else {
              this.$notify(
                "error",
                this.$t("profile.failed"),
                this.$t("xtream.restore-epgcodes-error"),
                "la-user-shield",
                { duration: 5000, permanent: false }
              );
            }
          })
          .catch(() => {
            this.isLoading = false;
            this.$notify(
              "error",
              this.$t("profile.failed"),
              this.$t("xtream.restore-epgcodes-error"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
          });
      }
    },
    restorePlaylist(e) {
      this.isLoading = true;
      if (e && e.target.files.length == 1) {
        var formData = new FormData();
        formData.append("backup.zip", e.target.files[0]);
        httpService
          .postFile(`playlist/restore/playlist/${this.playlist.id}`, formData)
          .then((res) => {
            this.isLoading = false;
            if (res.status === true && res.data === true) {
              this.$notify(
                "primary",
                this.$t("profile.success"),
                this.$t("xtream.restore-playlist-success"),
                "la-user-shield",
                { duration: 5000, permanent: false }
              );
            } else {
              this.$notify(
                "error",
                this.$t("profile.failed"),
                this.$t("xtream.restore-playlist-error"),
                "la-user-shield",
                { duration: 5000, permanent: false }
              );
            }
          })
          .catch(() => {
            this.isLoading = false;
            this.$notify(
              "error",
              this.$t("profile.failed"),
              this.$t("xtream.restore-playlist-error"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
          });
      }
    },
  },
  beforeMount() {
    this.loadPlaylists();
    EventBus.$emit("can-add-playlist", this.canAddPlaylist);
    EventBus.$on("search", this.searchAccount);
    EventBus.$on("print", this.printAccounts);
    EventBus.$on("refresh", this.loadPlaylists);
    EventBus.$on("add", this.addPlaylist);
    EventBus.$on("cancel", this.cancelEditor);
    EventBus.$on("save", this.saveEditor);
    EventBus.$on("tab-change", this.doTabChange);
  },
  beforeDestroy() {
    EventBus.$off("search", this.searchAccount);
    EventBus.$off("print", this.printAccounts);
    EventBus.$off("refresh", this.loadPlaylists);
    EventBus.$off("add", this.addPlaylist);
    EventBus.$off("cancel", this.cancelEditor);
    EventBus.$off("save", this.saveEditor);
    EventBus.$off("tab-change", this.doTabChange);
  },
  watch: {
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
    editor: function (val) {
      EventBus.$emit("update-editor", val);
      if (!val) {
        this.loadPlaylists();
      }
    },
    canAddPlaylist: function (val) {
      EventBus.$emit("can-add-playlist", val);
    },
    "playlist.source_host": function () {
      if (
        this.playlist.source_host &&
        this.playlist.source_host.length &&
        this.playlist.source_username &&
        this.playlist.source_username.length &&
        this.playlist.source_password &&
        this.playlist.source_password.length &&
        this.editor
      ) {
        this.playlistAuth();
        this.loadGroups();
      }
    },
    "playlist.url": function (url) {
      if (url !== undefined && url.length) {
        try {
          let u = new URL(url);
          this.playlist.source_host = u.hostname;
          this.playlist.source_port = u.port;
          this.playlist.source_username = u.searchParams.get("username");
          this.playlist.source_password = u.searchParams.get("password");
          if (!this.playlist.name.length) {
            this.playlist.name = u.hostname.toUpperCase();
          }
        } catch {
          //
        }
      }
    },
  },
};
</script>

<style lang="scss">
.modal-groups {
  max-height: 250px;
  overflow: hidden;

  .ps {
    max-height: 250px;
  }
}

.sync-groups {
  .checkbox-text {
    margin-top: 2px;
  }
}

.empty-group {
  text-align: center;
  color: $separator-color;
  padding-top: 1rem;

  i {
    display: block;
  }
  p {
    padding: 0;
    display: block;
  }
}

.backup-button,
.export-button {
  display: block;
  min-width: 250px;
}
</style>
