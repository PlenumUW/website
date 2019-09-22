<template>
  <home-slice class="c-issue-slice" :hideBackground="true" :color="bgColor">
    <template #title>
      <router-link v-if="!loading" :to="issueSlug">{{ title | prismicRawText }}</router-link>
    </template>

    <template #content>
      <paper v-if="!loading && imgSrc" :color="bgColor">
        <img class="c-issue-slice__cover-image" :src="imgSrc" :shadow="6" />
      </paper>

      <paper v-if="!loading" class="c-issue-slice__toc" :color="bgColor" :shadow="12">
        <table-of-contents :contents="essays" :contentPath="essayPath" :downloadUrl="issueDownloadLink"></table-of-contents>
      </paper>
    </template>
  </home-slice>
</template>
<script>
import BaseSlice from "@/components/slices/BaseSlice.vue";
import TableOfContents from "@/components/TableOfContents.vue";
import HomeSlice from "./HomeSlice.vue";

export default {
  name: "IssueSlice",
  extends: BaseSlice,
  components: {
    HomeSlice,
    TableOfContents
  },
  props: {
    issue: {
      type: Object,
      required: false
    },
    bgColor: {
      type: String,
      required: true
    }
  },
  computed: {
    essays: function () {
      return this.issue.essays;
    },
    imgSrc: function () {
      return this.issue.data.cover_image.url;
    },
    title: function () {
      return this.issue.data.title;
    },
    issueSlug: function () {
      return `/issue/${this.issue.uid}`;
    },
    issueDownloadLink: function () {
      return this.issue.data.download_file.url;
    },
    loading: function () {
      return !this.issue;
    },
    categories: function () {
      let categories = {};

      this.issue.essays.forEach((essay) => {
        const essayCategory = this.PrismicProcessor.getRawText(
          essay.data.category.data.name
        );

        if (!Object.keys(categories).find(cat => cat.name === essayCategory)) {
          const { list_position, name } = essay.data.category.data;
          categories[essayCategory] = {
            name: this.PrismicProcessor.getRawText(name),
            position: list_position,
            essays: []
          };
        }

        categories[essayCategory].essays.push(essay);
      });

      return categories;
    },
    orderedCategories: function () {
      return Object.values(this.categories).sort(
        (a, b) => a.position - b.position
      );
    },
    essayPath: function () {
      return `/issue/${this.issue.uid}`;
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
  }

  &__toc {
    width: 100%;

    max-width: 1100px;
    margin-left: auto;

    position: relative;

    @include for-size(tablet-landscape-up) {
      top: -40px;
      left: 40px;
    }
  }

  @include rfs(3em, --header-height);
}
</style>
