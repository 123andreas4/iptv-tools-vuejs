<template>
  <nav
    class="navbar d-print-none"
    @mouseenter="isMenuOver = true"
    @mouseleave="isMenuOver = false"
  >
    <div class="navbar-side">
      <a
        href="#"
        class="menu-button d-none d-md-inline-block"
        @click.prevent.stop="
          changeSideMenuStatus({
            step: menuClickCount + 1,
            classNames: menuType,
            selectedMenuHasSubItems,
          })
        "
      >
        <i class="las la-bars"></i>
      </a>
      <a
        href="#"
        class="menu-button d-xs-block d-sm-inline-block d-md-none"
        @click.prevent.stop="changeSideMenuForMobile(menuType)"
      >
        <i class="las la-bars"></i>
      </a>
      <div class="search" :class="{ 'mobile-view': searchMobile }">
        <input
          type="text"
          :placeholder="$t('navbar.search')"
          v-model="search"
        />
        <span class="search-icon" @click.stop="doSearchMobile">
          <i class="las la-search"></i>
        </span>
      </div>
    </div>
    <a href="/" class="navbar-logo active">
      <span class="logo d-none d-xs-block"></span>
      <span class="logo-mobile d-block d-xs-none"></span>
    </a>
    <div class="navbar-side right">
      <div class="account d-inline-block mr-3" @click.stop="openUser">
        <p class="d-none d-lg-inline-block" :class="{ active: userOpen }">
          {{ user.user.username }}
        </p>
        <i class="ml-1 icon las la-user" :class="{ active: userOpen }"></i>
        <transition name="fade">
          <ul class="dropdown-menu account" v-if="userOpen" role="menu">
            <li
              v-for="(item, index) in filteredUserMenu"
              :key="`account-user-menu-${index}`"
              @click.stop="closeUser"
            >
              <router-link class="dropdown-item" :to="item.to"
                ><i class="las" :class="item.icon"></i
                >{{ item.text }}</router-link
              >
            </li>
            <div class="hr px-4"></div>
            <li
              v-for="(item, index) in filteredContactMenu"
              :key="`account-contact-menu-${index}`"
              @click.stop="closeUser"
            >
              <router-link class="dropdown-item" :to="item.to"
                ><i class="las" :class="item.icon"></i
                >{{ item.text }}</router-link
              >
            </li>
            <div class="hr px-4"></div>
            <li @click.stop="closeUser">
              <a class="dropdown-item" href="#" @click.prevent="logout"
                ><i class="las la-sign-out-alt"></i
                >{{ $t("navbar.log-out") }}</a
              >
            </li>
          </ul>
        </transition>
      </div>
      <div class="print d-none d-md-inline-block mr-3" @click="printPage">
        <i class="icon las la-print"></i>
      </div>
      <div class="alerts d-inline-block" @click.stop="openAlerts">
        <span class="count" v-if="alerts.length > 0">{{ alerts.length }}</span>
        <i class="icon lar la-bell" :class="{ active: alertsOpen }"></i>
        <transition name="fade">
          <ul class="dropdown-menu alerts" v-if="alertsOpen" role="menu">
            <perfect-scrollbar
              class="scroll"
              :settings="{ suppressScrollX: true, wheelPropagation: true }"
            >
              <div class="no-alerts" v-if="alerts.length === 0">
                {{ $t("navbar.no-alerts") }}
              </div>
              <div
                class="alert"
                v-for="(alert, index) in alerts"
                :key="`alert-${index}`"
                :class="{ last: index === alerts.length - 1 }"
                @click.stop="closeAndDelete(index)"
              >
                <div class="alert-icon">
                  <i class="las" :class="alert.icon"></i>
                </div>
                <router-link :to="alert.to">
                  <div>{{ alert.text }}</div>
                  <p class="alert-date">
                    {{ formatDate(alert.date) }}
                  </p>
                </router-link>
              </div>
            </perfect-scrollbar>
          </ul>
        </transition>
      </div>
      <div
        class="fullscreen d-none d-sm-inline-block ml-3"
        @click="toggleFullScreen"
      >
        <i
          class="icon"
          :class="{
            'las la-expand-arrows-alt': !fullScreen,
            'las la-compress-arrows-alt': fullScreen,
          }"
        ></i>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import { EventBus } from "../../services/ebus";
import { UserRole } from "../../constants/config";

