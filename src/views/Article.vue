<template>
  <article>
    <paper :color="color">{{ title }}</paper>
  </article>
</template>
<script>
import View from "./View";

export default {
  name: "article",
  extends: View,
  computed: {
    title: function() {
      return "Article Title";
    },
    metaDescription: function() {
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
    }
  },
  meta() {
    const title = this.title;
    const metaDescription = this.metaDescription;
    const imgSrc = this.imgSrc;
    const authors = this.authors;

    const { origin, pathname } = window.location;
    const url = origin + pathname;
    return {
      title: title,
      titleTemplate: "%s - Plenum",
      meta: [
        { vmid: "title", property: "og:title", content: title },
        { vmid: "type", property: "og:type", content: "article" },
        { vmid: "url", property: "og:url", content: url },
        {
          vmid: "image",
          property: "og:image",
          content: imgSrc
        },
        {
          vmid: "description",
          property: "og:description",
          content: metaDescription
        },
        ...(() =>
          authors.map((author, index) => ({
            vmid: "author" + index === 0 ? "" : index, // Adding index overrides parent metadata, while creating an array for this page
            property: "og:author",
            content: author
          })))()
      ]
    };
  }
};
</script>
<style lang="scss" scoped></style>
