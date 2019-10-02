<template>
  <div id="app" ref="app" class="app">
    <div class="app__horizontal-wrapper">
      <the-site-header :color="activeColorString" :hamburgerOpen.sync="menuOpen" @logoClick="handleLogoClick"></the-site-header>

      <div class="main-content-container">
        <the-main-menu class="main-menu" :open.sync="menuOpen"></the-main-menu>

        <main class="main" :class="{ 'main--hidden': hideMainContent }">
          <transition :css="false" @before-appear="viewBeforeAppear" @appear="viewAppear" @after-appear="viewAfterAppear" @appear-cancelled="viewCancelledAppear" @before-enter="viewBeforeEnter" @enter="viewEnter" @after-enter="viewAfterEnter" @enter-cancelled="viewCancelledEnter" @before-leave="viewBeforeLeave" @leave="viewLeave" @after-leave="viewAfterLeave" @leave-cancelled="viewCancelledLeave">
            <router-view :key="viewKey" :id="viewKey" class="router-view" :color="activeColorString" :loadedCallback="startEnter"></router-view>
          </transition>
        </main>
      </div>
    </div>

    <div class="loading" :class="{'loading--error': error}"></div>
    <div v-if="error" class="error" :style="{'background-color': activeColorString}" @click="handleErrorClick">
      <div v-if="pageLoadingError">Your internet is bein' silly.<br />Try refreshing the site.</div>
      <div v-if="generalError">Something's gone wrong!<br />Try refreshing the site.</div>
    </div>

    <site-footer :color="activeColorString" :class="{ 'site-footer--hidden': hideMainContent }"></site-footer>
  </div>
</template>

<script>
import Velocity from "velocity-animate";
import colors from "@/utils/colors";
import {
  viewTransitions,
  loadingTransitions,
  Animations
} from "@/utils/Animations";

// eslint-disable-next-line no-unused-vars
import whatInput from "what-input";

import css from "@/styles/js.scss";

import TheMainMenu from "@/components/singletons/TheMainMenu";
import TheSiteHeader from "@/components/singletons/TheSiteHeader";
import SiteFooter from "@/components/singletons/TheSiteFooter";

export default {
  components: { TheSiteHeader, TheMainMenu, SiteFooter },
  data: function () {
    return {
      metadata: undefined,
      prevBackgroundColor: colors.getRgbValuesFromString(
        colors.getBackgroundColor(0, true)
      ), // Hue is arbitrary if desaturated
      activeColorString: "rgb(255, 255, 255)",
      menuOpen: false, // TODO: Find better name, or clarify difference between expanded and open
      startEnter: undefined,
      viewTransitions,
      loadingTransitions,
      loadingTransitionActive: false,
      colors,
      css
    };
  },
  computed: {

    /**
     * The background color of the application.
     */
    // TODO: Put currentBackgroundColor in global store
    // TODO: replace background gradient with box-shadow, this will help make icon height relative to header height ore intuitive
    currentBackgroundColor: function () {
      const hue =
        this.$route.meta.hue || this.$route.matched[0]
          ? this.$route.matched[0].meta.hue
          : undefined;

      const color =
        hue !== undefined
          ? this.colors.getBackgroundColor(hue)
          : this.colors.getBackgroundColor(0, true); // Hue is arbitrary if desaturated

      const colorValues = this.colors.getRgbValuesFromString(color);

      return colorValues;
    },
    viewKey: function () {
      return this.$route.name;
    },
    hideMainContent: function () {
      return this.menuOpen;
    },
    initialLoad: function () {
      return this.$store.state.initialLoad;
    },
    pageLoading: function () {
      return this.$store.state.isLoading;
    },
    error: function () {
      return this.pageLoadingError || this.generalError;
    },
    pageLoadingError: function () {
      return this.$store.state.pageLoadingError;
    },
    generalError: function () {
      return this.$store.state.generalError;
    }
  },
  watch: {
    currentBackgroundColor: function (newVal, oldVal) {
      this.prevBackgroundColor = oldVal;
    },
    pageLoading: function (newVal, oldVal) {
      if (newVal) {
        this.loadingTransitionActive = true;
        this.startLoadingAnimation().then(() => {
          console.log("looping loading animation");
          this.loadingAnimationLoop().then(() => console.log("loop done"));
        });
      } else {
        this.exitLoadingAnimation();
        this.loadingTransitionActive = false;
      }
    }
  },
  methods: {
    handleErrorClick() {
      this.$store.dispatch("resetErrors");
    },
    startLoadingAnimation() {
      const el = document.getElementsByClassName("loading")[0];

      const prevRgb = "transparent";
      const nextRgb = this.colors.getRgbValuesFromString(
        this.colors.getLoadingColor(0)
      );
      const cssProps = ["outlineColor"];

      return Animations.tweenColor(el, {
        prevRgb,
        nextRgb,
        cssProps,
        duration: 200
      })();
    },
    loadingAnimationLoop() {
      const el = document.getElementsByClassName("loading")[0];

      const prevRgb = this.colors.getRgbValuesFromString(
        this.colors.getLoadingColor(0)
      );
      const nextRgb = this.colors.getRgbValuesFromString(
        this.colors.getLoadingColor(180)
      );
      const cssProps = ["outlineColor"];

      return Animations.tweenColor(el, {
        prevRgb,
        nextRgb,
        cssProps,
        loop: true,
        duration: 1000
      })();
    },
    exitLoadingAnimation() {
      if (!this.loadingTransitionActive) return;

      const el = document.getElementsByClassName("loading")[0];

      const prevRgb = "current";
      const nextRgb = "transparent";
      const cssProps = ["outlineColor"];

      Velocity(el, "stop");
      Animations.tweenColor(el, {
        prevRgb,
        nextRgb,
        cssProps,
        duration: 200
      })();
    },
    handleLogoClick() {
      this.setMenuOpen(false);
    },

    /**
     * @param {Boolean} val New value for menuOpen.
     */
    setMenuOpen(val) {
      if (typeof val !== "boolean") throw new Error("Incorrect value type.");
      this.menuOpen = val;
    },
    setActiveColorString(colorString) {
      this.activeColorString = colorString;
    },
    viewBeforeAppear: viewTransitions.beforeAppear,
    viewAppear: viewTransitions.appear,
    viewAfterAppear: viewTransitions.afterAppear,
    viewCancelledAppear: viewTransitions.cancelledAppear,
    viewBeforeEnter: viewTransitions.beforeEnter,
    viewEnter: viewTransitions.enter,
    viewAfterEnter: viewTransitions.afterEnter,
    viewCancelledEnter: viewTransitions.cancelledEnter,
    viewBeforeLeave: viewTransitions.beforeLeave,
    viewLeave: viewTransitions.leave,
    viewAfterLeave: viewTransitions.afterLeave,
    viewCancelledLeave: viewTransitions.cancelledLeave
  }
};
</script>

