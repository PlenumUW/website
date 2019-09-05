<template>
  <div class="home">
    <issue-slice class="home-slice slice" :bgColor="bgColor"></issue-slice>
    <footer class="home-paper-wrapper">
      <site-footer></site-footer>
    </footer>
  </div>
</template>

<script>
import SiteFooter from "@/components/SiteFooter";
import IssueSlice from "@/components/slices/home/IssueSlice";

export default {
  name: "home",
  components: { IssueSlice, SiteFooter },
  props: {
    bgColor: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss">
.home-paper-wrapper {
  padding-right: 20px;
  padding-left: 0;

  @include for-size(tablet-landscape-up) {
    padding-left: 133px;
    padding-right: 70px;
  }

  .home-paper {
    @include box-shadow(12);
  }
}

.site-footer {
}

.home-slice {
}
.slice {
}
</style>
