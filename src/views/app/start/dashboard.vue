<template>
  <erd-row class="m-0 p-0" id="dashboard">
    <erd-spinner v-if="isLoading" size="lg" overlay absolute></erd-spinner>
    <erd-col xl="12" xs="12" class="m-0 p-0">
      <erd-row class="m-0 p-0">
        <erd-col xl="3" md="6">
          <erd-card>
            <erd-card-body class="dashboard-card">
              <i class="las la-calendar-day la-5x color-theme-1"></i>
              <div class="dashboard-card-title" style="">
                <h5 class="m-0">{{ $t("profile.member-since") }}</h5>
                <p class="m-0 color-theme-1">{{ memberSince }}</p>
              </div>
            </erd-card-body>
          </erd-card>
        </erd-col>
        <erd-col xl="3" md="6">
          <erd-card>
            <erd-card-body class="dashboard-card">
              <i class="las la-user-cog la-5x color-theme-1"></i>
              <div class="dashboard-card-title" style="">
                <h5 class="m-0">{{ $t("profile.member-status") }}</h5>
                <p class="m-0 color-theme-1">{{ userRole }}</p>
              </div>
            </erd-card-body>
          </erd-card>
        </erd-col>
        <erd-col xl="3" md="6">
          <erd-card>
            <erd-card-body class="dashboard-card">
              <i class="las la-user-tag la-5x color-theme-1"></i>
              <div class="dashboard-card-title" style="">
                <h5 class="m-0">{{ $t("profile.subscription") }}</h5>
                <p class="m-0 color-theme-1">{{ memberStatus }}</p>
              </div>
            </erd-card-body>
          </erd-card>
        </erd-col>
        <erd-col xl="3" md="6">
          <erd-card>
            <erd-card-body class="dashboard-card">
              <i class="las la-file-invoice-dollar la-5x color-theme-1"></i>
              <div class="dashboard-card-title" style="">
                <h5 class="m-0">{{ $t("profile.next-invoice") }}</h5>
                <p class="m-0 text-danger" v-if="nextInvoiceExpired">
                  {{ nextInvoiceDate }}
                </p>
                <p class="m-0 color-theme-1" v-else>{{ nextInvoiceDate }}</p>
              </div>
            </erd-card-body>
          </erd-card>
        </erd-col>
      </erd-row>
    </erd-col>
    <erd-col xl="12" xs="12" class="m-0 p-0">
      <erd-row class="m-0 p-0">
        <erd-col xl="6" lg="12" xs="12">
          <erd-card class="list-card">
            <erd-button
              class="refresh-button"
              icon="la-sync"
              outline
              @click="loadDashboard"
            ></erd-button>
            <erd-card-body>
              <div class="float-left float-none-xs">
                <div class="d-inline-block">
                  <h5 class="d-inline">
                    {{ $t("dashboard.xtream") }}
                    <span class="text-muted text-small text-capitalize"></span>
                  </h5>
                  <span class="text-muted text-small d-block">{{
                    $t("dashboard.xtream-account-info")
                  }}</span>
                </div>
              </div>
            </erd-card-body>
            <erd-card-body class="list mt-1">
              <p
                class="text-muted text-center mt-3"
                v-if="xtreamAccounts.length === 0"
              >
                <i class="las la-globe d-block la-3x"></i>
                {{ $t("dashboard.no-xtream-accounts") }}
              </p>
              <perfect-scrollbar>
                <router-link
                  class="dashboard-list-item"
                  v-for="(xtream, index) in xtreamAccounts"
                  :key="`xtream-account-${index}`"
                  to="/app/sources/xtream/accounts"
                >
                  <i class="las la-globe la-3x"></i>
                  <div class="details">
                    <p class="mt-1 float-right text-small">
                      {{ xtream.auth.active_cons }}/{{
                        xtream.auth.max_connections
                      }}
                      <i class="las la-plug"></i>
                    </p>
                    <p class="m-0 p-0">
                      <span>{{ xtream.title }}</span>
                      <span class="text-muted ml-2">{{ xtream.auth.url }}</span>
                    </p>
                    <span class="text-small text-muted"
                      >{{ $t("dashboard.created") }}
                      {{ formatDate(xtream.auth.created_at * 1000) }} -
                      {{ $t("dashboard.expiry") }}
                      {{
                        xtream.auth.exp_date
                          ? formatDate(xtream.auth.exp_date)
                          : $t("dashboard.no-expiry")
                      }}</span
                    >
                  </div>
                </router-link>
              </perfect-scrollbar>
            </erd-card-body>
          </erd-card>
        </erd-col>
        <erd-col xl="6" lg="12" xs="12">
          <erd-card class="list-card">
            <erd-button
              class="refresh-button"
              icon="la-sync"
              outline
              @click="loadDashboard"
            ></erd-button>
            <erd-card-body>
              <div class="float-left float-none-xs">
                <div class="d-inline-block">
                  <h5 class="d-inline">
                    {{ $t("dashboard.playlist") }}
                    <span class="text-muted text-small text-capitalize"></span>
                  </h5>
                  <span class="text-muted text-small d-block">{{
                    $t("dashboard.playlist-info")
                  }}</span>
                </div>
              </div>
            </erd-card-body>
            <erd-card-body class="list mt-1">
              <p
                class="text-muted text-center mt-3"
                v-if="playlists.length === 0"
              >
                <i class="las la-file-video d-block la-3x"></i>
                {{ $t("dashboard.no-playlists") }}
              </p>
              <perfect-scrollbar>
                <div
                  class="dashboard-list-item"
                  v-for="(playlist, index) in playlists"
                  :key="`playlist-${index}`"
                >
                  <i class="las la-file-video la-3x"></i>
                  <div class="details">
                    <p class="mt-1 float-right text-small">
                      {{ playlist.streams }}
                      <i class="las la-tv"></i>
                    </p>
                    <p class="m-0 p-0">
                      <span>{{ playlist.title }}</span>
                      <span class="text-muted text-small ml-2">{{
                        formatDate(playlist.last_updated)
                      }}</span>
                    </p>
                    <span class="text-small text-muted">
                      {{
                        $t("dashboard.playlist-content").format(
                          playlist.live,
                          playlist.movies,
                          playlist.series
                        )
                      }}
                    </span>
                  </div>
                </div>
              </perfect-scrollbar>
            </erd-card-body>
          </erd-card>
        </erd-col>
      </erd-row>
    </erd-col>
    <erd-col xl="12" xs="12" class="m-0 p-0 mt-3">
      <glide-component :settings="glideNoControlsSettings">
        <div class="pr-3 pl-3 mb-2 glide__slide">
          <erd-card>
            <erd-card-body class="dashboard-card">
              <i class="las la-globe la-5x color-theme-1"></i>
              <div class="dashboard-card-title" style="">
                <p class="m-0">{{ $t("dashboard.xtream") }}</p>
                <h5 class="m-0 color-theme-1">{{ statistics.xtream }}</h5>
              </div>
            </erd-card-body>
          </erd-card>
        </div>
        <div class="pr-3 pl-3 mb-2 glide__slide">
          <erd-card>
            <erd-card-body class="dashboard-card">
              <i class="las la-file-video la-5x color-theme-1"></i>
              <div class="dashboard-card-title" style="">
                <p class="m-0">{{ $t("dashboard.m3u-url") }}</p>
                <h5 class="m-0 color-theme-1">{{ statistics["m3u-url"] }}</h5>
              </div>
            </erd-card-body>
          </erd-card>
        </div>
        <div class="pr-3 pl-3 mb-2 glide__slide">
          <erd-card>
            <erd-card-body class="dashboard-card">
              <i class="las la-file-video la-5x color-theme-1"></i>
              <div class="dashboard-card-title" style="">
                <p class="m-0">{{ $t("dashboard.m3u-file") }}</p>
                <h5 class="m-0 color-theme-1">{{ statistics["m3u-file"] }}</h5>
              </div>
            </erd-card-body>
          </erd-card>
        </div>
        <div class="pr-3 pl-3 mb-2 glide__slide">
          <erd-card>
            <erd-card-body class="dashboard-card">
              <i class="las la-file-excel la-5x color-theme-1"></i>
              <div class="dashboard-card-title" style="">
                <p class="m-0">{{ $t("dashboard.xmltv") }}</p>
                <h5 class="m-0 color-theme-1">{{ statistics.xmltv }}</h5>
              </div>
            </erd-card-body>
          </erd-card>
        </div>
        <div class="pr-3 pl-3 mb-2 glide__slide">
          <erd-card>
            <erd-card-body class="dashboard-card">
              <i class="las la-tv la-5x color-theme-1"></i>
              <div class="dashboard-card-title" style="">
                <p class="m-0">{{ $t("dashboard.live-streams") }}</p>
                <h5 class="m-0 color-theme-1">{{ statistics.live }}</h5>
              </div>
            </erd-card-body>
          </erd-card>
        </div>
        <div class="pr-3 pl-3 mb-2 glide__slide">
          <erd-card>
            <erd-card-body class="dashboard-card">
              <i class="las la-film la-5x color-theme-1"></i>
              <div class="dashboard-card-title" style="">
                <p class="m-0">{{ $t("dashboard.movies") }}</p>
                <h5 class="m-0 color-theme-1">{{ statistics.movies }}</h5>
              </div>
            </erd-card-body>
          </erd-card>
        </div>
        <div class="pr-3 pl-3 mb-2 glide__slide">
          <erd-card>
            <erd-card-body class="dashboard-card">
              <i class="las la-video la-5x color-theme-1"></i>
              <div class="dashboard-card-title" style="">
                <p class="m-0">{{ $t("dashboard.series") }}</p>
                <h5 class="m-0 color-theme-1">{{ statistics.series }}</h5>
              </div>
            </erd-card-body>
          </erd-card>
        </div>
        <div class="pr-3 pl-3 mb-2 glide__slide">
          <erd-card>
            <erd-card-body class="dashboard-card">
              <i class="lab la-youtube la-5x color-theme-1"></i>
              <div class="dashboard-card-title" style="">
                <p class="m-0">{{ $t("menu.youtube") }}</p>
                <h5 class="m-0 color-theme-1">{{ statistics.youtube }}</h5>
              </div>
            </erd-card-body>
          </erd-card>
        </div>
        <div class="pr-3 pl-3 mb-2 glide__slide">
          <erd-card>
            <erd-card-body class="dashboard-card">
              <i class="lab la-vimeo la-5x color-theme-1"></i>
              <div class="dashboard-card-title" style="">
                <p class="m-0">{{ $t("menu.vimeo") }}</p>
                <h5 class="m-0 color-theme-1">{{ statistics.vimeo }}</h5>
              </div>
            </erd-card-body>
          </erd-card>
        </div>
        <div class="pr-3 pl-3 mb-2 glide__slide">
          <erd-card>
            <erd-card-body class="dashboard-card">
              <i class="las la-video la-5x color-theme-1"></i>
              <div class="dashboard-card-title" style="">
                <p class="m-0">{{ $t("menu.dailymotion") }}</p>
                <h5 class="m-0 color-theme-1">{{ statistics.dailymotion }}</h5>
              </div>
            </erd-card-body>
          </erd-card>
        </div>
        <div class="pr-3 pl-3 mb-2 glide__slide">
          <erd-card>
            <erd-card-body class="dashboard-card">
              <i class="las la-heart la-5x color-theme-1"></i>
              <div class="dashboard-card-title" style="">
                <p class="m-0">{{ $t("menu.xhamster") }}</p>
                <h5 class="m-0 color-theme-1">{{ statistics.xhamster }}</h5>
              </div>
            </erd-card-body>
          </erd-card>
        </div>
        <div class="pr-3 pl-3 mb-2 glide__slide">
          <erd-card>
            <erd-card-body class="dashboard-card">
              <i class="lab la-soundcloud la-5x color-theme-1"></i>
              <div class="dashboard-card-title" style="">
                <p class="m-0">{{ $t("menu.soundcloud") }}</p>
                <h5 class="m-0 color-theme-1">{{ statistics.soundcloud }}</h5>
              </div>
            </erd-card-body>
          </erd-card>
        </div>
      </glide-component>
    </erd-col>
    <erd-col xl="12" xs="12" class="m-0 p-0">
      <erd-row class="m-0 p-0">
        <erd-col xl="6" lg="12" xs="12">
          <erd-card class="list-card">
            <erd-button
              class="refresh-button"
              icon="la-sync"
              outline
              @click="loadTickets"
            ></erd-button>
            <erd-card-body>
              <div class="float-left float-none-xs">
                <div class="d-inline-block">
                  <h5 class="d-inline">
                    {{ $t("dashboard.tickets") }}
                    <span class="text-muted text-small text-capitalize"></span>
                  </h5>
                  <span class="text-muted text-small d-block">{{
                    $t("dashboard.tickets-info")
                  }}</span>
                </div>
              </div>
            </erd-card-body>
            <erd-card-body class="list mt-1">
              <p
                class="text-muted text-center mt-3"
                v-if="tickets.length === 0"
              >
                <i class="las la-headset d-block la-3x"></i>
                {{ $t("dashboard.no-tickets") }}
              </p>
              <perfect-scrollbar>
                <router-link
                  class="dashboard-list-item"
                  v-for="(ticket, index) in tickets"
                  :key="`ticket-${index}`"
                  to="/app/user/tickets"
                >
                  <i
                    class="las la-3x"
                    :class="ticketIcon(ticket.ticket_status)"
                  ></i>
                  <div class="details">
                    <p class="mt-1 float-right text-small">
                      {{ $t(`departement.${ticket.departement}`) }}
                      <i class="las la-headset"></i>
                    </p>
                    <p class="m-0 p-0">
                      <span>{{ ticket.title }}</span>
                      <span class="text-muted text-small ml-2">{{
                        $t(`priority.${ticket.priority}`)
                      }}</span>
                    </p>
                    <span class="text-small text-muted"
                      >{{ formatDate(ticket.created) }} -
                      {{ formatDate(ticket.last_updated) }}</span
                    >
                  </div>
                </router-link>
              </perfect-scrollbar>
            </erd-card-body>
          </erd-card>
        </erd-col>
        <erd-col xl="6" lg="12" xs="12">
          <erd-card class="list-card">
            <erd-button
              class="refresh-button"
              icon="la-sync"
              outline
              @click="loadInvoices"
            ></erd-button>
            <erd-card-body>
              <div class="float-left float-none-xs">
                <div class="d-inline-block">
                  <h5 class="d-inline">
                    {{ $t("dashboard.invoices") }}
                    <span class="text-muted text-small text-capitalize"></span>
                  </h5>
                  <span class="text-muted text-small d-block">{{
                    $t("dashboard.invoices-info")
                  }}</span>
                </div>
              </div>
            </erd-card-body>
            <erd-card-body class="list mt-1">
              <p
                class="text-muted text-center mt-3"
                v-if="invoices.length === 0"
              >
                <i class="las la-receipt d-block la-3x"></i>
                {{ $t("dashboard.no-invoices") }}
              </p>
              <perfect-scrollbar>
                <router-link
                  class="dashboard-list-item"
                  v-for="(invoice, index) in invoices"
                  :key="`invoice-${index}`"
                  to="/app/user/invoices"
                >
                  <i class="las la-receipt la-3x"></i>
                  <div class="details">
                    <p class="mt-1 float-right text-small">
                      {{ invoicePrice(invoice) }}
                      <i class="las la-euro-sign"></i>
                    </p>
                    <p class="m-0 p-0">{{ invoiceDescription(invoice) }}</p>
                    <span class="text-small text-muted">
                      {{ formatDate(invoice.invoice_date) }}
                    </span>
                  </div>
                </router-link>
              </perfect-scrollbar>
            </erd-card-body>
          </erd-card>
        </erd-col>
      </erd-row>
    </erd-col>
  </erd-row>
