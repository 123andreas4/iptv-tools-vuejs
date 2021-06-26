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
                <a
                  class="dashboard-list-item"
                  v-for="(xtream, index) in xtreamAccounts"
                  :key="`xtream-account-${index}`"
                  href="#"
                  @click.prevent="xtreamAccountModal(true, xtream)"
                >
                  <i class="las la-globe la-3x"></i>
                  <div class="details">
                    <p class="mt-1 float-right text-small">
                      {{ xtream.user_info.active_cons }}/{{
                        xtream.user_info.max_connections
                      }}
                      <i class="las la-plug"></i>
                    </p>
                    <p class="m-0 p-0">
                      <span>{{ xtream.server_info.url }}</span>
                      <span class="text-muted text-small ml-2">{{ xtream.user_info.message }}</span>
                    </p>
                    <span class="text-small text-muted"
                      >{{ $t("dashboard.created") }}
                      {{ formatDate(xtream.user_info.created_at * 1000) }} -
                      {{ $t("dashboard.expiry") }}
                      {{
                        xtream.user_info.exp_date
                          ? formatDate(xtream.user_info.exp_date)
                          : $t("dashboard.no-expiry")
                      }}</span
                    >
                  </div>
                </a>
              </perfect-scrollbar>
            </erd-card-body>
          </erd-card>
        </erd-col>
        <!--  

          XTREAM-ACCOUNT

        -->
        <erd-modal
          v-show="xtreamAccount.modal"
          @close="xtreamAccountModal(false)"
          :title="$t('dashboard.xtream')"
          class="select-none"
          small
        >
          <div class="px-2" v-if="xtreamAccount.account">
            <label class="w-100">{{ $t("xtream.url") }}</label>
            <erd-input class="mt-1 mb-2 w-100" :value="`${xtreamAccount.account.server_info.server_protocol}://${xtreamAccount.account.server_info.url}:${xtreamAccount.account.server_info.port}/get.php?username=${xtreamAccount.account.user_info.username}&password=${xtreamAccount.account.user_info.password}&type=m3u_plus`" readonly></erd-input>
            <erd-row class="p-0 m-0">
              <erd-col sm="8" class="m-0 pl-0 pr-1">
                <label class="w-100">{{ $t("xtream.host") }}</label>
                <erd-input class="mt-1 mb-2 w-100" :value="xtreamAccount.account.server_info.url" readonly></erd-input>
              </erd-col>
              <erd-col sm="4" class="m-0 px-0">
                <label class="w-100">{{ $t("xtream.port") }}</label>
                <erd-input class="mt-1 mb-2 w-100" :value="xtreamAccount.account.server_info.port" readonly></erd-input>
              </erd-col>
            </erd-row>
            <erd-row class="p-0 m-0">
              <erd-col sm="6" class="m-0 pl-0 pr-1">
                <label class="w-100">{{ $t("xtream.username") }}</label>
                <erd-input class="mt-1 mb-2 w-100" :value="xtreamAccount.account.user_info.username" readonly></erd-input>
              </erd-col>
              <erd-col sm="6" class="m-0 px-0">
                <label class="w-100">{{ $t("xtream.password") }}</label>
                <erd-input class="mt-1 mb-2 w-100" :value="xtreamAccount.account.user_info.password" readonly></erd-input>
              </erd-col>
            </erd-row>
            <erd-row class="p-0 m-0">
              <erd-col sm="6" class="m-0 pl-0 pr-1">
                <label class="w-100">{{ $t("xtream.max-connections") }}</label>
                <erd-input class="mt-1 mb-2 w-100" :value="xtreamAccount.account.user_info.max_connections" readonly></erd-input>
              </erd-col>
              <erd-col sm="6" class="m-0 px-0">
                <label class="w-100">{{ $t("xtream.active-connections") }}</label>
                <erd-input class="mt-1 mb-2 w-100" :value="xtreamAccount.account.user_info.active_cons" readonly></erd-input>
              </erd-col>
            </erd-row>
            <erd-row class="p-0 m-0">
              <erd-col sm="6" class="m-0 pl-0 pr-1">
                <label class="w-100">{{ $t("xtream.created") }}</label>
                <erd-input class="mt-1 mb-2 w-100" :value="formatDate(xtreamAccount.account.user_info.created_at * 1000)" readonly></erd-input>
              </erd-col>
              <erd-col sm="6" class="m-0 px-0">
                <label class="w-100">{{ $t("xtream.expire") }}</label>
                <erd-input class="mt-1 mb-2 w-100" :value="xtreamAccount.account.user_info.exp_date ? formatDate(xtreamAccount.account.user_info.exp_date) : $t('dashboard.no-expiry')" readonly></erd-input>
              </erd-col>
            </erd-row>
            <label class="w-100">{{ $t("users.status") }}</label>
            <erd-input class="mt-1 mb-2 w-100" :value="xtreamAccount.account.user_info.status" readonly></erd-input>
            <label class="w-100">{{ $t("xtream.message") }}</label>
            <erd-input class="mt-1 mb-2 w-100" :value="xtreamAccount.account.user_info.message" readonly></erd-input>
          </div>
          <template v-slot:footer>
            <erd-button
              @click="xtreamAccountModal(false)"
              icon="la-times"
              class="mr-1"
              variant="danger"
              >{{ $t("general.close") }}</erd-button
            >
          </template>
        </erd-modal>
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
                <a
                  href="#"
                  class="dashboard-list-item"
                  v-for="(playlist, index) in playlists"
                  :key="`playlist-${index}`"
                  @click.prevent="playlistModal(true, playlist)"
                >
                  <i class="las la-file-video la-3x"></i>
                  <div class="details">
                    <p class="mt-1 float-right text-small" v-if="userHasMoviesSeries">
                      {{ formatNumber(playlist.live + playlist.movies + playlist.series) }}
                      <i class="las la-stream"></i>
                    </p>
                    <p class="mt-1 float-right text-small" v-else>
                      {{ formatNumber(playlist.live) }}
                      <i class="las la-stream"></i>
                    </p>
                    <p class="m-0 p-0">
                      <span>{{ playlist.name }}</span>
                      <span class="text-muted text-small ml-2">
                        <i class="las la-sync"></i>
                        {{ formatDate(playlist.synced_at) }}
                      </span>
                    </p>
                    <span class="text-small text-muted" v-if="userHasMoviesSeries">
                      {{
                        $t("dashboard.playlist-content").format(
                          formatNumber(playlist.live),
                          formatNumber(playlist.movies),
                          formatNumber(playlist.series)
                        )
                      }}
                    </span>
                    <span v-else>
                      {{ $t("dashboard.playlist-content-live").format(formatNumber(playlist.live)) }}  
                    </span>
                  </div>
                </a>
              </perfect-scrollbar>
            </erd-card-body>
          </erd-card>
        </erd-col>
        <!--  

          PLAYLIST

        -->
        <erd-modal
          v-show="playlist.modal"
          @close="playlistModal(false)"
          :title="$t('dashboard.playlist')"
          class="select-none"
          small
        >
          <div class="px-2" v-if="playlist.playlist">
            <label class="w-100">{{ $t("xtream.name") }}</label>
            <erd-input class="mt-1 mb-2 w-100" :value="playlist.playlist.name" readonly></erd-input>
            <erd-row class="p-0 m-0">
              <erd-col sm="6" class="m-0 pl-0 pr-1">
                <label class="w-100">{{ $t("xtream.username") }}</label>
                <erd-input class="mt-1 mb-2 w-100" :value="playlist.playlist.api_username" readonly></erd-input>
              </erd-col>
              <erd-col sm="6" class="m-0 px-0">
                <label class="w-100">{{ $t("xtream.password") }}</label>
                <erd-input class="mt-1 mb-2 w-100" :value="playlist.playlist.api_password" readonly></erd-input>
              </erd-col>
            </erd-row>
            <label class="w-100">{{ $t("xtream.synced-at") }}</label>
            <erd-input class="mt-1 mb-2 w-100" :value="formatDate(playlist.playlist.synced_at)" readonly></erd-input>
            <erd-row class="p-0 m-0">
              <erd-col sm="4" class="m-0 pl-0 pr-1">
                <label class="w-100">{{ $t("xtream.total-live") }}</label>
                <erd-input class="mt-1 mb-2 w-100" :value="formatNumber(playlist.playlist['live'])" readonly></erd-input>
              </erd-col>
              <erd-col sm="4" class="m-0 pl-0 pr-1">
                <label class="w-100">{{ $t("xtream.live-new") }}</label>
                <erd-input class="mt-1 mb-2 w-100" :value="formatNumber(playlist.playlist['live-new'])" readonly></erd-input>
              </erd-col>
              <erd-col sm="4" class="m-0 px-0">
                <label class="w-100">{{ $t("xtream.live-removed") }}</label>
                <erd-input class="mt-1 mb-2 w-100" :value="formatNumber(playlist.playlist['live-removed'])" readonly></erd-input>
              </erd-col>
            </erd-row>
            <erd-row class="p-0 m-0" v-if="userHasMoviesSeries">
              <erd-col sm="4" class="m-0 pl-0 pr-1">
                <label class="w-100">{{ $t("xtream.total-movies") }}</label>
                <erd-input class="mt-1 mb-2 w-100" :value="formatNumber(playlist.playlist['movies'])" readonly></erd-input>
              </erd-col>
              <erd-col sm="4" class="m-0 pl-0 pr-1">
                <label class="w-100">{{ $t("xtream.movies-new") }}</label>
                <erd-input class="mt-1 mb-2 w-100" :value="formatNumber(playlist.playlist['movie-new'])" readonly></erd-input>
              </erd-col>
              <erd-col sm="4" class="m-0 px-0">
                <label class="w-100">{{ $t("xtream.movies-removed") }}</label>
                <erd-input class="mt-1 mb-2 w-100" :value="formatNumber(playlist.playlist['movie-removed'])" readonly></erd-input>
              </erd-col>
            </erd-row>
            <erd-row class="p-0 m-0" v-if="userHasMoviesSeries">
              <erd-col sm="4" class="m-0 pl-0 pr-1">
                <label class="w-100">{{ $t("xtream.total-series") }}</label>
                <erd-input class="mt-1 mb-2 w-100" :value="formatNumber(playlist.playlist['series'])" readonly></erd-input>
              </erd-col>
              <erd-col sm="4" class="m-0 pl-0 pr-1">
                <label class="w-100">{{ $t("xtream.series-new") }}</label>
                <erd-input class="mt-1 mb-2 w-100" :value="formatNumber(playlist.playlist['series-new'])" readonly></erd-input>
              </erd-col>
              <erd-col sm="4" class="m-0 px-0">
                <label class="w-100">{{ $t("xtream.series-removed") }}</label>
                <erd-input class="mt-1 mb-2 w-100" :value="formatNumber(playlist.playlist['series-removed'])" readonly></erd-input>
              </erd-col>
            </erd-row>
          </div>
          <template v-slot:footer>
            <erd-button
              @click="playlistModal(false)"
              icon="la-times"
              class="mr-1"
              variant="danger"
              >{{ $t("general.close") }}</erd-button
            >
          </template>
        </erd-modal>
      </erd-row>
    </erd-col>
    <erd-col xl="12" xs="12" class="m-0 p-0" v-if="userHasMoviesSeries">
      <erd-row class="m-0 p-0">
        <erd-col xl="3" md="6">
          <erd-card>
            <erd-card-body class="dashboard-card">
              <i class="las la-list la-5x color-theme-1"></i>
              <div class="dashboard-card-title" style="">
                <h5 class="m-0">{{ $t("dashboard.playlist") }}</h5>
                <p class="m-0 color-theme-1">{{ formatNumber(statistics.playlists) }}</p>
              </div>
            </erd-card-body>
          </erd-card>
        </erd-col>
        <erd-col xl="3" md="6">
          <erd-card>
            <erd-card-body class="dashboard-card">
              <i class="las la-tv la-5x color-theme-1"></i>
              <div class="dashboard-card-title" style="">
                <h5 class="m-0">{{ $t("dashboard.live-streams") }}</h5>
                <p class="m-0 color-theme-1">{{ formatNumber(statistics.live) }}</p>
              </div>
            </erd-card-body>
          </erd-card>
        </erd-col>
        <erd-col xl="3" md="6">
          <erd-card>
            <erd-card-body class="dashboard-card">
              <i class="las la-film la-5x color-theme-1"></i>
              <div class="dashboard-card-title" style="">
                <h5 class="m-0">{{ $t("dashboard.movies") }}</h5>
                <p class="m-0 color-theme-1">{{ formatNumber(statistics.movies) }}</p>
              </div>
            </erd-card-body>
          </erd-card>
        </erd-col>
        <erd-col xl="3" md="6">
          <erd-card>
            <erd-card-body class="dashboard-card">
              <i class="las la-video la-5x color-theme-1"></i>
              <div class="dashboard-card-title" style="">
                <h5 class="m-0">{{ $t("dashboard.series") }}</h5>
                <p class="m-0 color-theme-1">{{ formatNumber(statistics.series) }}</p>
              </div>
            </erd-card-body>
          </erd-card>
        </erd-col>
      </erd-row>
    </erd-col>
    <erd-col xl="12" xs="12" class="m-0 p-0" v-if="!userHasMoviesSeries">
      <erd-row class="m-0 p-0">
        <erd-col xl="6" md="6">
          <erd-card>
            <erd-card-body class="dashboard-card">
              <i class="las la-list la-5x color-theme-1"></i>
              <div class="dashboard-card-title" style="">
                <h5 class="m-0">{{ $t("dashboard.playlist") }}</h5>
                <p class="m-0 color-theme-1">{{ formatNumber(statistics.playlists) }}</p>
              </div>
            </erd-card-body>
          </erd-card>
        </erd-col>
        <erd-col xl="6" md="6">
          <erd-card>
            <erd-card-body class="dashboard-card">
              <i class="las la-tv la-5x color-theme-1"></i>
              <div class="dashboard-card-title" style="">
                <h5 class="m-0">{{ $t("dashboard.live-streams") }}</h5>
                <p class="m-0 color-theme-1">{{ formatNumber(statistics.live) }}</p>
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
import { mapActions, mapGetters } from "vuex";
import { httpService } from "../../../services/http";

