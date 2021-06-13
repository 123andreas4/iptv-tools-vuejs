<template>
  <div class="not-authorized-page">
    <div class="page-center">
      <p class="text-404">404</p>
      <i class="las la-dizzy la-10x"></i>
      <p class="text-message">{{ $t("general.404-message") }}</p>
      <erd-button @click="$router.replace('/app')">{{
        $t("general.back-to-home")
      }}</erd-button>
    </div>
  </div>
</template>

<style lang="scss">
body {
  padding-bottom: 0;
}

.not-authorized-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: $theme-color-3;
}

.page-center {
  color: $button-text-color;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -70%);
  text-align: center;
}

.text-404 {
  font-size: 120px;
  padding-bottom: 0;
  margin-bottom: 4rem;
}

.text-message {
  font-size: 32px;
}
</style>
