<template>
  <footer class="page-footer">
    <div class="footer-content">
      <div class="row">
        <div class="col-12 col-sm-6">
          <p class="mb-0 text-muted">
            {{ $t("footer.copyright") }} {{ new Date().getFullYear() }}
          </p>
        </div>
        <div class="col-sm-6 d-none d-sm-block">
          <erd-breadcrumb
            :items="breadcrumb"
            class="float-right"
          ></erd-breadcrumb>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  computed: {
    breadcrumb() {
      let res = [];
      this.$route.matched.map((item) => {
        res.push({
          text: this.$t(`menu.${item.name.toLowerCase()}`),
          to: item.path !== "" ? item.path : "/",
        });
      });
      return res;
    },
  },
};
</script>
