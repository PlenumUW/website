<template>
  <article>
    <paper :color="color">
      <h1>{{ combinedTitle }}</h1>
    </paper>
  </article>
</template>
<script>
// TODO: VUE WARNING - Do not use built-in or reserved HTML elements as component id: article
import View from "./View";

export default {
  name: "Essay",
  extends: View,
  data: function() {
    return {
      essay: undefined,
      title: undefined,
      subtitle: undefined,
      authors: undefined,
      description: undefined,
      image: undefined
    };
  },
  computed: {
    combinedTitle: function() {
      let title = this.title;
      if (this.subtitle) title += ": " + this.subtitle;
      return title;
    }
  },
  created: async function() {
    const essay = await this.$api.fetchEssayBySlug(
      this.$route.params.essaySlug
    );
    this.essay = essay;

    const rawText = this.PrismicProcessor.getRawText;

    const title = rawText(essay.title);
    const subtitle = rawText(essay.subtitle);
    const authors = essay.authors.map(({ author }) => rawText(author));
    const description = rawText(essay.description);
    const { metaImage, ...heroImage } = essay.hero_image;

    this.title = title;
    this.subtitle = subtitle;
    this.authors = authors;
    this.description = description;
    this.image = heroImage;

    this.metadata = {
      title: this.combinedTitle,
      description: description,
      authors,
      image: metaImage
    };
  },
  meta() {
    return this.MetadataManager.metaDefault(this.metadata, "article");
  }
};
</script>
<style lang="scss" scoped></style>
