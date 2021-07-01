<template>
  <div class="homepage">
    <slot></slot>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss">
.homepage {
  margin-top: $navbar-height;

  @include respond-below(xl) {
    margin-top: $navbar-height-lg;
  }

  @include respond-below(lg) {
    margin-top: $navbar-height-md;
  }

  @include respond-below(sm) {
    margin-top: $navbar-height-xs;
  }
}
</style>
