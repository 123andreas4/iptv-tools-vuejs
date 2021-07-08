<template>
  <erd-row class="h-100">
    <erd-col sm="12" md="10" lg="7" class="mx-auto my-auto pb-5">
      <erd-card class="depth-4 register">
        <div class="image-side">
          <div class="title">
            <h1>{{ $t("confirm.head") }}</h1>
            <h5>{{ $t("confirm.subtitle") }}</h5>
          </div>
          <transition name="fade">
            <erd-spinner
              variant="primary"
              v-if="processing"
              size="lg"
            ></erd-spinner>
          </transition>
        </div>
        <div class="form-side">
          <h1 class="title">{{ $t("confirm.title") }}</h1>
          <div class="form">
            <div class="px-4 text-center">
              <p>{{ $t("confirm.text") }}</p>
            </div>
            <div class="py-5 text-center">
              <erd-button
                variant="primary"
                @click="confirmEmail"
                v-if="!confirmed"
                :disabled="confirmDisabled"
                >{{ $t("confirm.submit") }}</erd-button
              >
              <erd-button
                variant="primary"
                @click="gotoLogin"
                v-if="confirmed"
                >{{ $t("login.submit") }}</erd-button
              >
              <p class="mt-5 font-weight-bold" v-if="confirmed">{{ $t("confirm.thank-you") }}</p>
              <p class="mt-5 font-weight-bold text-danger" v-if="error">{{ $t("confirm.error") }}</p>
            </div>
          </div>
        </div>
      </erd-card>
    </erd-col>
  </erd-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { httpService } from "../../services/http";

export default {
  data() {
    return {
      code: "",
      confirmed: false,
      error: false,
    };
  },
  computed: {
    ...mapGetters(["processing"]),
    confirmDisabled() {
      return this.code.length === 0;
    }
  },
  methods: {
    ...mapActions(["checkUsername", "register"]),
    confirmEmail() {
      this.error = false;
      httpService.post('users/confirm', { code: this.code })
      .then(res => {
        if (res.status === true && res.data === true) {
          this.code = "";
          this.confirmed = true;
        } else {
          this.code  = "";
          this.confirmed = true;
          this.error = true;
        }
      })
      .catch(() => {
        this.code  = "";
        this.confirmed = true;
        this.error = true;
      })
    },
    gotoLogin() {
      this.$router.replace({ path: "/user/login" });
    }
  },
  beforeMount() {
    if (this.$route.query && this.$route.query.code && this.$route.query.code.length) {
      this.code = this.$route.query.code;
    }
  }
};
</script>