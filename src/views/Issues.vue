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
import View from "./View";

export default {
  name: "issues",
  extends: View,
  data: function() {
    return {
      issues: []
    };
  },
  created: async function() {
    this.metadata = {
      title: "Issue Catalogue"
    };

    this.issues = await this.$api.fetchAllIssues();
  },
  meta() {
    return this.MetadataManager.metaDefault(this.metadata, "website");
  }
};
</script>
<style lang="scss" scoped></style>
