<template>
  <div class="home">
    <issue-slice
      class="home-slice slice"
      :bgColor="color"
      :issue="currentIssue || {}"
    ></issue-slice>
    <atlas-slice class="home-slice slice" :bgColor="color"></atlas-slice>
  </div>
</template>

<script>
import BaseView from "./BaseView";

import IssueSlice from "@/components/slices/home/IssueSlice";
import AtlasSlice from "@/components/slices/home/AtlasSlice";

export default {
  name: "Home",
  extends: BaseView,
  components: { IssueSlice, AtlasSlice },
  data: function () {
    return {
      currentIssue: undefined
    };
  },
  methods: {
    async fetchData() {
      let currentIssue = await this.$api.fetchCurrentIssue();

      let essayRequests = [];
      essayRequests = currentIssue.data.essays.map(({ essay }) =>
        this.$api.getById(essay.id, {
          fetchLinks: ["category.name", "category.list_position"]
        })
      );
      currentIssue.essays = await Promise.all(essayRequests);

      this.currentIssue = currentIssue;
    }
  }
};
</script>
