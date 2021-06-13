<template>
  <user-layout>
    <router-view></router-view>
  </user-layout>
</template>

<script>
import UserLayout from "../../layouts/UserLayout";
import { mapGetters } from "vuex";

export default {
  components: {
    "user-layout": UserLayout,
  },
  computed: {
    ...mapGetters(["currentUser"]),
  },
};
</script>
