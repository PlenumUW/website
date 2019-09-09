<template>
  <header class="c-home-slice-header">
    <div
      class="c-home-slice-header__gradient"
      :style="{ color: color, 'background-color': color }"
      aria-hidden="true"
    ></div>
    <h1 ref="fit-text" class="c-home-slice-header__title">
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
  },
  mounted: function() {
    window.fitText(this.$refs["fit-text"], 0.9);
  }
};
</script>

<style lang="scss" scoped>
$header-height: $g-header-height;
$header-height--tablet: $g-header-height--tablet;
$header-height--desktop: $g-header-height--desktop;
$header-shadow-height: $g-header-shadow-height;

.c-home-slice-header {
  position: sticky;

  @include header-offset();

  &__gradient {
    display: none;

    position: absolute;
    top: 0;
    width: 100%;
    height: $header-height;
    z-index: -1;

    @include for-size(tablet-landscape-up) {
      display: block;
      height: $header-height--desktop;

      box-shadow: 0 13px 25px 9px;
    }
  }

  &__title {
    margin-left: auto;

    text-align: right;
    line-height: 1em;
    white-space: nowrap;

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
