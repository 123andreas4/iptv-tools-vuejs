<template>
  <erd-row class="h-100">
    <erd-col sm="12" md="10" lg="7" class="mx-auto my-auto pb-5">
      <erd-card class="depth-4 login">
        <div class="image-side">
          <div class="title">
            <h1>{{ $t("login.head") }}</h1>
            <h5>{{ $t("login.subtitle") }}</h5>
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
          <h1 class="title">Login</h1>
          <div class="form">
            <div class="pb-2">
              <label for="username">{{ $t("login.username") }}</label>
              <erd-input
                id="username"
                :placeholder="$t('login.username')"
                v-model="username"
              ></erd-input>
            </div>
            <div class="pb-2">
              <label for="password">{{ $t("login.password") }}</label>
              <erd-input
                id="password"
                :placeholder="$t('login.password')"
                type="password"
                v-model="password"
              ></erd-input>
              <div class="pt-2 pb-2">
                <router-link to="/user/reset-password">{{ $t("login.forgot") }}</router-link>
              </div>
            </div>
            <div class="pb-1">
              <erd-checkbox v-model="remember">{{
                $t("login.remember")
              }}</erd-checkbox>
            </div>
            <div class="pb-5">
              <erd-button
                variant="primary"
                @click="loginClick"
                :disabled="loginDisabled"
                >{{ $t("login.submit") }}</erd-button
              >
            </div>
            <div class="pb-2">
              <router-link to="/user/register">{{
                $t("login.register")
              }}</router-link>
            </div>
          </div>
        </div>
      </erd-card>
    </erd-col>
  </erd-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { AppRoot } from "../../constants/config";

export default {
  data() {
    return {
      username: "",
      password: "",
      remember: false,
    };
  },
  computed: {
    ...mapGetters(["processing"]),
    loginDisabled() {
      return this.username.length <= 3 || this.password.length <= 3;
    },
  },
  methods: {
    ...mapActions(["login"]),
    loginClick() {
      this.login({
        username: this.username,
        password: this.password,
      })
        .then(() => {
          if (this.remember === true) {
            localStorage.setItem(
              "remember",
              JSON.stringify({
                username: this.username,
                password: this.password,
                remember: this.remember,
              })
            );
          } else if (localStorage.getItem("remember") !== null) {
            localStorage.removeItem("remember");
          }
          this.$router.push(AppRoot);
        })
        .catch(() => {
          this.$notify(
            "error",
            this.$t("login.invalid-title"),
            this.$t("login.invalid-message"),
            "la-sign-in-alt",
            { duration: 5000, permanent: false }
          );
        });
    },
  },
  mounted() {
    let r = localStorage.getItem("remember");
    if (r !== null) {
      let login = JSON.parse(r);
      this.username = login.username;
      this.password = login.password;
      this.remember = login.remember;
    }
  },
};
</script>
