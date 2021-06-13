<template>
  <erd-row class="m-0 p-0">
    <erd-spinner v-if="isLoading" size="lg" overlay absolute></erd-spinner>
    <erd-col xl="12" id="logins">
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
        <template v-slot:cell(action)="row">
          <erd-badge
            :variant="row.item.action === 1 ? 'primary' : 'secondary'"
            class="py-1"
            >{{ $t(`login-action.${row.item.action}`) }}</erd-badge
          >
        </template>
        <template v-slot:cell(status)="row">
          <erd-badge
            :variant="row.item.status === 1 ? 'success' : 'danger'"
            class="py-1"
            >{{ $t(`login-status.${row.item.status}`) }}</erd-badge
          >
        </template>
        <template v-slot:cell(datetime)="row">
          {{ formatDate(row.item.datetime) }}
        </template>
        <template v-slot:cell(ipaddress)="row">
          <a
            target="_blank"
            :href="`https://whatismyipaddress.com/ip/${row.item.ipaddress}`"
            >{{ row.item.ipaddress }}</a
          >
        </template>
        <template v-slot:cell(error)="row">
          <span
            v-if="row.item.error"
            v-html="
              $t('login-status.error').format(
                row.item.error.username,
                row.item.error.password
              )
            "
          ></span>
        </template>
        <template v-slot:cell(actions)="row">
          <erd-button
            variant="info"
            class="btn-table"
            @click="user(row.item.user_id)"
            ><i class="las la-user"></i
          ></erd-button>
          <erd-button
            variant="danger"
            class="btn-table"
            @click="deleteLogin(row.item.id)"
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
      logins: [],
      fields: [
        { key: "user_id", label: this.$t("users.id"), sortable: true },
        { key: "action", label: this.$t("logins.action"), sortable: true },
        { key: "status", label: this.$t("logins.status"), sortable: true },
        { key: "datetime", label: this.$t("logins.datetime"), sortable: true },
        {
          key: "ipaddress",
          label: this.$t("logins.ip-address"),
          sortable: true,
        },
        {
          key: "useragent",
          label: this.$t("logins.useragent"),
          sortable: true,
        },
        {
          key: "error",
          label: this.$t("logins.error"),
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
      statusList: [
        { value: 1, text: this.$t("user-status.1") },
        { value: 2, text: this.$t("user-status.2") },
        { value: 3, text: this.$t("user-status.3") },
        { value: 4, text: this.$t("user-status.4") },
        { value: 5, text: this.$t("user-status.5") },
      ],
      roleList: [
        { value: 1, text: this.$t("roles.1") },
        { value: 2, text: this.$t("roles.2") },
        { value: 3, text: this.$t("roles.3") },
        { value: 4, text: this.$t("roles.4") },
        { value: 5, text: this.$t("roles.5") },
        { value: 1985, text: this.$t("roles.1985") },
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
        return this.logins;
      } else {
        var re = new RegExp(this.search, "i");
        return this.logins.filter((login) => {
          return (
            String(login.user_id).match(re) ||
            String(login.datetime).match(re) ||
            this.formatDate(login.datetime).match(re) ||
            String(login.ipaddress).match(re) ||
            String(login.useragent).match(re) ||
            String(login.error).match(re) ||
            this.$t(`login-action.${login.action}`).match(re) ||
            this.$t(`login-status.${login.status}`).match(re)
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
      return new Date(date).toLocaleString(
        this.$t("date.locale"),
        this.dateOptions
      );
    },
    loadLogins() {
      this.isLoading = true;
      httpService
        .get("administration/logins")
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.logins = res.data;
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("logins.load-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    deleteLogin(id) {
      httpService
        .post("administration/login/delete", { id: id })
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.$notify(
              "primary",
              this.$t("profile.success"),
              this.$t("logins.delete-success"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
            this.loadLogins();
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("logins.delete-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    user(id) {
      this.$router.push({
        name: "users",
        params: { editor: true, id: id },
      });
    },
    searchLogin(search) {
      if (search.length === 0) {
        this.search = null;
      } else {
        this.search = search;
      }
    },
    printLogins() {
      document.getElementById("logins").print();
    },
  },
  beforeMount() {
    this.loadLogins();
    EventBus.$on("refresh", this.loadLogins);
    EventBus.$on("search", this.searchLogin);
    EventBus.$on("print", this.printLogins);
  },
  beforeDestroy() {
    EventBus.$off("refresh", this.loadLogins);
    EventBus.$off("search", this.searchLogin);
    EventBus.$off("print", this.printLogins);
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
  },
};
</script>
