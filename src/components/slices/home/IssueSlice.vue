<template>
  <home-slice class="c-issue-slice" :color="bgColor">
    <template #title>
      <router-link :to="issueSlug">{{ title }}</router-link>
    </template>

    <template #content>
      <img class="c-issue-slice__cover-image" :src="imgSrc" />

      <section class="toc">
        <header class="toc__header">
          <a :href="issueDownloadLink"
            ><img
              src="http://placehold.jp/10/bfbfbf/000000/50x50.png?text=Download Icon"
          /></a>
          <h1 class="toc__header__title">Contents</h1>
        </header>

        <div class="toc__body">
          <ul>
            <li
              v-for="(cat, catIndex) in categories"
              :key="`category-${cat.name}`"
              class="toc__category"
            >
              <h2 class="toc__category__title">{{ cat.name }}</h2>

              <ol class="toc__category__menu">
                <li
                  v-for="(item, itemIndex) in cat.items"
                  :key="`category-${catIndex}_item-${itemIndex}`"
                  class="toc__category__menu-item-wrapper"
                >
                  <router-link
                    :to="item.href"
                    class="toc__category__menu-item-link"
                  >
                    <div class="menu-item">
                      <div class="menu-item__page-number">
                        {{ item.page }}
                      </div>
                      <div class="menu-item__title">{{ item.title }}</div>
                      <div class="menu-item__authors">
                        <div v-for="author in item.authors" :key="author">
                          {{ author }}
                        </div>
                      </div>
                    </div>
                  </router-link>
                </li>
              </ol>
            </li>
          </ul>

          <!-- <div class="toc__body__image-preview"><img :src="false" /></div> -->
        </div>
      </section>
    </template>
  </home-slice>
</template>
<script>
import HomeSlice from "./HomeSlice.vue";

export default {
  name: "IssueSlice",
  components: {
    HomeSlice
  },
  props: {
    bgColor: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      categories: [
        {
          name: "editorial",
          items: [
            {
              title: "Letter from the Editors",
              href: "/href/journal/essay",
              authors: [
                "Firstname Last",
                "First Lastname",
                "Firstname Middlename Lastname",
                "First Last"
              ],
              page: 1
            }
          ]
        },
        {
          name: "essays",
          items: [
            {
              title: "Essay Title: And Subtitle",
              href: "/href/journal/essay",
              authors: ["Firstname Middlename Lastname"],
              page: 7
            },
            {
              title: "Essay Title: And Subtitle Which is Extra Long",
              href: "/href/journal/essay",
              authors: ["Firstname Last"],
              page: 17
            },
            {
              title: "Essay Title: And Subtitle",
              href: "/href/journal/essay",
              authors: ["First Lastname"],
              page: 24
            }
          ]
        },
        {
          name: "GIS",
          items: [
            {
              title: "Project Title: And Subtitle",
              href: "/href/journal/essay",
              authors: ["Firstname Middlename Lastname"],
              page: 3
            },
            {
              title: "Project Title",
              href: "/href/journal/essay",
              authors: ["Firstname Last"],
              page: 30
            }
          ]
        }
      ]
    };
  },
  computed: {
    imgSrc: function() {
      return "http://placehold.jp/80/bfbfbf/ffffff/1400x1800.png?text=Issue Cover Image";
    },
    title: function() {
      return "Current Issue";
    },
    issueSlug: function() {
      return "/issue/issue-title";
    },
    issueDownloadLink: function() {
      return "#";
    }
  }
};
</script>
<style lang="scss" scoped>
.c-issue-slice {
  position: relative;

  &__cover-image {
    width: 100%;
    height: auto;

    border-bottom: 3px solid black;
  }

  &__toc {
    width: 100%;
  }

  $toc_padding: 20px;
  @include rfs(3em, --header-height);

  .toc {
    position: relative;
    width: 100%;
    height: fit-content;
    padding: 10px;

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
        position: sticky;
        top: calc(100vh - var(--header-height) - #{$toc_padding});
        margin-bottom: 0;

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
        font-family: $font-titling;
        line-height: 1em;

        @include font-size(2em);

        @include for-size(tablet-portrait-up) {
          @include font-size(3em);
        }
      }
    }

    &__body {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      position: relative;

      @include for-size(tablet-landscape-up) {
        padding-left: 150px; // TODO: at least width of download icon
      }

      &__image-preview {
        width: 500px;
        height: 300px;
        transform: translateX(
          25px
        ); // TODO: reference the home slice's right padding

        position: sticky;
        top: 0;

        @include box-shadow(4);

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

        font-family: $font-sans;

        @include font-size(1.5em);

        @include for-size(tablet-portrait-up) {
          @include font-size(2em);
        }
      }

      &__menu {
        margin-left: 10px;
        @include for-size(tablet-portrait-up) {
          margin-left: 47px;
        }

        &-item-wrapper {
          margin-bottom: 15px;

          @include for-size(tablet-portrait-up) {
            margin-bottom: 36px;
          }

          &:last-of-type {
            margin-bottom: 0;
          }
        }

        &-item-link {
          display: inline-block; // Only to shrink outline to content width
          text-decoration: none;

          &:focus {
            @include focus();
          }
        }
      }
    }
  }

  .menu-item {
    display: grid;

    grid-template-rows: min-content min-content;
    grid-template-columns: 20px auto;
    grid-column-gap: 20px;
    grid-row-gap: 0px;

    @include font-size(1em);

    @include for-size(tablet-portrait-up) {
      grid-template-columns: 30px auto;
      grid-column-gap: 35px;

      @include font-size(1.5em);
    }

    &:hover {
      .menu-item__title {
        text-decoration: underline;
      }
    }

    &__page-number {
      grid-row: 1;
      grid-column: 1;

      text-align: right;
      font-style: italic;
    }

    &__title {
      grid-row: 1;
      grid-column: 2;

      font-weight: bold;
    }

    &__authors {
      grid-row: 2;
      grid-column: 2;

      font-weight: normal;

      @include font-size(0.9em);
    }
  }
}
</style>
