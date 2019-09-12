<template>
  <article>
    <paper :color="color">{{ title }}</paper>
  </article>
</template>
<script>
import MetadataManager from "@/utils/MetadataManager.js";

import View from "./View";

export default {
  name: "issue",
  extends: View,
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
    return MetadataManager.metaDefault(this.metadata, "book");

    // if (!this.metadata) return {};

    // const { title, description, image, authors } = this.metadata;
    // const { origin, pathname } = window.location;
    // const url = origin + pathname;

    // return {
    //   title: title,
    //   titleTemplate: "%s - Plenum", // TODO: import reused meta elements like this
    //   meta: MetadataManager.getOpenGraphMetadata({
    //     type: "book",
    //     title,
    //     description,
    //     image,
    //     url,
    //     authors
    //   })
    // };
  }
};
</script>
<style lang="scss" scoped></style>
