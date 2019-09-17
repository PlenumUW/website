<template>
  <div class="c-page">
    <section
      v-for="([titleSlice, ...slices], index) in sections"
      :key="`${index}`"
      class="c-page__section"
    >
      <header class="c-page__section__header">
        <header-gradient
          class="c-page__section__gradient"
          :color="color"
        ></header-gradient>
      </header>

      <!-- This design is highly coupled, so much so that can always use h1 instead of rich-text -->
      <h1 class="c-page__section__title">
        {{ getSectionTitle(titleSlice) }}
      </h1>

      <div class="c-page__section__content">
        <paper class="c-page__section__paper" :color="color">
          <div v-if="!loading">
            <rich-text
            v-for="({ primary, slice_type }, sliceIndex) in slices"
            :key="`section-${index}_slice-${sliceIndex}`"
            :body="primary[slice_type]"
            ></rich-text>
          </div>
          <div class="c-page__section__paper__placeholder"></div>
        </paper>
      </div>
    </section>
  </div>
</template>
<script>
import _ from "lodash";

import BaseView from "./BaseView";

import HeaderGradient from "@/components/HeaderGradient";

import RichText from "@/components/prismic/RichText.vue";

export default {
  name: "Page",
  extends: BaseView,
  components: { HeaderGradient, RichText },
  data: function () {
    return {
      items: _.range(0, 5, 1),
      rawData: undefined
    };
  },
  methods: {
    getSectionTitle(slice) {
      if (_.isEmpty(slice)) return "   ";

      return this.PrismicProcessor.getRawText(slice.primary.section_title);
    }
  },
  computed: {
    loading: function () {
      return !this.rawData;
    },
    title: function () {
      if (this.loading) return "";

      return this.PrismicProcessor.getRawText(this.rawData["page_title"])
    },
    slices: function () {
      if (this.loading) return [];

      return this.rawData.body[0].primary.text;
    },
    testSlice: function () {
      if (this.loading) return [];

      return [this.slices[0]];
    },
    sliceTypes: function () {
      if (this.loading) return [];

      return _.uniqBy(this.slices.map(slice => slice.type));
    },
    body: function () {
      if (this.loading) return [];

      return this.rawData.body;
    },
    sections: function () {
      if (this.loading) return [[{}]];

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
    }
  },
  created: async function () {
    const slugs = this.$route.path.split("/").filter(el => el.length > 0);
    const parentSlug = slugs[0];

    this.rawData = await this.$api.fetchPageBySlug(parentSlug);

    if (!this.docExists(this.rawData)) {
      return;
    }

    await this.handleLoad();

    this.metadata = {
      title: this.title
    };
  },
  meta() {
    return this.MetadataManager.metaDefault(this.metadata, "website");
  }
};
</script>
<style lang="scss">
.c-page {
  width: 100%;

  position: relative;

  font-family: $font-serif;

  &__section {
    width: 100%;
    max-width: 1100px;

    padding-right: 20px;

    @include for-size(tablet-landscape-up) {
      width: calc(100% - 100px);
      margin-bottom: 50px;
      margin-right: auto;

      // padding-left: 100px;

      &:last-of-type {
        margin-bottom: 0;
      }
    }

    &__header {
      display: none;
      top: 0;
      width: 120%; // Extends gradient beyond the edge of the paper

      position: sticky;

      @include header-offset(
        height
      ); // TODO: change all header mixins to this responsive one

      @include for-size(tablet-landscape-up) {
        display: block;
      }
    }

    $paper-padding: 1.2em;
    &__title {
      --font-size: 2em;
      margin-bottom: 15px;
      line-height: 1em;
      min-height: 1em;

      position: relative;
      padding-left: $paper-padding;

      text-align: left;

      @include font-size(var(--font-size));

      @include for-size(tablet-landscape-up) {
        --font-size: 5em;
        margin-bottom: 65px;

        padding-left: 50px;

        @include font-size(var(--font-size));
      }
    }

    &__paper {
      padding: $paper-padding;

      @include for-size(tablet-portrait-up) {
        padding: 2em;
      }

      @include for-size(tablet-landscape-up) {
        width: calc(100% - 100px);
        min-width: 800px;
        margin-bottom: 75px;

        margin-left: auto;

        padding: 70px 80px;

        &:last-of-type {
          margin-bottom: 0;
        }
      }

      &__placeholder {
        // position: absolute;
        min-height: 100vh;
        width: 100%;
      }
    }

    &__content {
      padding-bottom: 30px; // Helps hide the box-shadow when the paper scrolls under the gradient header // TODO: figure out how to bind this with paper box-shadows

      @include font-size(1.1em);

      @include for-size(tablet-portrait-up) {
        @include font-size(1.4em);
      }

      section {
        margin-bottom: 60px;

        &:last-of-type {
          margin-bottom: 0;
        }
      }

      h2 {
        margin-bottom: 20px;

        @include font-size(1.5em);
      }

      p {
        margin-bottom: 30px;

        &:last-of-type {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
