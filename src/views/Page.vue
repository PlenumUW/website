<template>
  <div v-if="!loading" class="c-page">
    <section v-for="([titleSlice, ...slices], index) in sections" :key="`${index}`" class="c-page__section">
      <header class="c-page__section__header">
        <header-gradient class="c-page__section__gradient" :color="color"></header-gradient>
      </header>

      <!-- This design is highly coupled, so much so that can always use h1 instead of rich-text -->
      <h1 class="c-page__section__title">
        {{ getSectionTitle(titleSlice) }}
      </h1>

      <div class="c-page__section__content">
        <paper class="c-page__section__paper" :color="color">
          <div>
            <rich-text v-for="({ primary, slice_type }, sliceIndex) in slices" :key="`section-${index}_slice-${sliceIndex}`" :body="primary[slice_type]"></rich-text>
          </div>
          <!-- <div v-if="loading" class="c-page__section__paper__placeholder" aria-hidden="true"></div> -->
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
      items: _.range(0, 5, 1)
    };
  },
  computed: {
    loading: function () {
      return !this.rawData;
    },
    title: function () {
      if (this.loading) return "";

      return this.PrismicProcessor.getRawText(this.rawData["page_title"]);
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
  methods: {
    buildMetadata() {
      return { title: this.title };
    },
    getSectionTitle(slice) {
      if (_.isEmpty(slice)) return "";

      return this.PrismicProcessor.getRawText(slice.primary.section_title);
    }
  },
  meta() {
    return this.MetadataManager.metaDefault(
      this.metadata,
      this.scriptMetadata,
      "website"
    );
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
      // margin-bottom: 50px;
      margin-right: auto;

      &:last-of-type {
        margin-bottom: 0;
      }
    }

    &__header {
      top: 0;
      width: 100%; // Extends gradient beyond the edge of the paper
      margin-bottom: 7px; // Optically attractive positioning for title with no gradient cover up on load

      position: sticky;
      z-index: 2; //TODO: use scss function

      opacity: 0;

      @include for-size(tablet-landscape-up) {
        display: block;
        margin-bottom: 35px; // TODO: figure out why 35px aligns title with logo position

        opacity: 1;

        @include header-offset(
          height
        ); // TODO: change all header mixins to this responsive one
      }
    }

    $paper-padding: 1.2em;
    &__title {
      position: sticky;
      top: 10px;

      --font-size: 2em;
      margin-bottom: 15px;
      line-height: 1em;
      min-height: 1em;

      // position: relative;
      padding-left: $paper-padding;
      z-index: 6; //TODO: use scss function // > 5, 5 is default z-index for stuck sticky els

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
        min-width: calc(
          #{$g-viewport-tablet} - #{$g-lefter-width} - (17px * 2)
        ); // 17px width of scrollbar
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
      padding-bottom: 60px; // Helps hide the box-shadow when the paper scrolls under the gradient header // TODO: figure out how to bind this with paper box-shadows
      z-index: 1; //TODO: use scss function

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
