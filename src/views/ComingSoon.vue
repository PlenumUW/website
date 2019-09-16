<template>
  <div class="c-coming-soon">
    <h1 class="c-coming-soon__title">
      {{ message }}
    </h1>
  </div>
</template>

<script>
import _ from "lodash";
import BaseView from "@/views/BaseView";

export default {
  name: "ComingSoon",
  extends: BaseView,
  computed: {
    message: function () {
      return `${this.title} Coming Soon`;
    },
    title: function () {
      return _.capitalize(this.$route.name)
    }
  },
  created: function () {
    this.metadata = {
      title: this.title
    }
  },
  meta() {
    // TODO: make DRY with NotFound
    let meta = this.MetadataManager.metaDefault(this.metadata);
    meta = this.MetadataManager.addNoIndexing(meta);
    return meta;
  }
}
</script>

<style lang="scss" scoped>
.c-coming-soon {
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  position: absolute;

  &__title {
    margin: auto;
  }
}
</style>
