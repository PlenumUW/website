<template>
  <div>
    <issue-slice v-for="(issue, index) in issues" :key="`issue-${index}`" :bgColor="color" :issue="issue"></issue-slice>
  </div>
</template>
<script>
import BaseView from "./BaseView";
import IssueSlice from "@/components/slices/home/IssueSlice";

export default {
  name: "Issues",
  extends: BaseView,
  components: { IssueSlice },
  computed: {
    issues: function () {
      return this.rawData;
    }
  },
  methods: {
    getIssueTitle(issue) {
      return this.PrismicProcessor.getRawText(issue.data.title);
    },
    getMetadata() {
      return {
        title: "Issue Catalogue"
      };
    }
  },
  meta() {
    return this.MetadataManager.metaDefault(
      this.metadata,
      this.scriptMetadata,
      "website"
    );
  }
};
</script>
<style lang="scss" scoped></style>
