<template>
  <header
    class="site-header"
    :style="{
      color: color,
      'background-color': color
    }"
  >
    <the-logo class="logo" @activate="handleLogoClick"></the-logo>
    <div class="buttons">
      <the-hamburger
        class="hamburger"
        :open="hamburgerOpen"
        @open="handleHamburgerOpen"
        @close="handleHamburgerClose"
      ></the-hamburger>
    </div>
  </header>
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

.site-header {
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

  .logo {
    position: relative;
    top: 0;

    z-index: 999;

    flex-grow: 0;
    flex-shrink: 0;

    @include for-size(tablet-landscape-up) {
      width: fit-content;
      left: 0;
      top: $g-header-height--desktop * 1.5; // 120px
      margin: auto;
    }
  }

  .buttons {
    .hamburger {
      z-index: 999;

      flex-grow: 0;
      flex-shrink: 0;

      pointer-events: all;
    }
  }
}
</style>
