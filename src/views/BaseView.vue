<script>
import MetadataManager from "@/utils/MetadataManager";
import PrismicProcessor from "@/utils/PrismicProcessor";

export default {
  name: "BaseView",
  props: {
    color: {
      type: String,
      required: true
    }
  },
  data: function () {
    return {
      metadata: undefined,
      MetadataManager,
      PrismicProcessor
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
  }
};
</script>
