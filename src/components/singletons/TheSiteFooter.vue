<template>
  <paper class="site-footer" :color="color" :shadow="6">
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
      <a v-if="terms" :href="terms">Terms of Use</a>
      <a v-if="privacy" :href="privacy">Privacy</a>
      <a :href="uwLogoLink">
        <uw-logo class="uw-logo"></uw-logo>
      </a>
    </div>
  </paper>
</template>

<script>
import Logo from "@/assets/svg/inline.logo.svg";
import UwLogo from "@/assets/svg/inline.uw-logo.svg";

import PrismicProcessor from "@/utils/PrismicProcessor";

export default {
  name: "SiteFooter",
  components: { Logo, UwLogo },
  props: {
    color: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      description: undefined,
      privacy: undefined,
      terms: undefined,
      uwLogoLink: undefined,
      facebook: undefined,
      instagram: undefined,
      twitter: undefined
    };
  },
  created: async function() {
    const rawData = await this.$api.fetchSiteFooter();

    this.description = PrismicProcessor.getRawText(rawData.description);

    this.privacy = rawData["privacy_statement"].url;

    this.terms = rawData["terms_of_use"].url;

    this.uwLogoLink = rawData["uw_logo_link"].url || ""; // Ensures that uw logo always exists, even if not a link // TODO: remove hover effect if not a link

    this.facebook = rawData.facebook.url;

    this.instagram = rawData.instagram.url;

    this.twitter = rawData.facebook.url;
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
  margin-top: 50px;

  position: relative;
  align-items: center;
  padding-bottom: 20px;

  font-family: $font-titling--subtitle;

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
