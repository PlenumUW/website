<template>
  <paper class="site-footer" :color="color" :shadow="6">
    <!-- <div class="site-footer"> -->
    <div class="site-footer__info-container">
      <div class="site-footer__header">
        <logo class="logo"></logo>
        <div class="title">Plenum</div>
        <div class="subtitle">Undergraduate Journal of Geography</div>
      </div>

      <div class="site-footer__description">
        {{ description }}
      </div>
    </div>

    <div class="site-footer__links">
      <a href="https://www.washington.edu/online/privacy">Terms of Use</a>
      <a href="https://www.washington.edu/online/terms">Privacy</a>
      <a href="https://geography.washington.edu/">
        <uw-logo class="uw-logo"></uw-logo>
      </a>
    </div>
    <!-- </div> -->
  </paper>
</template>

<script>
// TODO: use a prismic document for footer text?
import Logo from "@/assets/svg/inline.logo.svg";
import UwLogo from "@/assets/svg/inline.uw-logo.svg";

export default {
  name: "SiteFooter",
  components: { Logo, UwLogo },
  props: {
    color: {
      type: String,
      required: true
    }
  },
  computed: {
    description: function() {
      return "Plenum is an online journal of geographic works produced by undergraduate students at the University of Washington. The journal is managed by and for students with support by graduate students, the Department of Geography, staff, and professors.";
    }
  }
};
</script>

<style lang="scss" scoped>
$lefter-width: $g-lefter-width;

.site-footer {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: fit-content;
  margin-top: 60px;

  position: relative;
  align-items: center;
  padding-bottom: 20px;

  font-family: $font-titling--subtitle;

  @include for-size(tablet-landscape-up) {
    left: -124px;
    width: 100vw;
    margin-top: 50px;
    // margin-bottom: 20px;

    position: absolute;
    padding-left: 124px;
  }

  &__info-container {
    display: block;
    flex-direction: row;
    max-width: 1200px;
    margin: 5%;

    justify-content: space-between;

    padding-right: 0;

    @include for-size(tablet-landscape-up) {
      display: flex;
      margin: 25px;
      margin-right: 37px;
      margin-bottom: 0;

      > *:first-child {
        margin-right: 30px;
      }
    }
  }

  &__header {
    display: grid;
    height: min-content;
    margin-bottom: 30px;

    grid-template-rows: repeat(2, min-content);
    grid-template-columns: min-content 1fr;
    grid-auto-columns: auto minmax(0, 1fr);
    grid-auto-rows: auto min-content;

    .title {
      grid-column: 2;
      grid-row: 1;

      align-self: center;

      font-family: $font-titling;
      @include font-size(2.5rem);
    }

    .subtitle {
      grid-column: 2;
      grid-row: 2;

      align-self: flex-start;

      white-space: nowrap;
      @include font-size(1rem);

      @include for-size(phone-only) {
        white-space: normal;
      }
    }
  }

  &__description {
    height: fit-content;
    flex-basis: 50%;

    text-align: justify;

    border-bottom: 1px solid black;
    border-top: 1px solid black;

    @include for-size(tablet-landscape-down) {
      width: 80%;
      // min-width: 300px;
      margin-left: auto;
    }

    @include for-size(phone-only) {
      width: 100%;
      margin: auto;
    }
  }

  &__links {
    width: fit-content;
    align-self: flex-end;
    margin-top: 10px;
    margin-right: 5%;

    @include font-size(1.25em);
    @include for-size(tablet-landscape-up) {
      margin-right: 40px;
    }
    a {
      margin-right: 20px;

      &:focus {
        text-decoration: none;
        @include focus();
      }
    }

    a:last-child {
      margin-right: 0;
    }

    .uw-logo {
      height: 35px;

      &:hover {
        fill: rgb(145, 123, 76); // UW Metallic Gold
      }
    }
  }

  .logo {
    height: 100%;

    padding: 5px;

    align-self: center;
  }
}
</style>
