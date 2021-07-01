<template>
  <erd-row class="m-0 p-0" id="groups">
    <erd-spinner v-if="isLoading" size="lg" overlay absolute></erd-spinner>
    <erd-col xl="12" sm="12" v-if="!editor">
      <b-table :items="paged" :fields="fields" striped small>
        <template v-slot:cell(group_type)="row">
          {{ $t(`category-type.${row.item.group_type}`) }}
        </template>
        <template v-slot:cell(group_is_hidden)="row">
          <erd-badge
            class="py-1 px-2"
            variant="danger"
            v-if="row.item.group_is_hidden"
            >{{ $t("general.yes") }}</erd-badge
          >
          <erd-badge class="py-1 px-2" variant="success" v-else>{{
            $t("general.no")
          }}</erd-badge>
        </template>
        <template v-slot:cell(actions)="row">
          <erd-tooltip :tooltip="$t('xtream.tooltip-edit-group')" :enabled="showTooltips">
            <erd-button
              variant="info"
              class="btn-table"
              @click="editGroup(row.item)"
              ><i class="las la-pen"></i
            ></erd-button>
          </erd-tooltip>
          <erd-tooltip :tooltip="$t('xtream.tooltip-delete-group')" :enabled="showTooltips">
            <erd-button
              variant="danger"
              class="btn-table"
              @click="deleteGroup(row.item.id)"
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
    <erd-col xl="12" sm="12" v-if="editor">
      <label class="d-block" for="playlist">{{ $t("xtream.playlist") }}</label>
      <erd-select
        id="playlist"
        ref="playlist"
        class="mt-1 mb-2 w-100"
        v-model="group.playlist_id"
        :items="playlists"
      ></erd-select>
      <template v-if="currentUser.subscription.subscription_type !== 0">
        <label class="d-block" for="group-type">{{
          $t("xtream.group-type")
        }}</label>
        <erd-select
          id="group-type"
          ref="group-type"
          class="mt-1 mb-2 w-100"
          v-model="group.group_type"
          :items="groupTypes"
        ></erd-select>
      </template>
      <label class="d-block" for="name">{{ $t("xtream.name") }}</label>
      <erd-input
        id="name"
        class="mt-1 mb-2 w-100"
        v-model="group.group_name"
      ></erd-input>
      <label class="d-block" for="order">{{ $t("xtream.order") }}</label>
      <erd-input
        id="order"
        class="mt-1 mb-2 w-100"
        v-model="group.group_order"
        type="number"
      ></erd-input>
      <erd-checkbox
        class="mb-2 w-100"
        v-model="group.group_is_hidden"
        :true-value="1"
        :false-value="0"
        >{{ $t("xtream.hidden") }}</erd-checkbox
      >
    </erd-col>
  </erd-row>
</template>

