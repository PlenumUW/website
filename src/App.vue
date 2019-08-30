<template>
  <div id="app" ref="app" :style="{ 'background-color': bgColor }">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/test">Test</router-link>
    </div>
    <transition @enter="backgroundTransitionEnter">
      <router-view />
    </transition>
    <button @click="handleTest" :style="{ background: test ? 'green' : 'red' }">
      Test
    </button>
  </div>
</template>

<script>
import sweep from "@/utils/sweep";
import css from "@/styles/js.scss";
import colors from "@/utils/colors";

export default {
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
      return colors.getBackgroundColor(this.$route.meta.hue);
    },
    test: function() {
      return this.$store.state.test;
    }
  },
  watch: {
    bgColor: function(newVal, oldVal) {
      this.prevBgColor = oldVal;
    }
  },
  methods: {
    handleTest() {
      this.$store.dispatch("toggleTest");
    },
    /**
     * Tweens the application's background color through perceptually uniform color space.
     * @param {Element} el Transitioning element.
     * @param {Function} done Callback to declare that a transition has finished.
     * @param {String} duration Transition duration in milliseconds
     */
    backgroundTransitionEnter(
      el,
      done,
      duration = parseInt(css.routerTransitionDuration)
    ) {
      const prevColor = this.prevBgColor || "rgb(255, 255, 255)";
      const nextColor = this.bgColor || colors.getBackgroundColor(0);

      sweep(this.$refs.app, "backgroundColor", prevColor, nextColor, {
        duration,
        space: colors.getColorSpace(),
        callback: () => done()
      });
    }
  },
  mounted: function() {
    if (this.$route.name === "home") {
      // Transition is naturally called if first visit is on non-home route
      this.backgroundTransitionEnter({}, () => {}, 300);
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
  left: 0;
  right: 0;
  bottom: 0;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