export default {
  data() {
    return {
      isLoading: false,
      xtreamAccount: {
        modal: false,
        account: null,
      },
      playlist: {
        modal: false,
        playlist: null,
      },
      xtreamAccounts: [],
      playlists: [],
      tickets: [],
      invoices: [],
      statistics: {
        playlists: 0,
        live: 0,
        movies: 0,
        series: 0,
      }
    };
  },
  computed: {
    ...mapGetters(["currentUser"]),
    userHasMoviesSeries() {
      return this.currentUser.subscription && this.currentUser.subscription.subscription_type > 0;
    },
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
      this.isLoading = true;
      this.playlists = [];
      this.xtreamAccounts = [];
      Promise.all([
        httpService.get("dashboard/statistics"), 
        httpService.get("dashboard/xtream-accounts"), 
        httpService.get("dashboard/playlists")
      ])
        .then((res) => {
          if (res[0].status === true) {
            this.statistics.playlists = res[0].data.playlist;
            this.statistics.live = res[0].data.live;
            this.statistics.movies = res[0].data.movies;
            this.statistics.series = res[0].data.series;
          }
          if (res[1].status === true) {
            this.xtreamAccounts = res[1].data;
          }
          if (res[2].status === true) {
            this.playlists = res[2].data;
          }
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
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
    formatNumber(num) {
      return new Intl.NumberFormat(this.$t("date.locale")).format(num);
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
    xtreamAccountModal(show, account) {
      if (account) {
        this.xtreamAccount.account = account;
      }
      this.xtreamAccount.modal = show;
    },
    playlistModal(show, playlist) {
      if (playlist) {
        this.playlist.playlist = playlist;
      }
      this.playlist.modal = show;
    }
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
