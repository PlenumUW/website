<template>
  <article>
    <paper :color="color">
      <header>
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
  data: function () {
    return {
      essay: undefined,
      title: undefined,
      subtitle: undefined,
      authors: undefined,
      image: undefined,
      description: undefined,
      metaImage: undefined
    };
  },
  computed: {
    combinedTitle: function () {
      if (!this.title || !this.subtitle) return "";

      let title = this.title;
      if (this.subtitle) title += ": " + this.subtitle;
      return title;
    }
  },
  methods: {
    buildMetadata() {
      if (!this.rawData) return {};

      this.metadata = {
        title: this.combinedTitle,
        description: this.description,
        authors: this.authors,
        image: this.metaImage
      };
    },
    initData(rawData) {
      const essay = rawData;
      const rawTextOf = this.PrismicProcessor.getRawText;

      const title = rawTextOf(essay.title);
      const subtitle = rawTextOf(essay.subtitle);
      const authors = essay.authors.map(({ author }) => rawTextOf(author));
      const description = rawTextOf(essay.description);
      const { metaImage, ...heroImage } = essay.hero_image;

      // TODO: move this elsewhere, most likely in fetch data
      this.title = title;
      this.subtitle = subtitle;
      this.authors = authors;
      this.image = heroImage;
      this.description = description;
      this.metaImage = metaImage;
    }
  },
  meta() {
    return this.MetadataManager.metaDefault(this.metadata, "article");
  }
};
</script>
<style lang="scss" scoped></style>
