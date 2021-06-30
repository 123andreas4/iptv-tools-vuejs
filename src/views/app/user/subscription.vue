<template>
  <erd-row class="m-0 p-0" id="subscription">
    <erd-spinner v-if="isLoading" size="lg" overlay absolute></erd-spinner>
    <erd-modal
      v-show="modal"
      @close="closeModal"
      :title="$t('subscriptions.purchase')"
      class="select-none"
    >
      <p class="mt-0 ml-2">{{ $t("subscriptions.select-playlist") }}</p>
      <erd-radiobutton
        v-for="(type, index) in playlistTypes"
        :key="`type-${index}`"
        :value="type.value"
        v-model="newSubscription.playlist_type"
        class="ml-3"
        >{{ type.text }}</erd-radiobutton
      >
      <p class="mt-3 ml-2">{{ $t("subscriptions.select-days") }}</p>
      <erd-radiobutton
        v-for="(day, index) in days"
        :key="`day-${index}`"
        :value="day.value"
        v-model="newSubscription.months"
        class="ml-3"
        >{{ day.text }}</erd-radiobutton
      >
      <p class="mt-3 ml-2">
        {{ $t("subscriptions.total-amount") }} <strong>{{ totalPrice }}</strong>
      </p>
      <template v-slot:footer>
        <erd-paypal-button
          ref="paypal"
          id="paypal"
          :items="newSubscription.items"
          :value="newSubscription.amount"
          :description="newSubscription.description"
          @approve="paypalApprove"
          @cancel="paypalCancel"
          @error="paypalError"
        >
        </erd-paypal-button>
      </template>
    </erd-modal>
    <erd-modal
      v-show="modal2"
      @close="closeModal"
      :title="$t('subscriptions.payment-login-title')"
      class="select-none"
    >
      <p class="mt-0 ml-2">{{ $t("subscriptions.payment-login-text") }}</p>
      <template v-slot:footer>
        <erd-button variant="success" @click="logout" class="mr-1">{{
          $t("general.yes")
        }}</erd-button>
        <erd-button variant="danger" @click="closeModal">{{
          $t("general.no")
        }}</erd-button>
      </template>
    </erd-modal>
    <erd-col
      lg="4"
      md="6"
      v-for="(item, index) in personal"
      :key="`personal-${item.id}-${index}`"
    >
      <erd-card>
        <erd-card-body class="text-center price-card">
          <i class="las la-6x color-theme-1 mt-3" :class="item.icon"></i>
          <h3 class="item-title color-theme-1 my-3">{{ item.title }}</h3>
          <p class="text-large mb-2 text-default">&euro;{{ item.price }}</p>
          <p class="mt-0 text-muted text-small">
            {{ $t("subscriptions.user-month") }}
          </p>
          <ul class="list-unstyled mt-4">
            <li
              v-for="(listing, index) in item.list"
              :key="`listing-${item.id}-${index}`"
            >
              <p class="my-1">{{ listing }}</p>
            </li>
          </ul>
          <erd-button
            class="mt-5 w-50 text-uppercase"
            @click="showModal(item)"
            icon="la-shopping-cart"
            >{{
              subscriptionId == item.id
                ? $t("subscriptions.active")
                : $t("subscriptions.purchase")
            }}</erd-button
          >
        </erd-card-body>
      </erd-card>
    </erd-col>
    <erd-col xl="12">
      <p class="text-center">
        {{ $t("subscriptions.custom-plan") }}
        <a class="color-theme-1" :href="contactLink" target="_blank">{{
          $t("subscriptions.contact-us")
        }}</a>
      </p>
    </erd-col>
  </erd-row>
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { mapActions, mapGetters } from "vuex";
import { httpService } from "../../../services/http";
import { EventBus } from "../../../services/ebus";
import { PaymentWebsite } from "../../../constants/config";

