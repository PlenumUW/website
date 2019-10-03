<template>
  <section class="toc">
    <header class="toc__header">
      <h1 class="toc__header__title">Contents</h1>
      <a v-if="downloadUrl" :href="downloadUrl">Download</a>
    </header>

    <ul class="toc__body">
      <li v-for="(entry, index) in contents" :key="`item-${index}`" class="toc__body__list-item">
        <router-link :to="getPath(entry.uid)" class="toc__body__list-item__link">
          <span class="toc__body__list-item__bullet">&#9702;</span>
          <span class="toc__body__list-item__content">
            <!-- eslint-disable-next-line -->
            <span class="toc__body__list-item__title">{{entry.data.title | prismicRawText}}
              <span class="toc__body__list-item__subtitle">{{ entry.data.subtitle | prismicRawText }}</span>
            </span>
            <span v-if="entry.data.authors.length < 3" class="toc__body__list-item__authors">&#32;({{ getListedAuthors(entry.data.authors) }})</span>
          </span>
          <!-- Adds non-linked white space between entries -->
        </router-link>&nbsp;&nbsp;
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
.toc {
  position: relative;
  width: 100%;
  height: fit-content;
}

.toc__header {
  top: 0;
  width: 100%;
  margin-bottom: 1em;

  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-end;

  justify-content: space-between;

  a:focus {
    @include focus();
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

    &__title {
      margin-bottom: 10px;

      grid-row: 1;
      grid-column: 2;

      &:before {
        content: "◦";
      }
    }

    &__authors {
      grid-row: 2;
      grid-column: 2;
    }
  }
}
</style>
