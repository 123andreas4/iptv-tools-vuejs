import { httpService } from "../../services/http";

const state = {
  tmdbGenres: [],
  appXmltvSync: false,
  syncTMDB: false,
  syncPlaylist: false,
};

const getters = {
  tmdbGenres(state) {
    return state.tmdbGenres;
  },
  tmdbFilteredGenres(state) {
    return state.tmdbGenres.filter((genre) => {
      return [
        12,
        14,
        16,
        18,
        27,
        28,
        35,
        36,
        37,
        53,
        99,
        878,
        10749,
        10762,
        10759,
        80,
        10751,
        9648,
        10763,
        10765,
        10767,
        10768,
        10752,
        10402,
      ].includes(genre.id);
    });
  },
  syncTMDB(state) {
    return state.syncTMDB;
  },
  syncPlaylist(state) {
    return state.syncPlaylist;
  },
  appXmltvSync(state) {
    return state.appXmltvSync;
  },
};

const mutations = {
  setTMDBGenres(state, payload) {
    state.tmdbGenres = payload;
  },
  setSyncTMDB(state, payload) {
    state.syncTMDB = payload;
  },
  setSyncPlaylist(state, payload) {
    state.syncPlaylist = payload;
  },
  setAppXmltvSync(state, payload) {
    state.appXmltvSync = payload;
  },
};

const actions = {
  updateTMDBGenres({ commit }, payload) {
    httpService
      .get(`tmdb/genres/${payload.source}/${payload.language}`)
      .then((res) => {
        if (res.data && res.data !== null && res.data.length) {
          commit("setTMDBGenres", res.data);
        }
      });
  },
  getSyncTMDB({ commit }) {
    httpService.get("playlist/synchronize-tmdb").then((res) => {
      commit("setSyncTMDB", res.data);
    });
  },
  getSyncPlaylist({ commit }) {
    httpService.get("playlist/synchronize").then((res) => {
      commit("setSyncPlaylist", res.data);
    });
  },
  getAppXmltvSync({ commit }) {
    httpService.get("administration/xmltv-sync").then((res) => {
      commit("setAppXmltvSync", res.data);
    });
  },
  synchronizeTMDB({ commit }, payload) {
    httpService
      .post("playlist/synchronize-tmdb", {
        id: payload,
      })
      .then((res) => {
        commit("setSyncTMDB", res.data);
      });
  },
  synchronizePlaylist({ commit }, payload) {
    httpService
      .post("playlist/synchronize", {
        id: payload,
      })
      .then((res) => {
        commit("setSyncPlaylist", res.data);
      });
  },
  syncXmltv({ commit }, payload) {
    httpService
      .post("administration/xmltv/sync", {
        id: payload,
      })
      .then((res) => {
        commit("setAppXmltvSync", res.data);
      });
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