export default {
  data() {
    return {
      mailto: "contact@erdesigns.eu",
      modal: false,
      modal2: false,
      isLoading: false,
      subscription: null,
      newSubscription: {
        id: 0,
        description: "",
        months: "1",
        items: [],
        amount: "0.00",
        currency: "EUR",
        price: 0,
        playlist_type: 1,
      },
      days: [
        { value: "1", text: this.$t("subscriptions.1-month") },
        { value: "2", text: this.$t("subscriptions.2-month") },
        { value: "3", text: this.$t("subscriptions.3-month") },
        { value: "6", text: this.$t("subscriptions.6-month") },
        { value: "12", text: this.$t("subscriptions.1-year") },
      ],
      playlistTypes: [
        { value: "1", text: this.$t("subscriptions.xtream") },
        { value: "2", text: this.$t("subscriptions.m3u") },
        /*{ value: "3", text: this.$t("subscriptions.portal") },*/
      ],
      personal: [
        {
          title: this.$t("subscriptions.enthusiast"),
          icon: "la-compass",
          price: "2,50",
          list: [
            this.$t("subscriptions.2-playlists"),
            this.$t("subscriptions.unlimited-channels"),
            this.$t("subscriptions.live-only"),
            this.$t("subscriptions.daily-sync"),
            this.$t("subscriptions.epg-support"),
            "-",
            "-",
          ],
          id: 0,
        },
        {
          title: this.$t("subscriptions.professional"),
          icon: "la-user-tie",
          price: "5,00",
          list: [
            this.$t("subscriptions.2-playlists"),
            this.$t("subscriptions.unlimited-channels"),
            this.$t("subscriptions.live-movies-series"),
            this.$t("subscriptions.daily-sync"),
            this.$t("subscriptions.epg-support"),
            this.$t("subscriptions.free-tools"),
            "-",
          ],
          id: 1,
        },
        {
          title: this.$t("subscriptions.pro-plus"),
          icon: "la-users",
          price: "10,00",
          list: [
            this.$t("subscriptions.5-playlists"),
            this.$t("subscriptions.unlimited-channels"),
            this.$t("subscriptions.live-movies-series"),
            this.$t("subscriptions.daily-sync"),
            this.$t("subscriptions.epg-support"),
            this.$t("subscriptions.free-tools"),
            this.$t("subscriptions.5-7-contact"),
          ],
          id: 2,
        },
      ],
    };
  },
  methods: {
    ...mapActions(["logout"]),
    loadSubscription() {
      httpService
        .get("users/subscriptions")
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.subscription =
              Array.isArray(res.data) && res.data.length > 0
                ? res.data[0]
                : this.currentUser.subscription;
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.subscription = this.currentUser.subscription;
        });
    },
    pagePrint() {
      document.getElementById("subscription").print();
    },
    showModal(item) {
      this.newSubscription.description = item.title;
      this.newSubscription.id = item.id;
      this.newSubscription.items = [
        {
          name: "IPTV-Tools Subscription",
          description: item.title,
          quantity: "1",
          price: item.price.replace(",", "."),
          currency: "EUR",
        },
      ];
      this.newSubscription.price = item.price;
      this.newSubscription.amount = new Intl.NumberFormat("en-US").format(
        item.price.replace(",", ".") * this.newSubscription.months
      );
      this.modal = true;
    },
    closeModal() {
      this.modal = false;
      this.modal2 = false;
    },
    paypalApprove(details) {
      let end_date = new Date();
      switch (parseInt(this.newSubscription.months)) {
        case 1:
          end_date.setDate(end_date.getDate() + 30);
          break;
        case 2:
          end_date.setDate(end_date.getDate() + 60);
          break;
        case 3:
          end_date.setDate(end_date.getDate() + 90);
          break;
        case 6:
          end_date.setDate(end_date.getDate() + 180);
          break;
        case 12:
          end_date.setDate(end_date.getDate() + 365);
          break;
      }
      let maxPlaylist = 1;
      switch (this.newSubscription.id) {
        case 0:
          maxPlaylist = 2;
          break;
        case 1:
          maxPlaylist = 2;
          break;
        case 2:
          maxPlaylist = 5;
          break;
        case 3:
          maxPlaylist = 5;
          break;
        case 4:
          maxPlaylist = 10;
          break;
        case 5:
          maxPlaylist = 25;
          break;
      }
      let subscription = {
        user_id: this.currentUser.user.id,
        subscription_type: this.newSubscription.id,
        note: details,
        end_date: end_date,
        max_playlist: maxPlaylist,
      };
      let payment = {
        user_id: this.currentUser.user.id,
        payment_method: "Paypal",
        amount: this.newSubscription.amount,
        description: details,
        website: PaymentWebsite,
      };
      let invoice = {
        user_id: this.currentUser.user.id,
        items: [
          {
            description: this.newSubscription.items[0].description,
            amount: this.newSubscription.months,
            price: this.newSubscription.price,
            id: this.newSubscription.id,
          },
        ],
      };
      httpService
        .post("users/payment", {
          user_id: this.currentUser.user.id,
          subscription: subscription,
          payment: payment,
          invoice: invoice,
        })
        .then((res) => {
          if (res.status === true) {
            this.modal = false;
            this.modal2 = true;
            this.$notify(
              "success",
              this.$t("profile.success"),
              this.$t("subscriptions.payment-succes"),
              "la-check-double",
              { duration: 5000, permanent: false }
            );
          }
        })
        .catch(() => {
          this.$notify(
            "error",
            this.$t("general.error"),
            this.$t("subscriptions.payment-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    paypalCancel(data) {
      this.$notify(
        "error",
        this.$t("general.canceled"),
        this.$t("subscriptions.payment-canceled"),
        "la-user-shield",
        { duration: 5000, permanent: false }
      );
    },
    paypalError(error) {
      this.$notify(
        "error",
        this.$t("general.error"),
        this.$t("subscriptions.payment-error"),
        "la-user-shield",
        { duration: 5000, permanent: false }
      );
    },
  },
  computed: {
    ...mapGetters(["currentUser"]),
    subscriptionId() {
      return this.subscription ? this.subscription.subscription_type : -1;
    },
    totalPrice() {
      return new Intl.NumberFormat("nl-NL", {
        style: "currency",
        currency: "EUR",
      }).format(this.newSubscription.amount);
    },
    contactLink() {
      return `mailto:${this.mailto}?subject=${encodeURIComponent(
        this.$t("subscriptions.contact-subject")
      )}&body=${encodeURIComponent(this.$t("subscriptions.contact-body"))}`;
    },
  },
  mounted() {
    this.isLoading = true;
    this.loadSubscription();
  },
  beforeMount() {
    EventBus.$on("print", this.pagePrint);
  },
  beforeDestroy() {
    EventBus.$off("print", this.pagePrint);
  },
  watch: {
    "newSubscription.months": function (val) {
      this.newSubscription.items[0].quantity = val;
      this.newSubscription.amount = new Intl.NumberFormat("en-US").format(
        parseInt(val) * parseFloat(this.newSubscription.price.replace(",", "."))
      );
    },
  },
};
</script>

<style scoped lang="scss">
.price-card {
  min-height: 500px;
}
@media print {
  .card {
    @include depth(0);
  }

  .private,
  .business {
    display: none;
  }

  .price-card {
    min-height: 1000px;
  }

  .btn {
    display: none;
  }
}
.paypal-container {
  max-height: 400px;
  width: 100%;
}
</style>
