<template>
  <div class="about-view">
    <paper :color="color">
      <h1>This is an about page</h1>
    </paper>
  </div>
</template>

<script>
import BaseView from "./BaseView";

export default {
  name: "About",
  extends: BaseView,
  data: function() {
    return {
      rawData: undefined
    };
  },
  computed: {
    title: function() {
      return this.PrismicProcessor.getRawText(this.rawData["page_title"]);
    }
  },
  meta() {
    return this.MetadataManager.metaDefault(this.metadata, "website");
  }
};
</script>
