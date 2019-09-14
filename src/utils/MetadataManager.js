class MetadataManager {
  constructor() {}

  static _getOpenGraphSingleton(property, val, vmid) {
    return { property: `og:${property}`, content: val, vmid: vmid || property };
  }

  static _getOpenGraphImageData({ url, dimensions, alt }) {
    const { width, height } = dimensions;
    let data = [];

    data.push(this._getOpenGraphSingleton("image", url));
    data.push(this._getOpenGraphSingleton("image:alt", alt));
    data.push(this._getOpenGraphSingleton("image:width", width));
    data.push(this._getOpenGraphSingleton("image:height", height));
    data.push(
      this._getOpenGraphSingleton(
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

    if (title) metadata.push(this._getOpenGraphSingleton("title", title));

    if (description)
      metadata.push(this._getOpenGraphSingleton("description", description));

    if (type) metadata.push(this._getOpenGraphSingleton("type", type));

    if (image) {
      Array.prototype.push.apply(metadata, this._getOpenGraphImageData(image));
    }

    if (authors) {
      authors = typeof authors === "string" ? [authors] : authors;

      metadata.push(
        ...authors.map((author, index) => {
          return this._getOpenGraphSingleton(
            "author",
            author,
            "author" + (index === 0 ? "" : index)
          );
        })
      );
    }

    if (url) metadata.push(this._getOpenGraphSingleton("url", url));

    return metadata;
  }

  static metaDefault(metadata, type, routerAtHome = false) {
    if (!metadata) return {};

    const { title, description, image, authors } = metadata;
    const { origin, pathname } = window.location;
    const url = origin + pathname;

    return {
      title: title,
      titleTemplate: this.getTitleTemplate(routerAtHome),
      meta: this.getOpenGraphMetadata({
        type,
        title,
        description,
        image,
        url,
        authors
      })
    };
  }

  static getTitleTemplate(homeVersion) {
    const previewPrefix = "Previewing: ";
    if (homeVersion) return `${previewPrefix}Plenum Journal`;

    const variable = "%s ";
    const prefix = process.env.VUE_APP_PREVIEW ? previewPrefix : "";
    const postfix = "- Plenum";

    return prefix + variable + postfix;
  }
}

export default MetadataManager;
