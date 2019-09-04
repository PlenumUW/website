<template>
  <section class="c-issue-slice">
    <img
      class="c-issue-slice__cover-image"
      src="http://placehold.jp/250x325.png?text=Issue-Cover-Image"
    />
    <div class="c-issue-slice__toc"></div>
  </section>
</template>
<script>
export default {
  name: "IssueSlice",
  components: {},
  props: {}
};
</script>
<style lang="scss" scoped>
.c-issue-slice {
  position: relative;
  padding-right: 70px;

  &__cover-image {
    width: 100%;
    height: auto;
  }

  &__toc {
  }
}
</style>
