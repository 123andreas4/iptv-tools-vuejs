<template>
  <erd-row class="m-0 p-0">
    <erd-spinner v-if="isLoading" size="lg" overlay absolute></erd-spinner>
    <erd-col xl="12" id="confirms">
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
            @click="deleteConfirm(row.item.id)"
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
      confirms: [],
      fields: [
        { key: "user_id", label: this.$t("users.id"), sortable: true },
        { key: "code", label: this.$t("confirm.code"), sortable: true },
        { key: "expiry", label: this.$t("confirm.expiry"), sortable: true },
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
        return this.confirms;
      } else {
        var re = new RegExp(this.search, "i");
        return this.confirms.filter((confirm) => {
          return (
            String(confirm.user_id).match(re) ||
            String(confirm.code).match(re) ||
            String(confirm.expiry).match(re) ||
            this.formatDate(confirm.expiry).match(re)
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
    loadConfirms() {
      this.isLoading = true;
      httpService
        .get("administration/confirms")
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.confirms = res.data;
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("confirm.load-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    deleteConfirm(id) {
      httpService
        .post("administration/confirm/delete", { id: id })
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.$notify(
              "primary",
              this.$t("profile.success"),
              this.$t("confirm.delete-success"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
            this.loadConfirms();
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("confirm.delete-error"),
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
    searchConfirm(search) {
      if (search.length === 0) {
        this.search = null;
      } else {
        this.search = search;
      }
    },
    printConfirms() {
      document.getElementById("confirms").print();
    },
  },
  beforeMount() {
    this.loadConfirms();
    EventBus.$on("refresh", this.loadConfirms);
    EventBus.$on("search", this.searchConfirm);
    EventBus.$on("print", this.printConfirms);
  },
  beforeDestroy() {
    EventBus.$off("refresh", this.loadConfirms);
    EventBus.$off("search", this.searchConfirm);
    EventBus.$off("print", this.printConfirms);
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
