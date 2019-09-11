<template>
  <article>
    <paper :color="color">{{ title }}</paper>
  </article>
</template>
<script>
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
    }
  },
  meta() {
    const title = this.title;
    const description = this.description;
    const imgSrc = this.imgSrc;

    const { origin, pathname } = window.location;
    const url = origin + pathname;
    return {
      title: title,
      titleTemplate: "%s - Plenum", // TODO: import reused meta elements like this
      meta: [
        { property: "og:title", content: title, vmid: "title" },
        { property: "og:type", content: "book", vmid: "type" },
        { property: "og:url", content: url, vmid: "url" },
        {
          property: "og:image",
          content: imgSrc,
          vmid: "image"
        },
        {
          property: "og:description",
          content: description,
          vmid: "description"
        },
        {
          property: "og:author",
          content: "Plenum - Undergraduate Journal of Geography",
          vmid: "author"
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped></style>
