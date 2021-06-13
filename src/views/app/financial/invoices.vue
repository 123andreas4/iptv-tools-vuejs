<template>
  <erd-row class="m-0 p-0" :class="{ 'erd-report': viewer }">
    <erd-spinner v-if="isLoading" size="lg" overlay absolute></erd-spinner>
    <erd-col xl="12" v-if="!viewer" id="invoices">
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
        <template v-slot:cell(invoice_date)="row">
          {{ formatDate(row.item.invoice_date) }}
        </template>
        <template v-slot:cell(items)="row">
          {{ items(row.item.items) }}
        </template>
        <template v-slot:cell(visible)="row">
          {{ row.item.visible ? $t("general.yes") : $t("general.no") }}
        </template>
        <template v-slot:cell(confirmed)="row">
          {{ row.item.confirmed ? $t("general.yes") : $t("general.no") }}
        </template>
        <template v-slot:cell(actions)="row">
          <erd-button
            variant="info"
            class="btn-table"
            @click="viewInvoice(row.item)"
            ><i class="las la-search"></i
          ></erd-button>
          <erd-button
            variant="danger"
            class="btn-table"
            @click="deleteInvoice(row.item.id)"
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
    <erd-col v-if="viewer && viewerInvoice !== null" flex center>
      <erd-report
        id="invoice"
        :number="viewerInvoice.id"
        :recipient="recipient"
        :items="viewerInvoice.items"
        :date="new Date(viewerInvoice.invoice_date)"
        :context-items="invoiceContext"
      ></erd-report>
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
      viewer: false,
      viewerInvoice: null,
      viewerInvoiceProfile: null,
      search: null,
      isLoading: false,
      from: 0,
      to: 0,
      total: 0,
      currentPage: 1,
      invoices: [],
      fields: [
        { key: "user_id", label: this.$t("users.id"), sortable: true },
        {
          key: "invoice_date",
          label: this.$t("invoices.invoice-date"),
          sortable: true,
        },
        { key: "items", label: this.$t("invoices.items"), sortable: true },
        { key: "visible", label: this.$t("invoices.visible"), sortable: true },
        {
          key: "confirmed",
          label: this.$t("invoices.confirmed"),
          sortable: true,
        },
        { key: "note", label: this.$t("invoices.note"), sortable: true },
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
        return this.invoices;
      } else {
        var re = new RegExp(this.search, "i");
        return this.invoices.filter((invoice) => {
          return (
            String(invoice.user_id).match(re) ||
            String(invoice.invoice_date).match(re) ||
            JSON.stringify(invoice.items).match(re) ||
            this.formatDate(invoice.invoice_date).match(re)
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
    recipient() {
      let profile = this.viewerInvoiceProfile
        ? this.viewerInvoiceProfile
        : {
            first_name: "",
            last_name: "",
            address: "",
            zipcode: "",
            city: "",
            country: "",
            email: "",
            phone: "",
          };
      return [
        `${profile.name_first} ${profile.name_last}`,
        `${profile.address} ${profile.zipcode} ${profile.city}, ${profile.country}`,
      ];
    },
    invoiceContext() {
      return [
        {
          text: this.$t("subscriptions.print-invoice"),
          icon: "la-print",
          onClick: function () {
            document.getElementById("invoice").print();
          },
        },
      ];
    },
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString(
        this.$t("date.locale"),
        this.dateOptions
      );
    },
    items(items) {
      let i = [...items];
      return i.map((item) => item.description).join(",");
    },
    closeViewer() {
      this.viewer = false;
    },
    printInvoice() {
      if (this.viewer) {
        document.getElementById("invoice").print();
      } else {
        document.getElementById("invoices").print();
      }
    },
    loadInvoices() {
      this.isLoading = true;
      httpService
        .get("administration/invoices")
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.invoices = res.data;
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
    deleteInvoice(id) {
      httpService
        .post("administration/invoice/delete", { id: id })
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
            this.loadInvoices();
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
    // eslint-disable-next-line no-unused-vars
    viewInvoice(invoice) {
      this.isLoading = true;
      httpService
        .get(`administration/profile/${invoice.user_id}`)
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.viewerInvoiceProfile = res.data[0];
            this.viewerInvoice = invoice;
            this.viewer = true;
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("invoice.load-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    searchInvoice(search) {
      if (search.length === 0) {
        this.search = null;
      } else {
        this.search = search;
      }
    },
  },
  beforeMount() {
    this.loadInvoices();
    EventBus.$on("refresh", this.loadInvoices);
    EventBus.$on("search", this.searchInvoice);
    EventBus.$on("cancel", this.closeViewer);
    EventBus.$on("print", this.printInvoice);
  },
  beforeDestroy() {
    EventBus.$off("refresh", this.loadInvoices);
    EventBus.$off("search", this.searchInvoice);
    EventBus.$off("cancel", this.closeViewer);
    EventBus.$off("print", this.printInvoice);
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
    viewer: function (val) {
      EventBus.$emit("update-viewer", val);
    },
  },
};
</script>
