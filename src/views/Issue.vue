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
  data: function() {
    return {
      issue: undefined
    };
  },
  computed: {
    title: function() {
      if (!this.issue) return "";

      return this.PrismicProcessor.getRawText(this.issue.title);
    },
    image: function() {
      if (!this.issue) return "";

      return this.issue.cover_image;
    }
  },
  created: async function() {
    const issue = await this.$api.fetchIssueBySlug(
      this.$route.params.issueSlug
    );

    if (!this.docExists(issue)) {
      return;
    }

    this.issue = issue;

    this.metadata = {
      title: this.title,
      description: this.PrismicProcessor.getRawText(issue.description),
      image: issue.cover_image.SocialMedia
    };
  },
  meta() {
    return this.MetadataManager.metaDefault(this.metadata, "book");
  }
};
</script>
<style lang="scss" scoped></style>
