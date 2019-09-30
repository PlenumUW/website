<template>
  <article class="c-issue">
    <div class="">
      <header class="o-header">
        <header-gradient class="o-header__gradient" :color="color"></header-gradient>
      </header>

      <h1 class="c-issue__title o-header-title">
        {{ title }}
      </h1>

      <a class="c-issue__download" :href="downloadUrl">
        Download Issue
      </a>

      <div class="c-issue__cover-image c-issue__cover-image--bottom-half">
        <img class="c-issue__cover-image__image" :src="image.url" />
      </div>

      <ol class="toc">
        <li v-for="essay in essays" :key="`essay-${essay.id}`" class="entry">
          <paper class="entry__paper" :color="color" :type="'toc-entry'">
            <router-link :to="`/issue/${issueSlug}/${essay.uid}`" class="entry__header">
              <div class="entry__header__title">{{getEssayTitle(essay)}}
                <div class="entry__header__title__subtitle">{{essay.data.subtitle | prismicRawText}}</div>
              </div>

              <div class="entry__header__authors"><span v-for="({author}, i) in essay.data.authors" :key="`essay-${essay.id}_author${i}`" class="entry__header__authors__author"><span v-if="i !== 0"> | </span>{{ author | prismicRawText }}</span></div>
            </router-link>

            <div v-if="essay.data.abstract.length > 0" class="entry__summary">
              <img v-if="getEssayImageUrl(essay)" :src="getEssayImageUrl(essay)" class="entry__image--hero" />

              <div class="entry__summary__abstract">
                <div class="entry__summary__abstract__title">Abstract</div>

                <p class="entry__summary__abstract__contents"><img v-if="getEssayImageUrl(essay)" :src="getEssayImageUrl(essay)" class="entry__image--float" />{{ essay.data.abstract | prismicRawText }}</p>
              </div>
            </div>
          </paper>
        </li>
      </ol>

    </div>
  </article>
</template>
<script>
import BaseView from "./BaseView";
import HeaderGradient from "@/components/HeaderGradient";

// TODO: make DRY with IssueSlice
// TODO: make DRY with TableOfContents

export default {
  name: "Issue",
  extends: BaseView,
  components: { HeaderGradient },
  computed: {
    issueSlug: function () {
      return this.rawData.uid;
    },
    issue: function () {
      return this.rawData.data;
    },
    title: function () {
      if (!this.issue) return "";

      return this.PrismicProcessor.getRawText(this.issue.title);
    },
    image: function () {
      if (!this.issue) return "";

      return this.issue.cover_image;
    },
    essays: function () {
      return this.issue.essays;
    },
    downloadUrl: function () {
      return this.issue.download_file.url;
    },
    metaImage: function () {
      return this.issue.cover_image.SocialMedia;
    },
    metaDescription: function () {
      if (this.issue.description) {
        return this.PrismicProcessor.getRawText(this.issue.description);
      }

      const buildShortToc = () => {
        const entries = this.essays.map((essay) => {
          let entry = "'" + this.getEssayTitle(essay) + "'";

          const authors = essay.data.authors;
          if (authors.length <= 2) {
            entry += " by ";
            entry += this.getListedAuthors(authors, ", ");
          }

          return entry;
        });
        console.log(entries);

        return entries.join(" | ");
      };
      return "Contents: " + buildShortToc();
    }
  },
  methods: {
    getEssayImageUrl(essay) {
      return essay.data.hero_image.url;
    },
    getEssayTitle(essay) {
      return this.PrismicProcessor.getRawText(essay.data.title);
    },
    getEssaySubtitle(essay) {
      return this.PrismicProcessor.getRawText(essay.data.subtitle);
    },
    // TODO: make DRY with TableOfContents
    getListedAuthors(authors, seperator = " | ") {
      let authorsListed = "";
      authors.forEach(({ author }, index) => {
        authorsListed += this.PrismicProcessor.getRawText(author);
        if (index !== authors.length - 1) {
          authorsListed += seperator;
        }
      });
      return authorsListed;
    },
    getEssayAuthor(essay) {
      return this.PrismicProcessor.getRawText(author);
    },
    getMetadata() {
      return {
        title: this.title,
        description: this.metaDescription,
        image: this.metaImage
      };
    }
  },
  meta() {
    return this.MetadataManager.metaDefault(
      this.metadata,
      this.scriptMetadata,
      "book"
    );
  }
};
</script>
<style lang="scss" scoped>
.c-issue {
  &__download {
    display: none;

    @include for-size(tablet-landscape-up) {
      display: initial;
      position: sticky;
      top: 0.5em;
      float: left;

      font-size: 1.5em;
      font-family: $font-serif;
      z-index: 9;
    }
  }

  &__title {
    float: right;
  }

  &__cover-image {
    position: sticky;
    top: -120px; // unknown arbitrary value to put image near top of page, forced to adjust because of page title floats
    width: fit-content;
    max-height: 60vh;
    margin-left: auto;

    z-index: 0;

    &__image {
      width: $g-viewport-phone;
      height: auto;

      margin-left: auto;

      display: block;
      border: 10px solid black;

      @include for-size(tablet-landscape-up) {
        width: unset;
        height: calc(
          100vh - 184px - 104px
        ); // viewport height - footer height - header bleed height
        max-width: unset;
      }
    }
  }
}

