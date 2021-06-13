<template>
  <erd-row class="m-0 p-0">
    <erd-modal
      v-show="modal"
      @close="closeModal"
      :title="$t('payments.overview')"
      class="select-none"
      small
    >
      <div class="px-2 p-print-2" v-if="modalPayment" id="modal">
        <label>{{ $t("payments.payment-date") }}</label>
        <erd-input
          class="mt-1 mb-2 w-100 d-print-none"
          :value="formatDate(modalPayment.description.create_time)"
          disabled
        ></erd-input>
        <p class="d-none d-print-block font-weight-bold">
          {{ formatDate(modalPayment.description.create_time) }}
        </p>
        <label>{{ $t("payments.payment-method") }}</label>
        <erd-input
          class="mt-1 mb-2 w-100 d-print-none"
          :value="modalPayment.payment_method"
          disabled
        ></erd-input>
        <p class="d-none d-print-block font-weight-bold">
          {{ modalPayment.payment_method }}
        </p>
        <label>{{ $t("payments.status") }}</label>
        <erd-input
          class="mt-1 mb-2 w-100 d-print-none"
          :value="modalPayment.description.status"
          disabled
        ></erd-input>
        <p class="d-none d-print-block font-weight-bold">
          {{ modalPayment.description.status }}
        </p>
        <label>{{ $t("payments.payer-email") }}</label>
        <erd-input
          class="mt-1 mb-2 w-100 d-print-none"
          :value="modalPayment.description.payer.email_address"
          disabled
        ></erd-input>
        <p class="d-none d-print-block font-weight-bold">
          {{ modalPayment.description.payer.email_address }}
        </p>
        <label>{{ $t("payments.payer-name") }}</label>
        <erd-input
          class="mt-1 mb-2 w-100 d-print-none"
          :value="`${modalPayment.description.payer.name.given_name} ${modalPayment.description.payer.name.surname}`"
          disabled
        ></erd-input>
        <p class="d-none d-print-block font-weight-bold">
          {{
            `${modalPayment.description.payer.name.given_name} ${modalPayment.description.payer.name.surname}`
          }}
        </p>
        <label>{{ $t("payments.description") }}</label>
        <erd-input
          class="mt-1 mb-2 w-100 d-print-none"
          :value="paymentDescription(modalPayment.description)"
          disabled
        ></erd-input>
        <p class="d-none d-print-block font-weight-bold">
          {{ paymentDescription(modalPayment.description) }}
        </p>
        <label>{{ $t("payments.amount") }}</label>
        <erd-input
          class="mt-1 mb-2 w-100 d-print-none"
          :value="formatCurrency(modalPayment.amount)"
          disabled
        ></erd-input>
        <p class="d-none d-print-block font-weight-bold">
          {{ formatCurrency(modalPayment.amount) }}
        </p>
      </div>
      <template v-slot:footer>
        <erd-button @click="closeModal" icon="la-times" class="mr-1">{{
          $t("general.close")
        }}</erd-button>
        <erd-button @click="printPayment" icon="la-print">{{
          $t("payments.print-payment")
        }}</erd-button>
      </template>
    </erd-modal>
    <erd-spinner v-if="isLoading" size="lg" overlay absolute></erd-spinner>
    <erd-col xl="12" id="payments">
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
        <template v-slot:cell(payment_date)="row">
          {{ formatDate(row.item.payment_date) }}
        </template>
        <template v-slot:cell(payment_method)="row">
          <erd-badge
            :variant="
              row.item.payment_method.toLowerCase() == 'paypal'
                ? 'info'
                : 'primary'
            "
            ><i
              class="lab la-paypal badge-paypal"
              v-if="row.item.payment_method.toLowerCase() == 'paypal'"
            ></i
            >{{ row.item.payment_method }}</erd-badge
          >
        </template>
        <template v-slot:cell(description)="row">
          {{ paymentDescription(row.item.description) }}
        </template>
        <template v-slot:cell(amount)="row">
          {{ formatCurrency(row.item.amount) }}
        </template>
        <template v-slot:cell(actions)="row">
          <erd-button variant="info" class="btn-table" @click="view(row.item)"
            ><i class="las la-search"></i
          ></erd-button>
          <erd-button
            variant="danger"
            class="btn-table"
            @click="deletePayment(row.item.id)"
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
      modal: false,
      modalPayment: null,
      search: null,
      isLoading: false,
      from: 0,
      to: 0,
      total: 0,
      currentPage: 1,
      payments: [],
      fields: [
        { key: "user_id", label: this.$t("users.id"), sortable: true },
        {
          key: "payment_date",
          label: this.$t("payments.payment-date"),
          sortable: true,
        },
        {
          key: "payment_method",
          label: this.$t("payments.payment-method"),
          sortable: true,
        },
        { key: "amount", label: this.$t("payments.amount"), sortable: true },
        {
          key: "description",
          label: this.$t("payments.description"),
          sortable: true,
        },
        { key: "note", label: this.$t("payments.note"), sortable: true },
        { key: "website", label: this.$t("payments.website"), sortable: true },
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
        return this.payments;
      } else {
        var re = new RegExp(this.search, "i");
        return this.payments.filter((payment) => {
          return (
            String(payment.user_id).match(re) ||
            String(payment.payment_date).match(re) ||
            String(payment.payment_method).match(re) ||
            String(payment.amount).match(re) ||
            JSON.stringify(payment.description).match(re) ||
            String(payment.note).match(re) ||
            String(payment.website).match(re) ||
            this.formatDate(payment.payment_date).match(re)
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
    paymentDescription(description) {
      return description.purchase_units && description.purchase_units.length
        ? description.purchase_units[0].description
        : "";
    },
    formatCurrency(num) {
      return new Intl.NumberFormat(this.$t("date.locale"), {
        style: "currency",
        currency: "EUR",
      }).format(num);
    },
    formatDate(date) {
      return new Date(date).toLocaleString(
        this.$t("date.locale"),
        this.dateOptions
      );
    },
    loadPayments() {
      this.isLoading = true;
      httpService
        .get("administration/payments")
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.payments = res.data;
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("payments.load-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    deletePayment(id) {
      httpService
        .post("administration/payment/delete", { id: id })
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.$notify(
              "primary",
              this.$t("profile.success"),
              this.$t("payments.delete-success"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
            this.loadPayments();
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("payments.delete-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    view(payment) {
      this.modalPayment = payment;
      this.modal = true;
    },
    closeModal() {
      this.modal = false;
    },
    searchPayment(search) {
      if (search.length === 0) {
        this.search = null;
      } else {
        this.search = search;
      }
    },
    printPayment() {
      if (this.modal) {
        document.getElementById("modal").print();
      } else {
        document.getElementById("payments").print();
      }
    },
  },
  beforeMount() {
    this.loadPayments();
    EventBus.$on("refresh", this.loadPayments);
    EventBus.$on("search", this.searchPayment);
    EventBus.$on("print", this.printPayment);
  },
  beforeDestroy() {
    EventBus.$off("refresh", this.loadPayments);
    EventBus.$off("search", this.searchPayment);
    EventBus.$off("print", this.printPayment);
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

<style lang="scss">
.badge-paypal {
  margin-right: 0.25rem;
  font-size: 1rem;
  vertical-align: middle;
}
</style>