<script>
/* eslint-disable vue/no-side-effects-in-computed-properties */
import { EventBus } from "../../../services/ebus";
import { httpService } from "../../../services/http";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      activeTab: 0,
      playlists: [],
      groups: [],
      group: null,
      editor: false,
      search: null,
      isLoading: false,
      from: 0,
      to: 0,
      total: 0,
      currentPage: 1,
      fields: [
        {
          key: "playlist",
          label: this.$t("xtream.playlist"),
          sortable: true,
        },
        { key: "group_name", label: this.$t("xtream.name"), sortable: true },
        { key: "group_order", label: this.$t("xtream.order"), sortable: true },
        { key: "group_type", label: this.$t("xtream.type"), sortable: true },
        {
          key: "group_is_hidden",
          label: this.$t("xtream.hidden"),
          sortable: true,
        },
        {
          key: "streams",
          label: this.$t("xtream.streams"),
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
      groupTypes: [
        { text: this.$t("xtream.live"), value: 1 },
        { text: this.$t("xtream.movies"), value: 2 },
        { text: this.$t("xtream.series"), value: 3 },
      ],
    };
  },
  computed: {
    ...mapGetters(["currentUser", "settings"]),
    showTooltips () {
      return this.settings.showTooltips;
    },
    perPage() {
      return this.settings.perPage;
    },
    searchFiltered() {
      if (this.search === null) {
        return this.groups;
      } else {
        var re = new RegExp(this.search, "i");
        return this.groups.filter((group) => {
          return (
            String(group.group_name).match(re) ||
            String(group.group_order).match(re) ||
            this.$t(`category-type.${group.group_type}`).match(re)
          );
        });
      }
    },
    paged() {
      this.total = this.searchFiltered.length;
      this.from = (this.currentPage - 1) * this.perPage;
      this.to =
        this.from + this.perPage > this.total
          ? this.total
          : this.from + this.perPage;
      return this.searchFiltered.slice(this.from, this.to);
    },
  },
  methods: {
    loadGroups() {
      let amount = 50;
      let groups = [];
      this.isLoading = true;
      Promise.all([httpService.get("group/total"), httpService.get("playlist")])
        .then((res) => {
          if (res[0].status === true) {
            let requests = [];
            for (var i = 0; i < Math.ceil(res[0].data / amount); i++) {
              requests.push(httpService.get(`group/${i * amount}/${amount}`));
            }
            Promise.all(requests).then((results) => {
              this.isLoading = false;
              results.map((res) => {
                if (res.status === true) {
                  groups = [...groups, ...res.data];
                }
              });
              if (this.currentUser.subscription.subscription_type == 0) {
                this.groups = groups.filter((group) => {
                  return group.group_type === 1;
                });
              } else {
                this.groups = groups;
              }
            });
          }
          if (res[1].status === true) {
            this.playlists = res[1].data.map((playlist) => {
              return {
                text: playlist.name,
                value: playlist.id,
              };
            });
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("xtream.group-load-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    addGroup() {
      httpService
        .post("group/add")
        .then((res) => {
          this.isLoading = false;
          if (res.status === true && res.data) {
            this.group = {
              id: res.data,
              group_name: "",
              group_order: 0,
              group_type: 1,
              group_parent_code: "",
              group_is_hidden: false,
            };
            this.editor = true;
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("xtream.group-load-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    editGroup(group) {
      this.group = Object.assign({}, group);
      this.editor = true;
    },
    cancelEditor() {
      this.editor = false;
    },
    saveEditor() {
      let group = Object.assign({}, this.group);
      delete group.id;
      delete group.playlist;
      delete group.streams;

      httpService
        .put(`group/${this.group.id}`, group)
        .then((res) => {
          if (res.status === true) {
            this.$notify(
              "primary",
              this.$t("profile.success"),
              this.$t("xtream.group-save-success"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
            this.editor = false;
            this.loadGroups();
          }
        })
        .catch(() => {
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("xtream.group-save-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    deleteGroup(id) {
      httpService
        .delete(`group/${id}`)
        .then((res) => {
          if (res.status === true) {
            this.$notify(
              "primary",
              this.$t("profile.success"),
              this.$t("xtream.group-delete-success"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
            this.loadGroups();
          }
        })
        .catch(() => {
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("xtream.group-delete-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    searchGroup(search) {
      if (search.length === 0) {
        this.search = null;
      } else {
        this.search = search;
      }
    },
    printGroups() {
      document.getElementById("groups").print();
    },
    formatDate(date) {
      return new Date(date).toLocaleString(
        this.$t("date.locale"),
        this.dateOptions
      );
    },
    doTabChange(tab) {
      if (tab == 1) {
        this.loadGroups();
      }
      this.activeTab = tab;
    },
  },
  beforeMount() {
    this.loadGroups();
    EventBus.$on("search", this.searchGroup);
    EventBus.$on("print", this.printGroups);
    EventBus.$on("refresh", this.loadGroups);
    EventBus.$on("add", this.addGroup);
    EventBus.$on("cancel", this.cancelEditor);
    EventBus.$on("save", this.saveEditor);
    EventBus.$on("tab-change", this.doTabChange);
  },
  beforeDestroy() {
    EventBus.$off("search", this.searchGroup);
    EventBus.$off("print", this.printGroups);
    EventBus.$off("refresh", this.loadGroups);
    EventBus.$off("add", this.addGroup);
    EventBus.$off("cancel", this.cancelEditor);
    EventBus.$off("save", this.saveEditor);
    EventBus.$off("tab-change", this.doTabChange);
  },
  watch: {
    from: function (val) {
      EventBus.$emit("update-from", val);
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
        this.loadGroups();
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
</style>
