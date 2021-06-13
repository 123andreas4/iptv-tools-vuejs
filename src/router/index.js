import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";

import AuthGuard from "./auth";
import ScrollBehavior from "./scroll";

Vue.use(VueRouter);

/*

  Vue Router

*/
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  ScrollBehavior,
});

/*

  Authenticator

*/
router.beforeEach(AuthGuard);

export default router;
