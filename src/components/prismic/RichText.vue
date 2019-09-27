<template>
  <div class="c-rich-text" :class="{'sticky': sticky}" v-html="html"></div>
</template>

<script>
function htmlClassSyntax(classes) {
  return `class="${classes}"`;
}

const Elements = {
  pre: {
    type: "preformatted",
    open: (classes = "", { text }) => {
      const firstClosingCaretIndex = text.indexOf(">");

      let html =
        text.substring(0, firstClosingCaretIndex) +
        " " +
        htmlClassSyntax(classes) +
        text.substring(firstClosingCaretIndex);
      return html;
    },
    close: () => ""
  },
  p: {
    type: "paragraph",
    open: (classes = "", options = {}) => `<p ${htmlClassSyntax(classes)}>`,
    close: () => "</p>"
  },
  // TODO: generate ImageSimple component
  img: {
    type: "image",
    open: (classes = "", options = {}, alt = "", src = "") =>
      `<img src="${src}" ${htmlClassSyntax(classes)} alt=${alt}>`,
    close: () => "</img>"
  },
  a: {
    type: "hyperlink",
    open: (classes = "", { url, target }) =>
      `<a ${htmlClassSyntax(classes)} href="${url}" target="${target}">`,
    close: () => "</a>"
  },
  strong: {
    type: "strong",
    open: (classes = "", options = {}) =>
      `<strong ${htmlClassSyntax(classes)}>`,
    close: () => "</strong>"
  },
  em: {
    type: "em",
    open: (classes = "", options = {}) => `<em ${htmlClassSyntax(classes)}>`,
    close: () => "</em>"
  },
  ulli: {
    type: "list-item",
    open: (classes = "", options = {}) => `<li ${htmlClassSyntax(classes)}>`,
    close: () => "</li>"
  },
  olli: {
    type: "o-list-item",
    open: (classes = "", options = {}) => `<li ${htmlClassSyntax(classes)}>`,
    close: () => "</li>"
  },
  ul: {
    type: "u-list",
    open: (classes = "", options = {}) => `<ul ${htmlClassSyntax(classes)}>`,
    close: () => "</ul>"
  },
  ol: {
    type: "o-list",
    open: (classes = "", options = {}) => `<ol ${htmlClassSyntax(classes)}>`,
    close: () => "</ol>"
  },
  h1: {
    type: "heading1",
    open: (classes = "", { anchors = false, anchorId }) => {
      let openingEls = "";

      if (anchors) {
        if (!anchorId) throw new Error("No anchor name provided.");

        openingEls += `<a href="#${anchorId}">`; // TODO: add accessibility to a tags in richtext
      }

      return openingEls + `<h1 ${htmlClassSyntax(classes + " h1")}>`;
    },
    close: ({ anchors = false }) => "</h1>" + (anchors ? "</a>" : "")
  },
  h2: {
    type: "heading2",
    open: (classes = "", { anchors = false, anchorId }) => {
      let openingEls = "";

      if (anchors) {
        if (!anchorId) throw new Error("No anchor name provided.");

        openingEls += `<a href="#${anchorId}">`; // TODO: add accessibility to a tags in richtext
      }

      return openingEls + `<h2 ${htmlClassSyntax(classes + " h2")}>`;
    },
    close: ({ anchors = false }) => "</h2>" + (anchors ? "</a>" : "")
  },
  h3: {
    type: "heading3",
    open: (classes = "", { anchors = false, anchorId }) => {
      let openingEls = "";

      if (anchors) {
        if (!anchorId) throw new Error("No anchor name provided.");

        openingEls += `<a href="#${anchorId}">`; // TODO: add accessibility to a tags in richtext
      }

      return openingEls + `<h3 ${htmlClassSyntax(classes + " h3")}>`;
    },
    close: ({ anchors = false }) => "</h3>" + (anchors ? "</a>" : "")
  },
  h4: {
    type: "heading4",
    open: (classes = "", { anchors = false, anchorId }) => {
      let openingEls = "";

      if (anchors) {
        if (!anchorId) throw new Error("No anchor name provided.");

        openingEls += `<a href="#${anchorId}">`; // TODO: add accessibility to a tags in richtext
      }

      return openingEls + `<h4 ${htmlClassSyntax(classes + " h4")}>`;
    },
    close: ({ anchors = false }) => "</h4>" + (anchors ? "</a>" : "")
  },
  h5: {
    type: "heading5",
    open: (classes = "", { anchors = false, anchorId }) => {
      let openingEls = "";

      if (anchors) {
        if (!anchorId) throw new Error("No anchor name provided.");

        openingEls += `<a href="#${anchorId}">`; // TODO: add accessibility to a tags in richtext
      }

      return openingEls + `<h5 ${htmlClassSyntax(classes + " h5")}>`;
    },
    close: ({ anchors = false }) => "</h5>" + (anchors ? "</a>" : "")
  },
  h6: {
    type: "heading6",
    open: (classes = "", { anchors = false, anchorId }) => {
      let openingEls = "";

      if (anchors) {
        if (!anchorId) throw new Error("No anchor name provided.");

        openingEls += `<a href="#${anchorId}">`; // TODO: add accessibility to a tags in richtext
      }

      return openingEls + `<h6 ${htmlClassSyntax(classes + " h6")}>`;
    },
    close: ({ anchors = false }) => "</h6>" + (anchors ? "</a>" : "")
  }
};