.toc {
  position: relative;
  width: 100%; // TODO: match width of home papers
  height: fit-content;
  padding-right: 30px;
  margin-bottom: 15vh; // Displaces content so sticky image unsticks before it hides behind the footer

  z-index: 1;

  @include for-size(tablet-landscape-up) {
    max-width: 1600px;
    margin-right: 0;
  }
}

.entry {
  width: 100%;
  max-width: 1000px;
  margin-bottom: 80px;

  line-height: 1.2em;
  font-size: 1.6em;
  font-family: $font-serif;

  @include for-size(tablet-landscape-up) {
    line-height: 1.2em;
    font-size: 2em;
  }

  &:last-of-type {
    margin-bottom: 0;
  }

  &:nth-of-type(even) {
    margin-left: auto;
  }

  &__paper {
    width: 100%;
    height: 100%;
  }

  $contents-padding: 45px;
  --contents-padding: 45px;
  @include for-size(phone-only) {
    --contents-padding: 10px;
  }

  &__image {
    &--hero {
      width: 100%;
      padding: var(--contents-padding);

      @include for-size(tablet-landscape-up) {
        display: none;
      }
    }

    &--float {
      display: none;

      @include for-size(tablet-landscape-up) {
        display: initial;
        width: 50%;
        margin-left: 25px;
        float: right;
      }
    }
  }

  $header-padding: 10px;
  &__header {
    display: block;

    padding: $header-padding;

    text-decoration: none;

    &:hover,
    &:focus {
      [class*="title"] {
        text-decoration: underline;
      }
    }

    &:focus {
      @include focus();
    }

    &__title {
      font-weight: 300;
      margin-bottom: 26px;

      &__subtitle {
        width: 90%;
        margin-left: auto;

        text-align: right;
        font-weight: 200;
        font-style: italic;

        @include for-size(tablet-landscape-up) {
          width: 70%;
        }
      }
    }
    &__authors {
      max-width: 90%;
      margin-left: auto;
      text-align: right;
      font-weight: 300;
      font-style: italic;

      @include for-size(tablet-landscape-up) {
        max-width: 70%;
      }

      &__author {
        white-space: nowrap;
      }
    }
  }
  &__summary {
    padding: $header-padding;

    font-weight: 300;
    border-top: 1px solid rgb(66, 66, 66);

    &__abstract {
      &__title {
        margin-bottom: 16px;
        margin-top: 8px;

        @include for-size(tablet-landscape-up) {
          margin-top: 0;
        }
      }
      &__contents {
        margin-top: 20px;

        line-height: 1.65rem;
        font-size: 1.2rem;

        @include for-size(tablet-landscape-up) {
          margin: var(--contents-padding);

          line-height: 1.7rem;
          font-size: 1.3rem;

          text-align: justify;
        }
      }
    }
  }
}
</style>
