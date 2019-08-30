import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      // TODO: should the route have a meta 'hue', or have a meta colors object that includes the specific rgb values of menu, bg, etc...
      hue: 300
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
      hue: 200
    }
  },
  {
    path: "/test",
    name: "test",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function() {
      return import(/* webpackChunkName: "about" */ "./views/Test.vue");
    },
    meta: {
      hue: 100
    }
  }
];

export default new Router({
  mode: "history",
  // base: process.env.BASE_URL,
  routes
});
