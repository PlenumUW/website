<template>
  <div class="home">
    <issue-slice class="home-slice slice" :bgColor="color" :issue="currentIssue"></issue-slice>
    <atlas-slice class="home-slice slice" :bgColor="color"></atlas-slice>
    <events-slice class="home-slice slice" :bgColor="color"></events-slice>
  </div>
</template>

<script>
import BaseView from "./BaseView";

import IssueSlice from "@/components/slices/home/IssueSlice";
import AtlasSlice from "@/components/slices/home/AtlasSlice";
import EventsSlice from "@/components/slices/home/EventsSlice";

export default {
  name: "Home",
  extends: BaseView,
  components: { IssueSlice, AtlasSlice, EventsSlice },
  computed: {
    currentIssue: function () {
      return this.rawData ? this.rawData.issue : undefined;
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
