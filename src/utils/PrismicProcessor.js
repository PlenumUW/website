class PrismicProcessor {
  constructor() {}

  /**
   * Returns the raw text from a Prismic data object.
   * @param {Array} prismicArr Array that contains a Prismic data object.
   */
  static getPrismicRawText(prismicArr) {
    return prismicArr[0].text;
  }
}

export default PrismicProcessor;
