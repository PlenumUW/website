<template>
  <div class="about-view">
    <paper :color="color">
      <h1>This is an about page</h1>
    </paper>
  </div>
</template>

<script>
import View from "./View";

export default {
  name: "about",
  extends: View,
  data: function() {
    return {
      rawData: undefined
    };
  },
  // TODO: Make dry with Page view
  created: async function() {
    const slugs = this.$route.path.split("/").filter(el => el.length > 0);
    const parentSlug = slugs[0];

    this.rawData = await this.$api.fetchPageBySlug(parentSlug);

    if (!this.rawData) {
      this.$router.replace("/404");
    }

    this.metadata = {
      title: this.title
    };
  },
  computed: {
    title: function() {
      return this.PrismicProcessor.getPrismicRawText(
        this.rawData["page_title"]
      );
    }
  },
  meta() {
    return this.MetadataManager.metaDefault(this.metadata, "website");
  }
};
</script>
