import Vue from "vue";
import Vuex from "vuex";
import { routes } from "@/router/routes";

const getRouteComponentName = (routeName) => {
  const findRouteInRoutes = (routeName, routes) => {
    let foundRoute = undefined;

    for (let route of routes) {
      if (route.name === routeName) {
        return route;
      } else if (route.children) {
        foundRoute = findRouteInRoutes(routeName, route.children);
      }
    }

    return foundRoute;
  };

  const foundRoute = findRouteInRoutes(routeName, routes);

  if (!foundRoute) throw new Error("Invalid route name.");

  return foundRoute.componentName;
};

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    routeData: {},
    api: undefined,
    nextRoute: undefined,
    isLoading: false,
    initialLoad: true,
    pageLoadingError: false,
    generalError: false
  },
  mutations: {
    ADD_ROUTE_DATA: (state, { routePath, data }) => {
      Vue.set(state.routeData, routePath, data);
    },
    SET_API: (state, payload) => (state.api = payload),
    SET_NEXT_ROUTE: (state, payload) => (state.nextRoute = payload),
    SET_LOADING: (state, payload) => (state.isLoading = payload),
    SET_INITIAL_LOAD: (state, payload) => (state.initialLoad = payload),
    SET_PAGE_LOADING_ERROR: (state, payload) =>
      (state.pageLoadingError = payload),
    SET_GENERAL_ERROR: (state, payload) => (state.generalError = payload)
  },
  actions: {
    resetErrors({ commit }) {
      commit("SET_PAGE_LOADING_ERROR", false);
      commit("SET_GENERAL_ERROR", false);
    },
    setNextRoute: ({ commit }, nextRoute) => {
      commit("SET_NEXT_ROUTE", nextRoute);
    },
    initPreloadedData: async ({ state, commit, dispatch }) => {
      const preloadedJsonScriptEl = document.getElementById(
        "preloaded-store-json"
      );
      let preloadedJsonString;
      if (preloadedJsonScriptEl) {
        preloadedJsonString = preloadedJsonScriptEl.innerHTML;
      }

      const path = state.nextRoute.path || state.route.path; // TODO: make as getter, make DRY

      if (preloadedJsonString) {
        dispatch("addRouteData", {
          data: JSON.parse(preloadedJsonString),
          path
        });
      } else {
        await dispatch("fetchRouteData");
      }
    },
    setApi: ({ state, commit }, api) => {
      commit("SET_API", api);
    },
    fetchRouteData: async ({ state, commit, dispatch }) => {
      const { path, name } = state.nextRoute;
      let data = state.routeData[path];
      if (data) {
        return data;
      }

      commit("SET_LOADING", true);

      try {
        data = await dispatch("fetch" + getRouteComponentName(name));
      } catch (err) {
        if (err.message.includes("fetch")) {
          commit("SET_PAGE_LOADING_ERROR", true);
        } else {
          commit("SET_GENERAL_ERROR", true);
        }

        commit("SET_LOADING", false);
        throw err;
      }
      const routePath = path || state.route.path;
      dispatch("addRouteData", { data, path: routePath });

      commit("SET_LOADING", false);

      if (state.route.name !== null && state.initialLoad) {
        commit("SET_INITIAL_LOAD", false);
      }

      return data;
    },
    addRouteData: ({ state, commit }, { data, path }) => {
      const currentRoute = path;
      if (state.routeData[currentRoute]) {
        console.warn("Route data already initialized for: " + path);
      }

      commit("ADD_ROUTE_DATA", { routePath: currentRoute, data });
    },
    fetchHome: async ({ state, commit }) => {
      let issue = await state.api.fetchCurrentIssue({ includeEssays: true });
      return { issue };
    },
    fetchPage: async ({ state, commit }) => {
      const slugs = state.nextRoute.path.split("/").filter(el => el.length > 0);
      const parentSlug = slugs[0];

      const pageDoc = await state.api.fetchPageBySlug(parentSlug);
      return pageDoc.data;
    },
    fetchIssue: async ({ state, commit }) => {
      let issue = await state.api.fetchIssueBySlug(
        state.nextRoute.params.issueSlug,
        { includeEssays: true }
      );

      return issue;
    },
    fetchIssues: async ({ state, commit }) => {
      const issues = await state.api.fetchAllIssues();
      return issues;
    },
    fetchEssay: async ({ state, commit }) => {
      const { issueSlug, essaySlug } = state.nextRoute.params;
      let essayDoc = await state.api.fetchEssayBySlugs(issueSlug, essaySlug);

      return essayDoc.data;
    },
    fetchComingSoon: ({ state, commit }) => null,
    fetchNotFound: ({ state, commit }) => null
  },
  getters: {
    currentRouteData: state => state.routeData[state.route.path] // state.nextRoute.path
  }
});
