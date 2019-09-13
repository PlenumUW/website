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
    return (await this.getDocumentsByType("essay")).results;
  }

  /**
   * @returns {Array} Returns all documents of type 'Page'.
   */
  async fetchAllPages() {
    return (await this.getDocumentsByType("page")).results;
  }

  async getIssues() {
    return (await this.getDocumentsByType("issue")).results;
  }

  /**
   * Returns the data of a single document of the given type with a UID that matches the given slug.
   * If the document does not exist, returns undefined.
   * @param {String} type A Prismic document type.
   * @param {String} slug A URL slug of the requested document.
   */
  async getTypedDocumentBySlug(type, slug) {
    try {
      const results = (await this.api.query(
        this.predicates.at(`my.${type}.uid`, slug)
      )).results;

      if (results.length === 0) {
        return undefined;
      }

      return results[0].data;
    } catch (err) {
      throw err;
    }
  }

  /**
   * @returns {Object} Returns a 'Page' document with a UID that matches the given slug.
   */
  async fetchPageBySlug(slug) {
    return this.getTypedDocumentBySlug("page", slug);
  }

  /**
   * @returns {Object} Returns the site metadata.
   */
  async fetchSiteMetadata() {
    return (await this.getDocumentsByType("site_metadata")).results[0].data;
  }

  /**
   * @returns {Object} Returns the site metadata.
   */
  async fetchSiteFooter() {
    return (await this.getDocumentsByType("site_footer")).results[0].data;
  }

  async getDocumentById(id, options = {}) {
    return (await this.api.query(
      this.predicates.at("document.id", id),
      options
    )).results[0];
  }

  /**
   * @param {String} type Prismic portfolio document type, e.g. 'about', 'project'.
   * @returns {Promise} Promise of the specified Prismic document.
   */
  async getDocumentsByType(type) {
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

const prismicEndpoint = "https://plenum-website.cdn.prismic.io/api/v2"; //window.prismic.endpoint;
const prismicApiOptions = {};

let API = new Api(prismicEndpoint, prismicApiOptions);

export default API;
