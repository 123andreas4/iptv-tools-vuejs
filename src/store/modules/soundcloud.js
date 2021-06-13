import { httpService } from "../../services/http";

const state = {
  soundcloudClientId: null,
  soundcloudClientIdError: false,
};

const getters = {
  soundcloudClientId(state) {
    return state.soundcloudClientId;
  },
  soundcloudClientIdError(state) {
    return state.soundcloudClientIdError;
  },
};

const mutations = {
  setSoundcloudClientId(state, payload) {
    state.soundcloudClientId = payload;
  },
  setSoundcloudClientIdError(state, payload) {
    state.soundcloudClientIdError = payload;
  },
};

const actions = {
  updateSoundcloudId({ commit }) {
    httpService
      .get("editor/soundcloud-client-id")
      .then((res) => {
        if (res.data && res.data !== null && res.data.length) {
          commit("setSoundcloudClientId", res.data);
          commit("setSoundcloudClientIdError", false);
        } else {
          commit("setSoundcloudClientId", null);
          commit(
            "setSoundcloudClientIdError",
            "No soundcloud client-id from server!"
          );
        }
      })
      .catch(() => {
        commit("setSoundcloudClientId", null);
        commit(
          "setSoundcloudClientIdError",
          "Failed getting soundcloud client-id from server!"
        );
      });
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
