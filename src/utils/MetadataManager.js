import _ from "lodash";

class MetadataManager {
  constructor() {}

  static _getPrimaryMetaTag(name, content, vmid) {
    return { name, content, vmid: vmid || `primary-${name}` };
  }

  static _getOpenGraphMetaTag(property, content, vmid) {
    return {
      property: `og:${property}`,
      content,
      vmid: vmid || `og-${property}`
    };
  }

  static _getTwitterMetaTag(property, content, vmid) {
    return {
      property: `twitter:${property}`,
      content,
      vmid: vmid || `twitter-${property}`
    };
  }

  static _getOpenGraphImageData({ url, dimensions, alt }) {
    const { width, height } = dimensions;
    let data = [];

    data.push(this._getOpenGraphMetaTag("image", url));
    data.push(this._getOpenGraphMetaTag("image:alt", alt));
    data.push(this._getOpenGraphMetaTag("image:width", width));
    data.push(this._getOpenGraphMetaTag("image:height", height));
    data.push(
      this._getOpenGraphMetaTag(
        "image:secure_url",
        url.includes("https") ? url : null
      )
    );

    return data;
  }

  static getOpenGraphMetadata({
    title,
    description,
    image,
    type,
    authors,
    url
  }) {
    let metadata = [];

    if (title) metadata.push(this._getOpenGraphMetaTag("title", title));

    if (description)
      metadata.push(this._getOpenGraphMetaTag("description", description));

    if (type) metadata.push(this._getOpenGraphMetaTag("type", type));

    if (image) {
      Array.prototype.push.apply(metadata, this._getOpenGraphImageData(image));
    }

    if (authors) {
      authors = typeof authors === "string" ? [authors] : authors;

      metadata.push(
        ...authors.map((author, index) => {
          return this._getOpenGraphMetaTag(
            "author",
            author,
            "author" + (index === 0 ? "" : index)
          );
        })
      );
    }

    if (url) metadata.push(this._getOpenGraphMetaTag("url", url));

    return metadata;
  }

  static getPrimaryMetadata({ title, description }) {
    let metadata = [];

    if (title) metadata.push(this._getPrimaryMetaTag("title", title));

    if (description)
      metadata.push(this._getPrimaryMetaTag("description", description));

    return metadata;
  }

  static getTwitterMetadata(largeImage = true, home = false) {
    let metadata = [];

    if (home) metadata.push(this._getTwitterMetaTag("site", "@PlenumJournal"));

    if (largeImage)
      metadata.push(this._getTwitterMetaTag("card", "summary_large_image"));

    return metadata;
  }

  static metaDefault(metadata, type, overrides = {}) {
    if (!metadata) return {};

    const titleVar = "%s";

    const { title, description, image, authors, meta } = metadata;
    const { origin, pathname } = window.location;
    const url = origin + pathname;

    const data = {
      type,
      title,
      description,
      image,
      url,
      authors
    };

    return {
      title: overrides.title || title,
      titleTemplate:
        overrides.titleTemplate === false
          ? titleVar
          : overrides.titleTemplate || `${titleVar} - Plenum`,
      meta: _.concat(
        meta || [],
        this.getPrimaryMetadata(data),
        this.getOpenGraphMetadata(data)
      )
    };
  }
}

export default MetadataManager;
