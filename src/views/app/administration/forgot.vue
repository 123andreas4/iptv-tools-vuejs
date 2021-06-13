<template>
  <erd-row class="m-0 p-0">
    <erd-spinner v-if="isLoading" size="lg" overlay absolute></erd-spinner>
    <erd-col xl="12" id="forgots">
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
        <template v-slot:cell(expiry)="row">
          {{ formatDate(row.item.expiry) }}
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
            @click="deleteForgot(row.item.id)"
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
      forgots: [],
      fields: [
        { key: "user_id", label: this.$t("users.id"), sortable: true },
        { key: "code", label: this.$t("forgot.code"), sortable: true },
        { key: "expiry", label: this.$t("forgot.expiry"), sortable: true },
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
    perPage() {
      return this.settings.perPage;
    },
    searchFiltered() {
      if (this.search === null) {
        return this.forgots;
      } else {
        var re = new RegExp(this.search, "i");
        return this.forgots.filter((forgot) => {
          return (
            String(forgot.user_id).match(re) ||
            String(forgot.code).match(re) ||
            String(forgot.expiry).match(re) ||
            this.formatDate(forgot.expiry).match(re)
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
    loadForgots() {
      this.isLoading = true;
      httpService
        .get("administration/forgots")
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.forgots = res.data;
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("forgot.load-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    deleteForgot(id) {
      httpService
        .post("administration/forgot/delete", { id: id })
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.$notify(
              "primary",
              this.$t("profile.success"),
              this.$t("forgot.delete-success"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
            this.loadForgots();
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("forgot.delete-error"),
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
    searchForgot(search) {
      if (search.length === 0) {
        this.search = null;
      } else {
        this.search = search;
      }
    },
    printForgots() {
      document.getElementById("forgots").print();
    },
  },
  beforeMount() {
    this.loadForgots();
    EventBus.$on("refresh", this.loadForgots);
    EventBus.$on("search", this.searchForgot);
    EventBus.$on("print", this.printForgots);
  },
  beforeDestroy() {
    EventBus.$off("refresh", this.loadForgots);
    EventBus.$off("search", this.searchForgot);
    EventBus.$off("print", this.printForgots);
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
