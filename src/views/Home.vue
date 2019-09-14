<template>
  <div class="home">
    <issue-slice class="home-slice slice" :bgColor="color"></issue-slice>
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
  components: { IssueSlice, AtlasSlice }
};
</script>
