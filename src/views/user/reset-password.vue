<template>
  <erd-row class="h-100">
    <erd-col sm="12" md="10" lg="7" class="mx-auto my-auto pb-5">
      <erd-card class="depth-4 register">
        <div class="image-side">
          <div class="title">
            <h1>{{ $t("reset.head") }}</h1>
            <h5>{{ $t("reset.subtitle") }}</h5>
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
          <h1 class="title">{{ $t("reset.title") }}</h1>
          <div class="form">
            <div class="px-4 text-center">
              <p>{{ $t("reset.text") }}</p>
            </div>
            <div class="pb-2">
              <label for="email">{{ $t("register.email") }}</label>
              <erd-input
                id="email"
                :placeholder="$t('register.email')"
                v-model="email"
              ></erd-input>
            </div>
            <div class="pb-2">
              <label for="username">{{ $t("register.username") }}</label>
              <erd-input
                id="username"
                :placeholder="$t('register.username')"
                v-model="username"
              ></erd-input>
            </div>
            <div class="py-5 text-center">
              <erd-button
                variant="primary"
                @click="resetPassword"
                :disabled="!validEmail || !validUsername"
                >{{ $t("reset.reset") }}</erd-button
              >
              <p class="mt-5 font-weight-bold" v-if="reset === true">{{ $t("reset.thank-you") }}</p>
              <p class="mt-5 font-weight-bold text-danger" v-if="error === true">{{ $t("reset.error") }}</p>
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
      email: "",
      username: "",
      reset: false,
      error: false,
    };
  },
  computed: {
    ...mapGetters(["processing"]),
    validEmail() {
      return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.email);
    },
    validUsername() {
      return /^[a-zA-Z0-9_]{5,20}[a-zA-Z]+[0-9]*$/.test(this.username);
    }
  },
  methods: {
    ...mapActions(["checkUsername", "register"]),
    resetPassword() {
      this.error = false;
      httpService.post('users/reset', { username: this.username, email: this.email })
      .then(res => {
        if (res.status === true && res.data === true) {
          this.reset = true;
        } else {
          this.reset = true;
          this.error = true;
        }
      })
      .catch(() => {
        this.reset = true;
        this.error = true;
      })
    },
    gotoLogin() {
      this.$router.replace({ path: "/user/login" });
    }
  }
};
</script>