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
      viewEntered: false,
      rawData: undefined
    };
  },
  computed: {
    _rawDataIsValid: function () {
      return this.rawData !== undefined;
    }
  },
  watch: {
    loadedCallback: function (newCallback) {
      if (newCallback) {
        this._handleViewReady();
      }
    },
    rawData: function () {
      if (this._rawDataIsValid) {
        this._handleViewReady();
      }
    }
  },
  methods: {
    _handleDocNotFound(path) {
      this.$router.presets.docNotFound(path);
    },
    docExists(doc) {
      if (!doc) {
        this._handleDocNotFound(this.$route.path);
        return false;
      }

      return true;
    },
    _handleViewReady() {
      if (this.loadedCallback && this._rawDataIsValid && !this.viewEntered) {
        this.loadedCallback();
        this.viewEntered = true;
      }
    }
  },
  created: async function () {
    this.rawData = this.fetchData ? await this.fetchData() : null;
  },
  updated: function () {
    this._handleViewReady();
  }
};
</script>
