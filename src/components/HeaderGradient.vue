<template>
  <div
    class="c-header-gradient"
    :style="{ color: color, 'background-color': color }"
    aria-hidden="true"
  ></div>
</template>

<script>
export default {
  name: "HeaderGradient",
  props: {
    color: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss">
$header-height--desktop: $g-header-height--desktop;

.c-header-gradient {
  display: none;

  position: absolute;
  top: 0;
  width: 100%;
  z-index: -1;

  @include for-size(tablet-landscape-up) {
    display: block;
    height: $header-height--desktop;

    box-shadow: 0 13px 25px 9px;
  }
}
</style>
