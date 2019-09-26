import prismicJS from "prismic-javascript";

/**
 * Constructs an interface to interact with the Prismic API.
 * @param {Object} prismic Prismic javascript object.
 */
class Api {
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
      await this.api.query(""); // Initializes the API
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
  async fetchCurrentIssue({ includeEssays = false }) {
    const response = await this.api.query(
      this.predicates.at("document.type", "issue"),
      {
        orderings: "[my.issue.publication_date desc]"
      }
    );

    const issues = response.results;
    let currentIssue = issues[0];

    if (includeEssays) {
      currentIssue = await this.addEssaysToIssue(currentIssue);
    }

    return currentIssue;
  }

  /**
   * Adds fetched essays to an issue, and returns the issue.
   * @param {Object} issueDoc Prismic API object of an issue.
   * @return {Object} The given issue with essays attached.
   */
  async addEssaysToIssue(issueDoc) {
    issueDoc.data.essays = await this.fetchEssaysByIssue(issueDoc);
    return issueDoc;
  }

  /**
   * @returns {Array} The most recently published atlas projects.
   */
  async fetchRecentAtlases() {
    const response = await this.api.query(
      this.predicates.at("document.type", "atlas_project"),
      {
        pageSize: 4,
        orderings: "[document.first_publication_date desc]"
      }
    );

    return response.results;
  }

  /**
   * @param {String} slug A URL slug of a document.
   * @returns {Object} Returns a 'Page' document with a UID that matches the given slug.
   */
  async fetchIssueBySlug(slug, { includeEssays = false }) {
    let issueDoc = await this.getTypedDocumentBySlug("issue", slug);

    if (includeEssays) {
      issueDoc = await this.addEssaysToIssue(issueDoc);
    }

    return issueDoc;
  }

  /**
   * Returns an array of essays from the given issue.
   * @param {Object} issue Prismic API response for an issue.
   */
  async fetchEssaysByIssue(issue) {
    console.log(issue);
    if (issue.type.toLowerCase() !== "issue") {
      throw new Error("Prismic document of type 'Issue' required.");
    }

    let essayRequests = [];
    let essay;
    essayRequests = issue.data.essays.map(({ essay }) =>
      this.getById(essay.id, {
        fetchLinks: ["category.name", "category.list_position"]
      })
    );
    let essays = await Promise.all(essayRequests);
    return essays;
  }

  /**
   * Returns the data of a single document of the given type with a UID that matches the given slug.
   * @param {String} type A Prismic document type.
   * @param {String} slug A URL slug of a document.
   * @return {Object} Prismic document that matches the given slug.
   * @return {undefined} If document of type with given slug does not exist.
   */
  // TODO: return the entire document, not just data. some cases require slugs, uids, types, etc.
  async getTypedDocumentBySlug(type, slug) {
    try {
      const results = (await this.api.query(
        this.predicates.at(`my.${type}.uid`, slug)
      )).results;

      if (results.length === 0) {
        return undefined;
      }

      console.log(results);

      const result = results[0];
      return result;

      // let data = result.data;
      // data.id = result.id;
      // data.type = result.type;

      // return data;
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

    const issueContainsEssay = issue.data.essays.find(
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
