<template>
  <article>
    <paper :color="color">{{ title }}</paper>
  </article>
</template>
<script>
// TODO: VUE WARNING - Do not use built-in or reserved HTML elements as component id: article
import View from "./View";

export default {
  name: "article",
  extends: View,
  data: function() {
    return {};
  },
  computed: {
    title: function() {
      return "Article Title";
    },
    description: function() {
      return "Description of the Article"; // TODO: Two sentence abstract!!
    },
    imgSrc: function() {
      return "http://placehold.jp/80/bfbfbf/ffffff/1000x1400.png?text=Article Cover Image";
    },
    authors: function() {
      return [
        "Firstname Last",
        "First Lastname",
        "Firstname Middlename Lastname",
        "First Last"
      ];
    },
    metadata: function() {
      return {
        title: this.title,
        description: this.description,
        image: {
          url: this.imgSrc,
          dimensions: {
            width: 1000,
            height: 1400
          },
          alt: "Alt text"
        },
        authors: this.authors
      };
    }
  },
  meta() {
    return this.MetadataManager.metaDefault(this.metadata, "article");
  }
};
</script>
<style lang="scss" scoped></style>
