<template>
  <div
    id="app"
    ref="app"
    class="app"
    :class="{ 'app--no-scroll': hideMainContent }"
  >
    <div class="app__horizontal-wrapper">
      <the-site-header
        :color="activeColorString"
        :hamburgerOpen.sync="menuOpen"
        @logoClick="handleLogoClick"
      ></the-site-header>

      <div class="main-content-container">
        <the-main-menu class="main-menu" :open.sync="menuOpen"></the-main-menu>

        <main class="main" :class="{ 'main--hidden': hideMainContent }">
          <transition
            :css="false"

            @before-appear="viewBeforeAppear"
            @appear="viewAppear"
            @after-appear="viewAfterAppear"
            @appear-cancelled="viewCancelledAppear"

            @before-enter="viewBeforeEnter"
            @enter="viewEnter"
            @after-enter="viewAfterEnter"
            @enter-cancelled="viewCancelledEnter"

            @before-leave="viewBeforeLeave"
            @leave="viewLeave"
            @after-leave="viewAfterLeave"
            @leave-cancelled="viewCancelledLeave"
          >
            <router-view
              :key="viewKey"
              :id="viewKey"
              class="router-view"

              :color="activeColorString"
              :loadedCallback="startEnter"
            ></router-view>
          </transition>
        </main>
      </div>
    </div>

    <site-footer
      :color="activeColorString"
      :class="{ 'site-footer--hidden': hideMainContent }"
    ></site-footer>
  </div>
</template>

<script>
import Velocity from "velocity-animate";
import colors from "@/utils/colors";
import { viewTransitions } from "@/utils/Animations";
// import { fitText } from "@/utils/fittext.js";

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
      prevBackgroundColor: colors.getRgbValuesFromString(colors.getBackgroundColor(0, true)), // Hue is arbitrary if desaturated
      activeColorString: "rgb(255, 255, 255)",
      menuOpen: false, // TODO: Find better name, or clarify difference between expanded and open
      startEnter: undefined,
      viewTransitions,
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
    initialLoad: function() {
      return this.$store.state.initialLoad;
    }
  },
  watch: {
    currentBackgroundColor: function (newVal, oldVal) {
      this.prevBackgroundColor = oldVal;
    }
  },
  methods: {
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

.app {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  flex-direction: column;

  overflow-x: hidden;
  overflow-y: scroll; // Scroll required for momentum scrolling in iOS
  -webkit-overflow-scrolling: touch; // Required for momentum scrolling in iOS

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  &--no-scroll {
    overflow: hidden;
  }

  &__horizontal-wrapper {
    display: flex;
  flex-direction: column;
  @include for-size(tablet-landscape-up) {
    flex-direction: row;
  }
  }
}

@mixin hidden() {
  &--hidden {
    opacity: 0;

    pointer-events: none;

    transition: opacity 200ms ease-out;
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
      top: 265px;
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
