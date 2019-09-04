<template>
  <section class="c-issue-slice">
    <div
      class="c-issue-slice__header"
      :style="{
        background: `linear-gradient(
            180deg,
            ${bgColor},
            ${bgColor} 40%,
            transparent 100%
        )`
      }"
    >
      <h1 class="c-issue-slice__header__title">Plenum 2018</h1>
    </div>
    <div class="c-issue-slice__content-container">
      <div class="c-issue-slice__content">
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
export default {
  name: "IssueSlice",
  components: {},
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

  &__header {
    position: sticky;

    @include header-height($property: top);

    @include for-size(tablet-landscape-down) {
      background: 0 !important;
    }

    @include for-size(tablet-landscape-up) {
      top: 0;
    }

    &__title {
      font-family: $font-titling;
      text-align: right;
      line-height: 1em;

      @include font-size(8rem);

      @include for-size(tablet-landscape-up) {
        @include font-size(13rem);
      }
    }
  }

  &__content-container {
    position: relative;
    top: -2em; // To have title cut across top of image
    padding-right: 20px;

    z-index: -1;

    @include for-size(tablet-landscape-up) {
      top: -6em; // To have title cut across top of image

      padding-right: 70px;
    }
  }

  &__cover-image {
    width: 100%;
    height: auto;

    border-bottom: 3px solid black;
  }

  &__toc {
    width: 100%;
    background: white;
  }
}
</style>
