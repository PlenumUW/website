import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    test: false
  },
  mutations: {
    SET_TEST: (state, payload) => (state.test = payload)
  },
  actions: {
    toggleTest: ({ state, commit }) => {
      commit("SET_TEST", !state.test);
    }
  }
});
