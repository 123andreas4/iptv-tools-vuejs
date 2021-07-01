import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./sass/_base.scss";
import "./sass/_mixins.scss";
import "./sass/_variables.scss";
import "./sass/main.scss";

Vue.config.productionTip = false;

import PerfectScrollbar from "vue2-perfect-scrollbar";
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";
Vue.use(PerfectScrollbar);

import VueScrollTo from "vue-scrollto";
Vue.use(VueScrollTo);

Vue.use(require("vue-shortkey"));

import BootstrapVue from "bootstrap-vue";
Vue.use(BootstrapVue);

import shell from "vue-shell";
Vue.use(shell);

import VueI18n from "vue-i18n";

import en from "./locales/en.json";
import nl from "./locales/nl.json";

import { getCurrentLanguage } from "./helpers";
import { localeDateTimeFormats } from "./constants/config";
Vue.use(VueI18n);
const messages = { en: en, nl: nl };
const locale = getCurrentLanguage();
const i18n = new VueI18n({
  locale: locale,
  fallbackLocale: "en",
  messages,
  localeDateTimeFormats,
});

import wysiwyg from "vue-wysiwyg";
Vue.use(wysiwyg, {
  forcePlainTextOnPaste: true,
  iconOverrides: {
    bold: "<i class='las la-bold'></i>",
    italic: "<i class='las la-italic'></i>",
    underline: "<i class='las la-underline'></i>",
    justifyLeft: "<i class='las la-align-left'></i>",
    justifyCenter: "<i class='las la-align-center'></i>",
    justifyRight: "<i class='las la-align-right'></i>",
    headings: "<i class='las la-heading'></i>",
    link: "<i class='las la-link'></i>",
    code: "<i class='las la-code'></i>",
    orderedList: "<i class='las la-list-ol'></i>",
    unorderedList: "<i class='las la-list-ul'></i>",
    image: "<i class='las la-image'></i>",
    table: "<i class='las la-table'></i>",
  },
  hideModules: { removeFormat: true, separator: true },
});

import VuePlyr from "vue-plyr";
import "vue-plyr/dist/vue-plyr.css";

Vue.use(VuePlyr, {
  plyr: {
    i18n: i18n.t("video-player"),
  },
});

/*

  Grid

*/
Vue.component("erd-row", () => import("./components/Grid/ERDRow"));
Vue.component("erd-col", () => import("./components/Grid/ERDCol"));

/* 
  
  Card 
  
*/
Vue.component("erd-card", () => import("./components/Cards/ERDCard"));
Vue.component("erd-card-body", () => import("./components/Cards/ERDCardBody"));
Vue.component("erd-card-title", () =>
  import("./components/Cards/ERDCardTitle")
);
Vue.component("erd-card-header", () =>
  import("./components/Cards/ERDCardHeader")
);

/* 

  Form 
  
*/
Vue.component("erd-button", () => import("./components/Form/ERDButton"));
Vue.component("erd-input", () => import("./components/Form/ERDInput"));
Vue.component("erd-select", () => import("./components/Form/ERDSelect"));
Vue.component("erd-textarea", () => import("./components/Form/ERDTextarea"));
Vue.component("erd-checkbox", () => import("./components/Form/ERDCheckbox"));
Vue.component("erd-radiobutton", () =>
  import("./components/Form/ERDRadiobutton")
);
Vue.component("erd-tag-input", () => import("./components/Form/ERDTagInput"));

/* 

  Navigation 
  
*/
Vue.component("erd-breadcrumb", () =>
  import("./components/Navigation/ERDBreadcrumb")
);

/*

  Misc.

*/
Vue.component("erd-badge", () => import("./components/ERDBadge"));
Vue.component("erd-toggle", () => import("./components/ERDToggle"));
Vue.component("erd-alert", () => import("./components/ERDAlert"));
Vue.component("erd-info-box", () => import("./components/ERDInfoBox"));
Vue.component("erd-spinner", () => import("./components/ERDSpinner"));
Vue.component("erd-modal", () => import("./components/ERDModal"));
Vue.component("erd-collapse", () => import("./components/ERDCollapse"));

/* 

  Calendar 
  
*/
Vue.component("erd-calendar", () =>
  import("./components/Calendar/ERDCalendar")
);

/* 

  Report 
  
*/
Vue.component("erd-report", () => import("./components/Reports/ERDReport"));

/* 

  Utilities 
  
*/
Vue.component("erd-resize-observer", () =>
  import("./components/Utils/ERDResizeObserver")
);
Vue.component("erd-tooltip", () => import("./components/Utils/ERDTooltip"));
Vue.component("erd-context-menu", () =>
  import("./components/Utils/ERDContextMenu")
);
Vue.component("erd-paypal-button", () =>
  import("./components/ERDPaypalButton")
);
Vue.component("erd-progress-bar", () =>
  import("./components/Utils/ERDProgressBar")
);
Vue.component("erd-dropdown-menu", () =>
  import("./components/Utils/ERDDropdownMenu")
);
Vue.component("erd-genre-select", () =>
  import("./components/Utils/ERDGenreSelect")
);
Vue.component("erd-tab", () => import("./components/ERDTab"));
Vue.component("erd-app-menu", () => import("./components/App/AppMenu"));

import NoSleep from "./plugins/nosleep";
Vue.use(NoSleep);

import Notifications from "./components/Notifications";
Vue.use(Notifications);

import VueAwesomeSwiper from "vue-awesome-swiper";
Vue.use(VueAwesomeSwiper);
import "swiper/css/swiper.css";

import "viewerjs/dist/viewer.css";
import VueViewer from "v-viewer";
Vue.use(VueViewer);

new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

/*

  Prototypes

*/
import { printElement } from "./helpers";
HTMLElement.prototype.print = printElement;

String.prototype.format = function () {
  var a = this;
  var b;
  for (b in arguments) {
    a = a.replace(/%[a-z]/, arguments[b]);
  }
  return a;
};

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.titleCase = function () {
  var str = this.toLowerCase();
  var words = str.split(" ");
  var capitalized = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.substring(1, word.length);
  });
  return capitalized.join(" ");
};

Date.prototype.toJSON = function () {
  const hoursDiff = this.getHours() - this.getTimezoneOffset() / 60;
  this.setHours(hoursDiff);
  return this.toISOString();
};

/*

  App Wide Event Listeners

*/
import { EventBus } from "./services/ebus";
window.addEventListener("afterprint", () => {
  EventBus.$emit("afterprint");
});
