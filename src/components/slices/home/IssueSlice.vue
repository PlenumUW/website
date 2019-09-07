<template>
  <home-slice class="c-issue-slice" :color="bgColor">
    <template #title>
      <router-link to="/issue/issue-title">Plenum 2018</router-link>
    </template>

    <template #content>
      <img
        class="c-issue-slice__cover-image"
        src="http://placehold.jp/80/bfbfbf/ffffff/1400x1800.png?text=Issue Cover Image"
      />

      <section class="c-issue-slice__toc">
        <h1 class="c-issue-slice__category-title">Peer-reviewed</h1>

        <div class="c-issue-slice__sub-category__container">
          <h2 class="c-issue-slice__sub-category__title">Essay</h2>

          <div v-for="i in essays" :key="i" class="toc-entry">
            <div class="toc-entry__image">
              <img
                src="http://placehold.jp/40/adadad/ffffff/400x200.png?text=Project Image"
              />
            </div>

            <div class="toc-entry__text">
              <div class="toc-entry__text__title">Essay Title</div>
              <div class="toc-entry__text__author">Firstname Lastname</div>
            </div>
          </div>
        </div>

        <div class="c-issue-slice__sub-category__container">
          <h2 class="c-issue-slice__sub-category__title">GIS</h2>

          <div v-for="i in gis" :key="i" class="toc-entry">
            <div class="toc-entry__image">
              <img
                src="http://placehold.jp/40/adadad/ffffff/400x200.png?text=Project Image"
              />
            </div>

            <div class="toc-entry__text">
              <div class="toc-entry__text__title">Project Title</div>
              <div class="toc-entry__text__author">Firstname Lastname</div>
            </div>
          </div>
        </div>
      </section>
    </template>
  </home-slice>
</template>
<script>
import _ from "lodash";
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
      essays: _.range(0, 3, 1),
      gis: _.range(0, 2, 1)
    };
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

    background-color: white;
  }
}
</style>
