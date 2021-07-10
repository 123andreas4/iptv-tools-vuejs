<template>
  <erd-row class="h-100">
    <erd-col sm="12" md="10" lg="7" class="mx-auto my-auto pb-5">
      <erd-card class="depth-4 register">
        <div class="image-side">
          <div class="title">
            <h1>{{ $t("register.head") }}</h1>
            <h5>{{ $t("register.subtitle") }}</h5>
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
          <h1 class="title">{{ $t("register.title") }}</h1>
          <div class="form">
            <div class="pb-2">
              <label for="username">{{ $t("register.username") }}</label>
              <erd-input
                id="username"
                :placeholder="$t('register.username')"
                v-model="username"
              ></erd-input>
              <div
                class="pt-1 color-theme-2 text-center"
                v-if="error.username.visible"
              >
                {{ error.username.message }}
              </div>
            </div>
            <div class="pb-2">
              <label for="password">{{ $t("register.password") }}</label>
              <erd-input
                id="password"
                :placeholder="$t('register.password')"
                type="password"
                v-model="password"
              ></erd-input>
              <div
                class="pt-1 color-theme-2 text-center"
                v-if="error.password.visible"
              >
                {{ error.password.message }}
              </div>
            </div>
            <div class="pb-2">
              <label for="confirm">{{ $t("register.confirm") }}</label>
              <erd-input
                id="confirm"
                :placeholder="$t('register.confirm')"
                type="password"
                v-model="confirm"
              ></erd-input>
              <div
                class="pt-1 color-theme-2 text-center"
                v-if="error.confirm.visible"
              >
                {{ error.confirm.message }}
              </div>
            </div>
            <div class="pb-3">
              <label for="email">{{ $t("register.email") }}</label>
              <erd-input
                id="email"
                :placeholder="$t('register.email')"
                v-model="email"
              ></erd-input>
              <div
                class="pt-1 color-theme-2 text-center"
                v-if="error.email.visible"
              >
                {{ error.email.message }}
              </div>
            </div>
            <div class="pb-5">
              <erd-checkbox v-model="accept" class="mb-2">{{
                $t("register.accept")
              }}</erd-checkbox>
              <erd-button
                variant="primary"
                @click="registerClick"
                :disabled="registerDisabled"
                >{{ $t("register.submit") }}</erd-button
              >
            </div>
            <div class="pb-2">
              <router-link to="/user/login">{{
                $t("register.login")
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

export default {
  data() {
    return {
      username: "",
      password: "",
      confirm: "",
      email: "",
      accept: false,
      error: {
        username: {
          visible: false,
          message: "",
        },
        password: {
          visible: false,
          message: "",
        },
        confirm: {
          visible: false,
          message: "",
        },
        email: {
          visible: false,
          message: "",
        }
      },
    };
  },
  computed: {
    ...mapGetters(["processing"]),
    formIsValid() {
      return (
        this.error.username.visible === false &&
        this.error.password.visible === false &&
        this.error.confirm.visible === false &&
        this.error.email.visible === false
      );
    },
    registerDisabled() {
      return (
        this.accept !== true ||
        this.username.length === 0 ||
        this.password.length === 0 ||
        this.confirm.length === 0 ||
        this.email.length === 0
      );
    },
  },
  methods: {
    ...mapActions(["checkUsername", "register"]),
    validateUsername() {
      if (this.username.test(/^[a-zA-Z0-9_]{5,20}[a-zA-Z]+[0-9]*$/)) {
        this.error.username.visible = false;
        this.error.username.message = "";
      } else {
        this.error.username.visible = true;
        this.error.username.message = this.$t("register.username-error");
      }
    },
    validatePassword() {
      if (
        this.password.test(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{6,30}$/
        )
      ) {
        this.error.password.visible = false;
        this.error.password.message = "";
      } else {
        this.error.password.visible = true;
        this.error.password.message = this.$t("register.password-error");
      }
    },
    validateConfirm() {
      if (!this.confirm.localeCompare(this.password)) {
        this.error.confirm.visible = false;
        this.error.confirm.message = "";
      } else {
        this.error.confirm.visible = false;
        this.error.confirm.message = this.$t("register.confirm-error");
      }
    },
    validateEmail() {
      if (
        this.email.test(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
      ) {
        this.error.email.visible = false;
        this.error.email.message = "";
      } else {
        this.error.email.visible = true;
        this.error.email.message = this.$t("register.email-error");
      }
    },
    registerClick() {
      this.validateUsername();
      this.validatePassword();
      this.validateConfirm();
      this.validateEmail();
      if (this.formIsValid) {
        this.checkUsername(this.username)
          .then((res) => {
            if (res.data.available === false) {
              this.error.username.visible = true;
              this.error.username.message = this.$t("register.username-taken");
            } else {
              this.register({
                username: this.username,
                password: this.password,
                email: this.email,
              })
                .then((res) => {
                  if (res.status === true && res.data === true) {
                    this.$notify(
                      "primary",
                      this.$t("register.success-title"),
                      this.$t("register.success-message"),
                      "la-sign-in-alt",
                      { duration: 5000, permanent: false }
                    );
                    this.$router.push("/user/login");
                  } else {
                    this.error.username.visible = true;
                    this.error.username.message = this.$t(
                      "register.error-message"
                    );
                  }
                })
                .catch((error) => {
                  console.log(error);
                  this.error.username.visible = true;
                  this.error.username.message = this.$t(
                    "register.error-message"
                  );
                });
            }
          })
          .catch((error) => {
            console.error(error);
            this.error.username.visible = true;
            this.error.username.message = this.$t("register.error-message");
          });
      }
    },
  },
};
</script>
