<template>
  <div class="home">
    <issue-slice class="slice"></issue-slice>
  </div>
</template>

<script>
import IssueSlice from "@/components/slices/home/IssueSlice";

export default {
  name: "home",
  components: { IssueSlice }
};
</script>

<style lang="scss" scoped>
.home {
  padding-left: 133px;
  background: rgba(255, 192, 203, 0.466);
}
.slice {
}
</style>
