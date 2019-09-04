<template>
  <div class="home">
    <issue-slice class="slice" :bgColor="bgColor"></issue-slice>
    <issue-slice class="slice" :bgColor="bgColor"></issue-slice>
    <issue-slice class="slice" :bgColor="bgColor"></issue-slice>
    <issue-slice class="slice" :bgColor="bgColor"></issue-slice>
  </div>
</template>

<script>
import IssueSlice from "@/components/slices/home/IssueSlice";

export default {
  name: "home",
  components: { IssueSlice },
  props: {
    bgColor: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
}
.slice {
}
</style>
