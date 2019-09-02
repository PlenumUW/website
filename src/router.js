import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

import _ from "lodash";
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
  },
  {
    path: "/journals",
    name: "journals",
    component: function() {
      return import("./views/Page.vue");
    },
    meta: {
      hue: undefined,
      menuItem: true
    }
  },
  {
    path: "/journal/:journalId",
    name: "journal",
    component: function() {
      return import("./views/Page.vue");
    },
    meta: {
      hue: undefined,
      menuItem: false
    },
    children: [
      {
        path: ":articleSlug",
        name: "article",
        component: function() {
          return import("./views/Page.vue");
        }
      }
    ]
  },
  {
    path: "/atlas",
    name: "atlas",
    component: function() {
      return import("./views/Page.vue");
    },
    meta: {
      hue: undefined,
      menuItem: false
    },
    children: [
      {
        path: ":projectSlug",
        name: "project",
        component: function() {
          return import("./views/Page.vue");
        }
      }
    ]
  },
  {
    path: "/not-found",
    name: "not found",
    component: function() {
      return import("./views/Page.vue");
    },
    meta: {
      hue: undefined,
      menuItem: false
    }
  }
];

let hues = colors.getEquidistantHues(routes.length);
hues = _.shuffle(hues);
routes = routes.map((route, index) => {
  route.meta.hue = hues[index];
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
