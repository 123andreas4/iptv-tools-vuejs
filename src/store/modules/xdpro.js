/* eslint-disable */
import { httpService } from "../../services/http";

const state = {
  xdProInstances: [],
};

const getters = {
  xdProInstances(state) {
    return state.xdProInstances;
  },
};

const mutations = {
  setxdProInstances(state, payload) {
    state.xdProInstances = payload;
  },
};

const actions = {
  loadxdProInstances({ commit }) {
    httpService
    .get("xd-pro/instances")
    .then((res) => {
      if (res.data && res.data !== null) {
        commit("setxdProInstances", res.data);
      } else {
        commit("setxdProInstances", []);
      }
    })
    .catch(() => {
      commit("setxdProInstances", []);
    });
  },
  addxdProDownload({ commit }, payload) {
    if (Array.isArray(payload)) {
      return httpService.post("xd-pro/download", payload);
    } else {
      return httpService.post("xd-pro/download", [payload]);
    }
  }
};

export default {
  state,
  getters,
  mutations,
  actions,
};
