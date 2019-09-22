<template>
  <article>
    <paper :color="color">
      <header v-if="essay">
        <h1>{{ combinedTitle }}</h1>
        <div v-for="(author, index) in authors" :key="`author-${index}`" class="author">
          {{ author }}
        </div>
      </header>
    </paper>
  </article>
</template>
<script>
import BaseView from "./BaseView";

export default {
  name: "Essay",
  extends: BaseView,
  computed: {
    combinedTitle: function () {
      if (!this.title || !this.subtitle) return "";

      let title = this.title;
      if (this.subtitle) title += ": " + this.subtitle;
      return title;
    },
    title: function () {
      return this.PrismicProcessor.getRawText(this.essay.title);
    },
    subtitle: function () {
      return this.PrismicProcessor.getRawText(this.essay.subtitle);
    },
    authors: function () {
      return this.essay.authors.map(({ author }) =>
        this.PrismicProcessor.getRawText(author)
      );
    },
    image: function () {
      const { metaImage, ...heroImage } = this.essay.hero_image;
      return heroImage;
    },
    description: function () {
      return this.PrismicProcessor.getRawText(this.essay.description);
    },
    metaImage: function () {
      const { metaImage, ...heroImage } = this.essay.hero_image;
      return metaImage;
    },
    essay: function () {
      return this.rawData;
    }
  },
  methods: {
    buildMetadata() {
      return {
        title: this.combinedTitle,
        description: this.description,
        authors: this.authors,
        image: this.metaImage
      };
    }
  },
  meta() {
    return this.MetadataManager.metaDefault(this.metadata, "article");
  }
};
</script>
<style lang="scss" scoped></style>
