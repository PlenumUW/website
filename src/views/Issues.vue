<template>
  <div>
    <paper
      v-for="(issue, index) in issues"
      :key="`issue-${index}`"
      :color="color"
    >
      {{ issue.data.title[0].text }}
    </paper>
  </div>
</template>
<script>
import BaseView from "./BaseView";

export default {
  name: "Issues",
  extends: BaseView,
  data: function () {
    return {
      issues: []
    };
  },
  methods: {
    async fetchData() {
      this.metadata = {
        title: "Issue Catalogue"
      };

      this.issues = await this.$api.fetchAllIssues();

      return this.issues;
    }
  },
  meta() {
    return this.MetadataManager.metaDefault(this.metadata, "website");
  }
};
</script>
<style lang="scss" scoped></style>
