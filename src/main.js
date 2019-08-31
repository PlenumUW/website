import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

/**
 * Filters
 */
Vue.filter("capitalize", function(value) {
  if (!value) return "";
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});

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
