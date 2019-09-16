<template>
  <section class="toc">
    <header class="toc__header">
      <h1 class="toc__header__title">Contents</h1>
      <a v-if="downloadUrl" :href="downloadUrl">Download</a>
    </header>

      <ul class="toc__body">
        <li
          v-for="(entry, index) in contents"
          :key="`item-${index}`"
          class="toc__body__list-item"
        >
          <router-link :to="getPath(entry.uid)" class="toc__body__list-item__link">
            <span class="toc__body__list-item__bullet">&#9702;</span>
            <span class="toc__body__list-item__content">
              <!-- eslint-disable-next-line -->
              <span class="toc__body__list-item__title">{{entry.data.title | prismicRawText}}
                <span
                  class="toc__body__list-item__subtitle"
                >{{ entry.data.subtitle | prismicRawText }}</span>
              </span>
              <span
                v-if="entry.data.authors.length < 3"
                class="toc__body__list-item__authors"
              >&#32;({{ getListedAuthors(entry.data.authors) }})</span>
            </span>
          </router-link>
        </li>
      </ul>
  </section>
</template>
<script>
import PrismicProcessor from "@/utils/PrismicProcessor";

export default {
  name: "TableOfContents",
  props: {
    contents: {
      type: Array,
      required: true
    },
    downloadUrl: {
      type: String,
      required: false
    },
    contentPath: {
      type: String,
      requried: true
    }
  },
  methods: {
    getPath(slug) {
      return `${this.contentPath}/${slug}`;
    },
    getListedAuthors(authors) {
      let authorsListed = "";
      authors.forEach(({ author }, index) => {
        authorsListed += PrismicProcessor.getRawText(author);
        if (index !== authors.length - 1) {
          authorsListed += "; ";
        }
      });
      return authorsListed;
    }
  }
};
</script>
<style lang="scss" scoped>
$toc_padding: 20px;

.toc {
  position: relative;
  width: 100%;
  height: fit-content;
  padding: 10px;

  font-family: $font-serif;
  font-weight: 200;
  letter-spacing: -0.05em;
  line-height: 1em;

  @include font-size(1.8em);

  @include for-size(tablet-portrait-up) {
    padding: $toc_padding;
    @include font-size(3em);
  }
  @include for-size(desktop-up) {
    @include font-size(4.5em);
  }
}


.toc__header {
  top: 0;
  width: 100%;
  margin-bottom: 1em;

  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-end;

  line-height: 1em;

  justify-content: space-between;

  a:focus {
    @include focus();
  }

  &__title {
    font-size: 1em; // Override h1 font-size
    font-family: $font-serif; // Override h1 font-family
    font-weight: 200; //Override
  }
}


.toc__body {
  position: relative;

  font-variant: discretionary-ligatures;


  &:focus-within {
    > *:not(:focus-within) {
      opacity: 0.2;
    }
  }

  &__list-item {
    display: inline;

    &:not(:first-of-type) {
      &:before {
        content: "";
        padding-left: 0.5em;
      }
    }

    @include for-size(tablet-portrait-up) {
      margin-bottom: 42px;
    }

    &:last-of-type {
      margin-bottom: 0;
    }

    &__link {
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }

      &:focus {
        @include focus();
      }
    }

    &__bullet {
      margin-right: -0.4em;
    }

    &__content {

    }

    &__title {
      margin-bottom: 10px;

      text-transform: capitalize;

       font-weight: 200;
      grid-row: 1;
      grid-column: 2;

      &:before {
        content: "◦";
      }
    }

    &__subtitle {
      font-weight: 200;
      font-style: italic;
    }

    &__authors {
      grid-row: 2;
      grid-column: 2;
      font-style: italic;
      font-variant: unicase;
    }
  }


}
</style>
