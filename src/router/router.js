import Vue from "vue";
import Router from "vue-router";

import _ from "lodash";
import colors from "@/utils/colors";

import Home from "./../views/Home.vue";
import About from "./../views/About.vue";
import Page from "./../views/Page.vue";
import Issues from "./../views/Issues.vue";
import Issue from "./../views/Issue.vue";
import Article from "./../views/Article.vue";

const views = [Home, About, Page, Issues, Issue, Article];

import { routes } from "./routes";

Vue.use(Router);

let hues = colors.getEquidistantHues(routes.length);
hues = _.shuffle(hues);
const updatedRoutes = routes.map((route, index) => {
  let routeView = views.find(
    view => view.name.toLowerCase() === route.componentName
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

export default new Router({
  mode: "history",
  // base: process.env.BASE_URL,
  routes: updatedRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});
