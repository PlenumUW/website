<template>
  <article class="essay">
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
      <paper v-if="abstract" class="c-essay__context__abstract" :color="color">
        <div class="c-essay__context__abstract__title">Abstract</div>
        <p class="c-essay__context__abstract__body">{{ abstract }}</p>
      </paper>
      <hr />
    </div>
    <section v-for="(slices, index) in sections" :key="`${index}`" class="c-essay__section">
      <paper class="c-essay__section__paper" :color="color" :type="'essay'">
        <rich-text v-for="({ primary, slice_type }, sliceIndex) in slices" :key="`section-${index}_slice-${sliceIndex}`" class="c-essay__section__paper__rich-text" :body="primary[slice_type]" anchors stickyHeading></rich-text>
      </paper>
    </section>

    <section v-if="bibliography" class="c-essay__section c-essay__section--bibliography">
      <paper class="c-essay__section__paper" :color="color">
        <a class="sticky" href="#bibliography">
          <h1>Bibliography</h1>
        </a>
        <rich-text class="c-essay__section__paper__rich-text" :body="bibliography"></rich-text>
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
  watch: {
    currentHash: function (newVal, oldVal) {
      this.scrollToElWithHash(newVal);
    }
  },
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
    bibliography: function () {
      const bibliography = this.essay.bibliography;
      if (_.isEmpty(bibliography)) return undefined;

      return bibliography;
    },
    sections: function () {
      let sections = [];

      let section = [];
      // Build sections determined by section title slices as the initial slice
      this.body.forEach(({ primary, slice_type }) => {
        if (slice_type === "section_title" && section.length > 0) {
          sections.push(section);
          section = [];
        }

        section.push({ primary, slice_type });
      });

      // Fence post: Add the last built section
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
    // TODO: move scroll to logic to seperate script tag that runs on static html
    scrollToElWithHash(hash) {
      const scrollEl = document.documentElement;
      const anchorEl = document.querySelectorAll(`a[href='${hash}']`)[0];

      const scrollElPos = scrollEl.scrollTop;
      let anchorPos = anchorEl.getBoundingClientRect().top - 250; // TODO: calculate distance to show top of paper with shadow

      // if anchorpos is negative or less than 10 (10 = top postion -> TODO: put in scss globals, export to here)
      if (anchorPos < 10 && anchorEl.children[0].tagName === "H1") {
        // Checking tag name prevents scrolling to top of paper if h2 is clicked, e.g.
        const getParentPaper = (el) => {
          let parent = el.parentElement;
          while (!parent.classList.contains("paper") && !_.isNull(parent)) {
            parent = parent.parentElement;
          }

          if (_.isNull(parent)) return undefined;

          return parent;
        };

        const anchorContainerEl = getParentPaper(anchorEl);
        anchorPos = anchorContainerEl.getBoundingClientRect().top - 100; // TODO: paper's padding top difference between earlier 250
      }

      const offset = scrollElPos + anchorPos;
      scrollEl.scrollTo({
        left: 0,
        top: Math.floor(offset),
        behavior: "smooth"
      });
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
  &__subtitle {
    width: 70%;
    margin-left: auto;
  }

  &__authors {
    width: 50%;
    min-height: 1em;
    margin-left: auto;
  }

  &__context {
    max-width: 1000px;
    margin-bottom: 100px;
    font-family: $font-serif;

    text-align: justify;

    hr {
      border: 3px solid black;
    }

    &__abstract {
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 100px;

      @include for-size(desktop-up) {
        max-width: 80%;

        padding: 80px;
        padding-top: 40px;
      }

      &__title {
        margin-bottom: 1em;
      }
    }
  }
}

$title-left-margin: 1.5em;
.c-essay__section {
  margin-bottom: 150px;

  a {
    @include headings() {
      position: relative; // Enables absolute positioning of prepended icons

      &:before {
        content: "\00A7"; // Section symbol
        position: absolute;
        left: -1em;
        transform: translateY(-3%);

        opacity: 0;

        font-family: $font-serif;
      }

      &:hover {
        &:before {
          opacity: 1;
        }
      }
    }

    h1 {
      &:before {
        opacity: 0.4;
      }
    }
  }

  h1 {
    width: 100%;
    margin-bottom: 1.5em;

    @include for-size(tablet-landscape-up) {
      width: 90%;
    }
  }

  h2 {
    width: 90%;
    margin-top: 3em;
    margin-left: $title-left-margin;
    margin-bottom: 0.8em;

    $h2-border: 1px solid black;
    border-top: $h2-border;
    border-bottom: $h2-border;
  }

  h3 {
    width: fit-content;
    max-width: 70%;
    margin: auto;
    margin-bottom: 0.8em;
    margin-top: 2em;

    padding-left: 0;

    border-top: 1px solid black;
    border-bottom: 1px solid black;
  }

  p,
  &__paper__rich-text {
    margin-bottom: 1em;
    text-indent: 3rem; // TODO: align with h1 text-indents

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  .sticky {
    display: block;
    top: 0.5em;
    z-index: 3;
  }

  $paper-padding: 100px;
  $paper-padding--top: calc(#{$paper-padding} - 1em);
  $bibliography-padding: 60px;

  &__paper {
    max-width: 1000px;
  }

  &--bibliography {
    .paper {
      padding: $bibliography-padding;
      padding-top: $paper-padding--top;
    }

    h1 {
      margin-left: calc(#{$paper-padding} - #{$bibliography-padding});
    }

    p {
      padding-left: 2em; // TODO: create hanging indent mixin
      text-indent: -2em;
      margin-bottom: 0.8em;

      &:last-of-type {
        margin-bottom: 0;
      }
    }
  }
}
</style>
