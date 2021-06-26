<template>
  <erd-row class="m-0 p-0">
    <erd-spinner v-if="isLoading" size="lg" overlay absolute></erd-spinner>
    <erd-col xl="12" v-if="!editor" id="subscriptions">
      <b-table :items="paged" :fields="fields" striped small>
        <template v-slot:cell(user_id)="row">
          <router-link
            :to="{
              name: 'users',
              params: { editor: true, id: row.item.user_id },
            }"
            >{{ row.item.user_id }}</router-link
          >
        </template>
        <template v-slot:cell(subscription_type)="row">
          {{ $t(`status.${row.item.subscription_type}`) }}
        </template>
        <template v-slot:cell(enabled)="row">
          <erd-badge
            class="py-1"
            :variant="row.item.enabled ? 'success' : 'danger'"
            >{{
              row.item.enabled ? $t("general.yes") : $t("general.no")
            }}</erd-badge
          >
        </template>
        <template v-slot:cell(created)="row">
          {{ formatDate(row.item.created) }}
        </template>
        <template v-slot:cell(last_updated)="row">
          {{ formatDate(row.item.last_updated) }}
        </template>
        <template v-slot:cell(end_date)="row">
          {{ formatDate(row.item.end_date) }}
        </template>

        <template v-slot:cell(actions)="row">
          <erd-button
            variant="info"
            class="btn-table"
            @click="user(row.item.user_id)"
            ><i class="las la-user"></i
          ></erd-button>
          <erd-button
            variant="primary"
            class="btn-table"
            @click="editSubscription(row.item)"
            ><i class="las la-user-edit"></i
          ></erd-button>
          <erd-button
            variant="danger"
            class="btn-table"
            @click="deleteSubscription(row.item.id)"
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
      <label for="subscription-type">{{ $t("subscriptions.type") }}</label>
      <erd-select
        id="subscription-type"
        class="mt-1 mb-2 w-100"
        :items="subscriptionTypes"
        v-model="editorSubscription.subscription_type"
      ></erd-select>
      <label for="subscription-type">{{
        $t("subscriptions.playlist-type")
      }}</label>
      <erd-select
        id="playlist-type"
        class="mt-1 mb-2 w-100"
        :items="playlistTypes"
        v-model="editorSubscription.playlist_type"
      ></erd-select>
      <label for="enabled">{{ $t("subscriptions.enabled") }}</label>
      <erd-select
        id="enabled"
        class="mt-1 mb-2 w-100"
        :items="enabledTypes"
        v-model="editorSubscription.enabled"
      ></erd-select>
      <label for="custom">{{ $t("subscriptions.custom") }}</label>
      <erd-select
        id="custom"
        class="mt-1 mb-2 w-100"
        :items="enabledTypes"
        v-model="editorSubscription.custom_plan"
      ></erd-select>
      <div v-if="editorSubscription && editorSubscription.custom_plan == 1">
        <label for="custom">{{ $t("subscriptions.max-playlists") }}</label>
        <erd-input class="mt-1 mb-2 w-100" type="number" v-model="editorSubscription.max_playlist"></erd-input>
      </div>
      <label for="end-date" v-if="editorSubscription.end_date !== null">{{
        $t("subscriptions.end_date")
      }}</label>
      <erd-calendar
        class="form-control mt-1 mb-2"
        id="end-date"
        v-if="editorSubscription.end_date !== null"
        v-model="editorSubscription.end_date"
        :date-locale="$t('date.locale')"
      ></erd-calendar>
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
      search: null,
      isLoading: false,
      from: 0,
      to: 0,
      total: 0,
      currentPage: 1,
      editor: false,
      editorSubscription: null,
      subscriptions: [],
      fields: [
        { key: "user_id", label: this.$t("users.id"), sortable: true },
        {
          key: "subscription_type",
          label: this.$t("subscriptions.type"),
          sortable: true,
        },
        {
          key: "enabled",
          label: this.$t("subscriptions.enabled"),
          sortable: true,
        },
        {
          key: "created",
          label: this.$t("users.created"),
          sortable: true,
        },
        {
          key: "last_updated",
          label: this.$t("users.last-updated"),
          sortable: true,
        },
        {
          key: "end_date",
          label: this.$t("subscriptions.end_date"),
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
      subscriptionTypes: [
        { value: 0, text: this.$t("status.0") },
        { value: 1, text: this.$t("status.1") },
        { value: 2, text: this.$t("status.2") },
        { value: 3, text: this.$t("status.3") },
        { value: 4, text: this.$t("status.4") },
        { value: 5, text: this.$t("status.5") },
        { value: 1985, text: this.$t("status.1985") },
      ],
      playlistTypes: [
        { value: 0, text: this.$t("playlist-type.0") },
        { value: 1, text: this.$t("playlist-type.1") },
        { value: 2, text: this.$t("playlist-type.2") },
        { value: 3, text: this.$t("playlist-type.3") },
      ],
      enabledTypes: [
        { value: 0, text: this.$t("general.no") },
        { value: 1, text: this.$t("general.yes") },
      ],
    };
  },
  computed: {
    ...mapGetters(["currentUser", "settings"]),
    perPage() {
      return this.settings.perPage;
    },
    searchFiltered() {
      if (this.search === null) {
        return this.subscriptions;
      } else {
        var re = new RegExp(this.search, "i");
        return this.subscriptions.filter((subscription) => {
          return (
            String(subscription.subscription_type).match(re) ||
            String(subscription.enabled).match(re) ||
            String(subscription.user_id).match(re) ||
            JSON.stringify(subscription.note).match(re) ||
            String(subscription.end_date).match(re) ||
            String(subscription.created).match(re) ||
            String(subscription.last_updated).match(re) ||
            this.formatDate(subscription.end_date).match(re) ||
            this.formatDate(subscription.created).match(re) ||
            this.formatDate(subscription.last_updated).match(re)
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
    formatDate(date) {
      return date == null || date == undefined
        ? "-"
        : new Date(date).toLocaleString(
            this.$t("date.locale"),
            this.dateOptions
          );
    },
    loadSubscriptions() {
      this.isLoading = true;
      httpService
        .get("administration/subscriptions")
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.subscriptions = res.data;
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("subscriptions.load-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    editSubscription(subscription) {
      this.editorSubscription = Object.assign({}, subscription);
      this.editorSubscription.end_date =
        this.editorSubscription.end_date != null &&
        this.editorSubscription.end_date != undefined
          ? new Date(this.editorSubscription.end_date)
          : null;
      this.editor = true;
    },
    saveSubscription() {
      this.editor = false;
      let subscription = Object.assign({}, this.editorSubscription);
      subscription.last_updated = new Date();
      delete subscription.id;
      httpService
        .post("administration/subscription/update", {
          id: this.editorSubscription.id,
          subscription: subscription,
        })
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.$notify(
              "primary",
              this.$t("profile.success"),
              this.$t("subscriptions.save-success"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
            this.loadSubscriptions();
            this.editor = false;
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("subscriptions.save-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    deleteSubscription(id) {
      httpService
        .post("administration/subscription/delete", { id: id })
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.$notify(
              "primary",
              this.$t("profile.success"),
              this.$t("subscriptions.delete-success"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
            this.loadSubscriptions();
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("subscriptions.delete-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    cancelSubscription() {
      this.editor = false;
    },
    user(id) {
      this.$router.push({
        name: "users",
        params: { editor: true, id: id },
      });
    },
    searchSubscription(search) {
      if (search.length === 0) {
        this.search = null;
      } else {
        this.search = search;
      }
    },
    printSubscriptions() {
      document.getElementById("subscriptions").print();
    },
  },
  beforeMount() {
    if (this.$route.params.editor && this.$route.params.id !== undefined) {
      httpService
        .get("administration/subscriptions")
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.subscriptions = res.data;
            let subscription = this.subscriptions.find(
              (subscription) => subscription.user_id === this.$route.params.id
            );
            if (subscription) {
              this.editSubscription(subscription);
            }
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("subscriptions.load-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    } else {
      this.loadSubscriptions();
    }
    EventBus.$on("refresh", this.loadSubscriptions);
    EventBus.$on("save", this.saveSubscription);
    EventBus.$on("cancel", this.cancelSubscription);
    EventBus.$on("search", this.searchSubscription);
    EventBus.$on("print", this.printSubscriptions);
  },
  beforeDestroy() {
    EventBus.$off("refresh", this.loadSubscriptions);
    EventBus.$off("save", this.saveSubscription);
    EventBus.$off("cancel", this.cancelSubscription);
    EventBus.$off("search", this.searchSubscription);
    EventBus.$off("print", this.printSubscriptions);
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
    "editorSubscription.subscription_type": function (val) {
      if (val.value === 1985 || val === 1985) {
        this.editorSubscription.end_date = null;
      } else {
        this.editorSubscription.end_date =
          this.editorSubscription.end_date === null
            ? new Date()
            : this.editorSubscription.end_date;
      }
    },
  },
};
</script>
