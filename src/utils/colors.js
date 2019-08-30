import space from "color-space";
// TODO: figure out how to only import the hsluv with the rgb method in the prototype, 'space' is bloated
import hsluv from "color-space/hsluv";

/**
 * Color configurations
 */
const bg = {
  s: 20,
  l: 98
};
const menu = {
  s: 100,
  l: 84.5
};
const papers = {
  s: 100,
  l: 99
};

/**
 * Outputs standardized HSLuv colors.
 */
class ColorFactory {
  cosntructor(colorSpace, defaultHue = 180) {
    this.defaultHue = defaultHue;
    this.colorSpace = colorSpace;
  }

  getColorSpace() {
    return this.colorSpace;
  }

  getBackgroundColor(h) {
    return this._getRgbColor(h, bg);
  }

  getMenuColor(h) {
    return this._getRgbColor(h, menu);
  }

  getPaperColor(h) {
    return this._getRgbColor(h, papers);
  }

  _getRgbColor(h, { s, l }) {
    if (h < hsluv.min[0] || h > hsluv.max[0]) h = this.defaultHue;

    return this.serializeRgb(hsluv.rgb([h, s, l]));
  }

  /**
   * Returns a CSS-ready rgb string.
   * @param {Array} values Rgb channel values.
   */
  serializeRgb(values) {
    return `rgb(${values.join(",")})`;
  }
}

const colors = new ColorFactory(hsluv.alias[0]);
export default colors;
