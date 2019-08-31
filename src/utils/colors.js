import space from "color-space";
// TODO: figure out how to only import the hsluv with the rgb method in the prototype, 'space' is bloated
import hsluv from "color-space/hsluv";
// TODO: consider other color spaces, hsluv has bright yellows/greens (IMO)

/**
 * Color configurations
 */
const bg = {
  s: 20,
  l: 97
};
const menu = {
  s: 75,
  l: 89.5
};
const papers = {
  s: 100,
  l: 99
};

/**
 * Outputs standardized HSLuv colors.
 */
class ColorFactory {
  constructor(colorSpace, defaultHue = 180) {
    this.defaultHue = defaultHue;
    this.colorSpace = colorSpace;
  }

  getColorSpace() {
    return this.colorSpace;
  }

  getColorSpaceName() {
    return this.colorSpace.alias[0];
  }

  getBackgroundColor(h) {
    return this._getRgbColor(h, bg);
  }

  getMenuItemColor(h) {
    return this._getRgbColor(h, menu);
  }

  getPaperColor(h) {
    return this._getRgbColor(h, papers);
  }

  _getRgbColor(h, { s, l }) {
    if (h === undefined || h < hsluv.min[0] || h > hsluv.max[0]) {
      h = this.defaultHue;
      throw new Error("Hue value is required.");
    }

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

const colors = new ColorFactory(hsluv);
export default colors;
