import _ from "lodash";
import space from "color-space";
// TODO: figure out how to only import the hsluv with the rgb method in the prototype, 'space' is bloated
import hsluv from "color-space/hsluv";
import lchab from "color-space/lchab";

/**
 * Color configurations
 */
const schemes = {
  hsluv: {
    bg: {
      saturation: 20,
      lightness: 97
    },
    menu: {
      saturation: 96.2,
      lightness: 90
    },
    paper: {
      saturation: 100,
      lightness: 99
    }
  },
  lchab: {
    bg: {
      lightness: 98,
      chroma: 3
    },
    menu: {
      lightness: 90,
      chroma: 34
    },
    paper: {
      lightness: 99,
      chroma: 100
    }
  }
};

/**
 * Outputs standardized colors from a specified color space.
 */
class ColorFactory {
  constructor(colorSpace, schemes) {
    this._defaultHue = 180;
    this._colorSpace = colorSpace;
    this._bg = schemes.bg;
    this._menu = schemes.menu;
    this._paper = schemes.paper;
  }

  get colorSpace() {
    return this._colorSpace;
  }

  get colorSpaceName() {
    return this.colorSpace.alias[0];
  }

  getBackgroundColor(h) {
    return this._getRgbColor(h, this._bg);
  }

  getMenuItemColor(h) {
    let color = this._getRgbColor(h, this._menu);
    return color;
  }

  getPaperColor(h) {
    return this._getRgbColor(h, this._paper);
  }

  /**
   * Returns a set of hues of equal distant along the hue channel of the color space.
   * @param {Number} num The number of hues to return.
   */
  getEquidistantHues(num) {
    const colorSpace = this.colorSpace;
    const whiteHueBuffer = 20; // For color spaces that produce white along the hues
    const min = colorSpace.min[this.hueChannelIndex];
    const max = colorSpace.max[this.hueChannelIndex];
    const range = max - min;
    const hueInterval = range / num;

    return _.range(min, max, hueInterval);
  }

  _getRgbColor(h, scheme) {
    const hueIndex = this.hueChannelIndex;
    if (
      h === undefined ||
      h < this.colorSpace.min[hueIndex] ||
      h > this.colorSpace.max[hueIndex]
    ) {
      h = this._defaultHue;
      throw new Error("Hue value is required.");
    }

    let channelValues = new Array(3);
    this.colorSpace.channel.forEach((channel, index) => {
      if (channel === "hue") {
        channelValues[index] = h;
      } else if (scheme.hasOwnProperty(channel)) {
        channelValues[index] = scheme[channel];
      } else {
        throw new Error("Scheme channels do not match current color space.");
      }
    });

    return this.serializeRgb(this.colorSpace.rgb(channelValues));
  }

  get hueChannelIndex() {
    return this.colorSpace.channel.indexOf("hue");
  }

  /**
   * Returns a CSS-ready rgb string.
   * @param {Array} values Rgb channel values.
   */
  serializeRgb(values) {
    return `rgb(${values.join(",")})`;
  }
}

const colors = new ColorFactory(lchab, schemes.lchab);
export default colors;
