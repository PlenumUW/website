<template>
  <div class="the-logo">
    <router-link to="/" class="the-logo__link" @click.native="handleClick">
      <logo
        class="the-logo__link__icon"
        :style="{ width: width ? `${width}px` : null }"
      ></logo>
    </router-link>
  </div>
</template>

<script>
import Logo from "@/assets/svg/inline.logo.svg";

export default {
  components: { Logo },
  props: {
    width: {
      type: Number,
      required: false,
      default: function () {
        return undefined;
      }
    }
  },
  data: function () {
    return {
      focused: false,
      padding: 10
    };
  },
  computed: {
    height: function () {
      return this.width;
    }
  },
  methods: {
    handleClick() {
      this.$emit("activate");
    }
  }
};
</script>

<style lang="scss" scoped>
$padding: 10px;
@mixin rotateIcon() {
  transform: rotate(22deg);
  transition: transform 200ms ease-out;
}

.the-logo {
  width: 100%;

  @include for-size(tablet-landscape-up) {
      height: 100%;
    }

  &__link {
    display: block;
    width: fit-content;
    height: 100%;
    margin: unset; // Keeps logo in corner for hand-held layouts

    position: relative;

    transform: rotate(0);

    transition: transform 200ms ease-in;

    

    &:focus {
      @include focus(0);
    }

    &:hover {
      @include rotateIcon();
    }

    &__icon {
      height: 100%;

      padding: $padding;

      pointer-events: all;
    }
  }
}
</style>
