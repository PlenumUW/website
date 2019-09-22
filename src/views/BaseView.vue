<script>
import MetadataManager from "@/utils/MetadataManager";
import PrismicProcessor from "@/utils/PrismicProcessor";

export default {
  name: "BaseView",
  props: {
    color: {
      type: String,
      required: true
    },
    loadedCallback: {
      type: Function,
      required: false
    }
  },
  data: function () {
    return {
      metadata: undefined,
      MetadataManager,
      PrismicProcessor,
      viewEntered: false, // Whether or not the view as transitioned in
      rawData: undefined
    };
  },
  watch: {
    loadedCallback: function (newCallback) {
      if (newCallback) {
        this._handleViewReady();
      }
    },
    rawData: function () {
      if (this._isDataValid(this.rawData)) {
        this._handleViewReady();
      }
    }
  },
  methods: {
    _isDataValid(data) {
      return !_.isUndefined(data);
    },
    _handleDocNotFound(path) {
      this.$router.presets.docNotFound(path);
    },
    _docExists(doc) {
      if (!this._isDataValid(doc)) {
        // Non API views will return null, not undefined
        this._handleDocNotFound(this.$route.path);
        return false;
      }

      return true;
    },
    _handleViewReady() {
      if (
        this.loadedCallback &&
        this._isDataValid(this.rawData) &&
        !this.viewEntered
      ) {
        this.viewEntered = true;

        // EVERY VIEW SHOULD GET IN HERE WHEN READY TO RENDER
        this.loadedCallback().then(() => {
          document.dispatchEvent(new Event("page-rendered")); // TODO: might need to await loadedcallback
          console.log("PAGE-RENDERED");
        });
      }
    }
  },
  // 1. Check if store has data
  // 2. If store does not have data, fetch data and put in store
  // 3. Use data to build metadata
  created: async function () {
    let routeData = this.$store.getters.currentRouteData;

    console.log(routeData);

    if (!this._isDataValid(routeData)) {
      await this.$store.dispatch("fetchRouteData", this.rawData);
      routeData = this.$store.getters.currentRouteData;
    }

    if (!this._docExists(routeData)) return;

    this.rawData = routeData;

    if (this.buildMetadata) this.buildMetadata();
  },
  updated: function () {
    this._handleViewReady();
  }
};
</script>
