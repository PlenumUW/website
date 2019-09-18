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


            @before-appear="() => {}"
            @appear="appear"
            @after-appear="() => {}"

            @before-enter="beforeEnter"
            @enter="enter"
            @after-enter="afterEnter"
            @enter-cancelled="enterCancelled"

            @before-leave="beforeLeave"
            @leave="leave"
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
import Animations from "@/utils/Animations";
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
      prevRouteColor: [255, 255, 255],
      activeColorString: "rgb(255, 255, 255)",
      menuOpen: false, // TODO: Find better name, or clarify difference between expanded and open
      startEnter: () => {}
    };
  },
  computed: {

    /**
     * The background color of the application.
     */
    // TODO: Put currentRouteColor in global store
    // TODO: replace background gradient with box-shadow, this will help make icon height relative to header height ore intuitive
    currentRouteColor: function () {
      if (process.env.VUE_APP_BUILD_OPTION === "prerender") {
        return [
          255,
          255,
          255
        ];
      }

      const hue =
        this.$route.meta.hue || this.$route.matched[0]
          ? this.$route.matched[0].meta.hue
          : undefined;

      const color =
        hue !== undefined
          ? colors.getBackgroundColor(hue)
          : "rgb(255, 255, 255)";

      const colorValues = colors.getRgbValuesFromString(color);

      return colorValues;
    },
    viewKey: function () {
      return this.$route.name;
    },
    hideMainContent: function () {
      return this.menuOpen;
    }
  },
  watch: {
    currentRouteColor: function (newVal, oldVal) {
      this.prevRouteColor = oldVal;
    }
  },
  methods: {
    setActiveColorString(colorString) {
      this.activeColorString = colorString;
    },
    enterCancelled() {
      console.log("enter cancelled");
      // If cancelled because router when backwards, reverse transition
      // Otherwise, no difference
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
    beforeEnter(el) {
      console.log('before enter');

      el.style.opacity = 0; // Hides the view b/c it initially renders in center of viewport
      el.getElementsByClassName("c-header-gradient")[0].style.opacity = 0;
    },
    appear(el, done) {
      const prevRouteColor = this.prevRouteColor;
      const nextRouteColor = this.currentRouteColor;

      const rgbChannels = ["Red", "Green", "Blue"];
      let rgbTransition = {};
      rgbChannels.forEach((channel, index) => {
        rgbTransition[`backgroundColor${channel}`] = [
          nextRouteColor[index],
          255
        ]
      });

      Velocity(app, rgbTransition, {
        duration: 500,
        easing: "linear",
        queue: false,
        begin: undefined,
        progress: undefined,
        complete: () => {
          console.log('tween complete');
          console.log(nextRouteColor)
          this.setActiveColorString(colors.serializeRgb(nextRouteColor));
          done();
        },
        loop: false,
        delay: false
      });
    },
    enter(el, done) {
      console.log('enter');
      const app = this.$refs.app;
      const papers = el.getElementsByClassName("paper");
      console.log(papers);
      const paper = papers[0];
      const titles = el.getElementsByTagName("h1"); // TODO: exclude 'h1's in paper

      const transformPaper = Animations.slideIntoViewport(paper, {
        xDistance: paper.offsetWidth + parseInt(css.lefterWidthValue) + 200 // 200 accomodates for rotation into the viewport
      })

      const fadeTitles = Animations.fadeIn(titles);

      const gradients = el.getElementsByClassName("c-header-gradient");
      console.log(gradients)
      // TODO: tween mobile menu colors
      const tweenGradients = Animations.tweenColor(gradients, {
        prevRgb: this.prevRouteColor,
        nextRgb: this.currentRouteColor,
        properties: ["backgroundColor", "color"]
      })

      const tweenAppBg = Animations.tweenColor(app, {
        prevRgb: this.prevRouteColor,
        nextRgb: this.currentRouteColor
      });


      const animations = () => Promise.all([
        tweenAppBg(),
        tweenGradients(),
        transformPaper(),
        fadeTitles()
      ]);

      this.startEnter = () => {
        console.log('start enter method called');
        el.style.opacity = 1; // Previously hidden in beforeEnter, TODO: make dry with appear // RESET EL METHOD
        animations().then(() => {
          this.setActiveColorString(colors.serializeRgb(this.currentRouteColor));

          console.log('enter animation finished');
          done();
        });
      };
    },
    afterEnter(el) {
      console.log('after enter')

      if (el.style.opacity === 0) {
        el.style.opacity = 1;
      }
      el.getElementsByClassName("c-header-gradient")[0].style.opacity = 1;
    },

    beforeLeave(el) {
      el.style.position = "absolute";
      el.style.top = "0";
      el.style.left = "0";
      console.log("before leave", el.style.position);
      const gradients = el.getElementsByClassName("c-header-gradient");
      gradients[0].style.opacity = 0; // TODO: the old gradient must remain in place
      // TODO: if router history are to retain scroll position, and if transition is to occur mid-page
      // the original gradient must remain while the old page slides out
      // New page slides in simultaneously or delayed, and new name only shows after slide in.
      // Old name hides immediately.
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
      console.log("leave");
      const papers = el.getElementsByClassName("paper");
      const titles = el.getElementsByTagName("h1"); // TODO: exclude 'h1's in paper

      const transformPapers = Animations.slideOutOfViewport(papers, {
        xDistance: "100vw"
      });

      const fadeTitles = Animations.fadeOut(titles);


      const animations = () => Promise.all([
        transformPapers(),
        // tweenGradients(),
        fadeTitles()
      ]);

      animations().then(() => done());
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
