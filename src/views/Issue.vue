<template>
  <article>
    <paper :color="color">
      <h1>{{ title }}</h1>
      <img :src="image.url" />
    </paper>
  </article>
</template>
<script>
import BaseView from "./BaseView";

// TODO: make DRY with IssueSlice

export default {
  name: "Issue",
  extends: BaseView,
  data: function () {
    return {
      issue: undefined
    };
  },
  computed: {
    title: function () {
      if (!this.issue) return "";

      return this.PrismicProcessor.getRawText(this.issue.title);
    },
    image: function () {
      if (!this.issue) return "";

      return this.issue.cover_image;
    }
  },
  meta() {
    return this.MetadataManager.metaDefault(
      this.metadata,
      this.scriptMetadata,
      "book"
    );
  }
};
</script>
<style lang="scss" scoped></style>
