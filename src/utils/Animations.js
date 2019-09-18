import Velocity from "velocity-animate";

class Animations {
  constructor() {}

  /**
   *
   * @param {HtmlDocument(s)} el Element(s) to be animated.
   * @param {Object} settings
   * @param {Object} settings
   * @param {Object} settings
   *
   */
  static tweenColor(el, { prevRgb, nextRgb, properties = [
    "backgroundColor"
  ], complete = () => {} }) {
    const rgbTransition = [
      "Red",
      "Green",
      "Blue"
    ].reduce((transitions, channel, i) => {
      properties.forEach((prop) => {
        transitions[`${prop}${channel}`] = [
          nextRgb[i],
          prevRgb[i]
        ]
      })

      return transitions;
    }, {});

    return () => new Promise((resolve) => {
      Velocity(el, rgbTransition, {
        duration: 500,
        easing: "linear",
        queue: false,
        begin: undefined,
        progress: undefined,
        complete: () => {
          complete();
          resolve();
        },
        loop: false,
        delay: false
      });
    })
  }

  static slideIntoViewport(el, { xDistance, complete = () => {}, reverse = false }) {
    const dir = reverse ? "" : "-";

    return () => new Promise((resolve) => {
      Velocity(el, {
        translateX: [
          0,
          dir + `${xDistance}`
        ],
        translateY: [0, "20vh"], // TODO: randomize?
        rotateZ: [0, dir + "20deg"],
        translateZ: 0
      }, {
        duration: 650,
        easing: "swing",
        queue: false,
        begin: undefined,
        progress: undefined,
        complete: () => {
          complete();
          resolve();
        },
        loop: false,
        delay: false
      });
    });
  }

  static slideOutOfViewport(el, { xDistance, complete = () => {}, reverse = false }) {
    const dir = reverse ? "-" : "";

    return () => new Promise((resolve) => {
      Velocity(el, {
        translateX: [
          dir + `${xDistance}`,
          0
        ],
        translateY: ["20vh", 0],
        rotateZ: [dir + "20deg", 0],
        translateZ: 0
      }, {
        duration: 800,
        easing: "swing",
        queue: false,
        begin: undefined,
        progress: undefined,
        complete: () => {
          complete();
          resolve();
        },
        loop: false,
        delay: false
      })
    });
  }

  static _fade(el, on, complete = () => {}) {
    return () => new Promise((resolve) => {
      Velocity(el, { opacity: on ? [1, 0] : [0, 1] }, {
        duration: 500,
        easing: "ease-out", // "swing",
        queue: "",
        begin: undefined,
        progress: undefined,
        complete: () => {
          complete();
          resolve();
        },
        loop: false,
        delay: false
      });
    })
  }

  static fadeIn(el, { complete } = {}) {
    return this._fade(el, true, complete);
  }

  static fadeOut(el, { complete } = {}) {
    return this._fade(el, false, complete);
  }
}

/**
 * Router view transitions.
 */
