import Vue from "vue";
import Vuex from "vuex";
import app from "./../App.vue";

import user from "./modules/user";
import menu from "./modules/menu";
import soundcloud from "./modules/soundcloud";
import sync from "./modules/sync";
import xdpro from "./modules/xdpro";

import { setCurrentLanguage } from "../helpers";
import { httpService } from "../services/http";

Vue.use(Vuex);

export default new Vuex.Store({
  mutations: {
    changeLang(payload) {
      app.$i18n.locale = payload;
      setCurrentLanguage(payload);
    },
  },
  actions: {
    setLang({ commit }, payload) {
      commit("changeLang", payload);
    },
    // eslint-disable-next-line no-unused-vars
    ipgeo({ commit }) {
      return new Promise((resolve, reject) => {
        httpService.ipgeo().then(
          (res) => {
            resolve(res);
          },
          (error) => {
            reject(error);
          }
        );
      });
    },
  },
  modules: {
    user,
    menu,
    soundcloud,
    sync,
    xdpro,
  },
});
