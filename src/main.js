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

const unsync = sync(store, router);

Vue.config.productionTip = false;

Vue.component("Paper", Paper);

Vue.use(VueMeta, {
  keyName: "meta",
  refreshOnceOnNavigation: true
});

Vue.filter("prismicRawText", function (arr) {
  return PrismicProcessor.getRawText(arr);
});

API.init().then(() => {
  Vue.prototype.$api = API;
  store.dispatch("setApi", API);

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
    mounted() {
      // You'll need this for renderAfterDocumentEvent.
      document.dispatchEvent(new Event("render-event"));
      console.log("render event");
    },
    meta() {
      return MetadataManager.metaDefault(this.metadata, "website", {
        titleTemplate: false
      });
    }
  }).$mount("#app");
});