const viewTransitions = {
  beforeAppear: function (el) {},

  /**
   * View's initial render transition.
   * Tweens all elements sensitive to route colors from white to the current
   * route color. Prerendered routes use white to be replaced by the
   * generated colors of the session.
   * Tweened elements:
   *    - App background
   *    - Page view gradients
   *    - TODO: mobile header
   * @param {Element} el Transitioning element.
   * @param {Function} done Callback to declare that a transition has finished.
   */
  appear: function (el, done) {
    const app = this.$refs.app;
    const gradients = el.getElementsByClassName("c-header-gradient");

    const prevRgb = this.prerenderColor;
    const nextRgb = this.currentRouteColor

    const tweenAppBg = Animations.tweenColor(app, {
      prevRgb,
      nextRgb
    });
    const tweenGradients = Animations.tweenColor(gradients, {
      prevRgb,
      nextRgb,
      properties: ["backgroundColor", "color"]
    })

    Promise.all([tweenAppBg(), tweenGradients()]).then(() => {
      this.setActiveColorString(this.colors.serializeRgb(nextRgb));
      done();
    });
  },
  afterAppear: function (el) {},
  cancelledAppear: function (el) {},

  /**
   * Before view component is transitioned in, via appear or enter methods.
   * Hides elements that initially render in the viewport or over elements that are
   * transitioning out.
   * @param {Element} el Transitioning element.
   */
  beforeEnter: function (el) {
    el.style.opacity = 0; // Hides the view b/c it initially renders in center of viewport
    el.getElementsByClassName("c-header-gradient")[0].style.opacity = 0;
    el.getElementsByTagName("h1")[0].style.opacity = 0;
  },

  /**
  * New view's transition.
  * First: simultaneously tweens elements affected by route color and
  * slides the first paper of views into the viewport.
  * Second: Fades in the view titles.
  * @param {Element} el Transitioning element.
  * @param {Function} done Callback to declare that a transition has finished.
  */
  enter: function (el, done) {
    const app = this.$refs.app;
    const paper = el.getElementsByClassName("paper")[0];
    const titles = el.getElementsByTagName("h1"); // TODO: exclude 'h1's in paper

    const slidePaperIntoViewport = Animations.slideIntoViewport(paper, {
      xDistance: paper.offsetWidth + parseInt(this.css.lefterWidthValue) + 200 // 200 accomodates for rotation into the viewport
    })

    const fadeInTitles = Animations.fadeIn(titles);

    const gradients = el.getElementsByClassName("c-header-gradient");
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
      slidePaperIntoViewport()
    ]);

    this.startEnter = () => {
      el.style.opacity = 1; // Previously hidden in beforeEnter, TODO: make dry with appear // RESET EL METHOD
      animations().then(() => {
        this.setActiveColorString(this.colors.serializeRgb(this.currentRouteColor));
        fadeInTitles();
        done();
      });
    };
  },

  /**
   * After the new view transition.
   * Reset opacity of header gradients, imoortant if page enters a non-zero scroll position.
   * @param {Element} el Transitioning element.
   */
  afterEnter: function (el) {
    const firstPageGradient = el.getElementsByClassName("c-header-gradient")[0];
    Velocity(firstPageGradient, { opacity: [1, 0] });
  },

  /**
   * View entering transition is cancelled.
   * @param {Element} el Transitioning element.
   */
  cancelledEnter: function (el) {
    console.log("enter cancelled");
    // TODO: If cancelled because router when backwards, reverse transition
    // Otherwise, no difference
  },

  /**
   * Before view transitions out.
   * Positions exiting view to allow overlap of new and old; absolute positioning
   * must occur on exiting view--if on new view, footer is misplaced and flash occurs when set
   * back to relative to fix footer.
   * Header gradient hides to prevent disjunct color transitions.
   * @param {Element} el Transitioning element.
   */
  beforeLeave: function (el) {
    el.style.position = "absolute";
    const firstPageGradient = el.getElementsByClassName("c-header-gradient")[0];
    firstPageGradient.style.opacity = 0; // TODO: the old gradient must remain in place
    // TODO: if router history are to retain scroll position, and if transition is to occur mid-page
    // the original gradient must remain while the old page slides out
    // New page slides in simultaneously or delayed, and new name only shows after slide in.
    // Old name hides immediately.
  },

  /**
   * View transitions out.
   * Simultaneously fades out view titles and slides papers out of the viewport.
   * @param {Element} el Transitioning element.
   * @param {Function} done Callback to declare that a transition has finished.
   */
  leave: function (el, done) {
    const papers = el.getElementsByClassName("paper");
    const titles = el.getElementsByTagName("h1"); // TODO: exclude 'h1's in paper

    const transformPapers = Animations.slideOutOfViewport(papers, {
      xDistance: "100vw"
    });

    const fadeTitles = Animations.fadeOut(titles);

    const animations = () => Promise.all([
      transformPapers(),
      fadeTitles()
    ]);

    animations().then(() => done());
  },
  afterLeave: function (el) {},
  cancelledLeave: function (el) {}
}

export { Animations, viewTransitions };
