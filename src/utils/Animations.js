import Velocity from "velocity-animate";

class Animations {
  constructor() {}

  /**
   *
   * @param {HtmlDocument(s)} el Element(s) to be animated.
   * @param {Object} settings
   * @param {Object} prevRgb
   * @param {Object} nextRgb
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
        rotateZ: [0, dir + "10deg"],
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
      const transformOrigin = (reverse ? "100%" : "0") + " 100%";
      if (el.length !== undefined) {
        for (let element of el) {
          element.style.transformOrigin = transformOrigin;
        }
      } else {
        el.style.transformOrigin = transformOrigin;
      }
      Velocity(el, {
        translateX: [
          dir + `${xDistance}`,
          0
        ],
        translateY: ["20vh", 0],
        rotateZ: [dir + "5deg", 0],
        translateZ: 0
      }, {
        duration: 900,
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

// TODO: move each transition group to diff files?
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
    console.log('before enter');
    el.style.opacity = 0; // Hides the view b/c it initially renders in center of viewport

    const firstTitle = el.getElementsByTagName("h1")[0];
    if (firstTitle) firstTitle.style.opacity = 0;

    // Hide entering gradient to prevent covering up content near top of viewport, e.g. Home Header Titles
    // Unhidden afterEnter
    const gradients = el.getElementsByClassName("c-header-gradient");
    for (let gradient of gradients) {
      if (gradient.getBoundingClientRect().top === 0) {
        gradient.style.opacity = 0;
        break;
      }
    }
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
    console.log('enter');
    const papers = el.getElementsByClassName("paper");
    let slidePaperIntoViewport = () => {};
    if (papers.length > 0) {
      slidePaperIntoViewport = Animations.slideIntoViewport(papers, {
        xDistance: papers[0].offsetWidth + parseInt(this.css.lefterWidthValue) + 200 // 200 accomodates for rotation into the viewport
      });
    }

    const titles = el.getElementsByTagName("h1"); // TODO: exclude 'h1's in paper
    let fadeInTitle = () => {};
    if (titles.length > 0) {
      fadeInTitle = Animations.fadeIn(titles);
    }

    const gradients = document.getElementsByClassName("c-header-gradient");
    let tweenGradients = () => {};
    if (gradients) {
      tweenGradients = Animations.tweenColor(gradients, {
        prevRgb: this.prevRouteColor,
        nextRgb: this.currentRouteColor,
        properties: ["backgroundColor", "color"]
      })
    }

    const app = this.$refs.app;
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
      console.log('enter started')
      el.style.opacity = 1; // Previously hidden in beforeEnter, TODO: make dry with appear // RESET EL METHOD

      animations().then(() => {
        console.log('enter animations finished');
        fadeInTitle();

        this.setActiveColorString(this.colors.serializeRgb(this.currentRouteColor));
        this.startEnter = undefined;
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
    console.log('after enter');
    const gradients = el.getElementsByClassName("c-header-gradient");
    for (let gradient of gradients) {
      if (gradient.style.opacity === 0 || gradient.getBoundingClientRect().top === 0) {
        Velocity(gradient, { opacity: [1, 0] })
      }
    }
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
   * Element is offset in order to create the illusion that the new view is
   * transitioning into it's start position, while this element slides out from it's current position.
   * Header gradient hides to prevent disjunct color transitions.
   * @param {Element} el Transitioning element.
   */
  beforeLeave: function (el) {
    const app = this.$refs.app;
    const scrollPosVal = app.scrollTop; // THIS IS BEING CALLED AFTER SCROLL IS RESET BY ROUTER
    const scrollPos = `${scrollPosVal}px`;
    const elOffset = "-" + scrollPos;

    app.scrollTop = 0;
    el.style.position = "absolute";
    el.style.top = elOffset;

    // Hide all gradients except if it's 'stuck' to top of viewport
    const gradients = el.getElementsByClassName("c-header-gradient");
    for (let gradient of gradients) {
      if (gradient.getBoundingClientRect().top !== 0) {
        gradient.style.opacity = 0;
      }
    }

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
    console.log('leaving')

    const papers = el.getElementsByClassName("paper");
    let transformPapers = () => new Promise(resolve => resolve());
    if (papers.length > 0) {
      transformPapers = Animations.slideOutOfViewport(papers, {
        xDistance: "120vw" // extra 20vw to accomodate for rotation displacement
      });
    }

    const titles = el.getElementsByTagName("h1"); // TODO: exclude 'h1's in paper
    let fadeTitles = () => new Promise(resolve => resolve());
    if (titles) {
      fadeTitles = Animations.fadeOut(titles);
    }

    const animations = () => Promise.all([
      transformPapers(),
      fadeTitles()
    ]);

    animations().then(() => {
      done()
    });
  },
  afterLeave: function (el) {
    console.log('after leave')
  },
  cancelledLeave: function (el) {}
}

export { Animations, viewTransitions };
