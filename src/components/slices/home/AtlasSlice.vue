<template>
  <home-slice class="c-atlas-slice" :color="bgColor">
    <template #title>
      <router-link to="/atlas">Atlas</router-link>
    </template>

    <template #content>
      <div class="c-atlas-slice__previews">
        <div
          v-for="(project, projectIndex) in chunkedProjects[currentPairIndex]"
          :key="`project-${projectIndex}`"
          class="c-atlas-slice__project"
        >
          <router-link :to="getProjectPath(project.uid)" class="c-atlas-slice__project__link">
            <img class="c-atlas-slice__project__image" :src="getProjectImageSrc(project)" />
            <p class="c-atlas-slice__project__title">{{ getProjectTitle(project) }}</p>
            <p class="c-atlas-slice__project__author">
              {{ getListedAuthors(project) }}
            </p>
          </router-link>
        </div>
      </div>

      <div v-if="projects.length > 0" class="c-atlas-slice__navigation">
        <button @click="prevPair" :disabled="currentPairIndex === 0"><<</button>
        <button @click="nextPair" :disabled="currentPairIndex === projects.length / 2 - 1">>></button>
        <!-- <img src="http://placehold.jp/300x200.png?text=Atlas Navigation" /> -->
      </div>
    </template>
  </home-slice>
</template>
<script>
import _ from "lodash";
import BaseSlice from "@/components/slices/BaseSlice.vue";
import HomeSlice from "./HomeSlice.vue";

export default {
  name: "AtlasSlice",
  extends: BaseSlice,
  components: {
    HomeSlice
  },
  props: {
    projects: {
      type: Array,
      required: true
    },
    bgColor: {
      type: String,
      required: true
    }
  },
  data: function () {
    return {
      currentPairIndex: 0
    };
  },
  computed: {
    chunkedProjects: function () {
      return _.chunk(this.projects, 2);
    }
  },
  methods: {
    nextPair() {
      if (this.currentPairIndex === this.projects.length / 2 - 1) {
        this.currentPairIndex = 0;
        return;
      }

      this.currentPairIndex++;
    },
    prevPair() {
      if (this.currentPairIndex === 0) {
        return;
      }

      this.currentPairIndex--;
    },
    getProjectPath(projectSlug) {
      return `/atlas/${projectSlug}`;
    },
    getProjectTitle(project) {
      return this.PrismicProcessor.getRawText(project.data.title);
    },
    getProjectImageSrc(project) {
      return project.data.cover_image.url;
    },
    getListedAuthors(project) {
      const authors = project.data.authors;

      let authorsListed = "";
      authors.forEach(({ author }, index) => {
        authorsListed += this.PrismicProcessor.getRawText(author);
        if (index !== authors.length - 1) {
          authorsListed += ", ";
        }
      });

      return authorsListed;
    }
  }
};
</script>
<style lang="scss" scoped>
$background: white;

.c-atlas-slice {
  position: relative;

  > *:last-child {
    padding-bottom: 20%;

    @include for-size(tablet-landscape-up) {
      padding-bottom: 50px; // To prevent the visibility of the sticky gradient moving offscreen
    }
  }

  &__content-container {
    &__content {
      background-color: $background;
    }
  }

  &__previews {
    display: block;
    padding: 30px;

    > * {
      margin-right: 0;
    }

    @include for-size(tablet-landscape-up) {
      display: flex;
      flex-direction: row;

      > * {
        margin-right: 20px;

        &:last-child {
          margin-right: 0;
        }
      }
    }
    @include for-size(desktop-up) {
      padding: 55px 60px;
    }
  }

  &__project {
    flex-basis: 50%;

    margin-bottom: 25px;

    &:last-of-type {
      margin-bottom: 0;
    }

    &:hover {
      .c-atlas-slice__project__title {
        text-decoration: underline;
      }
    }

    @include for-size(tablet-landscape-up) {
      margin-bottom: 0;
    }

    &__link {
      text-decoration: none;

      &:focus {
        @include focus();
      }
    }

    &__image {
      width: 100%;
      height: auto;
    }

    &__title,
    &__author {
      text-align: center;
    }

    &__title {
      @include font-size(1.2em);
    }

    &__author {
      font-style: italic;

      @include font-size(1em);
    }

    @include for-size(tablet-landscape-up) {
      &__title {
        @include font-size(1.5em);
      }

      &__author {
        @include font-size(1.1em);
      }
    }

    @include for-size(desktop-up) {
      &__title {
        @include font-size(2em);
      }

      &__author {
        @include font-size(1.5em);
      }
    }
  }

  &__navigation {
    width: 100%;
  }
}
</style>
