<template>
  <erd-row class="m-0 p-0">
    <erd-modal
      v-show="outputModal"
      @close="closeModal"
      :title="$t('scheduler.output')"
      class="select-none"
      small
    >
      <div class="pfs-wrapper">
        <perfect-scrollbar>
          <span v-html="output"></span>
        </perfect-scrollbar>
      </div>
      <template v-slot:footer>
        <erd-button @click="closeModal" icon="la-times" class="mr-1">{{
          $t("general.close")
        }}</erd-button>
      </template>
    </erd-modal>

    <erd-spinner v-if="isLoading" size="lg" overlay absolute></erd-spinner>
    <erd-col xl="12" v-if="!editor" id="scheduler">
      <b-table :items="paged" :fields="fields" striped small>
        <template v-slot:cell(created_at)="row">
          {{ formatDate(row.item.created_at) }}
        </template>
        <template v-slot:cell(last_updated)="row">
          {{ formatDate(row.item.last_updated) }}
        </template>
        <template v-slot:cell(enabled)="row">
          <erd-badge variant="success" v-if="row.item.enabled">{{
            $t("general.yes")
          }}</erd-badge>
          <erd-badge variant="danger" v-else>{{ $t("general.no") }}</erd-badge>
        </template>
        <template v-slot:cell(actions)="row">
          <erd-button
            variant="info"
            class="btn-table"
            @click="executeSchedule(row.item.id)"
            ><i class="las la-terminal"></i
          ></erd-button>
          <erd-button
            variant="info"
            class="btn-table"
            @click="showOutputModal(row.item)"
            ><i class="las la-search"></i
          ></erd-button>
          <erd-button
            variant="primary"
            class="btn-table"
            @click="editSchedule(row.item)"
            ><i class="las la-pen"></i
          ></erd-button>
          <erd-button
            variant="danger"
            class="btn-table"
            @click="deleteSchedule(row.item.id)"
            ><i class="las la-trash"></i
          ></erd-button>
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
    <erd-col xl="12" v-if="editor">
      <label for="title">{{ $t("scheduler.name") }}</label>
      <erd-input
        id="title"
        class="mt-1 mb-2 w-100"
        :placeholder="$t('scheduler.name')"
        v-model="editorSchedule.name"
      ></erd-input>
      <label for="group">{{ $t("scheduler.group") }}</label>
      <erd-input
        id="group"
        class="mt-1 mb-2 w-100"
        :placeholder="$t('scheduler.group')"
        v-model="editorSchedule.group"
      ></erd-input>
      <label for="command">{{ $t("scheduler.command") }}</label>
      <erd-input
        id="command"
        class="mt-1 mb-2 w-100"
        :placeholder="$t('scheduler.command')"
        v-model="editorSchedule.command"
      ></erd-input>
      <label for="minute">{{ $t("scheduler.minute") }}</label>
      <erd-row class="m-0 p-0">
        <erd-col xl="4" sm="4" class="m-0 p-0">
          <erd-input
            id="minute"
            class="mt-1 mb-2 w-100"
            :placeholder="$t('scheduler.minute')"
            v-model="editorSchedule.minute"
          ></erd-input>
        </erd-col>
        <erd-col xl="8" sm="8" class="m-0 p-0 pl-2">
          <erd-select
            class="mt-1 mb-2 w-100"
            v-model="minute"
            ref="minutes"
            :items="select.minute"
            :placeholder="$t('scheduler.default-settings')"
          ></erd-select>
        </erd-col>
      </erd-row>
      <label for="hour">{{ $t("scheduler.hour") }}</label>
      <erd-row class="m-0 p-0">
        <erd-col xl="4" sm="4" class="m-0 p-0">
          <erd-input
            id="hour"
            class="mt-1 mb-2 w-100"
            :placeholder="$t('scheduler.hour')"
            v-model="editorSchedule.hour"
          ></erd-input>
        </erd-col>
        <erd-col xl="8" sm="8" class="m-0 p-0 pl-2">
          <erd-select
            class="mt-1 mb-2 w-100"
            v-model="hour"
            ref="hour"
            :items="select.hour"
            :placeholder="$t('scheduler.default-settings')"
          ></erd-select>
        </erd-col>
      </erd-row>
      <label for="day">{{ $t("scheduler.day") }}</label>
      <erd-row class="m-0 p-0">
        <erd-col xl="4" sm="4" class="m-0 p-0">
          <erd-input
            id="day"
            class="mt-1 mb-2 w-100"
            :placeholder="$t('scheduler.day')"
            v-model="editorSchedule.day"
          ></erd-input>
        </erd-col>
        <erd-col xl="8" sm="8" class="m-0 p-0 pl-2">
          <erd-select
            class="mt-1 mb-2 w-100"
            v-model="day"
            ref="day"
            :items="select.day"
            :placeholder="$t('scheduler.default-settings')"
          ></erd-select>
        </erd-col>
      </erd-row>
      <label for="month">{{ $t("scheduler.month") }}</label>
      <erd-row class="m-0 p-0">
        <erd-col xl="4" sm="4" class="m-0 p-0">
          <erd-input
            id="month"
            class="mt-1 mb-2 w-100"
            :placeholder="$t('scheduler.month')"
            v-model="editorSchedule.month"
          ></erd-input>
        </erd-col>
        <erd-col xl="8" sm="8" class="m-0 p-0 pl-2">
          <erd-select
            class="mt-1 mb-2 w-100"
            v-model="month"
            ref="month"
            :items="select.month"
            :placeholder="$t('scheduler.default-settings')"
          ></erd-select>
        </erd-col>
      </erd-row>
      <label for="weekday">{{ $t("scheduler.weekday") }}</label>
      <erd-row class="m-0 p-0">
        <erd-col xl="4" sm="4" class="m-0 p-0">
          <erd-input
            id="weekday"
            class="mt-1 mb-2 w-100"
            :placeholder="$t('scheduler.weekday')"
            v-model="editorSchedule.weekday"
          ></erd-input>
        </erd-col>
        <erd-col xl="8" sm="8" class="m-0 p-0 pl-2">
          <erd-select
            class="mt-1 mb-2 w-100"
            v-model="weekday"
            ref="weekday"
            :items="select.weekday"
            :placeholder="$t('scheduler.default-settings')"
          ></erd-select>
        </erd-col>
      </erd-row>
      <erd-checkbox
        :true-value="1"
        :false-value="0"
        v-model="editorSchedule.enabled"
        >{{ $t("scheduler.enabled") }}</erd-checkbox
      >
    </erd-col>
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
      search: null,
      isLoading: false,
      from: 0,
      to: 0,
      total: 0,
      currentPage: 1,
      editor: false,
      editorSchedule: null,
      schedules: [],
      fields: [
        { key: "id", label: this.$t("scheduler.id"), sortable: true },
        {
          key: "created_at",
          label: this.$t("scheduler.created"),
          sortable: true,
        },
        {
          key: "last_updated",
          label: this.$t("scheduler.last-updated"),
          sortable: true,
        },
        { key: "name", label: this.$t("scheduler.name"), sortable: true },
        { key: "group", label: this.$t("scheduler.group"), sortable: true },
        { key: "enabled", label: this.$t("scheduler.enabled"), sortable: true },
        { key: "minute", label: this.$t("scheduler.minute"), sortable: true },
        { key: "hour", label: this.$t("scheduler.hour"), sortable: true },
        { key: "day", label: this.$t("scheduler.day"), sortable: true },
        { key: "month", label: this.$t("scheduler.month"), sortable: true },
        { key: "weekday", label: this.$t("scheduler.weekday"), sortable: true },
        { key: "command", label: this.$t("scheduler.command"), sortable: true },
        {
          key: "actions",
          label: this.$t("users.actions"),
          sortable: false,
          thClass: "text-right",
          tdClass: "text-right",
        },
      ],
      select: {
        minute: [
          { text: this.$t("scheduler.minute-*"), value: "*" },
          { text: this.$t("scheduler.minute-0"), value: "0" },
          { text: this.$t("scheduler.minute-15"), value: "15" },
          { text: this.$t("scheduler.minute-30"), value: "30" },
          { text: this.$t("scheduler.minute-45"), value: "45" },
        ],
        hour: [
          { text: this.$t("scheduler.hour-*"), value: "*" },
          { text: this.$t("scheduler.hour-0"), value: "0" },
          { text: this.$t("scheduler.hour-30"), value: "30" },
        ],
        day: [
          { text: this.$t("scheduler.day-*"), value: "*" },
          { text: 1, value: "1" },
          { text: 2, value: "2" },
          { text: 3, value: "3" },
          { text: 4, value: "4" },
          { text: 5, value: "5" },
          { text: 6, value: "6" },
          { text: 7, value: "7" },
          { text: 8, value: "8" },
          { text: 9, value: "9" },
          { text: 10, value: "10" },
          { text: 11, value: "11" },
          { text: 12, value: "12" },
          { text: 13, value: "13" },
          { text: 14, value: "14" },
          { text: 15, value: "15" },
          { text: 16, value: "16" },
          { text: 17, value: "17" },
          { text: 18, value: "18" },
          { text: 19, value: "19" },
          { text: 20, value: "20" },
          { text: 21, value: "21" },
          { text: 22, value: "22" },
          { text: 23, value: "23" },
          { text: 24, value: "24" },
          { text: 25, value: "25" },
          { text: 26, value: "26" },
          { text: 27, value: "27" },
          { text: 28, value: "28" },
          { text: 29, value: "29" },
          { text: 30, value: "30" },
          { text: 31, value: "31" },
        ],
        month: [
          { text: this.$t("scheduler.month-*"), value: "*" },
          { text: this.$t("scheduler.month-1"), value: "1" },
          { text: this.$t("scheduler.month-2"), value: "2" },
          { text: this.$t("scheduler.month-3"), value: "3" },
          { text: this.$t("scheduler.month-4"), value: "4" },
          { text: this.$t("scheduler.month-5"), value: "5" },
          { text: this.$t("scheduler.month-6"), value: "6" },
          { text: this.$t("scheduler.month-7"), value: "7" },
          { text: this.$t("scheduler.month-8"), value: "8" },
          { text: this.$t("scheduler.month-9"), value: "9" },
          { text: this.$t("scheduler.month-10"), value: "10" },
          { text: this.$t("scheduler.month-11"), value: "11" },
          { text: this.$t("scheduler.month-12"), value: "12" },
        ],
        weekday: [
          { text: this.$t("scheduler.weekday-*"), value: "*" },
          { text: this.$t("scheduler.weekday-0"), value: "0" },
          { text: this.$t("scheduler.weekday-1"), value: "1" },
          { text: this.$t("scheduler.weekday-2"), value: "2" },
          { text: this.$t("scheduler.weekday-3"), value: "3" },
          { text: this.$t("scheduler.weekday-4"), value: "4" },
          { text: this.$t("scheduler.weekday-5"), value: "5" },
          { text: this.$t("scheduler.weekday-6"), value: "6" },
        ],
      },
      minute: 0,
      hour: 0,
      day: 0,
      month: 0,
      weekday: 0,
      outputModal: false,
      output: "",
    };
  },
  computed: {
    ...mapGetters(["currentUser", "settings", "appXmltvSync"]),
    perPage() {
      return this.settings.perPage;
    },
    searchFiltered() {
      if (this.search === null) {
        return this.schedules;
      } else {
        var re = new RegExp(this.search, "i");
        return this.schedules.filter((schedule) => {
          return (
            String(schedule.name).match(re) ||
            String(schedule.group).match(re) ||
            String(schedule.command).match(re) ||
            String(schedule.output).match(re) ||
            this.formatDate(schedule.created_at).match(re) ||
            this.formatDate(schedule.last_updated).match(re)
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
    ...mapActions(["syncXmltv"]),
    closeModal() {
      this.outputModal = false;
    },
    showOutputModal(schedule) {
      this.output = schedule.output;
      this.outputModal = true;
    },
    updatePerPage(perPage) {
      this.perPage = perPage;
    },
    formatDate(date) {
      return new Date(date).toLocaleString(
        this.$t("date.locale"),
        this.dateOptions
      );
    },
    loadSchedules() {
      this.isLoading = true;
      httpService
        .get("administration/scheduler")
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.schedules = res.data;
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("scheduler.load-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    editSchedule(schedule) {
      this.minute = 0;
      this.hour = 0;
      this.day = 0;
      this.month = 0;
      this.weekday = 0;
      this.editorSchedule = Object.assign({}, schedule);
      this.editor = true;
    },
    addXmltv() {
      this.minute = 0;
      this.hour = 0;
      this.day = 0;
      this.month = 0;
      this.weekday = 0;
      this.editorSchedule = {
        name: "",
        group: "",
        enabled: 1,
        minute: "*",
        hour: "*",
        day: "*",
        month: "*",
        weekday: "*",
        command: "",
      };
      this.editor = true;
    },
    saveSchedule() {
      this.editor = false;
      let schedule = Object.assign({}, this.editorSchedule);
      if (schedule.id !== undefined) {
        delete schedule.id;
        httpService
          .post("administration/scheduler/update", {
            id: this.editorSchedule.id,
            schedule: schedule,
          })
          .then((res) => {
            this.isLoading = false;
            if (res.status === true) {
              this.$notify(
                "primary",
                this.$t("profile.success"),
                this.$t("scheduler.save-success"),
                "la-user-shield",
                { duration: 5000, permanent: false }
              );
              this.loadSchedules();
              this.editor = false;
            }
          })
          .catch(() => {
            this.isLoading = false;
            this.$notify(
              "error",
              this.$t("profile.failed"),
              this.$t("scheduler.save-error"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
          });
      } else {
        schedule.user_id = this.currentUser.user.id;
        httpService
          .post("administration/scheduler/insert", schedule)
          .then((res) => {
            this.isLoading = false;
            if (res.status === true) {
              this.$notify(
                "primary",
                this.$t("profile.success"),
                this.$t("scheduler.save-success"),
                "la-user-shield",
                { duration: 5000, permanent: false }
              );
              this.loadSchedules();
              this.editor = false;
            }
          })
          .catch(() => {
            this.isLoading = false;
            this.$notify(
              "error",
              this.$t("profile.failed"),
              this.$t("scheduler.save-error"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
          });
      }
    },
    deleteSchedule(id) {
      httpService
        .post("administration/scheduler/delete", { id: id })
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.$notify(
              "primary",
              this.$t("profile.success"),
              this.$t("scheduler.delete-success"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
            this.loadSchedules();
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("scheduler.delete-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    cancelSchedule() {
      this.editor = false;
    },
    executeSchedule(id) {
      this.isLoading = true;
      httpService
        .post("administration/scheduler/execute", { id: id })
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.output = res.data;
            this.outputModal = true;
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    searchSchedule(search) {
      if (search.length === 0) {
        this.search = null;
      } else {
        this.search = search;
      }
    },
    printUsers() {
      document.getElementById("scheduler").print();
    },
  },
  beforeMount() {
    this.loadSchedules();
    EventBus.$on("refresh", this.loadSchedules);
    EventBus.$on("save", this.saveSchedule);
    EventBus.$on("cancel", this.cancelSchedule);
    EventBus.$on("search", this.searchSchedule);
    EventBus.$on("print", this.printUsers);
    EventBus.$on("add", this.addXmltv);
  },
  beforeDestroy() {
    EventBus.$off("refresh", this.loadSchedules);
    EventBus.$off("save", this.saveSchedule);
    EventBus.$off("cancel", this.cancelSchedule);
    EventBus.$off("search", this.searchSchedule);
    EventBus.$off("print", this.printUsers);
    EventBus.$off("add", this.addXmltv);
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
    },
    minute: function (val) {
      this.editorSchedule.minute = val;
    },
    hour: function (val) {
      this.editorSchedule.hour = val;
    },
    day: function (val) {
      this.editorSchedule.day = val;
    },
    month: function (val) {
      this.editorSchedule.month = val;
    },
    weekday: function (val) {
      this.editorSchedule.weekday = val;
    },
  },
};
</script>

<style lang="scss">
.pfs-wrapper {
  .ps {
    height: 300px;
  }
}
</style>