export default {
  data() {
    return {
      searchBounce: null,
      search: "",
      menuUp: false,
      searchMobile: false,
      isMenuOver: false,
      fullScreen: false,
      alertsOpen: false,
      userOpen: false,
      userMenu: [
        {
          text: this.$t("navbar.profile"),
          to: "/app/user/profile",
          icon: "la-user-cog",
        },
        {
          text: this.$t("navbar.subscription"),
          to: "/app/user/subscription",
          icon: "la-user-tag",
          roles: [UserRole.User, UserRole.Guest, UserRole.External],
        },
        {
          text: this.$t("navbar.invoices"),
          to: "/app/user/invoices",
          icon: "la-receipt",
          roles: [UserRole.User, UserRole.Guest, UserRole.External],
        },
      ],
      contactMenu: [
        {
          text: this.$t("navbar.faq"),
          to: "/app/user/faq",
          icon: "la-question-circle",
        },
        {
          text: this.$t("menu.versions"),
          to: "/app/user/versions",
          icon: "la-info-circle",
        },
        {
          text: this.$t("navbar.tickets"),
          to: "/app/user/tickets",
          icon: "la-headset",
          roles: [UserRole.User, UserRole.Guest, UserRole.External],
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      alerts: "alerts",
      user: "currentUser",
      menuType: "getMenuType",
      menuClickCount: "getMenuClickCount",
      selectedMenuHasSubItems: "getSelectedMenuHasSubItems",
      getMenuType: "getMenuType",
    }),
    filteredUserMenu() {
      return this.userMenu
        ? this.userMenu.filter(
            (x) =>
              !x.roles || (x.roles && x.roles.includes(this.user.user.role))
          )
        : [];
    },
    filteredContactMenu() {
      return this.contactMenu
        ? this.contactMenu.filter(
            (x) =>
              !x.roles || (x.roles && x.roles.includes(this.user.user.role))
          )
        : [];
    },
  },
  methods: {
    ...mapMutations(["changeSideMenuStatus", "changeSideMenuForMobile"]),
    ...mapActions(["logout", "deleteAlert"]),
    addEvents() {
      document.addEventListener("click", this.handleDocumentClick);
      document.addEventListener("touchstart", this.handleDocumentClick);
    },
    removeEvents() {
      document.removeEventListener("click", this.handleDocumentClick);
      document.removeEventListener("touchstart", this.handleDocumentClick);
    },
    handleDocumentClick() {
      if (!this.isMenuOver) {
        this.searchMobile = false;
      }
      if (this.alertsOpen) {
        this.alertsOpen = false;
        this.removeEvents();
      }
      if (this.userOpen) {
        this.userOpen = false;
        this.removeEvents();
      }
    },
    doSearchMobile() {
      this.searchMobile = true;
      this.addEvents();
    },
    openAlerts() {
      this.userOpen = false;
      this.alertsOpen = true;
      this.addEvents();
    },
    closeAlerts() {
      this.alertsOpen = false;
      this.removeEvents();
    },
    closeAndDelete(index) {
      this.deleteAlert(index);
      this.closeAlerts();
    },
    openUser() {
      this.alertsOpen = false;
      this.userOpen = true;
      this.addEvents();
    },
    closeUser() {
      this.userOpen = false;
      this.removeEvents();
    },
    toggleFullScreen() {
      const isInFullScreen = this.isInFullScreen();

      var docElm = document.documentElement;
      if (!isInFullScreen) {
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen();
        } else if (docElm.msRequestFullscreen) {
          docElm.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
      this.fullScreen = !isInFullScreen;
    },
    isInFullScreen() {
      return (
        (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement &&
          document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement &&
          document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null)
      );
    },
    fullScreenWatcher() {
      if (document.fullscreenElement) {
        if (this.fullScreen !== true) {
          this.fullScreen = false;
        }
      } else {
        if (this.fullScreen) {
          this.fullScreen = false;
        }
      }
    },
    printPage() {
      EventBus.$emit("print");
    },
    debouncedSearch(val) {
      EventBus.$emit("search", val);
    },
    formatDate(date) {
      return new Date(date).toLocaleString(
        this.$t("date.locale"),
        this.dateOptions
      );
    },
  },
  watch: {
    searchMobile: function (val) {
      if (!val) {
        this.removeEvents();
      }
    },
    search: function (val) {
      let vm = this;
      clearTimeout(this.searchBounce);
      this.searchBounce = setTimeout(function () {
        vm.debouncedSearch(val);
      }, 500);
    },
  },
  created() {
    document.addEventListener("fullscreenchange", this.fullScreenWatcher);
  },
  beforeDestroy() {
    this.removeEvents();
    document.removeEventListener("fullscreenchange", this.fullScreenWatcher);
  },
};
</script>

<style>
nav {
}
</style>
