<template>
  <home-slice class="c-atlas-slice" :color="bgColor">
    <template #title>
      <router-link to="/atlas">Atlas</router-link>
    </template>

    <template #content>
      <div class="c-atlas-slice__contents">
        <div class="c-atlas-slice__contents__message">Atlas Coming Soon</div>
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
  font-family: $font-serif;

  &__contents {
    display: flex;
    align-items: center;

    min-height: 400px;
    font-size: 2em;

    &__message {
      width: fit-content;
      height: fit-content;
      margin: auto;
    }
  }
}
</style>
