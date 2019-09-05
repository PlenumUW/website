<template>
  <div class="page-view">
    <div v-for="item in items" class="paper">
      <h1>This is a page</h1>
      <h2>This is a page</h2>
      <h3>This is a page</h3>
      <h4>This is a page</h4>
      <h5>This is a page</h5>
      <h6>This is a page</h6>
    </div>
  </div>
</template>
<script>
import _ from "lodash";

export default {
  name: "page",
  data: function() {
    return {
      items: _.range(0, 30, 1)
    };
  }
};
</script>
<style lang="scss" scoped>
.paper {
  width: 100%;
}
</style>
