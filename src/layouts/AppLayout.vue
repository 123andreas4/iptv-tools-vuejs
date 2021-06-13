<template>
  <div id="app-container" :class="getMenuType">
    <nav-bar></nav-bar>
    <side-bar></side-bar>
    <main>
      <div class="container-fluid">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script>
import NavBar from "../components/App/NavBar";
import SideBar from "../components/App/SideBar";
import AppFooter from "../components/App/Footer";

import { mapGetters } from "vuex";

export default {
  components: {
    "nav-bar": NavBar,
    "side-bar": SideBar,
    // eslint-disable-next-line vue/no-unused-components
    "app-footer": AppFooter,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      getMenuType: "getMenuType",
    }),
  },
  mounted() {
    setTimeout(() => {
      document.body.classList.add("default-transition");
    }, 100);
  },
};
</script>

<style>
#app-container {
}
</style>
