<template>
  <div id="app" ref="app" :style="{ 'background-color': bgColor }">
    <div class="lefter">
      <the-logo class="logo" :width="64"></the-logo>
      <the-main-menu></the-main-menu>
    </div>
    <transition @leave="backgroundTransitionLeave">
      <router-view :key="viewKey" class="router-view"></router-view>
    </transition>
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
      const hue = this.$route.meta.hue;
      const color = hue ? colors.getBackgroundColor(hue) : "rgb(255, 255, 255)";
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
        space: colors.getColorSpaceName(),
        callback: () => done()
      });
    }
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
  height: 100vh;
  left: 0;
  right: 0;

  display: flex;
  flex-direction: row;

  overflow-x: hidden;
  overflow-y: auto;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.lefter {
  position: fixed;
  width: $g-lefter-width;
  height: 100%;

  z-index: 10; // TODO: use scss z-index mixin

  flex-basis: $g-lefter-width;
  flex-grow: 0;
  flex-shrink: 0;

  display: flex;
  flex-direction: column;

  pointer-events: none;
}

.logo {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: $g-header-height;

  flex-basis: $g-header-height;
  flex-grow: 0;
  flex-shrink: 0;
}

.router-view {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200%;

  padding-left: $g-lefter-width;
}
</style>
