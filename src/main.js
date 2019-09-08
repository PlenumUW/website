import Vue from "vue";
import App from "./App.vue";
import router from "./router/router";
import store from "./store";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: function(h) {
    return h(App);
  },
  mounted() {
    // You'll need this for renderAfterDocumentEvent.
    document.dispatchEvent(new Event("render-event"));
    console.log("render event");
  }
}).$mount("#app");
