import Vue from "vue";
import App from "./App.vue";
import router from "./router/router";
import store from "./store";

import VueMeta from "vue-meta";

import API from "@/utils/API.js";
import MetadataManager from "@/utils/MetadataManager";
import PrismicProcessor from "@/utils/PrismicProcessor";

import Paper from "@/components/Paper";

Vue.config.productionTip = false;

Vue.component("Paper", Paper);

Vue.use(VueMeta, {
  keyName: "meta",
  refreshOnceOnNavigation: true
});

API.init().then(() => {
  Vue.prototype.$api = API;

  new Vue({
    router,
    store,
    render: function(h) {
      return h(App);
    },
    data: function() {
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
        image
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
