<template>
  <header class="c-home-slice-header">
    <header-gradient :color="color"></header-gradient>
    <h1 ref="fit-text" class="c-home-slice-header__title">
      <slot></slot>
    </h1>
  </header>
</template>

<script>
import HeaderGradient from "@/components/HeaderGradient";

export default {
  name: "HomeSliceHeader",
  components: { HeaderGradient },
  props: {
    color: {
      type: String,
      required: true
    }
  },
  mounted: function () {
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
