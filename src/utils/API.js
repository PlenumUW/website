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
   * @returns {Object} The most recently published issue.
   */
  async fetchCurrentIssue() {
    const response = await this.api.query(
      this.predicates.at("document.type", "issue"),
      {
        orderings: "[my.issue.publication_date desc]"
      }
    );

    const issues = response.results;
    return issues[0];
  }

  /**
   * @param {String} slug A URL slug of a document.
   * @returns {Object} Returns a 'Page' document with a UID that matches the given slug.
   */
  async fetchIssueBySlug(slug) {
    return this.getTypedDocumentBySlug("issue", slug);
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

      const result = results[0];

      let data = result.data;
      data.id = result.id;

      return data;
    } catch (err) {
      throw err;
    }
  }

  // TODO: have this class extend the ResolvedApi ?
  // This would remove the moments of '$api.api...', however, it would
  // couple this API with prismic API? Is it already coupled?
  async getById(id, options = {}) {
    return await this.api.getByID(id, options);
  }

  /**
   * @param {String} slug A URL slug of a document.
   * @returns {Object} Returns a 'Page' document with a UID that matches the given slug.
   */
  async fetchEssayBySlug(slug) {
    return this.getTypedDocumentBySlug("essay", slug);
  }

  /**
   * Returns an essay, only if the essay exists and exists within an issue that
   * corresponds to the given issue slug.
   * @param {String} issueSlug The slug of an issue.
   * @param {String} essaySlug The slug of an essay.
   */
  async fetchEssayBySlugs(issueSlug, essaySlug) {
    // TODO: improve the efficiency of this, only one API call should be made
    // TODO: does the validation process need to exist in the API? NO
    let issue = await this.getTypedDocumentBySlug("issue", issueSlug);
    if (!issue) return undefined;

    let essay = await this.fetchEssayBySlug(essaySlug);
    if (!essay) return undefined;

    const issueContainsEssay = issue.essays.find(
      essayObj => essayObj.essay.id === essay.id
    );

    return issueContainsEssay ? essay : undefined;
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
    return (await this.api.getSingle("site_metadata")).data;
  }

  /**
   * @returns {Object} Returns the site footer document.
   */
  async fetchSiteFooter() {
    return (await this.api.getSingle("site_footer")).data;
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
