<template>
  <article>
    <paper :color="color">
      <header>
        <h1>{{ combinedTitle }}</h1>
        <div
          v-for="(author, index) in authors"
          :key="`author-${index}`"
          class="author"
        >
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
      image: undefined
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
    async fetchData() {
      const essaySlug = this.$route.params.essaySlug;
      const issueSlug = this.$route.params.issueSlug;
      const essay = await this.$api.fetchEssayBySlugs(issueSlug, essaySlug);

      if (!this.docExists(essay)) {
        return;
      }

      this.essay = essay;

      const rawTextOf = this.PrismicProcessor.getRawText;

      const title = rawTextOf(essay.title);
      const subtitle = rawTextOf(essay.subtitle);
      const authors = essay.authors.map(({ author }) => rawTextOf(author));
      const description = rawTextOf(essay.description);
      const { metaImage, ...heroImage } = essay.hero_image;

      this.title = title;
      this.subtitle = subtitle;
      this.authors = authors;
      this.image = heroImage;

      this.metadata = {
        title: this.combinedTitle,
        description: description,
        authors,
        image: metaImage
      };

      return this.essay;
    }
  },
  meta() {
    return this.MetadataManager.metaDefault(this.metadata, "article");
  }
};
</script>
<style lang="scss" scoped></style>
