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
    api: undefined
  },
  mutations: {
    ADD_ROUTE_DATA: (state, { routePath, data }) =>
      Vue.set(state.routeData, routePath, data),
    SET_API: (state, payload) => (state.api = payload)
  },
  actions: {
    initPreloadedData: ({ state, commit, dispatch }, data) => {
      if (data) {
        dispatch("addRouteData", data);
      }
    },
    setApi: ({ state, commit }, api) => {
      commit("SET_API", api);
    },
    fetchRouteData: async ({ state, commit, dispatch }) => {
      const { name } = state.route;
      const data = await dispatch("fetch" + [getRouteComponentName(name)]);
      dispatch("addRouteData", data);
    },
    addRouteData: ({ state, commit }, data) => {
      const currentRoute = state.route.path;
      if (state.routeData[currentRoute]) {
        throw new Warning("Route data already initialized.");
      }

      commit("ADD_ROUTE_DATA", { routePath: currentRoute, data });
    },
    fetchHome: async ({ state, commit }) => {
      // TODO: add all home data fetches
      let issue = await state.api.fetchCurrentIssue();

      let essayRequests = [];
      essayRequests = issue.data.essays.map(({ essay }) =>
        state.api.getById(essay.id, {
          fetchLinks: ["category.name", "category.list_position"]
        })
      );
      issue.essays = await Promise.all(essayRequests);

      return issue;
    },
    fetchPage: async ({ state, commit }) => {
      const slugs = state.route.path.split("/").filter(el => el.length > 0);
      const parentSlug = slugs[0];

      const page = await state.api.fetchPageBySlug(parentSlug);

      return page;
    },
    fetchIssue: async ({ state, commit }) => {
      const issue = await state.api.fetchIssueBySlug(
        state.route.params.issueSlug
      );

      return issue;
    },
    fetchIssues: async ({ state, commit }) => {
      const issues = await state.api.fetchAllIssues();
      return issues;
    },
    fetchEssay: async ({ state, commit }) => {
      const { issueSlug, essaySlug } = state.route.params;
      let essay = await state.api.fetchEssayBySlugs(issueSlug, essaySlug);

      return essay;
    },
    fetchComingSoon: ({ state, commit }) => null,
    fetchNotFound: ({ state, commit }) => null
  },
  getters: {
    currentRouteData: state => state.routeData[state.route.path]
  }
});
