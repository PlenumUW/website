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
    this.fetchData ? await this.fetchData() : null;
  },
  updated: function () {
    if (this.rawData && !this.loadingHandled) { // Req. b/c updated called multiple times
      this.loadedCallback();
      this.loadingHandled = true;
    }
  }
};
</script>
