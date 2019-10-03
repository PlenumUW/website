<template>
  <section class="c-home-slice">
    <home-slice-header class="c-home-slice__header" :color="color">
      <slot name="title"></slot>
    </home-slice-header>

    <div class="c-home-slice__content">
      <paper v-if="!hideBackground" :color="color" :shadow="12">
        <slot name="content"></slot>
      </paper>
      <slot v-else name="content"></slot>
    </div>

    <home-slice-header class="c-home-slice__bottom-padding" :color="color" :aria-hidden="true" role="presentation">_</home-slice-header>
  </section>
</template>
<script>
import HomeSliceHeader from "./HomeSliceHeader";

export default {
  name: "HomeSlice",
  components: { HomeSliceHeader },
  props: {
    color: {
      type: String,
      required: true
    },
    hideBackground: {
      type: Boolean,
      required: false,
      default: function () {
        return false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.c-home-slice {
  font-family: $font-sans;
  // @include headings($font-sans);

  &__header {
    z-index: 1;
  }

  &__content {
    max-width: 2000px;

    position: relative;
    z-index: 0;
    padding-right: 20px;
    padding-left: 0;

    @include for-size(tablet-landscape-up) {
      padding-left: 0px;
      padding-right: $g-home-right-padding;
    }

    > * {
      max-width: 1400px;
    }
  }

  &__bottom-padding {
    opacity: 0;
    pointer-events: none;
  }
}
</style>
