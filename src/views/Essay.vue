<template>
  <article>
    <div class="c-essay__header">
      <header class="o-header c-essay__header__gradient-wrapper">
        <header-gradient class="o-header__gradient" :color="color"></header-gradient>
      </header>

      <h1 class="c-essay__title-wrapper o-header-title">
        <div class="c-essay__title">{{ title }}</div>
        <div class="c-essay__subtitle">{{ subtitle }}</div>
      </h1>

      <div class="c-essay__authors">
        <div v-for="(author, index) in authors" :key="`author-${index}`" class="c-essay__authors__author">
          {{ author }}
        </div>
      </div>
    </div>
    <paper :color="color">
      {{ abstract }}
    </paper>
  </article>
</template>
<script>
import BaseView from "./BaseView";
import HeaderGradient from "@/components/HeaderGradient";

export default {
  name: "Essay",
  extends: BaseView,
  components: { HeaderGradient },
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
      const { SocialMedia, ...heroImage } = this.essay.hero_image;
      return heroImage;
    },
    description: function () {
      return this.PrismicProcessor.getRawText(this.essay.description);
    },
    metaImage: function () {
      return this.essay.hero_image.SocialMedia;
    },
    essay: function () {
      return this.rawData;
    },
    abstract: function () {
      return this.PrismicProcessor.getRawText(this.essay.abstract);
    }
  },
  methods: {
    getMetadata() {
      return {
        title: this.combinedTitle,
        description: this.description || this.abstract,
        authors: this.authors,
        image: this.metaImage
      };
    }
  },
  meta() {
    return this.MetadataManager.metaDefault(
      this.metadata,
      this.scriptMetadata,
      "article"
    );
  }
};
</script>
<style lang="scss" scoped>
@mixin align-right() {
  margin-left: auto;
  text-align: right;
}
.c-essay {
  &__header {
    max-width: 2000px;
    width: 100%;

    padding: 1em;

    @include for-size(tablet-landscape-up) {
      width: 90%;
      padding: 0;

      @include header-offset(margin-bottom); // 35px = header margin
    }

    &__gradient-wrapper {
      margin-bottom: 0;
    }
  }
  &__title-wrapper {
    width: 100%;
    top: 0; // Override sticky header

    position: relative; // Override sticky header
    padding: 0;
    white-space: normal;

    @include for-size(desktop-up) {
      padding-left: 1em;
    }
  }
  &__title {
    font-size: 0.8em; // Adjust from header em size
  }
  &__subtitle {
    width: 70%;
    margin-top: 0.4em;

    font-family: $font-titling--subtitle;
    font-size: 0.4em;
    line-height: 1.3em;

    @include align-right();
  }
  &__authors {
    width: 50%;

    font-family: $font-titling--subtitle;
    line-height: 1em;
    min-height: 1em;
    @include align-right();

    // Steps used in mixin responsiveTitling
    @include font-size(1em);
    @include for-size(tablet-portrait-up) {
      @include font-size(1.5em);
    }
    @include for-size(desktop-up) {
      @include font-size(2em);
    }

    @include for-size(big-desktop-up) {
      @include font-size(2.5em);
    }
  }
}
</style>
