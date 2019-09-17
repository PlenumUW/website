<template>
  <div
    id="app"
    ref="app"
    class="app"
    :style="{ 'background-color': bgColor }"
    :class="{ 'app--no-scroll': hideMainContent }"
  >
    <div class="app__horizontal-wrapper">
      <the-site-header
        :color="bgColor"
        :hamburgerOpen.sync="menuOpen"
        @logoClick="handleLogoClick"
      ></the-site-header>

      <div class="main-content-container">
        <the-main-menu class="main-menu" :open.sync="menuOpen"></the-main-menu>

        <main class="main" :class="{ 'main--hidden': hideMainContent }">
          <transition
            :css="false"

            @before-enter="beforeEnter"
            @enter="enter"
            @after-enter="afterEnter"
            @enter-cancelled="enterCancelled"

            @before-leave="beforeLeave"
            @leave="leave"
            @after-leave="afterLeave"
            @leave-cancelled="leaveCancelled"
          >
            <router-view
              :key="viewKey"
              :id="viewKey"
              class="router-view"

              :color="bgColor"
              :loadedCallback="startEnter"
            ></router-view>
          </transition>
        </main>
      </div>
    </div>

    <site-footer
      :color="bgColor"
      :class="{ 'site-footer--hidden': hideMainContent }"
    ></site-footer>
  </div>
</template>

