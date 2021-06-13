/*

    User State

*/

import {
  getCurrentUser,
  setCurrentUser,
  getUserSettings,
  setUserSettings,
} from "../../helpers";
import { userService } from "../../services/http";
import router from "../../router";

export default {
  state: {
    currentUser: getCurrentUser(),
    loginError: null,
    processing: false,
    forgotPasswordSuccess: null,
    resetPasswordSuccess: null,
    alerts: [],
    settings: getUserSettings(),
  },
  getters: {
    currentUser: (state) => state.currentUser,
    processing: (state) => state.processing,
    loginError: (state) => state.loginError,
    forgotPasswordSuccess: (state) => state.forgotPasswordSuccess,
    resetPasswordSuccess: (state) => state.resetPasswordSuccess,
    alerts: (state) => state.alerts,
    settings: (state) => state.settings,
  },
  mutations: {
    setSettings(state, payload) {
      setUserSettings(payload);
      state.settings = payload;
    },
    setUser(state, payload) {
      state.currentUser = payload;
      setCurrentUser(payload);
      state.processing = false;
      state.loginError = null;
    },
    setLogout(state) {
      state.currentUser = null;
      state.processing = false;
      state.loginError = null;
      setCurrentUser(null);
    },
    setProcessing(state, payload) {
      state.processing = payload;
      state.loginError = null;
    },
    setError(state, payload) {
      state.loginError = payload;
      state.currentUser = null;
      state.processing = false;
    },
    setForgotPasswordSuccess(state) {
      state.loginError = null;
      state.currentUser = null;
      state.processing = false;
      state.forgotPasswordSuccess = true;
    },
    setResetPasswordSuccess(state) {
      state.loginError = null;
      state.currentUser = null;
      state.processing = false;
      state.resetPasswordSuccess = true;
    },
    clearError(state) {
      state.loginError = null;
    },
    setAlerts(state, payload) {
      state.alerts = payload;
    },
    setProfile(state, payload) {
      state.currentUser.profile = payload;
    },
    setSubscription(state, payload) {
      state.currentUser.subscription = payload;
    },
  },
  actions: {
    login({ commit }, payload) {
      commit("clearError");
      commit("setProcessing", true);
      return new Promise((resolve, reject) => {
        userService.login(payload.username, payload.password).then(
          (user) => {
            commit("setProcessing", false);
            if (user.data === false) {
              commit("setError", "Invalid username or password!");
              reject("Invalid username or password!");
              setTimeout(() => {
                commit("clearError");
              }, 3000);
            } else {
              commit("setUser", user.data);
              resolve(user.data);
            }
          },
          (error) => {
            commit("setProcessing", false);
            reject("Invalid username or password!");
            commit("setError", error.message);
            setTimeout(() => {
              commit("clearError");
            }, 3000);
          }
        );
      });
    },
    logout({ commit }) {
      router.replace("/user/login");
      userService.logout();
      commit("setLogout");
    },
    forgotPassword({ commit }, payload) {
      commit("clearError");
      commit("setProcessing", true);
      userService.forgotPassword(payload.username, payload.email).then(
        () => {
          commit("clearError");
          commit("setForgotPasswordSuccess");
        },
        (error) => {
          commit("setError", error.message);
          setTimeout(() => {
            commit("clearError");
          }, 3000);
        }
      );
    },
    resetPassword({ commit }, payload) {
      commit("clearError");
      commit("setProcessing", true);
      userService
        .resetPassword(payload.username, payload.code, payload.password)
        .then(
          () => {
            commit("clearError");
            commit("setResetPasswordSuccess");
          },
          (error) => {
            commit("setError", error.message);
            setTimeout(() => {
              commit("clearError");
            }, 3000);
          }
        );
    },
    register({ commit }, payload) {
      commit("setProcessing", true);
      return new Promise((resolve, reject) => {
        userService.register(payload).then(
          (user) => {
            commit("setProcessing", false);
            resolve(user);
          },
          (error) => {
            reject(error);
            commit("setProcessing", false);
            commit("setError", error.message);
            setTimeout(() => {
              commit("clearError");
            }, 3000);
          }
        );
      });
    },
    // eslint-disable-next-line no-empty-pattern
    checkUsername({}, payload) {
      return new Promise((resolve, reject) => {
        userService.checkUsername(payload).then(
          (res) => {
            resolve(res);
          },
          (error) => {
            reject(error);
          }
        );
      });
    },
    updateProfile({ commit }, payload) {
      commit("setProfile", payload);
    },
    updateSubscription({ commit }, payload) {
      commit("setSubscription", payload);
    },
    addAlert({ commit, state }, payload) {
      let alerts = [...state.alerts];
      alerts.unshift({
        icon: payload.icon,
        to: payload.to,
        text: payload.text,
        date: new Date(),
      });
      commit("setAlerts", alerts);
    },
    deleteAlert({ commit, state }, payload) {
      let alerts = [...state.alerts];
      alerts.splice(payload, 1);
      commit("setAlerts", alerts);
    },
  },
};
