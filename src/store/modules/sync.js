import { httpService } from "../../services/http";

const state = {
  tmdbGenres: [],
  appXmltvSync: false,
  syncTMDB: false,
  syncPlaylist: false,
  movieSeriePlaylists: [],
  movieSeriePlaylist: null,
  catchUpGroups: [],
  catchUpGroup: null,
  catchUpDays: [],
  catchUpDay: null,
};

const getters = {
  tmdbGenres(state) {
    return state.tmdbGenres;
  },
  tmdbFilteredGenres(state) {
    return state.tmdbGenres.filter((genre) => {
      return [
        12, 14, 16, 18, 27, 28, 35, 36, 37, 53, 99, 878, 10749, 10762, 10759,
        80, 10751, 9648, 10763, 10765, 10767, 10768, 10752, 10402,
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
  movieSeriePlaylists(state) {
    return state.movieSeriePlaylists;
  },
  movieSeriePlaylist(state) {
    return state.movieSeriePlaylist;
  },
  catchUpGroups(state) {
    return state.catchUpGroups;
  },
  catchUpGroup(state) {
    return state.catchUpGroup;
  },
  catchUpDays(state) {
    return state.catchUpDays;
  },
  catchUpDay(state) {
    return state.catchUpDay;
  }
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
  setMovieSeriePlaylists(state, payload) {
    state.movieSeriePlaylists = payload;
  },
  setMovieSeriePlaylist(state, payload) {
    state.movieSeriePlaylist = payload;
  },
  setCatchUpGroups(state, payload) {
    state.catchUpGroups = payload;
  },
  setCatchUpGroup(state, payload) {
    state.catchUpGroup = payload;
  },
  setCatchUpDays(state, payload) {
    state.catchUpDays = payload;
  },
  setCatchUpDay(state, payload) {
    state.catchUpDay = payload;
  }
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
  loadMovieSeriePlaylists({ commit }, payload) {
    httpService.get("playlist").then((res) => {
      commit(
        "setMovieSeriePlaylists",
        res.data.map((playlist) => {
          return {
            text: playlist.name,
            value: playlist.id,
            playlist: playlist
          };
        })
      );
      if (
        payload &&
        payload === true &&
        res.data.length &&
        res.data.length > 0
      ) {
        commit("setMovieSeriePlaylist", res.data[0].id);
      }
    });
  },
  loadCatchUpGroups({ commit }, payload) {
    httpService.get(`group/catch-up/${payload}`).then((res) => {
      commit(
        "setCatchUpGroups",
        res.data.map((group) => {
          return {
            text: group.group_name,
            value: group.id,
          };
        })
      );
      if (
        res.data.length &&
        res.data.length > 0
      ) {
        commit("setCatchUpGroup", res.data[0].id);
      }
    });
  },
  loadCatchUpDays({ commit }, payload) {
    commit("setCatchUpDays", payload);
    if (payload.length > 0) {
      commit("setCatchUpDay", payload[0].value);
    }
  }
};

export default {
  state,
  getters,
  mutations,
  actions,
};