<style lang="scss">
@import "~backpack.css";
@import "./styles/app.scss";

html {
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch; // Required for momentum scrolling in iOS
}

.app {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  &__horizontal-wrapper {
    display: flex;
    flex-direction: column;

    @include for-size(tablet-landscape-up) {
      flex-direction: row;
    }
  }
}

.loading {
  position: fixed;
  width: 100%;
  height: 100%;

  z-index: 999;

  pointer-events: none;

  --outline-width: 5px;

  outline-style: solid;
  outline-color: transparent;
  outline-width: var(--outline-width);
  outline-offset: calc(-1 * var(--outline-width));

  @include for-size(tablet-landscape-up) {
    --outline-width: 10px;
  }

  &--error {
    outline-color: red !important;
  }
}

@mixin hidden() {
  &--hidden {
    opacity: 0;

    pointer-events: none;

    transition: opacity 200ms ease-out;
  }
}

.error {
  --outline-width: 5px;

  position: fixed;
  max-width: 60%;
  top: 0;
  outline: var(--outline-width) solid red;
  width: fit-content;
  transform: translateX(-50%);
  left: 50%;

  padding: 20px;
  z-index: 999;

  font-family: $font-sans;
  font-size: 1.5em;

  cursor: pointer;

  @include for-size(tablet-landscape-up) {
    --outline-width: 10px;
    font-size: 4em;
  }
}

.main-content-container {
  position: relative;
  display: inline-block;
  top: 0;
  left: 0;
  width: 100%;
  height: fit-content;
  min-height: 100vh;

  .main-menu {
    position: fixed;
    width: 100%;
    height: 100%;

    z-index: 11; // TODO: use scss z-index mixin

    @include for-size(tablet-landscape-up) {
      width: unset;
      height: unset;
      top: 260px;
    }
  }

  .main {
    min-height: 100vh;
    z-index: 10; // TODO: use scss z-index mixin

    padding-bottom: 35px;
    opacity: 1;

    transition: opacity 200ms ease-in;

    @include hidden();
  }
}

.site-footer {
  opacity: 1;

  transition: opacity 200ms ease-in;

  @include hidden();
}

.router-view {
  top: 0;
  left: 0;
  width: 100%;
}
</style>