</template>

<script>
import { EventBus } from "../../../services/ebus";
import GlideComponent from "../../../components/Carousel/GlideComponent";
import { mapActions, mapGetters } from "vuex";
import { httpService } from "../../../services/http";

export default {
  components: {
    "glide-component": GlideComponent,
  },
  data() {
    return {
      isLoading: false,
      statistics: {
        xtream: 0,
        "m3u-url": 0,
        "m3u-file": 0,
        xmltv: 0,
        live: 0,
        movies: 0,
        series: 0,
        youtube: 0,
        vimeo: 0,
        dailymotion: 0,
        xhamster: 0,
        soundcloud: 0,
      },
      glideNoControlsSettings: {
        gap: 5,
        perView: 4,
        type: "carousel",
        breakpoints: {
          480: {
            perView: 1,
          },
          800: {
            perView: 2,
          },
          1200: {
            perView: 3,
          },
        },
        hideNav: true,
      },
      xtreamAccounts: [],
      playlists: [],
      tickets: [],
      invoices: [],
    };
  },
  computed: {
    ...mapGetters(["currentUser"]),
    memberSince() {
      return new Date(this.currentUser.user.created).toLocaleDateString(
        this.$t("date.locale")
      );
    },
    memberStatus() {
      return this.currentUser.subscription
        ? this.$t(`status.${this.currentUser.subscription.subscription_type}`)
        : this.$t("status.none");
    },
    userRole() {
      return this.currentUser.user
        ? this.$t(`roles.${this.currentUser.user.role}`)
        : this.$t("roles.none");
    },
    nextInvoiceExpired() {
      return this.currentUser.subscription &&
        this.currentUser.subscription.end_date
        ? new Date(this.currentUser.subscription.end_date).getTime() <
            new Date().getTime()
        : false;
    },
    nextInvoiceDate() {
      return this.currentUser.subscription &&
        this.currentUser.subscription.end_date
        ? new Date(this.currentUser.subscription.end_date).toLocaleDateString(
            this.$t("date.locale")
          )
        : this.$t("general.not-available");
    },
  },
  methods: {
    ...mapActions([]),
    pagePrint() {
      document.getElementById("dashboard").print();
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString(
        this.$t("date.locale"),
        this.dateOptions
      );
    },
    loadDashboard() {
      this.playlists = [];
      this.xtreamAccounts = [];
      httpService
        .get("dashboard")
        .then((res) => {
          if (res.status === true) {
            this.xtreamAccounts = res.data.xtream;
            this.playlists = res.data.playlists;
            this.statistics = res.data.statistics;
          }
        })
        .catch(() => {
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("dashboard.load-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    loadTickets() {
      httpService
        .get("users/tickets")
        .then((res) => {
          if (res.status === true) {
            this.tickets = res.data;
          }
        })
        .catch(() => {
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("tickets.tickets-loading-failed"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    loadInvoices() {
      httpService
        .get("users/invoices")
        .then((res) => {
          if (res.status === true) {
            this.invoices = res.data;
          }
        })
        .catch(() => {
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("subscriptions.invoice-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    ticketIcon(status) {
      switch (status) {
        case 0:
          return "la-user";
        case 1:
          return "la-user-check";
        case 2:
          return "la-user-check";
        case 3:
          return "la-user-lock";
      }
    },
    formatCurrency(num) {
      return new Intl.NumberFormat(this.$t("date.locale"), {
        style: "currency",
        currency: "EUR",
      }).format(num);
    },
    parsePrice(price) {
      return parseFloat(price.replace(",", "."));
    },
    invoicePrice(invoice) {
      let total = 0;
      invoice.items.map((item) => {
        total += item.amount * this.parsePrice(item.price);
      });
      return this.formatCurrency(total);
    },
    invoiceDescription(invoice) {
      return invoice.items.length
        ? invoice.items[0].description
        : this.$t("general.not-available");
    },
  },
  beforeMount() {
    this.loadDashboard();
    this.loadTickets();
    this.loadInvoices();
    EventBus.$on("print", this.pagePrint);
  },
  beforeDestroy() {
    EventBus.$off("print", this.pagePrint);
  },
};
</script>

<style scoped lang="scss">
.dashboard-card {
  display: table;
}
.dashboard-card-title {
  display: table-cell;
  vertical-align: middle;
  width: 100%;
  padding-left: 0.5rem;
}
.list-card {
  user-select: none;
  position: relative;
  height: 340px;

  .refresh-button {
    position: absolute;
    right: 20px;
    top: 20px;
    border-radius: 50%;
    height: 32px;
    width: 32px;
    line-height: 32px;
    padding: 0;
  }

  .ps {
    height: 230px;
    padding-right: 1rem;
  }

  .list {
    height: 200px;
  }

  .dashboard-list-item {
    display: table;
    padding-bottom: 8px;

    &:not(:first-child) {
      padding-top: 8px;
    }

    &:not(:last-child) {
      border-bottom: 1px solid $separator-color-light;
    }

    .details {
      display: table-cell;
      vertical-align: middle;
      width: 100%;
      padding-left: 0.25rem;
    }
  }
}
</style>
