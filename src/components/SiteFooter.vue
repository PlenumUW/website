<template>
  <div class="site-footer">
    <div class="site-footer__info-container">
      <div class="site-footer__header">
        <logo class="logo"></logo>
        <div class="title">Plenum</div>
        <div class="subtitle">Undergraduate Journal of Geography</div>
      </div>

      <div class="site-footer__description">
        Plenum is an online journal of geographic works produced by
        undergraduate students at the University of Washington. The journal is
        managed by and for students with support by graduate students, the
        Department of Geography, staff, and professors.
      </div>
    </div>

    <div class="site-footer__links">
      <a href="https://www.washington.edu/online/privacy">Terms of Use</a>
      <a href="https://www.washington.edu/online/terms">Privacy</a>
      <a href="https://geography.washington.edu/">
        <uw-logo class="uw-logo"></uw-logo>
      </a>
    </div>
  </div>
</template>

<script>
// TODO: build foot description from prismic?
import Logo from "@/assets/svg/inline.logo.svg";
import UwLogo from "@/assets/svg/inline.uw-logo.svg";

export default {
  name: "SiteFooter",
  components: { Logo, UwLogo }
};
</script>

<style lang="scss" scoped>
.site-footer {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: fit-content;

  position: relative;
  align-items: center;

  border-top: 5px solid black;

  font-family: $font-titling--subtitle;

  &__info-container {
    display: block;
    flex-direction: row;
    max-width: 1200px;
    margin: 5%;

    justify-content: space-between;

    padding-right: 0;

    > *:first-child {
      margin-bottom: 3%;
    }

    @include for-size(tablet-landscape-up) {
      display: flex;

      > *:first-child {
        margin-right: 30px;
      }
    }
  }

  &__header {
    display: grid;
    height: 100px;

    grid-template-rows: repeat(2, 1fr);
    grid-template-columns: min-content 1fr;
    grid-auto-columns: auto minmax(0, 1fr);

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
      min-width: 300px;

      margin-left: auto;
    }

    @include for-size(phone-only) {
      width: 100%;
    }
  }

  &__links {
    width: fit-content;
    align-self: flex-end;
    margin-top: 10px;
    margin-right: 5%;

    @include font-size(1.25em);
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
