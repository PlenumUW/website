<template>
  <div class="home">
    <issue-slice class="home-slice slice" :bgColor="color"></issue-slice>
    <atlas-slice class="home-slice slice" :bgColor="color"></atlas-slice>
    <footer class="home-paper-wrapper">
      <site-footer></site-footer>
    </footer>
  </div>
</template>

<script>
import View from "@/components/bases/View";

import SiteFooter from "@/components/SiteFooter";
import IssueSlice from "@/components/slices/home/IssueSlice";
import AtlasSlice from "@/components/slices/home/AtlasSlice";

export default {
  name: "home",
  extends: View,
  components: { IssueSlice, SiteFooter, AtlasSlice }
};
</script>

<style lang="scss">
footer {
  @include for-size(tablet-landscape-down) {
    padding: 0 !important;
  }
}
</style>
