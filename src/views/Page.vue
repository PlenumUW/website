<template>
  <div class="page-view">
    <paper
      v-for="(item, index) in items"
      :key="`item-${_uid}-${index}`"
      :color="color"
    >
      <h1>This is a page</h1>
      <h2>This is a page</h2>
      <h3>This is a page</h3>
      <h4>This is a page</h4>
      <h5>This is a page</h5>
      <h6>This is a page</h6>
    </paper>
  </div>
</template>
<script>
import _ from "lodash";

import View from "@/components/bases/View";

export default {
  name: "page",
  extends: View,
  data: function() {
    return {
      items: _.range(0, 5, 1)
    };
  }
};
</script>
<style lang="scss" scoped>
.paper {
  width: 100%;
}
</style>
