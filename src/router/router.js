import Vue from "vue";
import Router from "vue-router";

import _ from "lodash";
import colors from "@/utils/colors";

import Home from "./../views/Home.vue";
import About from "./../views/About.vue";
import Page from "./../views/Page.vue";
import Issues from "./../views/Issues.vue";
import Issue from "./../views/Issue.vue";
import Essay from "./../views/Essay.vue";
import NotFound from "./../views/NotFound.vue";
import ComingSoon from "./../views/ComingSoon.vue";

const views = [Home, About, Page, Issues, Issue, Essay, NotFound, ComingSoon];

import { routes } from "./routes";

Vue.use(Router);

// Add a unique perceptually uniform color to each route.
let hues = colors.getEquidistantHues(routes.length);
hues = _.shuffle(hues);
const updatedRoutes = routes.map((route, index) => {
  let routeView = views.find(
    view => view.name.toLowerCase() === route.componentName.toLowerCase()
  );

  if (!routeView) {
    throw new Error(
      "View does not exist. Requested view: '" + route.componentName + "'"
    );
  }

  route.component = routeView;
  route.meta.hue = hues[index];
  return route;
});

let router = new Router({
  mode: "history",
  routes: updatedRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});

// Preset routing methods
router.presets = {
  docNotFound: (path) => {
    router.replace({ name: "not found", params: { brokenPath: path } });
  }
};

export default router;
