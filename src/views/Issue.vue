<template>
  <article>
    <paper :color="color">{{ title }}</paper>
  </article>
</template>
<script>
import BaseView from "./BaseView";

export default {
  name: "Issue",
  extends: BaseView,
  computed: {
    title: function() {
      return "Issue Title";
    },
    description: function() {
      return "Description of the Issue";
    },
    imgSrc: function() {
      return "http://placehold.jp/80/bfbfbf/ffffff/1400x1800.png?text=Issue Cover Image";
    },
    metadata: function() {
      return {
        title: this.title,
        description: this.description,
        image: {
          url: this.imgSrc,
          dimensions: {
            width: 1400,
            height: 1800
          },
          alt: "Alt text"
        },
        authors: "Plenum - Undergraduate Journal of Geography"
      };
    }
  },
  meta() {
    return this.MetadataManager.metaDefault(this.metadata, "book");
  }
};
</script>
<style lang="scss" scoped></style>
