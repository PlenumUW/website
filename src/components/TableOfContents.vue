<template>
  <section class="toc">
    <header class="toc__header">
      <h1 class="toc__header__title">Contents</h1>
      <a v-if="downloadUrl" :href="downloadUrl">Download</a>
    </header>

    <div class="toc__body">
      <ul class="toc__entry-list">
        <li
          v-for="(entry, index) in contents"
          :key="`item-${index}`"
          class="toc__category__menu-item-wrapper"
        >
          <router-link :to="getPath(entry.uid)" class="toc__category__menu-item-link">
            <!-- <span class="menu-item-bullet">&#9702;</span> -->
            <span class="menu-item">
              <!-- eslint-disable-next-line -->
              <span class="menu-item__title">{{entry.data.title | prismicRawText}}
                <span
                  class="menu-item__subtitle"
                >{{ entry.data.subtitle | prismicRawText }}</span>
              </span>
              <span
                v-if="entry.data.authors.length < 3"
                class="menu-item__authors"
              >&#32;({{ getListedAuthors(entry.data.authors) }})</span>
            </span>
          </router-link>
        </li>
      </ul>
    </div>
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
  // font-size: 70px;
  // line-height: 80px;
  line-height: 1em;
  font-weight: 300;

  @include font-size(6em);

  @include for-size(tablet-portrait-up) {
    padding: $toc_padding;
  }

  &__header {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-end;

    margin-bottom: 20px;

    top: 0;

    width: 100%;

    @include for-size(tablet-landscape-up) {
      margin-bottom: 1.5em;

      justify-content: space-between;
    }

    a {
      display: none;
      height: 100%;

      @include for-size(tablet-landscape-up) {
        display: unset;
      }
    }

    a:focus {
      @include focus();
    }

    &__title {
      line-height: 1em;
      font-size: 1em; // Override h1 font-size
      font-family: $font-serif; // Override h1 font-family
    }
  }

  &__body {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    position: relative;

    &__image-preview {
      width: 500px;
      height: 300px;
      transform: translateX(
        25px
      ); // TODO: reference the home slice's right padding

      position: sticky;
      top: 0;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  &__category {
    margin-bottom: 25px;

    @include for-size(tablet-portrait-up) {
      margin-bottom: 42px;
    }

    &:last-of-type {
      margin-bottom: 0;
    }

    &__title {
      margin-bottom: 10px;

      text-transform: capitalize;
    }

    &__menu {
      margin-left: 10px;
      @include for-size(tablet-portrait-up) {
        margin-left: 47px;
      }

      &-item-wrapper {
        display: inline;

        &:after {
          content: "";
          padding-left: 80px;
        }
      }

      &-item-link {
        // display: inline-block; // Only to shrink outline to content width
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }

        &:focus {
          @include focus();
        }
      }
    }
  }
}

.menu-item-bullet {
  margin-right: -15px;
}

.menu-item {
  &__title {
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
  }
}
</style>
