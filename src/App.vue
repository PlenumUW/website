<template>
  <div id="app" ref="app" :style="{ 'background-color': bgColor }">
    <header
      class="menu-bar"
      :style="{
        'background-color': bgColor,
        background: `linear-gradient(
          180deg,
          ${bgColor},
          ${bgColor} 66%,
          transparent 100%
        )`
      }"
    >
      <the-logo class="logo" @activate="handleLogoClick"></the-logo>
      <div class="buttons">
        <the-hamburger
          class="hamburger"
          :open="menuOpen"
          @open="handleHamburgerOpen"
          @close="handleHamburgerClose"
        ></the-hamburger>
      </div>
    </header>

    <div class="main-content-container">
      <the-main-menu class="main-menu" :open.sync="menuOpen"></the-main-menu>

      <main class="main" :class="{ 'main--hidden': hideMainContent }">
        <transition name="view" @leave="backgroundTransitionLeave">
          <router-view
            :key="viewKey"
            class="router-view"
            :bgColor="bgColor"
          ></router-view>
        </transition>
      </main>
    </div>
  </div>
</template>

<script>
import sweep from "@/utils/sweep";
import css from "@/styles/js.scss";
import colors from "@/utils/colors";

import TheLogo from "@/components/singletons/TheLogo";
import TheHamburger from "@/components/singletons/TheHamburger";
import TheMainMenu from "@/components/singletons/TheMainMenu";

export default {
  components: { TheLogo, TheHamburger, TheMainMenu },
  data: function() {
    return {
      prevBgColor: undefined,
      menuOpen: false // TODO: Find better name, or clarify difference between expanded and open
    };
  },
  computed: {
    /**
     * The background color of the application.
     */
    // TODO: Put bgColor in global store
    bgColor: function() {
      const hue =
        this.$route.meta.hue || this.$route.matched[0]
          ? this.$route.matched[0].meta.hue
          : undefined;

      const color =
        hue !== undefined
          ? colors.getBackgroundColor(hue)
          : "rgb(255, 255, 255)";

      return color;
    },
    viewKey: function() {
      return this.$route.name;
    },
    hideMainContent: function() {
      return this.menuOpen;
    }
  },
  watch: {
    bgColor: function(newVal, oldVal) {
      this.prevBgColor = oldVal;
    }
  },
  methods: {
    handleHamburgerOpen() {
      this.setMenuOpen(true);
    },
    handleHamburgerClose() {
      this.setMenuOpen(false);
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
    /**
     * Tweens the application's background color through perceptually uniform color space.
     * @param {Element} el Transitioning element.
     * @param {Function} done Callback to declare that a transition has finished.
     * @param {String} duration Transition duration in milliseconds
     */
    backgroundTransitionLeave(
      el,
      done,
      duration = parseInt(css.routerTransitionDuration)
    ) {
      const defaultColor = "rgb(255, 255, 255)";

      const prevColor = this.prevBgColor || defaultColor;
      const nextColor = this.bgColor || defaultColor;

      // TODO: determine direction of sweep w/
      // direction = [absolute value of (fromHue - toHue)] > 180 ? counter-clockwise(-1) : clockwise(1)
      // This will prevent strange flashes during transitions
      sweep(this.$refs.app, "backgroundColor", prevColor, nextColor, {
        duration,
        // TODO: fork sweep.js to build an lchab sweep, hsluv & hsl flash bright yellow b/w orange and green
        space: "RGB",
        callback: () => done()
      });
    }
  },
  created: function() {
    // TODO: Add storage of history scroll positions https://github.com/vuejs/vue-router/issues/1187
    this.$router.beforeEach((to, from, next) => {
      const resetScrollPosition = el => {
        if (el) el.scrollTop = 0;
      };

      resetScrollPosition(this.$refs.app);
      next();
    });
  },
  mounted: function() {
    if (this.$route.name === "home") {
      // Transition is naturally called if first visit is on non-home route
      this.backgroundTransitionLeave({}, () => {}, 300);
    }
  }
};
</script>

<style lang="scss">
@import "~backpack.css";
@import "./styles/app.scss";

#app {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  flex-direction: column;

  overflow-x: hidden;
  overflow-y: auto;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  @include for-size(tablet-landscape-up) {
    flex-direction: row;
  }
}

.menu-bar {
  position: sticky;
  width: 100%;
  top: 0;

  z-index: 10; // TODO: use scss z-index mixin

  // flex-basis: calc(#{$g-header-height} / 0.8);
  flex-grow: 0;
  flex-shrink: 0;

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  pointer-events: none;
  @include header-height();
  @include header-height($property: flex-basis);

  @include for-size(tablet-landscape-up) {
    display: inline-block;
    width: $g-lefter-width;

    flex-basis: unset;

    flex-direction: column;

    @include header-height(desktop);
  }

  .logo {
    position: relative;
    top: 0;
    height: 64%;

    z-index: 999;

    flex-grow: 0;
    flex-shrink: 0;

    @include for-size(tablet-landscape-up) {
      height: 64%;
      left: 0;

      margin-top: 30px;
    }
  }

  .buttons {
    height: 64%;

    .hamburger {
      z-index: 999;

      flex-grow: 0;
      flex-shrink: 0;

      pointer-events: all;
    }
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
    z-index: 10; // TODO: use scss z-index mixin

    padding-bottom: 35px;
    opacity: 1;

    transition: opacity 200ms ease-in;

    &--hidden {
      opacity: 0;

      transition: opacity 200ms ease-out;
    }
  }
}

.view-leave,
.view-leave-active,
.view-leave-to {
  position: absolute;
  left: 0;
  top: 0;
}
</style>
