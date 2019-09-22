<template>
  <div class="not-found">{{ message }}</div>
</template>

<script>
import BaseView from "./BaseView";

export default {
  name: "NotFound",
  extends: BaseView,
  computed: {
    message: function() {
      let msg = "404 - Site ";
      const brokenPath = this.$route.params.brokenPath;
      if (brokenPath) msg += `at path, '${brokenPath}', `;
      msg += "not found.";

      return msg;
    }
  },
  created() {
    this.metadata = {
      title: "Not Found"
    };
  },
  meta() {
    let meta = this.MetadataManager.metaDefault(
      this.metadata,
      this.scriptMetadata
    );
    meta = this.MetadataManager.addNoIndexing(meta);
    return meta;
  }
};
</script>
