<template>
  <erd-row class="m-0 p-0">
    <erd-spinner v-if="isLoading" size="lg" overlay absolute></erd-spinner>
    <erd-col xl="12" sm="12" id="statistics" class="p-0">
      <erd-row class="m-0 p-0">
        <erd-col xl="3" md="6">
          <erd-card>
            <erd-card-body class="statistics-card">
              <i class="las la-shopping-basket la-4x color-theme-1"></i>
              <div class="statistics-card-title" style="">
                <h5 class="m-0">{{ $t("statistics.sales-last-month") }}</h5>
                <p class="m-0 color-theme-1">{{ lastMonth.sales }}x</p>
              </div>
            </erd-card-body>
          </erd-card>
        </erd-col>
        <erd-col xl="3" md="6">
          <erd-card>
            <erd-card-body class="statistics-card">
              <i class="las la-money-bill-alt la-4x color-theme-1"></i>
              <div class="statistics-card-title" style="">
                <h5 class="m-0">{{ $t("statistics.revenue-last-month") }}</h5>
                <p class="m-0 color-theme-1">
                  {{ formatCurrency(revenueLastMonth) }}
                </p>
              </div>
            </erd-card-body>
          </erd-card>
        </erd-col>
        <erd-col xl="3" md="6">
          <erd-card>
            <erd-card-body class="statistics-card">
              <i class="las la-shopping-basket la-4x text-info"></i>
              <div class="statistics-card-title" style="">
                <h5 class="m-0">{{ $t("statistics.sales-this-month") }}</h5>
                <p class="m-0 text-info">{{ currentMonth.sales }}x</p>
              </div>
            </erd-card-body>
          </erd-card>
        </erd-col>
        <erd-col xl="3" md="6">
          <erd-card>
            <erd-card-body class="statistics-card">
              <i class="las la-money-bill-alt la-4x text-info"></i>
              <div class="statistics-card-title" style="">
                <h5 class="m-0">{{ $t("statistics.revenue-this-month") }}</h5>
                <p class="m-0 text-info">
                  {{ formatCurrency(revenueThisMonth) }}
                </p>
              </div>
            </erd-card-body>
          </erd-card>
        </erd-col>
      </erd-row>
      <erd-row class="m-0 p-0">
        <erd-col xl="6" md="12" sm="12">
          <erd-card class="chart-card">
            <erd-card-body>
              <div class="float-left float-none-xs">
                <div class="d-inline-block">
                  <h5 class="d-inline">
                    {{ $t("statistics.last-month") }}
                    <span class="text-muted text-small text-capitalize"
                      >({{ monthName(new Date().getMonth()) }})</span
                    >
                  </h5>
                  <span class="text-muted text-small d-block">{{
                    $t("statistics.sales-per-day")
                  }}</span>
                </div>
              </div>
            </erd-card-body>
            <erd-card-body class="chart mt-3">
              <area-chart
                v-if="lastMonth.data"
                :data="lastMonth.data"
                :step="lastMonth.step"
                :min="lastMonth.min"
                :max="lastMonth.max"
                :tooltip="tooltip"
                container-class="chart"
                shadow
              />
            </erd-card-body>
          </erd-card>
        </erd-col>
        <erd-col xl="6" md="12" sm="12">
          <erd-card class="chart-card">
            <erd-card-body>
              <div class="float-left float-none-xs">
                <div class="d-inline-block">
                  <h5 class="d-inline">
                    {{ $t("statistics.this-month") }}
                    <span class="text-muted text-small text-capitalize"
                      >({{ monthName(new Date().getMonth() + 1) }})</span
                    >
                  </h5>
                  <span class="text-muted text-small d-block">{{
                    $t("statistics.sales-per-day")
                  }}</span>
                </div>
              </div>
            </erd-card-body>
            <erd-card-body class="chart mt-3">
              <area-chart
                v-if="currentMonth.data"
                :data="currentMonth.data"
                :step="currentMonth.step"
                :min="currentMonth.min"
                :max="currentMonth.max"
                :tooltip="tooltip"
                container-class="chart"
                shadow
              />
            </erd-card-body>
          </erd-card>
        </erd-col>
      </erd-row>
      <erd-row class="m-0 p-0">
        <erd-col xl="3" md="6">
          <erd-card>
            <erd-card-body class="statistics-card">
              <i class="las la-shopping-basket la-4x color-theme-1"></i>
              <div class="statistics-card-title" style="">
                <h5 class="m-0">{{ $t("statistics.sales-last-year") }}</h5>
                <p class="m-0 color-theme-1">{{ lastYear.sales }}x</p>
              </div>
            </erd-card-body>
          </erd-card>
        </erd-col>
        <erd-col xl="3" md="6">
          <erd-card>
            <erd-card-body class="statistics-card">
              <i class="las la-money-bill-alt la-4x color-theme-1"></i>
              <div class="statistics-card-title" style="">
                <h5 class="m-0">{{ $t("statistics.revenue-last-year") }}</h5>
                <p class="m-0 color-theme-1">
                  {{ formatCurrency(revenueLastYear) }}
                </p>
              </div>
            </erd-card-body>
          </erd-card>
        </erd-col>
        <erd-col xl="3" md="6">
          <erd-card>
            <erd-card-body class="statistics-card">
              <i class="las la-shopping-basket la-4x text-info"></i>
              <div class="statistics-card-title" style="">
                <h5 class="m-0">{{ $t("statistics.sales-this-year") }}</h5>
                <p class="m-0 text-info">{{ currentYear.sales }}x</p>
              </div>
            </erd-card-body>
          </erd-card>
        </erd-col>
        <erd-col xl="3" md="6">
          <erd-card>
            <erd-card-body class="statistics-card">
              <i class="las la-money-bill-alt la-4x text-info"></i>
              <div class="statistics-card-title" style="">
                <h5 class="m-0">{{ $t("statistics.revenue-this-year") }}</h5>
                <p class="m-0 text-info">
                  {{ formatCurrency(revenueThisYear) }}
                </p>
              </div>
            </erd-card-body>
          </erd-card>
        </erd-col>
      </erd-row>
      <erd-row class="m-0 p-0">
        <erd-col xl="6" md="12" sm="12">
          <erd-card class="chart-card">
            <erd-card-body>
              <div class="float-left float-none-xs">
                <div class="d-inline-block">
                  <h5 class="d-inline">
                    {{ $t("statistics.last-year") }}
                    <span class="text-muted text-small text-capitalize"
                      >({{ new Date().getFullYear() - 1 }})</span
                    >
                  </h5>
                  <span class="text-muted text-small d-block">{{
                    $t("statistics.sales-per-month")
                  }}</span>
                </div>
              </div>
            </erd-card-body>
            <erd-card-body class="chart mt-3">
              <area-chart
                v-if="lastYear.data"
                :data="lastYear.data"
                :step="lastYear.step"
                :min="lastYear.min"
                :max="lastYear.max"
                :tooltip="tooltip"
                container-class="chart"
                shadow
              />
            </erd-card-body>
          </erd-card>
        </erd-col>
        <erd-col xl="6" md="12" sm="12">
          <erd-card class="chart-card">
            <erd-card-body>
              <div class="float-left float-none-xs">
                <div class="d-inline-block">
                  <h5 class="d-inline">
                    {{ $t("statistics.this-year") }}
                    <span class="text-muted text-small text-capitalize"
                      >({{ new Date().getFullYear() }})</span
                    >
                  </h5>
                  <span class="text-muted text-small d-block">{{
                    $t("statistics.sales-per-month")
                  }}</span>
                </div>
              </div>
            </erd-card-body>
            <erd-card-body class="chart mt-3">
              <area-chart
                v-if="currentYear.data"
                :data="currentYear.data"
                :step="currentYear.step"
                :min="currentYear.min"
                :max="currentYear.max"
                :tooltip="tooltip"
                container-class="chart"
                shadow
              />
            </erd-card-body>
          </erd-card>
        </erd-col>
      </erd-row>
    </erd-col>
  </erd-row>
