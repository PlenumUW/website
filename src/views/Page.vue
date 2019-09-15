<template>
  <div class="c-page">
    <section
      v-for="([titleSlice, ...slices], index) in sections"
      :key="`${title}-slice-${index}`"
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
        {{ titleSlice.primary.section_title | prismicRawText }}
      </h1>

      <div class="c-page__section__content">
        <paper class="c-page__section__paper" :color="color">
          <rich-text
            v-for="({ primary, slice_type }, sliceIndex) in slices"
            :key="`section-${index}_slice-${sliceIndex}`"
            :body="primary[slice_type]"
          ></rich-text>
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
  data: function() {
    return {
      items: _.range(0, 5, 1),
      rawData: undefined
    };
  },
  computed: {
    title: function() {
      return this.rawData
        ? this.PrismicProcessor.getRawText(this.rawData["page_title"])
        : "";
    },
    slices: function() {
      if (!this.rawData) return [];

      return this.rawData.body[0].primary.text;
    },
    testSlice: function() {
      if (!this.rawData) return [];

      return [this.slices[0]];
    },
    sliceTypes: function() {
      if (!this.rawData) return [];

      return _.uniqBy(this.slices.map(slice => slice.type));
    },
    body: function() {
      if (!this.rawData) return [];

      return this.rawData.body;
    },
    sections: function() {
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
  created: async function() {
    const slugs = this.$route.path.split("/").filter(el => el.length > 0);
    const parentSlug = slugs[0];

    this.rawData = await this.$api.fetchPageBySlug(parentSlug);

    if (!this.docExists(this.rawData)) {
      return;
    }

    this.metadata = {
      title: this.title
    };
  },
  meta() {
    return this.MetadataManager.metaDefault(this.metadata, "website");
  }
};
</script>
<style lang="scss" scoped>
.c-page {
  width: 100%;

  position: relative;

  &__section {
    width: 100%;
    max-width: 1100px;

    padding-right: 20px;

    @include for-size(tablet-landscape-up) {
      margin-bottom: 50px;

      padding-left: 100px;

      &:last-of-type {
        margin-bottom: 0;
      }
    }

    &__header {
      top: 0;
      width: 120%; // Extends gradient beyond the edge of the paper

      position: sticky;

      @include header-offset(
        height
      ); // TODO: change all header mixins to this responsive one
    }

    $paper-padding: 20px;
    &__title {
      margin-bottom: 15px;

      position: relative;
      padding-left: $paper-padding;

      text-align: left;

      @include font-size(3em);

      @include for-size(tablet-landscape-up) {
        margin-bottom: 65px;

        @include font-size(5em);
      }
    }

    &__paper {
      padding: $paper-padding;
      @include for-size(tablet-portrait-up) {
        margin-bottom: 75px;

        margin-left: 100px;

        padding: 70px 80px;

        &:last-of-type {
          margin-bottom: 0;
        }
      }
    }

    &__content {
      padding-bottom: 30px; // Helps hide the box-shadow when the paper scrolls under the gradient header // TODO: figure out how to bind this with paper box-shadows

      section {
        margin-bottom: 60px;

        &:last-of-type {
          margin-bottom: 0;
        }
      }

      h2 {
        margin-bottom: 20px;

        @include font-size(2.2em);
      }

      p {
        margin-bottom: 30px;

        font-family: $font-serif;
        @include font-size(1.3em);

        &:last-of-type {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
