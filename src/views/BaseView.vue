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
      loadingHandled: false,
      rawData: undefined // TODO: use rawData variable in ALL views
    };
  },
  watch: {
    // Necessary to continue view transition.
    // Because no API data updates the page, the BaseView's method
    // of activating the transition fails.
    loadedCallback: function (newCallback, oldCallback) {
      if (newCallback && this.rawData === null) this.loadedCallback();
    }
  },
  methods: {
    handleDocNotFound(path) {
      this.$router.presets.docNotFound(path);
    },
    docExists(doc) {
      if (!doc) {
        this.handleDocNotFound(this.$route.path);
        return false;
      }

      return true;
    }
  },
  created: async function () {
    this.rawData = this.fetchData ? await this.fetchData() : null;
  },
  // TODO: only works for view that are waiting for API data, and the DOM
  // updates as a result of the new data
  // This is never called for views that are 'local', e.g. NotFound, ComingSoon
  updated: function () {
    if (this.rawData && !this.loadingHandled) { // Req. b/c updated called multiple times
      if (this.loadedCallback) this.loadedCallback();
      this.loadingHandled = true;
    }
  }
};
</script>
