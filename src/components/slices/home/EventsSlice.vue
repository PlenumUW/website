<template>
  <home-slice class="c-events-slice" :color="bgColor">
    <template #title>
      <router-link to="/events">Events</router-link>
    </template>

    <template #content>
      <div class="c-events-slice__contents">
        <div class="c-events-slice__contents__message">Events Coming Soon</div>
      </div>
    </template>
  </home-slice>
</template>
<script>
import _ from "lodash";
import HomeSlice from "./HomeSlice.vue";

export default {
  name: "EventsSlice",
  components: {
    HomeSlice
  },
  props: {
    bgColor: {
      type: String,
      required: true
    }
  }
};
</script>
<style lang="scss" scoped>
.c-events-slice {
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