</template>

<script>
/* eslint-disable vue/no-side-effects-in-computed-properties */
/* eslint-disable no-unused-vars */
import { EventBus } from "../../../services/ebus";
import { httpService } from "../../../services/http";
import { mapGetters } from "vuex";
import AreaChart from "../../../components/Charts/Area";
import { ThemeColors, getDaysInMonth, monthName } from "../../../helpers";

const colors = ThemeColors();

export default {
  components: {
    "area-chart": AreaChart,
  },
  data() {
    return {
      search: null,
      isLoading: false,
      statistics: null,
      lastMonth: {
        min: 0,
        max: 100,
        step: 1,
        data: null,
        sales: 0,
      },
      currentMonth: {
        min: 0,
        max: 100,
        step: 1,
        data: null,
        sales: 0,
      },
      lastYear: {
        min: 0,
        max: 100,
        step: 1,
        data: null,
        sales: 0,
      },
      currentYear: {
        min: 0,
        max: 100,
        step: 1,
        data: null,
        sales: 0,
      },
    };
  },
  computed: {
    ...mapGetters(["currentUser"]),
    revenueLastMonth() {
      return this.lastMonth.data
        ? this.lastMonth.data.datasets[0].data.reduce((a, b) => a + b, 0)
        : 0;
    },
    revenueThisMonth() {
      return this.currentMonth.data
        ? this.currentMonth.data.datasets[0].data.reduce((a, b) => a + b, 0)
        : 0;
    },
    revenueLastYear() {
      return this.lastYear.data
        ? this.lastYear.data.datasets[0].data.reduce((a, b) => a + b, 0)
        : 0;
    },
    revenueThisYear() {
      return this.currentYear.data
        ? this.currentYear.data.datasets[0].data.reduce((a, b) => a + b, 0)
        : 0;
    },
    tooltip() {
      let vm = this;
      return {
        displayColors: false,
        backgroundColor: colors.foregroundColor,
        titleFontColor: colors.primaryColor,
        borderColor: colors.separatorColor,
        borderWidth: 0.5,
        bodyFontColor: colors.primaryColor,
        bodySpacing: 10,
        xPadding: 15,
        yPadding: 15,
        cornerRadius: 10,
        callbacks: {
          label: function (context) {
            if (context.datasetIndex === 0) {
              return `${vm.$t("statistics.revenue")}: ${new Intl.NumberFormat(
                vm.$t("date.locale"),
                {
                  style: "currency",
                  currency: "EUR",
                }
              ).format(context.value)}`;
            } else {
              return `${vm.$t("statistics.sales")}: ${context.value}x`;
            }
          },
        },
      };
    },
  },
  methods: {
    monthName(month, length = "long") {
      var objDate = new Date();

      objDate.setDate(1);
      objDate.setMonth(month - 1);

      return objDate.toLocaleString(this.$t("date.locale"), { month: length });
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
    loadStatistics() {
      this.isLoading = true;
      httpService
        .get("administration/financial-statistics")
        .then((res) => {
          this.isLoading = false;
          if (res.status === true) {
            this.statistics = res.data;
            this.createLastMonth();
            this.createThisMonth();
            this.createLastYear();
            this.createThisYear();
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("statistics.load-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    revenueMonthDay(month, day) {
      let res = this.statistics.revenue[month].find((rev) => rev.day == day);
      return res ? res.revenue : 0;
    },
    salesMonthDay(month, day) {
      let res = this.statistics.sales[month].find((sale) => sale.day == day);
      return res ? res.sales : 0;
    },
    revenueYearMonth(year, month) {
      let res = this.statistics.revenue[year].find((rev) => rev.month == month);
      return res ? res.revenue : 0;
    },
    salesYearMonth(year, month) {
      let res = this.statistics.sales[year].find((sale) => sale.month == month);
      return res ? res.sales : 0;
    },
    createLastMonth() {
      let d = new Date();
      let month = d.getMonth();
      let year = d.getFullYear();

      let days = [...Array(getDaysInMonth(month, year)).keys()].map(
        (x) => x + 1
      );
      let dataRevenue = [...days].map((day) => {
        return this.revenueMonthDay("last_month", day);
      });
      let dataSales = [...days].map((day) => {
        return this.salesMonthDay("last_month", day);
      });

      let res = 0;
      this.statistics.sales.last_month.map((sale) => {
        res += sale.sales;
      });
      this.lastMonth.sales = res;

      let maxRevenue = Math.max(...dataRevenue);
      let maxSales = Math.max(...dataSales);
      let maxTotal = Math.max(maxRevenue, maxSales);

      this.lastMonth.step = maxTotal > 10 ? maxTotal / 5 : 1;
      this.lastMonth.max = maxTotal > 10 ? maxTotal : 10;
      this.lastMonth.data = {
        labels: days,
        datasets: [
          {
            label: this.$t("statistics.revenue"),
            data: dataRevenue,
            borderColor: colors.themeColor1,
            pointBackgroundColor: colors.foregroundColor,
            pointBorderColor: colors.themeColor1,
            pointHoverBackgroundColor: colors.themeColor1,
            pointHoverBorderColor: colors.foregroundColor,
            pointRadius: 4,
            pointBorderWidth: 2,
            pointHoverRadius: 5,
            fill: true,
            borderWidth: 2,
            backgroundColor: colors.themeColor1_10,
          },
          {
            label: this.$t("statistics.sales"),
            data: dataSales,
            borderColor: colors.themeColor1,
            pointBackgroundColor: colors.foregroundColor,
            pointBorderColor: colors.themeColor1,
            pointHoverBackgroundColor: colors.themeColor1,
            pointHoverBorderColor: colors.foregroundColor,
            pointRadius: 4,
            pointBorderWidth: 2,
            pointHoverRadius: 5,
            fill: true,
            borderWidth: 2,
            backgroundColor: colors.themeColor1_10,
          },
        ],
      };
    },
    createLastYear() {
      let months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      let dataRevenue = [...months].map((month) => {
        return this.revenueYearMonth("last_year", month);
      });
      let dataSales = [...months].map((month) => {
        return this.salesYearMonth("last_year", month);
      });

      let res = 0;
      this.statistics.sales.last_year.map((sale) => {
        res += sale.sales;
      });
      this.lastYear.sales = res;

      let maxRevenue = Math.max(...dataRevenue);
      let maxSales = Math.max(...dataSales);
      let maxTotal = Math.max(maxRevenue, maxSales);

      this.lastYear.step = maxTotal > 10 ? maxTotal / 5 : 1;
      this.lastYear.max = maxTotal > 10 ? maxTotal : 10;
      this.lastYear.data = {
        labels: months.map((month) =>
          this.monthName(month, "short").capitalize()
        ),
        datasets: [
          {
            label: this.$t("statistics.revenue"),
            data: dataRevenue,
            borderColor: colors.themeColor1,
            pointBackgroundColor: colors.foregroundColor,
            pointBorderColor: colors.themeColor1,
            pointHoverBackgroundColor: colors.themeColor1,
            pointHoverBorderColor: colors.foregroundColor,
            pointRadius: 4,
            pointBorderWidth: 2,
            pointHoverRadius: 5,
            fill: true,
            borderWidth: 2,
            backgroundColor: colors.themeColor1_10,
          },
          {
            label: this.$t("statistics.sales"),
            data: dataSales,
            borderColor: colors.themeColor1,
            pointBackgroundColor: colors.foregroundColor,
            pointBorderColor: colors.themeColor1,
            pointHoverBackgroundColor: colors.themeColor1,
            pointHoverBorderColor: colors.foregroundColor,
            pointRadius: 4,
            pointBorderWidth: 2,
            pointHoverRadius: 5,
            fill: true,
            borderWidth: 2,
            backgroundColor: colors.themeColor1_10,
          },
        ],
      };
    },
    createThisMonth() {
      let d = new Date();
      let month = d.getMonth() + 1;
      let year = d.getFullYear();

      let days = [...Array(getDaysInMonth(month, year)).keys()].map(
        (x) => x + 1
      );
      let dataRevenue = [...days].map((day) => {
        return this.revenueMonthDay("current_month", day);
      });
      let dataSales = [...days].map((day) => {
        return this.salesMonthDay("current_month", day);
      });

      let res = 0;
      this.statistics.sales.current_month.map((sale) => {
        res += sale.sales;
      });
      this.currentMonth.sales = res;

      let maxRevenue = Math.max(...dataRevenue);
      let maxSales = Math.max(...dataSales);
      let maxTotal = Math.max(maxRevenue, maxSales);

      this.currentMonth.step = maxTotal > 10 ? maxTotal / 5 : 1;
      this.currentMonth.max = maxTotal > 10 ? maxTotal : 10;
      this.currentMonth.data = {
        labels: days,
        datasets: [
          {
            label: this.$t("statistics.revenue"),
            data: dataRevenue,
            borderColor: colors.infoColor,
            pointBackgroundColor: colors.foregroundColor,
            pointBorderColor: colors.infoColor,
            pointHoverBackgroundColor: colors.infoColor,
            pointHoverBorderColor: colors.foregroundColor,
            pointRadius: 4,
            pointBorderWidth: 2,
            pointHoverRadius: 5,
            fill: true,
            borderWidth: 2,
            backgroundColor: colors.infoColor1_10,
          },
          {
            label: this.$t("statistics.sales"),
            data: dataSales,
            borderColor: colors.infoColor5_10,
            pointBackgroundColor: colors.foregroundColor,
            pointBorderColor: colors.infoColor5_10,
            pointHoverBackgroundColor: colors.infoColor5_10,
            pointHoverBorderColor: colors.foregroundColor,
            pointRadius: 4,
            pointBorderWidth: 2,
            pointHoverRadius: 5,
            fill: true,
            borderWidth: 2,
            backgroundColor: colors.infoColor1_10,
          },
        ],
      };
    },
    createThisYear() {
      let months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      let dataRevenue = [...months].map((month) => {
        return this.revenueYearMonth("current_year", month);
      });
      let dataSales = [...months].map((month) => {
        return this.salesYearMonth("current_year", month);
      });

      let res = 0;
      this.statistics.sales.current_year.map((sale) => {
        res += sale.sales;
      });
      this.currentYear.sales = res;

      let maxRevenue = Math.max(...dataRevenue);
      let maxSales = Math.max(...dataSales);
      let maxTotal = Math.max(maxRevenue, maxSales);

      this.currentYear.step = maxTotal > 10 ? maxTotal / 5 : 1;
      this.currentYear.max = maxTotal > 10 ? maxTotal : 10;
      this.currentYear.data = {
        labels: months.map((month) =>
          this.monthName(month, "short").capitalize()
        ),
        datasets: [
          {
            label: this.$t("statistics.revenue"),
            data: dataRevenue,
            borderColor: colors.infoColor,
            pointBackgroundColor: colors.foregroundColor,
            pointBorderColor: colors.infoColor,
            pointHoverBackgroundColor: colors.infoColor,
            pointHoverBorderColor: colors.foregroundColor,
            pointRadius: 4,
            pointBorderWidth: 2,
            pointHoverRadius: 5,
            fill: true,
            borderWidth: 2,
            backgroundColor: colors.infoColor1_10,
          },
          {
            label: this.$t("statistics.sales"),
            data: dataSales,
            borderColor: colors.infoColor5_10,
            pointBackgroundColor: colors.foregroundColor,
            pointBorderColor: colors.infoColor5_10,
            pointHoverBackgroundColor: colors.infoColor5_10,
            pointHoverBorderColor: colors.foregroundColor,
            pointRadius: 4,
            pointBorderWidth: 2,
            pointHoverRadius: 5,
            fill: true,
            borderWidth: 2,
            backgroundColor: colors.infoColor1_10,
          },
        ],
      };
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
    this.loadStatistics();
    EventBus.$emit("hide-all", true);
    EventBus.$on("search", this.searchPayment);
    EventBus.$on("print", this.printPayment);
    EventBus.$on("refresh", this.loadStatistics);
  },
  beforeDestroy() {
    EventBus.$emit("hide-all", false);
    EventBus.$off("search", this.searchPayment);
    EventBus.$off("print", this.printPayment);
    EventBus.$off("refresh", this.loadStatistics);
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
.statistics-card {
  display: table;
}
.statistics-card-title {
  display: table-cell;
  vertical-align: middle;
  width: 100%;
  padding-left: 0.5rem;

  p {
    font-size: 1rem;
    font-weight: bold;
  }
}
.chart-card {
  height: 340px;

  .chart {
    height: 200px;
  }
}
</style>
