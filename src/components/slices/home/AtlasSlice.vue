<template>
  <home-slice class="c-atlas-slice" :color="bgColor">
    <template #title>
      <router-link to="/atlas">Atlas</router-link>
    </template>

    <template #content>
      <div class="c-atlas-slice__previews">
        <div class="c-atlas-slice__project">
          <img
            class="c-atlas-slice__project__image"
            src="http://placehold.jp/50/bfbfbf/ffffff/600x800.png?text=Atlas Project Image"
          />
          <p class="c-atlas-slice__project__title">Project Title</p>
          <p class="c-atlas-slice__project__author">Firstname Lastname</p>
        </div>

        <div class="c-atlas-slice__project">
          <img
            class="c-atlas-slice__project__image"
            src="http://placehold.jp/50/bfbfbf/ffffff/600x800.png?text=Atlas Project Image"
          />
          <p class="c-atlas-slice__project__title">Project Title</p>
          <p class="c-atlas-slice__project__author">Firstname Lastname</p>
        </div>
      </div>

      <div v-if="false" class="c-atlas-slice__navigation">
        <img src="http://placehold.jp/300x200.png?text=Atlas Navigation" />
      </div>
    </template>
  </home-slice>
</template>
<script>
import HomeSlice from "./HomeSlice.vue";

export default {
  name: "AtlasSlice",
  components: {
    HomeSlice
  },
  props: {
    bgColor: {
      type: String,
      required: true
    }
  }
};
</script>
<style lang="scss" scoped>
$background: white;

.c-atlas-slice {
  position: relative;

  > *:last-child {
    padding-bottom: 20%;

    @include for-size(tablet-landscape-up) {
      padding-bottom: 50px; // To prevent the visibility of the sticky gradient moving offscreen
    }
  }

  &__content-container {
    &__content {
      background-color: $background;
    }
  }

  &__previews {
    display: flex;
    flex-direction: row;

    padding: 10px 15px;

    > * {
      margin-right: 0;
    }

    // TODO: this responsive mgmt is too much. find simpler approach using inherit layout qualities
    @include for-size(tablet-portrait-up) {
      padding: 25px 30px;
    }
    @include for-size(tablet-landscape-down) {
      display: block;
      padding: 25px 30px;
    }
    @include for-size(tablet-landscape-up) {
      > * {
        margin-right: 20px;

        &:last-child {
          margin-right: 0;
        }
      }
    }
    @include for-size(desktop-up) {
      padding: 55px 60px;
    }
  }

  &__project {
    flex-basis: 50%;

    &__image {
      width: 100%;
      height: auto;
    }

    &__title,
    &__author {
      text-align: center;
      font-family: $font-serif;
    }

    &__title {
      @include font-size(1.2em);
    }

    &__author {
      font-style: italic;

      @include font-size(1em);
    }

    @include for-size(tablet-landscape-up) {
      &__title {
        @include font-size(1.5em);
      }

      &__author {
        @include font-size(1.1em);
      }
    }

    @include for-size(desktop-up) {
      &__title {
        @include font-size(2em);
      }

      &__author {
        @include font-size(1.5em);
      }
    }
  }

  &__navigation {
    width: 100%;
  }
}
</style>
