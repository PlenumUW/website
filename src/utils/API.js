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
      console.log(await this.api.query("")); // Initializes the API
      this.initialized = true;
    } catch (err) {
      throw err;
    }
  }

  /**
   * @param {String} type Prismic document type to be retrieved.
   * @return {Array} All prismic documents that match the given type.
   */
  async fetchAllOf(type) {
    return (await this.getDocumentsByType(type)).results;
  }

  /**
   * @returns {Array} All essays.
   */
  async fetchAllEssays() {
    return await this.fetchAllOf("essay");
  }

  /**
   * @returns {Array} All pages.
   */
  async fetchAllPages() {
    return await this.fetchAllOf("page");
  }

  /**
   * @returns {Array} All issues.
   */
  async fetchAllIssues() {
    return await this.fetchAllOf("issue");
  }

  /**
   * Returns the data of a single document of the given type with a UID that matches the given slug.
   * @param {String} type A Prismic document type.
   * @param {String} slug A URL slug of a document.
   * @return {Object} Prismic document that matches the given slug.
   * @return {undefined} If document of type with given slug does not exist.
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
   * @param {String} slug A URL slug of a document.
   * @returns {Object} Returns a 'Page' document with a UID that matches the given slug.
   */
  async fetchEssayBySlug(slug) {
    return this.getTypedDocumentBySlug("essay", slug);
  }

  /**
   * @param {String} slug A URL slug of a document.
   * @returns {Object} Returns a 'Page' document with a UID that matches the given slug.
   */
  async fetchEssayBySlugs(issueSlug, essaySlug) {
    let issue = this.getTypedDocumentBySlug("issue", issueSlug);
    if (!issue) return undefined;

    let essay = this.fetchEssayBySlug(essaySlug);
    if (!essay) return undefined;

    // check whether the essay ID matches an essay id in the issue;
    return essay;
  }

  /**
   * @param {String} slug A URL slug of a document.
   * @returns {Object} Returns a 'Page' document with a UID that matches the given slug.
   */
  async fetchPageBySlug(slug) {
    return this.getTypedDocumentBySlug("page", slug);
  }

  /**
   * @returns {Object} Returns the site metadata document.
   */
  async fetchSiteMetadata() {
    return (await this.getDocumentsByType("site_metadata")).results[0].data;
  }

  /**
   * @returns {Object} Returns the site footer document.
   */
  async fetchSiteFooter() {
    return (await this.getDocumentsByType("site_footer")).results[0].data;
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

const prismicEndpoint = window.prismic.endpoint;
const prismicApiOptions = {};

let API = new Api(prismicEndpoint, prismicApiOptions);

export default API;
