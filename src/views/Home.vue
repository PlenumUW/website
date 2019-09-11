<template>
  <div class="home">
    <issue-slice class="home-slice slice" :bgColor="color"></issue-slice>
    <atlas-slice class="home-slice slice" :bgColor="color"></atlas-slice>
  </div>
</template>

<script>
import View from "./View";

import IssueSlice from "@/components/slices/home/IssueSlice";
import AtlasSlice from "@/components/slices/home/AtlasSlice";

export default {
  name: "home",
  extends: View,
  components: { IssueSlice, AtlasSlice }
};
</script>
