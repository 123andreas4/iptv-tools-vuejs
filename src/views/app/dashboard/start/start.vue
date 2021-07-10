<template>
  <erd-row class="m-0 p-0" id="dashboard">
    <erd-spinner v-if="isLoading" size="lg" overlay absolute></erd-spinner>
    <erd-col xl="12" xs="12" class="m-0 p-0">
      <erd-row class="m-0 p-0">
        <erd-col xl="3" md="6">
          <erd-card>
            <erd-card-body class="dashboard-card">
              <i class="las la-microchip la-5x color-theme-1"></i>
              <div class="dashboard-card-title" style="">
                <h5 class="m-0">
                  {{ $t("dashboard.cpu-cores").format(server.cpu.cores) }}
                </h5>
                <p class="m-0 color-theme-1">
                  {{ $t("dashboard.cpu-load").format(server.cpu.load + "%") }}
                </p>
              </div>
            </erd-card-body>
          </erd-card>
        </erd-col>
        <erd-col xl="3" md="6">
          <erd-card>
            <erd-card-body class="dashboard-card">
              <i class="las la-memory la-5x color-theme-1"></i>
              <div class="dashboard-card-title" style="">
                <h5 class="m-0">
                  {{ $t("dashboard.memory-total").format(server.memory.total) }}
                </h5>
                <p class="m-0 color-theme-1">
                  {{
                    $t("dashboard.memory-used").format(
                      Math.abs(server.memory.total_used_percent) + "%"
                    )
                  }}
                </p>
              </div>
            </erd-card-body>
          </erd-card>
        </erd-col>
        <erd-col xl="3" md="6">
          <erd-card>
            <erd-card-body class="dashboard-card">
              <i class="las la-hdd la-5x color-theme-1"></i>
              <div class="dashboard-card-title" style="">
                <h5 class="m-0">
                  {{ $t("dashboard.disk-total").format(server.hdd.total) }}
                </h5>
                <p class="m-0 color-theme-1">
                  {{
                    $t("dashboard.disk-used").format(
                      server.hdd.total_used_percent + "%"
                    )
                  }}
                </p>
              </div>
            </erd-card-body>
          </erd-card>
        </erd-col>
        <erd-col xl="3" md="6">
          <erd-card>
            <erd-card-body class="dashboard-card">
              <i class="las la-ethernet la-5x color-theme-1"></i>
              <div class="dashboard-card-title" style="">
                <h5 class="m-0">
                  {{ $t("dashboard.network-rx").format(server.network.rx) }}
                  <span class="text-muted text-small"
                    >({{ server.network.receive }} B)</span
                  >
                </h5>
                <p class="m-0 color-theme-1">
                  {{ $t("dashboard.network-tx").format(server.network.tx) }}
                  <span class="text-muted text-small"
                    >({{ server.network.send }} B)</span
                  >
                </p>
              </div>
            </erd-card-body>
          </erd-card>
        </erd-col>
      </erd-row>
    </erd-col>
    <erd-col xl="12" xs="12" class="m-0 p-0">
      <erd-row class="m-0 p-0">
        <erd-col xl="3" md="6">
          <erd-card>
            <erd-card-body class="dashboard-card">
              <i class="las la-table la-5x color-theme-1"></i>
              <div class="dashboard-card-title" style="">
                <h5 class="m-0">
                  {{
                    $t("dashboard.database-tables").format(
                      formatNumber(database.tables)
                    )
                  }}
                </h5>
              </div>
            </erd-card-body>
          </erd-card>
        </erd-col>
        <erd-col xl="3" md="6">
          <erd-card>
            <erd-card-body class="dashboard-card">
              <i class="las la-list la-5x color-theme-1"></i>
              <div class="dashboard-card-title" style="">
                <h5 class="m-0">
                  {{
                    $t("dashboard.database-rows").format(
                      formatNumber(database.rows)
                    )
                  }}
                </h5>
              </div>
            </erd-card-body>
          </erd-card>
        </erd-col>
        <erd-col xl="3" md="6">
          <erd-card>
            <erd-card-body class="dashboard-card">
              <i class="las la-columns la-5x color-theme-1"></i>
              <div class="dashboard-card-title" style="">
                <h5 class="m-0">
                  {{
                    $t("dashboard.database-columns").format(
                      formatNumber(database.columns)
                    )
                  }}
                </h5>
              </div>
            </erd-card-body>
          </erd-card>
        </erd-col>
        <erd-col xl="3" md="6">
          <erd-card>
            <erd-card-body class="dashboard-card">
              <i class="las la-server la-5x color-theme-1"></i>
              <div class="dashboard-card-title" style="">
                <h5 class="m-0">
                  {{ $t("dashboard.database-size").format(database.size) }}
                </h5>
              </div>
            </erd-card-body>
          </erd-card>
        </erd-col>
      </erd-row>
    </erd-col>
  </erd-row>
</template>

<script>
import { EventBus } from "../../../../services/ebus";
import { mapActions, mapGetters } from "vuex";
import { httpService } from "../../../../services/http";

export default {
  data() {
    return {
      dateOptions: { day: "2-digit", month: "numeric", year: "numeric" },
      isLoading: false,
      handles: {
        server: null,
        database: null,
      },
      server: {
        cpu: {
          cores: 0,
          load: 0,
        },
        memory: {
          total: 0,
          total_free: 0,
          total_used: 0,
          total_used_percent: 0,
        },
        hdd: {
          total: 0,
          total_free: 0,
          total_used: 0,
          total_used_percent: 0,
        },
        network: {
          rx: 0,
          tx: 0,
        },
      },
      database: {
        columns: 0,
        rows: 0,
        tables: 0,
        size: 0,
      },
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
    formatNumber(num) {
      return new Intl.NumberFormat(this.$t("date.locale"), {}).format(num);
    },
    loadServer() {
      httpService
        .post("administration/dashboard/server")
        .then((res) => {
          if (res.status === true) {
            this.server = res.data;
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
    loadDatabase() {
      httpService
        .post("administration/dashboard/database")
        .then((res) => {
          if (res.status === true) {
            this.database = res.data;
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
  },
  beforeMount() {
    this.loadServer();
    this.loadDatabase();
    EventBus.$on("print", this.pagePrint);
    this.handles.server = setInterval(this.loadServer, 10 * 1000);
    this.handles.database = setInterval(this.loadDatabase, 60 * 1000);
  },
  beforeDestroy() {
    EventBus.$off("print", this.pagePrint);
    clearInterval(this.handles.server);
    clearInterval(this.handles.database);
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
