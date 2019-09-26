import Vue from "vue";
import App from "./App.vue";
import router from "./router/router";
import store from "./store";
import { sync } from "vuex-router-sync";

import VueMeta from "vue-meta";

import API from "@/utils/API.js";
import MetadataManager from "@/utils/MetadataManager";
import PrismicProcessor from "@/utils/PrismicProcessor";

import Paper from "@/components/Paper";

const unsyncRouterWithStore = sync(store, router);

Vue.config.productionTip = false;

Vue.component("Paper", Paper);

Vue.use(VueMeta, {
  keyName: "meta",
  refreshOnceOnNavigation: true
});

Vue.filter("prismicRawText", function (arr) {
  return PrismicProcessor.getRawText(arr);
});

const DEBUG = true;

API.init().then(() => {
  Vue.prototype.$api = API;
  store.dispatch("setApi", API);

  // Fetch data associated with next route
  router.beforeEach(async (to, from, next) => {
    // Navigation resolution is finished BEFORE the view transition initiates
    store.dispatch("setNextRoute", to);
    if (from.name === null) {
      // If first visit to site
      // Load static page's embedded data
      await store.dispatch("initPreloadedData");
      if (DEBUG) console.log("dispatch init preloaded data");
    } else {
      if (DEBUG) console.log("dispatch fetch route data");
      await store.dispatch("fetchRouteData");
    }

    next();
  });

  new Vue({
    router,
    store,
    render: function (h) {
      return h(App);
    },
    data: function () {
      return {
        metadata: undefined
      };
    },
    async created() {
      const rawMeta = await this.$api.fetchSiteMetadata();
      const { title, description, image } = rawMeta;

      this.metadata = {
        description: PrismicProcessor.getRawText(description),
        title: PrismicProcessor.getRawText(title),
        image,
        meta: MetadataManager.getTwitterMetadata(true, true)
      };
    },
    meta() {
      return MetadataManager.metaDefault(this.metadata, {}, "website", {
        titleTemplate: false
      });
    }
  }).$mount("#app", true);
});
