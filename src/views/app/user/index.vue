<template>
  <erd-row>
    <erd-breadcrumb :items="breadcrumb" :heading="heading"></erd-breadcrumb>
    <div class="seperator page"></div>
    <router-view class="px-0 mt-0"></router-view>
  </erd-row>
</template>

<script>
/* eslint-disable */
export default {
  computed: {
    breadcrumb () {
      let res = [];
      this.$route.matched.map(item => {
        res.push({
          text: this.$t(`menu.${item.name.toLowerCase()}`),
          to: item.path !== '' ? item.path : '/'
        })
      });
      return res;
    },
    heading () {
      let br = this.breadcrumb;
      return br[br.length -1].text;
    }
  }
};
</script>

<style scoped>
.seperator.page {
  margin-left: 15px;
  margin-right: 15px;
  width: calc(100% - 30px);
}
</style>