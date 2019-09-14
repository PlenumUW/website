<template>
  <home-slice v-if="!loading" class="c-issue-slice" :color="bgColor">
    <template #title>
      <router-link :to="issueSlug">{{ title }}</router-link>
    </template>

    <template #content>
      <img class="c-issue-slice__cover-image" :src="imgSrc" />

      <section class="toc">
        <header class="toc__header">
          <a :href="issueDownloadLink">
            <img
              src="http://placehold.jp/10/bfbfbf/000000/50x50.png?text=Download Icon"
            />
          </a>
          <h1 class="toc__header__title">Contents</h1>
        </header>

        <div class="toc__body">
          <ul>
            <li
              v-for="({ name, essays }, catIndex) in orderedCategories"
              :key="`category-${catIndex}`"
              class="toc__category"
            >
              <h2 class="toc__category__title">{{ name }}</h2>

              <ol class="toc__category__menu">
                <li
                  v-for="(essay, essayIndex) in essays"
                  :key="`category-${name}_item-${essayIndex}`"
                  class="toc__category__menu-item-wrapper"
                >
                  <router-link
                    :to="getEssayUrlPath(essay.uid)"
                    class="toc__category__menu-item-link"
                  >
                    <div class="menu-item">
                      <div class="menu-item__page-number">5</div>
                      <div class="menu-item__title">
                        {{ essay.data.title | prismicRawText }}
                      </div>
                      <div class="menu-item__authors">
                        <div
                          v-for="({ author }, authorIndex) in essay.data
                            .authors"
                          :key="`${essay.uid}_author-${authorIndex}`"
                        >
                          {{ author | prismicRawText }}
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
import BaseSlice from "@/components/slices/BaseSlice.vue";
import HomeSlice from "./HomeSlice.vue";

export default {
  name: "IssueSlice",
  extends: BaseSlice,
  components: {
    HomeSlice
  },
  props: {
    issue: {
      type: Object,
      required: true
    },
    bgColor: {
      type: String,
      required: true
    }
  },
  computed: {
    imgSrc: function() {
      return this.issue.data.cover_image.url;
    },
    title: function() {
      return this.PrismicProcessor.getRawText(this.issue.data.title);
    },
    issueSlug: function() {
      return `/issue/${this.issue.uid}`;
    },
    issueDownloadLink: function() {
      return this.issue.data.download_file.url;
    },
    loading: function() {
      return Object.keys(this.issue).length === 0;
    },
    categories: function() {
      let cats = {};

      this.issue.essays.forEach(essay => {
        const essayCat = this.PrismicProcessor.getRawText(
          essay.data.category.data.name
        );

        if (!Object.keys(cats).find(cat => cat.name === essayCat)) {
          const { list_position, name } = essay.data.category.data;
          cats[essayCat] = {
            name: this.PrismicProcessor.getRawText(name),
            position: list_position,
            essays: []
          };
        }

        cats[essayCat].essays.push(essay);
      });

      return cats;
    },
    orderedCategories: function() {
      return Object.values(this.categories).sort(
        (a, b) => a.position - b.position
      );
    }
  },
  methods: {
    getEssayUrlPath(essaySlug) {
      return `/issue/${this.issue.uid}/${essaySlug}`;
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
