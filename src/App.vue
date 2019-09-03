<template>
  <div id="app" ref="app" :style="{ 'background-color': bgColor }">
    <div class="menu-bar" :style="{ 'background-color': bgColor }">
      <the-logo class="logo" :width="64"></the-logo>
    </div>

    <div class="main-content-container">
      <the-main-menu class="main-menu" :bgColor="bgColor"></the-main-menu>
      <main>
        <transition name="view" @leave="backgroundTransitionLeave">
          <router-view :key="viewKey" class="router-view"></router-view>
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
import TheMainMenu from "@/components/singletons/TheMainMenu";

export default {
  components: { TheLogo, TheMainMenu },
  data: function() {
    return {
      prevBgColor: undefined
    };
  },
  computed: {
    /**
     * The background color of the application.
     */
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
    }
  },
  watch: {
    bgColor: function(newVal, oldVal) {
      this.prevBgColor = oldVal;
    }
  },
  methods: {
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
  height: 100%;
  top: 0;

  z-index: 10; // TODO: use scss z-index mixin

  flex-basis: $g-lefter-width;
  flex-grow: 0;
  flex-shrink: 0;

  display: flex;
  flex-direction: row;

  pointer-events: none;

  @include for-size(tablet-landscape-up) {
    display: inline-block;
    width: $g-lefter-width;

    flex-direction: column;
  }

  .logo {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: $g-header-height;

    z-index: 999;

    flex-basis: $g-header-height;
    flex-grow: 0;
    flex-shrink: 0;
  }
}

.main-menu {
  position: fixed;
  width: 100%;
  height: 100%;

  z-index: 11; // TODO: use scss z-index mixin

  @include for-size(tablet-landscape-up) {
    width: fit-content;
    height: fit-content;
    left: 0;
    top: 265px;
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
}

.view-leave,
.view-leave-active,
.view-leave-to {
  position: absolute;
  left: 0;
  top: 0;
}
</style>
