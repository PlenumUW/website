<template>
  <div class="home">
    <issue-slice class="home-slice slice" :bgColor="bgColor"></issue-slice>
    <atlas-slice class="home-slice slice" :bgColor="bgColor"></atlas-slice>
    <footer class="home-paper-wrapper">
      <site-footer></site-footer>
    </footer>
  </div>
</template>

<script>
import SiteFooter from "@/components/SiteFooter";
import IssueSlice from "@/components/slices/home/IssueSlice";
import AtlasSlice from "@/components/slices/home/AtlasSlice";

export default {
  name: "home",
  components: { IssueSlice, SiteFooter, AtlasSlice },
  props: {
    bgColor: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss">
footer {
  @include for-size(tablet-landscape-down) {
    padding: 0 !important;
  }
}

.site-footer {
}

.home-slice {
}
.slice {
}
</style>
