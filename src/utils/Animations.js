import Velocity from "velocity-animate";

class Animations {
  constructor() {}

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
        easing: "swing",
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

export default Animations;
