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
      default: function() {
        return undefined;
      }
    }
  },
  data: function() {
    return {
      focused: false,
      padding: 10
    };
  },
  computed: {
    height: function() {
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
  display: flex;
  flex-direction: column;
  align-items: center;

  &__link {
    position: relative;
    height: 100%;

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
      pointer-events: all;

      padding: $padding;
    }
  }
}
</style>
