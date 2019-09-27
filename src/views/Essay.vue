<template>
  <article>
    <div class="o-header c-essay__header__gradient-wrapper">
      <header-gradient class="o-header__gradient" :color="color"></header-gradient>
    </div>

    <header class="c-essay__header">
      <h1 class="c-essay__title-wrapper o-header-title">
        <div class="c-essay__title">{{ title }}</div>
        <div class="c-essay__subtitle">{{ subtitle }}</div>
      </h1>

      <div class="c-essay__authors">
        <div v-for="(author, index) in authors" :key="`author-${index}`" class="c-essay__authors__author">
          {{ author }}
        </div>
      </div>
    </header>

    <div class="c-essay__context">
      <paper :color="color">
        {{ abstract }}
      </paper>
    </div>

    <section v-for="(slices, index) in sections" :key="`${index}`" class="c-essay__section">
      <paper class="c-essay__section__paper" :color="color">
        <rich-text v-for="({ primary, slice_type }, sliceIndex) in slices" :key="`section-${index}_slice-${sliceIndex}`" :body="primary[slice_type]" anchors stickyHeading></rich-text>
      </paper>
    </section>
  </article>
</template>
<script>
import Velocity from "velocity-animate";

import BaseView from "./BaseView";
import HeaderGradient from "@/components/HeaderGradient";
import RichText from "@/components/prismic/RichText.vue";

export default {
  name: "Essay",
  extends: BaseView,
  components: { HeaderGradient, RichText },
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
    },
    body: function () {
      return this.essay.body;
    },
    sections: function () {
      // if (this.loading) return [[{}]];

      let sections = [];

      let section = [];
      this.body.forEach(({ primary, slice_type }) => {
        if (slice_type === "section_title" && section.length > 0) {
          sections.push(section);
          section = [];
        }

        section.push({ primary, slice_type });
      });

      if (section.length > 0) {
        sections.push(section);
      }

      return sections;
    },
    currentHash: function () {
      return this.$route.hash;
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
    },
    scrollToElWithHash(hash) {
      const scrollEl = document.documentElement;
      const anchorEl = document.querySelectorAll(`a[href='${hash}']`)[0];

      const anchorPos = anchorEl.getBoundingClientRect().top - 100; // arbitrary 100 to displace scroll to location

      scrollEl.scrollTop = anchorPos;
    }
  },
  meta() {
    return this.MetadataManager.metaDefault(
      this.metadata,
      this.scriptMetadata,
      "article"
    );
  },
  mounted: function () {
    const hash = this.currentHash;
    if (hash !== "") {
      this.scrollToElWithHash(hash);
    }
  }
};
</script>
<style lang="scss">
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

$title-left-margin: 1.5em;
.c-essay__section {
  margin-bottom: 150px;

  font-size: 1.15em;

  font-family: $font-serif;

  &__paper {
    max-width: 1000px;
    padding: 100px;
  }

  a {
    text-decoration: none;

    h1 {
      &:before {
        content: "\00A7";
        position: absolute;
        transform: translateX(0.5em);

        font-family: $font-serif;

        opacity: 0.4;
        line-height: 1.15em; // Center align with title
      }

      &:hover {
        text-decoration: underline;
        cursor: pointer;

        &:before {
          opacity: 1;
          text-decoration: none;
        }
      }
    }
  }

  h1 {
    width: 90%;
    margin-bottom: 1.5em;
    line-height: 1.2em;

    padding-left: $title-left-margin;
    text-indent: calc(-1 * #{$title-left-margin});

    font-family: $font-titling--subtitle;
    font-size: 1.6em;
  }

  .sticky {
    top: 0.5em;
    z-index: 3;
  }

  h2 {
    width: 90%;
    margin-top: 3em;
    margin-left: $title-left-margin;
    margin-bottom: 0.5em;

    font-family: $font-titling--subtitle;
    font-variant: small-caps;
    font-size: 1.45em;
  }

  p {
    margin-bottom: 1.5em;
  }
}
</style>
