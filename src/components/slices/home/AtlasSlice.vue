<template>
  <home-slice class="c-atlas-slice" :color="bgColor">
    <template #title>
      <router-link to="/atlas">Atlas</router-link>
    </template>

    <template #content>
      <div class="c-atlas-slice__previews">
        <div
          v-for="(project, projectIndex) in currentProjects"
          :key="`${project.title}-${projectIndex}`"
          class="c-atlas-slice__project"
        >
          <router-link :to="project.slug" class="c-atlas-slice__project__link">
            <img class="c-atlas-slice__project__image" :src="project.imgSrc" />
            <p class="c-atlas-slice__project__title">{{ project.title }}</p>
            <p
              v-for="(author, authorIndex) in project.authors"
              :key="`${project.title}-author-${authorIndex}`"
              class="c-atlas-slice__project__author"
            >
              {{ author }}
            </p>
          </router-link>
        </div>
      </div>

      <div v-if="false" class="c-atlas-slice__navigation">
        <img src="http://placehold.jp/300x200.png?text=Atlas Navigation" />
      </div>
    </template>
  </home-slice>
</template>
<script>
import _ from "lodash";
import HomeSlice from "./HomeSlice.vue";

export default {
  name: "AtlasSlice",
  components: {
    HomeSlice
  },
  props: {
    bgColor: {
      type: String,
      required: true
    }
  },
  data: function () {
    return {
      projects: _.fill(new Array(3), {
        title: "Project Title",
        authors: ["Firstname Lastname"],
        slug: "/atlas/project/title",
        imgSrc:
          "http://placehold.jp/50/bfbfbf/ffffff/600x800.png?text=Atlas Project Image"
      }),
      projectPairIndex: 0
    };
  },
  computed: {
    currentProjects: function () {
      let index = this.projectPairIndex;
      return [this.projects[index], this.projects[index + 1]];
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
