<template>
  <section class="c-home-slice">
    <home-slice-header class="c-home-slice__header" :color="color">
      <slot name="title"></slot>
    </home-slice-header>

    <div class="c-home-slice__paper-wrapper">
      <div
        class="c-home-slice__paper-wrapper__paper"
        :style="{ 'background-color': paperColor }"
      >
        <slot name="content"></slot>
      </div>
    </div>

    <home-slice-header
      class="c-home-slice__bottom-padding"
      :color="color"
      :aria-hidden="true"
      role="presentation"
    >
      _
    </home-slice-header>
  </section>
</template>
<script>
import colors from "@/utils/colors";

import HomeSliceHeader from "./HomeSliceHeader";

export default {
  name: "HomeSlice",
  components: { HomeSliceHeader },
  props: {
    color: {
      type: String,
      required: true
    }
  },
  computed: {
    paperColor: function() {
      return colors.getPaperColor(colors.getOppositeHueByRgbString(this.color));
    }
  }
};
</script>
<style lang="scss" scoped>
.c-home-slice {
  font-family: $font-sans;
  @include headings($font-sans);

  &__header {
    z-index: 1;
  }

  &__paper-wrapper {
    position: relative;
    z-index: 0;
    padding-right: 20px;
    padding-left: 0;

    @include for-size(tablet-landscape-up) {
      padding-left: 133px;
      padding-right: 70px;
    }

    &__paper {
      @include box-shadow(12);
    }
  }

  &__bottom-padding {
    opacity: 0;
    pointer-events: none;
  }
}
</style>
