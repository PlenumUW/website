<template>
  <header
    class="c-home-slice__header"
    :style="{
      background: `linear-gradient(
            180deg,
            ${color},
            ${color} 40%,
            transparent 60%
        )`
    }"
  >
    <h1 class="c-home-slice__header__title">
      <slot></slot>
    </h1>
  </header>
</template>

<script>
export default {
  name: "HomeSliceHeader",
  props: {
    color: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.c-home-slice__header {
  position: sticky;

  @include header-height($property: top);

  @include for-size(tablet-landscape-down) {
    background: 0 !important;
  }

  @include for-size(tablet-landscape-up) {
    top: 0;
  }

  &__title {
    margin-left: auto;

    text-align: right;
    line-height: 1em;

    @include font-size(8rem);

    @include for-size(tablet-landscape-up) {
      max-width: 90%;

      @include font-size(10rem);
    }

    @include for-size(desktop-up) {
      @include font-size(14rem);
    }

    @include for-size(big-desktop-up) {
      @include font-size(17rem);
    }

    > a {
      text-decoration: none;

      &:hover,
      &:focus {
        text-decoration: underline;
        outline: 0;
      }

      &:active {
        text-decoration: line-through;
      }
    }
  }
}
</style>
