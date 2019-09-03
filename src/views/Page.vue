<template>
  <div class="page-view">
    <div v-for="item in items" class="paper">
      <h1>This is a page</h1>
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
<style lang="scss" scoped></style>
