<template>
  <div class="c-page">
    <section
      v-for="(section, index) in [1, 2]"
      :key="`${index}-${uid}`"
      class="c-page__section"
    >
      <header class="c-page__section__header">
        <header-gradient
          class="c-page__section__gradient"
          :color="color"
        ></header-gradient>
      </header>

      <h1 class="c-page__section__title">{{ title }}</h1>

      <div class="c-page__section__content">
        <paper class="c-page__section__paper" :color="color">
          <section>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Pellentesque quis lacus aliquet, mollis lacus et, sollicitudin
              turpis. Vestibulum dapibus tincidunt urna, et varius justo
              tincidunt vel. Sed sodales ut sem id efficitur. Vestibulum quis
              ligula quis nunc ultrices suscipit. Aenean vestibulum purus
              placerat, dictum orci et, scelerisque ante. Quisque imperdiet
              dolor scelerisque luctus bibendum. Curabitur sed sapien sit amet
              metus viverra efficitur. Nullam ac sagittis ipsum. Suspendisse
              lorem neque, mollis nec ullamcorper vitae, consectetur a orci. Ut
              interdum malesuada commodo. Sed et sollicitudin turpis. Proin a
              egestas massa, vulputate egestas diam. Nulla risus dolor,
              vulputate vitae turpis in, blandit semper nulla. Quisque ultrices
              eget libero et tempor. Nulla mi diam, laoreet in est eget,
              interdum bibendum massa. Praesent convallis blandit lectus quis
              iaculis.
            </p>
            <p>
              Aliquam fringilla diam vitae erat porta, vitae congue justo
              hendrerit. Vivamus cursus tristique arcu, vehicula pulvinar justo
              porttitor ac. Donec nec est et ligula tempor interdum ut at nunc.
              Maecenas posuere libero et tellus dignissim bibendum. Donec non
              metus lectus. Donec vel diam aliquet, pulvinar nisi varius,
              vehicula velit. Pellentesque euismod elit eu sapien auctor
              volutpat. Integer faucibus quis lectus ut iaculis. Fusce imperdiet
              et nisi at interdum. Fusce condimentum neque eget tortor
              pellentesque, at tempor metus sodales. Quisque enim magna, commodo
              sit amet velit eget, interdum ultricies orci. Donec dignissim,
              enim ac bibendum imperdiet, elit orci faucibus augue, eget
              dignissim est est at nunc. Nulla faucibus felis a sodales
              porttitor. Vestibulum nec purus eget libero porta lobortis id et
              ante.
            </p>
          </section>

          <section>
            <h2>
              Secondary Title
            </h2>
            <p>
              Donec finibus mauris ante, ullamcorper molestie diam dictum id.
              Vivamus sit amet pharetra nunc. Ut volutpat leo sit amet mauris
              condimentum imperdiet. Suspendisse eu sodales lacus. Nulla
              tristique orci leo, ac iaculis nisl euismod sit amet. Praesent
              quis velit accumsan, dictum velit eu, sodales tellus. Vestibulum
              ante ipsum primis in faucibus orci luctus et ultrices posuere
              cubilia Curae; Donec pretium et tellus sit amet pulvinar.
            </p>
          </section>

          <section>
            <h2>
              Secondary Title
            </h2>
            <p>
              Maecenas iaculis venenatis elit id consectetur. Ut dignissim
              sodales justo, ut tincidunt diam. Quisque pellentesque semper
              ipsum, sit amet sollicitudin metus congue sit amet. Suspendisse
              vel nisi mollis, eleifend eros et, gravida justo. Mauris faucibus
              dolor nibh, et tempus est tristique vel. Quisque gravida quam vel
              sollicitudin aliquet. Proin scelerisque, nunc id aliquam
              malesuada, erat risus vulputate arcu, vitae scelerisque sapien ex
              a dolor. Praesent ac urna nisl. Sed ex metus, tristique et elit
              id, imperdiet gravida massa. Sed ut sagittis justo. Proin sed
              velit vel sem faucibus cursus consectetur volutpat mi. Curabitur
              sagittis luctus metus, molestie venenatis nisl elementum eu. Fusce
              id consequat elit. Nullam a arcu vel sem laoreet eleifend. In
              finibus cursus orci, sit amet mollis leo hendrerit a. Vivamus
              posuere imperdiet facilisis.
            </p>
            <p>
              Fusce vitae felis risus. Aliquam quis gravida dui, quis laoreet
              nulla. Maecenas id varius nisi. Sed facilisis aliquam vulputate.
              Nullam mattis turpis eu nisl fringilla, ut porttitor lectus
              blandit. Nam ut augue sit amet purus facilisis blandit eget non
              elit. Phasellus in pellentesque velit. Nulla molestie ac ipsum ac
              tempus. Aliquam pellentesque placerat velit.
            </p>
          </section>
        </paper>
      </div>
    </section>
  </div>
</template>
<script>
import _ from "lodash";

import View from "@/components/bases/View";

import HeaderGradient from "@/components/HeaderGradient";

export default {
  name: "page",
  extends: View,
  components: { HeaderGradient },
  data: function() {
    return {
      items: _.range(0, 5, 1)
    };
  },
  computed: {
    title: function() {
      return "Page Title";
    }
  }
};
</script>
<style lang="scss" scoped>
.c-page {
  width: 100%;

  position: relative;

  &__section {
    width: 100%;
    max-width: 1100px;

    padding-right: 20px;

    @include for-size(tablet-landscape-up) {
      margin-bottom: 50px;

      padding-left: 100px;

      &:last-of-type {
        margin-bottom: 0;
      }
    }

    &__header {
      top: 0;
      width: 120%; // Extends gradient beyond the edge of the paper

      position: sticky;

      @include header-offset(
        height
      ); // TODO: change all header mixins to this responsive one
    }

    $paper-padding: 20px;
    &__title {
      margin-bottom: 15px;

      position: relative;
      padding-left: $paper-padding;

      text-align: left;

      @include font-size(3em);

      @include for-size(tablet-landscape-up) {
        margin-bottom: 65px;

        @include font-size(5em);
      }
    }

    &__paper {
      padding: $paper-padding;
      @include for-size(tablet-portrait-up) {
        margin-bottom: 75px;

        margin-left: 100px;

        padding: 70px 80px;

        &:last-of-type {
          margin-bottom: 0;
        }
      }
    }

    &__content {
      padding-bottom: 30px; // Helps hide the box-shadow when the paper scrolls under the gradient header // TODO: figure out how to bind this with paper box-shadows

      section {
        margin-bottom: 60px;

        &:last-of-type {
          margin-bottom: 0;
        }
      }

      h2 {
        margin-bottom: 20px;

        @include font-size(2.2em);
      }

      p {
        margin-bottom: 30px;

        font-family: $font-serif;
        @include font-size(1.3em);

        &:last-of-type {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