export default {
  name: "RichText",
  props: {
    body: {
      required: true,
      type: Array,

      /**
       * Validates that the given objects are valid Prismic objects.
       */
      validator: function (val) {
        return val.every((p) => {
          const hasProps =
            p.hasOwnProperty("type") &&
            ((p.hasOwnProperty("spans") && p.hasOwnProperty("text")) ||
              (p.hasOwnProperty("alt") &&
                p.hasOwnProperty("dimensions") &&
                p.hasOwnProperty("copyright") &&
                p.hasOwnProperty("url")));

          if (!hasProps) return false;

          const correctTypes =
            Array.isArray(p.spans) &&
            typeof p.text === "string" &&
            typeof p.type === "string";

          if (!correctTypes) return false;

          return true;
        });
      }
    },
    classes: {
      required: false,
      type: String,
      default: function () {
        return "";
      }
    },
    anchors: {
      required: false,
      type: Boolean,
      default: function () {
        return false;
      }
    },
    stickyHeading: {
      required: false,
      type: Boolean,
      default: function () {
        return false;
      }
    }
  },
  data: function () {
    return {
      olListOpen: false,
      ulListOpen: false
    };
  },
  computed: {
    html: function () {
      return this.buildHtml();
    },
    // Whether there is a wrapping element tag that is currently open
    wrappingHtmlElementOpen: function () {
      return this.olListOpen || this.ulListOpen;
    },
    sticky: function () {
      return this.stickyHeading && this.parentType === Elements.h1.type;
    },
    parentType: function () {
      return this.body[0].type;
    }
  },
  methods: {
    buildHtml() {
      return this.body.reduce(
        (html, element, index) => (html += this.serialize(element, index)),
        ""
      );
    },
    findElement(type) {
      const elKey = Object.keys(Elements).find(
        key => Elements[key].type === type
      );

      if (elKey === undefined) {
        throw new Error("Prismic element type, '" + type + "', unhandled.");
      }

      return Elements[elKey];
    },
    serialize(data, index) {
      const { type } = data;
      let html = "";

      switch (type) {
        case Elements.img.type:
          html += this.serializeImage(data, index);
          break;

        case Elements.pre.type:
          html += Elements.pre.open(this.classes, data);
          break;

        default:
          html += this.serializeText(data, index);
          break;
      }

      return html;
    },
    serializeText(data, index) {
      let { text, spans, type } = data;
      let html = "";
      let currentIndex = 0;

      const { open, close } = this.findElement(type);
      let options = {
        sticky: this.stickyHeading,
        anchors: this.anchors,
        anchorId: data.type.includes("heading")
          ? encodeURI(data.text.replace(/ /g, "-").toLowerCase())
          : undefined
      };

      html += this.processOpeningWrappers(type);
      html += open(this.wrappingHtmlElementOpen ? "" : this.classes, options);

      spans.forEach((span) => {
        const { type, data, start, end } = span;
        const { open, close } = this.findElement(type);
        let options = {};

        html += text.slice(currentIndex, start);
        currentIndex = start;
        html += open(data, options);
        html += text.slice(currentIndex, end);
        currentIndex = end;
        html += close({ anchors: this.anchors });
      });

      html += text.slice(currentIndex, text.length);

      html += close({ anchors: this.anchors });
      html += this.processClosingWrappers(type, index);

      return html;
    },
    serializeImage(data) {
      const { type, alt, dimensions, copyright, url } = data;
      const { open, close } = Elements.img;
      let options = {};

      return (
        open(this.classes, options, alt, url) +
        close({
          anchors: this.anchors
        })
      );
    },
    processOpeningWrappers(type) {
      let el;

      if (!this.ulListOpen && type === Elements.ulli.type) {
        el = Elements.ul;
        this.ulListOpen = true;
      } else if (!this.olListOpen && type === Elements.olli.type) {
        el = Elements.ol;
        this.olListOpen = true;
      } else {
        return "";
      }

      let options = {};
      const wrappers = el.open(this.classes, options);

      return wrappers;
    },
    processClosingWrappers(type, index) {
      let el;

      if (
        this.olListOpen &&
        (type !== Elements.olli.type || index === this.body.length - 1)
      ) {
        el = Elements.ol;
        this.olListOpen = false;
      } else if (
        this.ulListOpen &&
        (type !== Elements.ulli.type || index === this.body.length - 1)
      ) {
        el = Elements.ul;
        this.ulListOpen = false;
      } else {
        return "";
      }

      const wrappers = el.close({ anchors: this.anchors });

      return wrappers;
    }
  }
};
</script>
<style lang="scss">
.sticky {
  position: sticky;
}
</style>

