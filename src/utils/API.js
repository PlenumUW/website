import prismicJS from "prismic-javascript";

/**
 * Prismic Api specific to portfolio
 */
class Api {
  /**
   * Constructs an interface to interact with the Prismic API.
   * @param {Object} prismic Prismic javascript object.
   */
  constructor(endpoint, options) {
    this.endpoint = endpoint;
    this.options = options;
    this.initialized = false;
  }

  /**
   * Initializes the api. MUST be called after construction.
   */
  async init() {
    try {
      this.api = await prismicJS.api(this.endpoint, this.options);
      this.predicates = prismicJS.Predicates;
      const { results } = await this.api.query("");
      console.log("API", this.api);
      console.log("Results", results);
      this.initialized = true;
    } catch (err) {
      throw err;
    }
  }

  /**
   * @returns {Promise} Returns all essays.
   */
  async fetchEssays() {
    const essays = (await this.getDocuments("essay")).results;
    return essays;
  }

  /**
   * @returns {Promise} Returns all essays.
   */
  async fetchPages() {
    return (await this.getDocuments("page")).results;
  }

  /**
   * Returns the raw text from a Prismic data object.
   * @param {Array} prismicArr Array that contains a Prismic data object.
   */
  // TODO: move to prismic data mgmt class
  _getPrismicRawText(prismicArr) {
    return prismicArr[0].text;
  }

  /**
   * @returns {Promise} Returns all essays.
   */
  async fetchSiteMetadata() {
    const { title, description, image } = (await this.getDocuments(
      "site_metadata"
    )).results[0].data;

    return {
      description: this._getPrismicRawText(description),
      title: this._getPrismicRawText(title),
      image
    };
  }

  /**
   * @param {String} type Prismic portfolio document type, e.g. 'about', 'project'.
   * @returns {Promise} Promise of the specified Prismic document.
   */
  async getDocuments(type) {
    if (!this.initialized) {
      throw new Error("Api must be initialized before requests can be handled");
    }
    type = type.toLowerCase();

    if (!Object.keys(this.api.types).find(key => key === type)) {
      throw new Error("Requested type is not a valid Prismic document type.");
    }

    try {
      return await this.api.query(this.predicates.at("document.type", type));
    } catch (err) {
      console.error(
        "Failed to get Prismic documents of type '" +
          type +
          "'.  \n" +
          err.message
      );
      return err;
    }
  }
}

const prismicEndpoint = window.prismic.endpoint;
const prismicApiOptions = {};

let API = new Api(prismicEndpoint, prismicApiOptions); // TODO: move outside of this file

export default API;
