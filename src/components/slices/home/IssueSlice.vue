<template>
  <section class="c-issue-slice">
    <home-slice-header :color="bgColor">
      <a href="#">Plenum 2018</a>
    </home-slice-header>

    <div class="c-issue-slice__content-container home-paper-wrapper">
      <div class="c-issue-slice__content-container__content home-paper">
        <img
          class="c-issue-slice__cover-image"
          src="http://placehold.jp/250x325.png?text=Issue-Cover-Image"
        />

        <div class="c-issue-slice__toc">
          <img src="http://placehold.jp/300x200.png?text=Table-of-Contents" />
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import HomeSliceHeader from "./HomeSliceHeader.vue";

export default {
  name: "IssueSlice",
  components: {
    HomeSliceHeader
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
.c-issue-slice {
  position: relative;

  > *:last-child {
    padding-bottom: 20%;

    @include for-size(tablet-landscape-up) {
      padding-bottom: 50px; // To prevent the visibility of the sticky gradient moving offscreen
    }
  }

  &__content-container {
    top: -2em; // To have title cut across top of image

    position: relative;

    z-index: -1;

    @include for-size(tablet-landscape-up) {
      top: -6em; // To have title cut across top of image
    }
  }

  &__cover-image {
    width: 100%;
    height: auto;

    border-bottom: 3px solid black;
  }

  &__toc {
    width: 100%;

    background-color: white;
  }
}
</style>