<script>
import Velocity from "velocity-animate";
import colors from "@/utils/colors";
import { fitText } from "@/utils/fittext.js";

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
      prevBgColor: undefined,
      menuOpen: false, // TODO: Find better name, or clarify difference between expanded and open
      endLeave: () => {
        console.log('should not be called')
      },
      startEnter: () => {}
    };
  },
  computed: {

    /**
     * The background color of the application.
     */
    // TODO: Put bgColor in global store
    // TODO: replace background gradient with box-shadow, this will help make icon height relative to header height ore intuitive
    bgColor: function () {
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
    viewKey: function () {
      return this.$route.name;
    },
    hideMainContent: function () {
      return this.menuOpen;
    }
  },
  watch: {
    bgColor: function (newVal, oldVal) {
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

    beforeEnter(el) {
      console.log("before enter");

      el.style.position = "absolute";
      const titles = el.getElementsByTagName("h1");
      const paper = el.getElementsByClassName("paper")[0];

      paper.style.translateX = "-100vw"
      paper.style.translateY = "-100vh"
      paper.style.rotateZ = "-10deg"

      for (let title of titles) {
        title.style.opacity = 0;
      }
    },
    async enter(el, done) {
      const paper = el.getElementsByClassName("paper")[0];
      const titles = el.getElementsByTagName("h1"); // TODO: exclude 'h1's in paper

      const defaultColor = "rgb(255, 255, 255)";

      const prevColor = this.prevBgColor || defaultColor;
      const nextColor = this.bgColor || defaultColor;

      const transformPaper = new Promise((resolve) => {
        Velocity(paper, {
          translateX: [0, "-100vw"],
          translateY: [0, "20vh"],
          rotateZ: [0, "-20deg"],
          translateZ: 0
        }, {
          duration: 700,
          easing: "swing",
          queue: "",
          begin: undefined,
          progress: undefined,
          complete: resolve,
          loop: false,
          delay: false
        });
      });

      const fadeTitles = new Promise((resolve) => {
        Velocity(titles, { opacity: 1 }, {
          duration: 1000,
          easing: "swing",
          queue: "",
          begin: undefined,
          progress: undefined,
          complete: resolve,
          loop: false,
          delay: false
        });
      });

      const animations = () => Promise.all([
        transformPaper,
        fadeTitles
      ]);

      this.startEnter = async () => {
        await animations();
        console.log("enter transition finished");

        done();
      };
    },
    afterEnter(el) {
      el.style.position = "relative";
      console.log("after enter");
    },

    /**
     * Tweens the application's background color through perceptually uniform color space.
     * @param {Element} el Transitioning element.
     * @param {Function} done Callback to declare that a transition has finished.
     * @param {String} duration Transition duration in milliseconds
     */
    async leave(
      el,
      done,
      duration = parseInt(css.routerTransitionDuration)
    ) {
      // this.endLeave = () => {
      //   console.log("Page finished loading. Page starting 'enter' transition.")
      //   done();
      // }

      const appBg = this.$refs.app;
      const papers = el.getElementsByClassName("paper");
      const titles = el.getElementsByTagName("h1"); // TODO: exclude 'h1's in paper

      const defaultColor = "rgb(255, 255, 255)";

      const prevColor = this.prevBgColor || defaultColor;
      const nextColor = this.bgColor || defaultColor;

      const transformPapers = new Promise((resolve) => {
        Velocity(papers, {
          translateX: ["100vw", 0],
          translateY: ["20vh", 0],
          rotateZ: ["20deg", 0],
          translateZ: 0
        }, {
          duration: 800,
          easing: "ease-in",
          queue: "",
          begin: undefined,
          progress: undefined,
          complete: resolve,
          loop: false,
          delay: false
        });
      });

      const fadeTitles = new Promise((resolve) => {
        Velocity(titles, { opacity: 0 }, {
          duration: 300,
          easing: "swing",
          queue: "",
          begin: undefined,
          progress: undefined,
          complete: resolve,
          loop: false,
          delay: false
        });
      });

      const tweenBackground = new Promise((resolve) => {
        Velocity(appBg, { "background-color": [nextColor, prevColor] }, {
          duration: 500,
          easing: "linear",
          queue: "",
          begin: undefined,
          progress: undefined,
          complete: resolve,
          loop: false,
          delay: false
        });
      });

      const animations = async () => await Promise.all([
        transformPapers,
        fadeTitles,
        tweenBackground
      ]);

      console.log("leave animations started");
      await animations();
      done();
      console.log("leave animation finished", el);
    },
    afterLeave(el) {
      console.log("after leave");
    }
  },
  created: async function () {
    fitText();

    // TODO: Add storage of history scroll positions https://github.com/vuejs/vue-router/issues/1187
    this.$router.beforeEach((to, from, next) => {
      const resetScrollPosition = (el) => {
        if (el) el.scrollTop = 0;
      };

      resetScrollPosition(this.$refs.app);
      next();
    });
  },
  mounted: function () {
    if (this.$route.name === "home") {
      // Transition is naturally called if first visit is on non-home route
      this.leave({}, () => {}, 300);
    }
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
}

// .router-view {
//   // transition: transform 800ms ease-in-out;
//   // /deep/ h1 {
//   //   opacity: 1;

//   //   // transition: opacity 300ms ease-out;
//   // }

//   /deep/ .paper {
//     // transform: translate(0, 0);

//     transition: transform 800ms ease-in-out;

//     h1 {
//       opacity: 1;
//     }
//   }
// }

// .view-enter {
//   // transform: translate(-200vw, 100vh);

//   // /deep/ h1 {
//   //   opacity: 0;

//   //   transition: opacity 300ms ease-out; // Fade in
//   // }

//   /deep/ .paper {
//     transform: translate(-200vw, 40vh);

//     transition: transform 800ms ease-out;


//     h1 {
//       opacity: 1;
//     }
//   }
// }

// .view-enter-active {
//   // transition: transform 800ms ease-in-out;
//   // /deep/ h1 {
//   //   transition: opacity 300ms ease-out; // Fade in
//   // }

//   /deep/ .paper {
//     transition: transform 800ms ease-in-out;
//   }
// }

// .view-enter-to {
//   // transform: translate(0, 0);

//   // /deep/ h1 {
//   //   // transform: translate(0, 0);
//   //   opacity: 1;

//   //   // transition: opacity 300ms ease-in;
//   // }

//   /deep/ .paper {
//     transform: translate(0, 0);

//     transition: transform 800ms ease-in-out;

//     h1 {
//       opacity: 1;
//     }
//   }
// }

// .view-leave-active {
//   // transition: transform 800ms ease-in-out;
// }

// .view-leave-to {
//   // transform: translate(200vw, -200vh);

//   /deep/ h1 {
//     opacity: 0;

//     transition: opacity 300ms ease-in-out; // Fade out
//   }

//   /deep/ .paper {
//     transform: translate(200vw, 40vh);

//     transition: transform 800ms ease-in-out;

//     h1 {
//       opacity: 1;
//     }
//   }
// }

// .view-leave,
// .view-leave-to,
// .view-enter,
// .view-enter-to {
//   position: absolute;
//   left: 0;
//   top: 0;
// }
</style>
