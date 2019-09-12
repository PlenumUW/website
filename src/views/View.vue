<script>
import MetadataManager from "@/utils/MetadataManager";
import PrismicProcessor from "@/utils/PrismicProcessor";

export default {
  name: "View",
  props: {
    color: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      metadata: undefined,
      MetadataManager,
      PrismicProcessor
    };
  }
};
</script>
