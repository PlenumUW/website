<template>
  <div class="c-site-header" :style="{
      color: color,
      'background-color': color
    }">
    <div class="c-site-header__logo c-site-header__icon">
      <the-logo @activate="handleLogoClick"></the-logo>
    </div>
    <div class="c-site-header__buttons c-site-header__icon">
      <the-hamburger class="hamburger" :open="hamburgerOpen" @open="handleHamburgerOpen" @close="handleHamburgerClose"></the-hamburger>
    </div>
  </div>
</template>

<script>
import TheLogo from "@/components/singletons/TheLogo";
import TheHamburger from "@/components/singletons/TheHamburger";

export default {
  name: "TheSiteHeader",
  components: { TheLogo, TheHamburger },
  props: {
    color: {
      type: String,
      required: true
    },
    hamburgerOpen: {
      type: Boolean,
      required: true
    }
  },
  data: function () {
    return {};
  },
  methods: {
    handleHamburgerOpen() {
      this.updateHamburger(true);
    },
    handleHamburgerClose() {
      this.updateHamburger(false);
    },
    handleLogoClick() {
      this.$emit("logoClick");
    },
    updateHamburger(bool) {
      this.$emit("update:hamburgerOpen", bool);
    }
  }
};
</script>

<style lang="scss">
$header-shadow-y: $g-header-shadow-y;
$header-shadow-spread: $g-header-shadow-spread;

.c-site-header {
  position: sticky;
  top: 0;
  width: 100%;

  z-index: 10; // TODO: use scss z-index mixin

  flex-grow: 0;
  flex-shrink: 0;

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  pointer-events: none;

  box-shadow: 0px $header-shadow-y $header-shadow-spread 10px;

  @include header-height();
  @include header-height($property: flex-basis);

  @include for-size(tablet-portrait-up) {
    @include header-height(tablet, flex-basis);
  }

  @include for-size(tablet-landscape-up) {
    display: inline-block;
    width: $g-lefter-width;

    flex-basis: unset;

    flex-direction: column;

    color: transparent !important;
    background-color: transparent !important;

    @include header-height(desktop);
  }

  &__icon {
    @include header-height($property: width);
    @include header-height($property: height);
  }

  &__logo {
    top: 0;
    height: 100%;

    position: relative;

    // z-index: 999;

    // flex-grow: 0;
    // flex-shrink: 0;

    @include for-size(tablet-landscape-up) {
      width: fit-content;
      left: 0;
      top: $g-header-height--desktop * 1.5; // 120px
      margin: auto;
    }
  }

  &__buttons {
    .hamburger {
      width: 100%;
      height: 100%;

      pointer-events: all;
    }
  }
}
</style>
