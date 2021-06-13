<template>
  <erd-row class="erd-report m-0 px-0 py-3">
    <erd-modal
      v-show="invoiceModal"
      @close="closeModal"
      :title="$t('subscriptions.print-invoices')"
      class="select-none"
    >
      <p class="text-one mx-2">{{ $t("subscriptions.select-invoices") }}</p>
      <perfect-scrollbar
        class="modal-list"
        :options="{ wheelPropagation: false }"
      >
        <erd-checkbox
          v-for="(invoice, index) in invoices"
          :key="`print-${index}-${invoice.id}`"
          v-model="selected"
          :value="index"
          ># {{ invoice.id }} ({{
            formatDate(new Date(invoice.invoice_date))
          }})</erd-checkbox
        >
      </perfect-scrollbar>
      <template v-slot:footer>
        <erd-button
          variant="primary"
          class="mr-1"
          icon="la-print"
          @click="pagePrint"
          >{{ $t("general.ok") }}</erd-button
        >
        <erd-button variant="danger" @click="closeModal">{{
          $t("general.cancel")
        }}</erd-button>
      </template>
    </erd-modal>
    <erd-spinner v-if="isLoading" size="lg" overlay absolute></erd-spinner>
    <erd-col
      flex
      center
      v-if="invoices.length === 0"
      class="text-muted select-none"
    >
      <div class="text-center">
        <h5 class="mb-1">{{ $t("subscriptions.no-invoices") }}</h5>
        <i class="las la-receipt la-4x d-block"></i>
      </div>
    </erd-col>
    <erd-col
      flex
      center
      v-for="(invoice, index) in invoices"
      :key="`invoice-${index}-${invoice.id}`"
    >
      <erd-report
        :id="`invoice-${invoice.id}`"
        :number="invoice.id"
        :recipient="recipient"
        :items="invoice.items"
        :date="new Date(invoice.invoice_date)"
        :context-items="invoiceContext(invoice.id)"
      ></erd-report>
    </erd-col>
  </erd-row>
</template>

<script>
import { mapGetters } from "vuex";
import { httpService } from "../../../services/http";
import { EventBus } from "../../../services/ebus";

export default {
  data() {
    return {
      invoiceModal: false,
      isLoading: false,
      invoices: [],
      selected: [],
    };
  },
  computed: {
    ...mapGetters(["currentUser"]),
    recipient() {
      let profile = this.currentUser.profile
        ? this.currentUser.profile
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
  },
  methods: {
    showModal() {
      this.invoiceModal = true;
    },
    closeModal() {
      this.invoiceModal = false;
    },
    invoiceContext(id) {
      return [
        {
          text: this.$t("subscriptions.print-invoice"),
          icon: "la-print",
          onClick: function () {
            document.getElementById(`invoice-${id}`).print();
          },
        },
      ];
    },
    loadInvoices() {
      httpService
        .get("users/invoices")
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
            this.$t("subscriptions.invoice-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    formatDate(date) {
      return date.toLocaleDateString(this.$t("date.locale"), this.dateOptions);
    },
    pagePrint() {
      this.closeModal();
      for (var i = 0; i < this.invoices.length; i++) {
        if (this.selected.includes(i)) {
          document.getElementById(`invoice-${this.invoices[i].id}`).print();
        }
      }
    },
    searchInItems(items, search) {
      let found = false;
      let re = new RegExp(search, "i");
      items.map((item) => {
        if (item.description.match(re)) {
          found = true;
        }
      });
      return found;
    },
    searchInvoice(search) {
      if (search === undefined || search === null || search.length === 0) {
        this.loadInvoices();
      } else {
        httpService
          .get("users/invoices")
          .then((res) => {
            this.isLoading = false;
            if (res.status === true) {
              this.invoices = res.data.filter((inv) => {
                var re = new RegExp(search, "i");
                var foundInTitle = inv.note.match(re);
                var foundInItems = this.searchInItems(inv.items, search);
                return foundInTitle || foundInItems;
              });
            }
          })
          .catch(() => {
            this.invoices = [];
          });
      }
    },
  },
  beforeMount() {
    this.isLoading = true;
    this.loadInvoices();
    EventBus.$on("print", this.showModal);
    EventBus.$on("search", this.searchInvoice);
  },
  beforeDestroy() {
    EventBus.$off("print", this.showModal);
    EventBus.$off("search", this.searchInvoice);
  },
};
</script>

<style scoped>
.modal-list {
  max-height: 200px;
}
</style>
