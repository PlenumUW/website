<template>
  <div class="c-rich-text" v-html="html"></div>
</template>

<script>
function htmlClassSyntax(classes) {
  return `class="${classes}"`;
}

const Elements = {
  pre: {
    type: "preformatted",
    open: ({ text } = {}, classes = "") => {
      console.log(text, classes);
      const firstClosingCaretIndex = text.indexOf(">");

      let html =
        text.substring(0, firstClosingCaretIndex) +
        " " +
        htmlClassSyntax(classes) +
        text.substring(firstClosingCaretIndex);
      console.log(html);
      return html;
    },
    close: () => ""
  },
  p: {
    type: "paragraph",
    open: (data = {}, classes = "") => `<p ${htmlClassSyntax(classes)}>`,
    close: () => "</p>"
  },
  // TODO: generate ImageSimple component
  img: {
    type: "image",
    open: (data = {}, classes = "", alt = "", src = "") =>
      `<img src="${src}" ${htmlClassSyntax(classes)} alt=${alt}>`,
    close: () => "</img>"
  },
  a: {
    type: "hyperlink",
    open: ({ url, target } = {}, classes = "") =>
      `<a ${htmlClassSyntax(classes)} href="${url}" target="${target}">`,
    close: () => "</a>"
  },
  strong: {
    type: "strong",
    open: (data = {}, classes = "") => `<strong ${htmlClassSyntax(classes)}>`,
    close: () => "</strong>"
  },
  em: {
    type: "em",
    open: (data = {}, classes = "") => `<em ${htmlClassSyntax(classes)}>`,
    close: () => "</em>"
  },
  ulli: {
    type: "list-item",
    open: (data = {}, classes = "") => `<li ${htmlClassSyntax(classes)}>`,
    close: () => "</li>"
  },
  olli: {
    type: "o-list-item",
    open: (data = {}, classes = "") => `<li ${htmlClassSyntax(classes)}>`,
    close: () => "</li>"
  },
  ul: {
    type: "u-list",
    open: (data = {}, classes = "") => `<ul ${htmlClassSyntax(classes)}>`,
    close: () => "</ul>"
  },
  ol: {
    type: "o-list",
    open: (data = {}, classes = "") => `<ol ${htmlClassSyntax(classes)}>`,
    close: () => "</ol>"
  },
  h1: {
    type: "heading1",
    open: (data = {}, classes = "") => `<h1 ${htmlClassSyntax(classes)}>`,
    close: () => "</h1>"
  },
  h2: {
    type: "heading2",
    open: classes => `<h2 ${htmlClassSyntax(classes + " h2")}>`,
    close: () => "</h2>"
  },
  h3: {
    type: "heading3",
    open: classes => `<h3 ${htmlClassSyntax(classes + " h3")}>`,
    close: () => "</h3>"
  },
  h4: {
    type: "heading4",
    open: classes => `<h4 ${htmlClassSyntax(classes + " h4")}>`,
    close: () => "</h4>"
  },
  h5: {
    type: "heading5",
    open: classes => `<h5 ${htmlClassSyntax(classes + " h5")}>`,
    close: () => "</h5>"
  },
  h6: {
    type: "heading6",
    open: classes => `<h6 ${htmlClassSyntax(classes + " h6")}>`,
    close: () => "</h6>"
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
          html += Elements.pre.open(data, this.classes);
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

      html += this.processOpeningWrappers(type);
      html += open({}, this.wrappingHtmlElementOpen ? "" : this.classes);

      spans.forEach((span) => {
        const { type, data, start, end } = span;
        const { open, close } = this.findElement(type);

        html += text.slice(currentIndex, start);
        currentIndex = start;
        html += open(data);
        html += text.slice(currentIndex, end);
        currentIndex = end;
        html += close();
      });

      html += text.slice(currentIndex, text.length);

      html += close();
      html += this.processClosingWrappers(type, index);

      return html;
    },
    serializeImage(data) {
      const { type, alt, dimensions, copyright, url } = data;
      const { open, close } = Elements.img;

      return open({}, this.classes, alt, url) + close();
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

      const wrappers = el.open({}, this.classes);

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

      const wrappers = el.close();

      return wrappers;
    }
  }
};
</script>
<style lang="scss" scoped>
.sticky {
  position: sticky;
  top: 0.5em; // TODO: move specifics to parent component that requested sticky headers
  z-index: 3; // TODO: move specifics to parent component that requested sticky headers
}
</style>

