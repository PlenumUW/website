<template>
  <div
    id="app"
    ref="app"
    class="app"
    :style="{ 'background-color': bgColor }"
    :class="{ 'app--no-scroll': hideMainContent }"
  >
    <the-site-header
      :color="bgColor"
      :hamburgerOpen.sync="menuOpen"
      @logoClick="handleLogoClick"
    ></the-site-header>

    <div class="main-content-container">
      <the-main-menu class="main-menu" :open.sync="menuOpen"></the-main-menu>

      <main class="main" :class="{ 'main--hidden': hideMainContent }">
        <transition name="view" @leave="backgroundTransitionLeave">
          <router-view
            :key="viewKey"
            class="router-view"
            :color="bgColor"
          ></router-view>
        </transition>
      </main>
      <site-footer
        :color="bgColor"
        :class="{ 'site-footer--hidden': hideMainContent }"
      ></site-footer>
    </div>
  </div>
</template>

<script>
import sweep from "@/utils/sweep";
import colors from "@/utils/colors";
import { fitText } from "@/utils/fittext.js";
import API from "@/utils/API.js";

// eslint-disable-next-line no-unused-vars
import whatInput from "what-input";

import css from "@/styles/js.scss";

import TheMainMenu from "@/components/singletons/TheMainMenu";
import TheSiteHeader from "@/components/singletons/TheSiteHeader";
import SiteFooter from "@/components/singletons/TheSiteFooter";

export default {
  components: { TheSiteHeader, TheMainMenu, SiteFooter },
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
    // TODO: replace background gradient with box-shadow, this will help make icon height relative to header height ore intuitive
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
    },
    metaTitle: function() {
      return "Plenum Journal";
    },
    metaImgSrc: function() {
      return window.location.origin + require("@/assets/raster/meta-image.png");
    },
    metaDescription: function() {
      return "Plenum is an online journal of geographic works produced by undergraduate students at the University of Washington.";
    }
  },
  watch: {
    bgColor: function(newVal, oldVal) {
      this.prevBgColor = oldVal;
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
    fitText();
    // API.init()
    //   .then(res => {
    //     console.log(res);
    //     return API.fetchEssays();
    //   })
    //   .then(response => {
    //     console.log(response);
    //     return API.fetchPages();
    //   })
    //   .then(res => console.log(res));

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
  },
  meta() {
    const metaTitle = this.metaTitle;
    const baseUrl = window.location.origin;
    const metaImgSrc = this.metaImgSrc;
    const metaDescription = this.metaDescription;

    return {
      title: "Plenum Journal",
      meta: [
        { property: "og:title", content: metaTitle, vmid: "title" },
        { property: "og:type", content: "website", vmid: "type" },
        { property: "og:url", content: baseUrl, vmid: "url" },
        {
          property: "og:image",
          content: metaImgSrc,
          vmid: "image"
        },
        {
          property: "og:description",
          content: metaDescription,
          vmid: "description"
        }
      ]
    };
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
  // overflow-y: auto;
  overflow-y: scroll; // Scroll required for momentum scrolling in iOS
  -webkit-overflow-scrolling: touch; // Required for momentum scrolling in iOS

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  @include for-size(tablet-landscape-up) {
    flex-direction: row;
  }

  &--no-scroll {
    overflow: hidden;
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

.view-leave,
.view-leave-active,
.view-leave-to {
  position: absolute;
  left: 0;
  top: 0;
}
</style>
