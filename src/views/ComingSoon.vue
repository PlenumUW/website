<template>
    <div>
        Coming Soon
    </div>
</template>
<script>
import _ from "lodash";
import BaseView from "@/views/BaseView";

export default {
  name: "ComingSoon",
  extends: BaseView,
  created: function () {
    this.metadata = {
      title: _.capitalize(this.$route.name)
    }
  },
  meta() {
    // TODO: make DRY with NotFound
    let meta = this.MetadataManager.metaDefault(this.metadata);
    meta = this.MetadataManager.addNoIndexing(meta);
    return meta;
  }
}
</script>
