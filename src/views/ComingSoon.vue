<template>
  <div class="c-coming-soon">
    <section class="c-coming-soon__section">
      <header class="c-coming-soon__section__header">
        <header-gradient class="c-coming-soon__section__gradient" :color="color"></header-gradient>
      </header>

      <h1 class="c-coming-soon__section__title">
        {{ title }}
      </h1>

      <div class="c-coming-soon__section__content">
        <paper class="c-page__section__paper" :color="color">
          <p>
            {{message}}
          </p>
        </paper>
      </div>
    </section>

  </div>
</template>

<script>
import _ from "lodash";
import BaseView from "@/views/BaseView";

import HeaderGradient from "@/components/HeaderGradient";

export default {
  name: "ComingSoon",
  extends: BaseView,
  components: { HeaderGradient },
  computed: {
    message: function() {
      return `${this.title} Coming Soon...`;
    },
    title: function() {
      return _.capitalize(this.$route.name);
    }
  },
  created: function() {
    this.metadata = {
      title: this.title
    };
  },
  meta() {
    // TODO: make DRY with NotFound
    let meta = this.MetadataManager.metaDefault(
      this.metadata,
      this.scriptMetadata
    );
    meta = this.MetadataManager.addNoIndexing(meta);
    return meta;
  }
};
</script>

<style lang="scss" scoped>
// TODO: Make dry with Page view -> seperate styling of a page template from
// the view for a Page document. Would allow for different logic, but same look.
.c-coming-soon {
  height: 100%;
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

      &:last-of-type {
        margin-bottom: 0;
      }
    }

    &__header {
      display: none;
      top: 0;
      width: 120%; // Extends gradient beyond the edge of the paper

      position: sticky;
      z-index: 2; //TODO: use scss function

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
      z-index: 1; //TODO: use scss function

      @include font-size(1.1em);

      @include for-size(tablet-portrait-up) {
        @include font-size(1.4em);
      }
    }
  }
}
</style>
