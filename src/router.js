import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

import colors from "@/utils/colors";

Vue.use(Router);

let routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      // TODO: should the route have a meta 'hue', or have a meta colors object that includes the specific rgb values of menu, bg, etc...
      hue: undefined,
      menuItem: false
    }
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function() {
      return import(/* webpackChunkName: "about" */ "./views/About.vue");
    },
    meta: {
      hue: undefined,
      menuItem: true
    }
  },
  {
    path: "/contribute",
    name: "contribute",
    component: function() {
      return import("./views/Page.vue");
    },
    meta: {
      hue: undefined,
      menuItem: true
    }
  },
  {
    path: "/join-us",
    name: "join us",
    component: function() {
      return import("./views/Page.vue");
    },
    meta: {
      hue: undefined,
      menuItem: true
    }
  }
];

/**
 * Add equidistant hues along the active color space.
 */
// TODO: move to color class?
const colorSpace = colors.getColorSpace();
const whiteHueBuffer = 20; // Buffer to prevent white colors being selected
const hueInterval =
  (colorSpace.max[0] - colorSpace.min[0] - 2 * whiteHueBuffer) / routes.length;

let currentHue = whiteHueBuffer;
routes = routes.map(route => {
  route.meta.hue = currentHue;
  currentHue += hueInterval;
  return route;
});

export default new Router({
  mode: "history",
  // base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});
